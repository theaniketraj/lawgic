"""
retriever.py — Semantic retrieval of BNS sections from ChromaDB.

Improvements over v1
--------------------
1. Query expansion  — the user's query is rewritten into N legal phrasings;
                      all variants are searched and results merged before
                      reranking.  This dramatically improves recall for
                      colloquial questions like "what if someone beats me".

2. Keyword reranking — after merging, chunks are rescored by adding a
                       keyword-overlap boost on top of the vector distance.
                       Chunks that contain the user's exact terms rank higher
                       than semantically similar but vague ones.

3. Lazy singletons  — the model and DB client load only on the first query
                       (via @lru_cache), keeping import time near zero.

4. warm_up()        — call once at startup to pre-load the model so the
                       first real query is fast.
"""

from __future__ import annotations

import logging
from functools import lru_cache

import chromadb
from sentence_transformers import SentenceTransformer

from config import (
    DB_DIR, EMBED_MODEL, COLLECTION,
    TOP_K, FINAL_TOP_K, DISTANCE_THRESHOLD, QUERY_EXPANSION_N,
)
from query_expander import expand_query
from reranker import rerank

logger = logging.getLogger(__name__)


# ── Lazy singletons ────────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _get_embedder() -> SentenceTransformer:
    logger.info("Loading embedding model '%s' …", EMBED_MODEL)
    return SentenceTransformer(EMBED_MODEL)


@lru_cache(maxsize=1)
def _get_collection() -> chromadb.Collection:
    client = chromadb.PersistentClient(path=str(DB_DIR))
    return client.get_collection(COLLECTION)


def warm_up() -> None:
    """
    Pre-load the embedding model and open the ChromaDB connection.
    Call this once at application startup so the first real query
    doesn't bear the model-loading latency.
    """
    logger.info("Warming up retriever …")
    _get_embedder()
    _get_collection()
    logger.info("Retriever ready.")


# ── Core retrieval ─────────────────────────────────────────────────────────────

def _search_one(query_text: str, top_k: int) -> list[dict]:
    """Run a single vector search and return raw hit dicts."""
    embedder   = _get_embedder()
    collection = _get_collection()

    vec = embedder.encode(query_text, convert_to_numpy=True).tolist()
    results = collection.query(
        query_embeddings=[vec],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    hits: list[dict] = []
    for doc, meta, dist in zip(
        results.get("documents", [[]])[0],
        results.get("metadatas",  [[]])[0],
        results.get("distances",  [[]])[0],
    ):
        if dist <= DISTANCE_THRESHOLD:
            hits.append({**meta, "text": doc, "distance": dist})
        else:
            logger.debug(
                "Filtered out section %s (dist=%.3f > threshold=%.3f)",
                meta.get("section"), dist, DISTANCE_THRESHOLD,
            )
    return hits


# ── Public API ─────────────────────────────────────────────────────────────────

def retrieve(
    query: str,
    top_k: int = TOP_K,
    final_top_k: int = FINAL_TOP_K,
    expand: bool = True,
) -> tuple[str, list[dict]]:
    """
    Retrieve the most relevant BNS sections for *query*.

    Parameters
    ----------
    query       : The user's natural-language question.
    top_k       : Chunks fetched per query variant (before reranking).
    final_top_k : Chunks returned after reranking.
    expand      : Whether to use query expansion (default True).

    Returns
    -------
    context : str
        Formatted string ready to inject into the LLM prompt.
    hits : list[dict]
        Reranked hit dicts (with "final_score", "keyword_boost", etc.)
        Useful for display and debugging.
    """
    if not query.strip():
        return "No query provided.", []

    # ── 1. Query expansion ─────────────────────────────────────────────────
    if expand:
        query_variants = expand_query(query, n=QUERY_EXPANSION_N)
        logger.info("Query variants: %s", query_variants)
    else:
        query_variants = [query]

    # ── 2. Multi-variant vector search ────────────────────────────────────
    all_hits: list[dict] = []
    for variant in query_variants:
        hits = _search_one(variant, top_k)
        all_hits.extend(hits)

    if not all_hits:
        return (
            "No relevant BNS sections found. "
            "The query may be outside the scope of the BNS dataset.",
            [],
        )

    # ── 3. Rerank (dedup + keyword boost) ─────────────────────────────────
    ranked_hits = rerank(query, all_hits, final_top_k=final_top_k)

    if not ranked_hits:
        return (
            "No sufficiently relevant BNS sections found after reranking.",
            [],
        )

    # ── 4. Format context for the LLM ─────────────────────────────────────
    context_parts: list[str] = []
    for hit in ranked_hits:
        section   = hit.get("section",    "Unknown")
        subsection= hit.get("subsection", "")
        cause     = hit.get("cause",      "")
        effect    = hit.get("effect",     "")
        score     = 1.0 - hit["final_score"]   # convert to similarity (higher = better)
        sub_label = f" ({subsection})" if subsection and subsection != "-" else ""

        context_parts.append(
            f"━━━ BNS {section}{sub_label} — relevance {score:.0%} ━━━\n"
            f"Offence / Cause: {cause}\n\n"
            f"{hit['text']}\n\n"
            f"Punishment / Effect: {effect}"
        )

    context = "\n\n".join(context_parts)
    return context, ranked_hits


if __name__ == "__main__":
    import sys
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    warm_up()
    query = " ".join(sys.argv[1:]) or "What is the punishment for murder?"
    ctx, hits = retrieve(query)
    print(f"\n{'━'*60}")
    print(f"Query : {query}")
    print(f"Hits  : {len(hits)}")
    print(f"{'━'*60}\n")
    print(ctx)
