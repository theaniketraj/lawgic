"""
reranker.py — Rerank retrieved BNS chunks for better answer quality.

The vector retriever gives semantic similarity scores, but two problems arise:
  1. Multiple query variants may return the same chunk with different scores.
  2. A chunk may be semantically close but miss the specific keyword the user
     mentioned (e.g. "acid attack" vs a generic "hurt" section).

This module:
  - Deduplicates chunks from multiple query variants, keeping the best score.
  - Applies a lightweight BM25-inspired keyword boost so chunks that contain
    the user's exact terms rank higher than semantically similar but vague ones.
  - Returns a final ranked list ready for the LLM.
"""

from __future__ import annotations

import logging
import re
import string
from collections import defaultdict

from config import KEYWORD_BOOST, FINAL_TOP_K

logger = logging.getLogger(__name__)

_STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "shall", "can", "need", "dare", "ought",
    "used", "to", "of", "in", "on", "at", "by", "for", "with", "about",
    "against", "between", "into", "through", "during", "before", "after",
    "above", "below", "from", "up", "down", "out", "off", "over", "under",
    "again", "further", "then", "once", "and", "but", "or", "nor", "not",
    "so", "yet", "both", "either", "neither", "whether", "if", "as",
    "what", "which", "who", "whom", "whose", "this", "that", "these",
    "those", "it", "its", "they", "them", "their", "he", "she", "his",
    "her", "we", "us", "our", "you", "your", "i", "me", "my",
    "person", "someone", "anyone", "somebody", "anybody",
}


def _keywords(text: str) -> set[str]:
    """Extract meaningful lowercase words from *text*."""
    tokens = re.findall(r"\b[a-z]{3,}\b", text.lower())
    return {t for t in tokens if t not in _STOP_WORDS}


def _keyword_score(query_keywords: set[str], chunk_text: str) -> float:
    """
    Return a boost score based on how many query keywords appear in the chunk.
    Score = KEYWORD_BOOST × (matched keywords / total query keywords).
    """
    if not query_keywords:
        return 0.0
    chunk_words = _keywords(chunk_text)
    overlap = query_keywords & chunk_words
    ratio = len(overlap) / len(query_keywords)
    return KEYWORD_BOOST * ratio


def rerank(
    query: str,
    raw_hits: list[dict],
    final_top_k: int = FINAL_TOP_K,
) -> list[dict]:
    """
    Deduplicate and rerank *raw_hits* from one or more query variants.

    Parameters
    ----------
    query       : The original user query (used for keyword extraction).
    raw_hits    : List of hit dicts, each with at least:
                    - "section"  : BNS section identifier
                    - "distance" : cosine distance (lower = better)
                    - "text"     : full chunk text
    final_top_k : Number of chunks to return after reranking.

    Returns
    -------
    Sorted list of the best *final_top_k* hit dicts, best first.
    Each hit gains a new "final_score" field (lower = better).
    """
    if not raw_hits:
        return []

    query_kw = _keywords(query)

    # Deduplicate by section id — keep the hit with the lowest distance
    best_by_section: dict[str, dict] = {}
    for hit in raw_hits:
        sid = hit.get("section", "")
        if sid not in best_by_section or hit["distance"] < best_by_section[sid]["distance"]:
            best_by_section[sid] = hit

    unique_hits = list(best_by_section.values())

    # Compute final score: distance − keyword_boost  (lower = better)
    for hit in unique_hits:
        boost = _keyword_score(query_kw, hit.get("text", ""))
        hit["keyword_boost"] = round(boost, 4)
        hit["final_score"]   = round(hit["distance"] - boost, 4)
        logger.debug(
            "Section %s  dist=%.3f  boost=%.3f  final=%.3f",
            hit["section"], hit["distance"], boost, hit["final_score"],
        )

    # Sort by final_score ascending (lower = more relevant)
    ranked = sorted(unique_hits, key=lambda h: h["final_score"])

    return ranked[:final_top_k]


if __name__ == "__main__":
    # Quick sanity check
    logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")
    sample_hits = [
        {"section": "S. 100", "distance": 0.45, "text": "murder culpable homicide death", "cause": "", "effect": ""},
        {"section": "S. 115", "distance": 0.38, "text": "hurt grievous hurt injury bodily harm", "cause": "", "effect": ""},
        {"section": "S. 100", "distance": 0.50, "text": "murder culpable homicide death", "cause": "", "effect": ""},  # duplicate
        {"section": "S. 300", "distance": 0.80, "text": "property damage mischief fire", "cause": "", "effect": ""},
    ]
    result = rerank("What is the punishment for murder?", sample_hits, final_top_k=3)
    for r in result:
        print(r["section"], "→ final_score:", r["final_score"])
