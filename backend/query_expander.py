"""
query_expander.py — Expand a user query into multiple legal phrasings.

Why this matters
----------------
Embedding models are sensitive to exact wording.  A user asking
"what happens if someone beats another person" may not semantically
match chunks that contain "assault", "hurt", or "grievous hurt".

This module generates N alternative phrasings of the query using
simple rule-based expansion (no extra LLM call needed), so retrieval
covers a much wider surface area before reranking.
"""

from __future__ import annotations
import re

# Legal synonym map: colloquial term → list of legal equivalents
_LEGAL_SYNONYMS: dict[str, list[str]] = {
    "kill":       ["murder", "culpable homicide", "cause death"],
    "killed":     ["murdered", "culpable homicide", "death caused by"],
    "murder":     ["culpable homicide", "causing death", "homicide"],
    "beat":       ["assault", "hurt", "grievous hurt", "bodily harm"],
    "beating":    ["assault", "causing hurt", "grievous hurt"],
    "hit":        ["assault", "hurt", "battery", "causing injury"],
    "attack":     ["assault", "hurt", "criminal force"],
    "rape":       ["sexual assault", "assault on woman", "outraging modesty"],
    "steal":      ["theft", "robbery", "misappropriation", "dishonest taking"],
    "theft":      ["robbery", "extortion", "misappropriation"],
    "rob":        ["robbery", "dacoity", "extortion by force"],
    "cheat":      ["cheating", "fraud", "criminal breach of trust"],
    "fraud":      ["cheating", "criminal breach of trust", "deception"],
    "bribe":      ["bribery", "illegal gratification", "corruption"],
    "defame":     ["defamation", "criminal defamation", "libel"],
    "threaten":   ["criminal intimidation", "threat", "coercion"],
    "stalk":      ["stalking", "criminal intimidation", "following"],
    "kidnap":     ["kidnapping", "abduction", "wrongful confinement"],
    "hurt":       ["grievous hurt", "simple hurt", "bodily harm", "injury"],
    "injure":     ["hurt", "grievous hurt", "bodily harm"],
    "property":   ["mischief", "damage to property", "criminal trespass"],
    "trespass":   ["criminal trespass", "house trespass", "house breaking"],
    "break in":   ["house breaking", "house trespass", "burglary"],
    "forgery":    ["forgery", "making false documents", "fabrication of evidence"],
    "lie":        ["false statement", "perjury", "fabrication of evidence"],
    "weapon":     ["arms", "deadly weapon", "dangerous weapon"],
    "drunk":      ["public intoxication", "drunk and disorderly"],
    "arson":      ["mischief by fire", "setting fire", "burning property"],
    "poison":     ["administering poison", "hurt by poisoning"],
    "acid":       ["acid attack", "grievous hurt by acid", "throwing acid"],
    "dowry":      ["dowry death", "cruelty by husband", "matrimonial cruelty"],
    "suicide":    ["abetment of suicide", "attempt to suicide"],
    "conspiracy": ["criminal conspiracy", "abetment"],
    "gang":       ["dacoity", "gang robbery", "criminal conspiracy"],
    "minor":      ["child", "person under eighteen", "juvenile"],
    "woman":      ["female", "modesty", "woman and girl"],
}

_LEGAL_TERM_EXPANSIONS: dict[str, list[str]] = {
    "punishment": ["sentence", "penalty", "imprisonment", "fine"],
    "offence":    ["crime", "violation", "criminal act"],
    "section":    ["provision", "clause"],
}


def _tokenize(text: str) -> list[str]:
    return re.findall(r"\b\w+\b", text.lower())


def expand_query(query: str, n: int = 3) -> list[str]:
    """
    Return a list of *n* query variants including the original.

    Strategy:
    1. Always include the original query.
    2. Replace colloquial terms with legal synonyms (one synonym per pass).
    3. Add a short "BNS section for <core noun phrase>" variant.

    The list is deduplicated and capped at *n*.
    """
    variants: list[str] = [query]
    tokens = _tokenize(query)

    # Generate synonym-substituted variants
    for token in tokens:
        synonyms = _LEGAL_SYNONYMS.get(token, [])
        for syn in synonyms:
            new_query = re.sub(
                rf"\b{re.escape(token)}\b", syn, query, flags=re.IGNORECASE
            )
            if new_query.lower() != query.lower() and new_query not in variants:
                variants.append(new_query)
            if len(variants) >= n:
                break
        if len(variants) >= n:
            break

    # If we still need more variants, add a legalised reformulation
    if len(variants) < n:
        # Extract the most meaningful noun/verb tokens (skip stop words)
        STOP = {"what", "is", "the", "a", "an", "for", "of", "in", "on",
                "under", "if", "and", "or", "to", "does", "do", "can",
                "someone", "person", "someone", "somebody", "anyone"}
        keywords = [t for t in tokens if t not in STOP and len(t) > 3]
        if keywords:
            legal_variant = "BNS section punishment for " + " ".join(keywords[:4])
            if legal_variant not in variants:
                variants.append(legal_variant)

    return variants[:n]


if __name__ == "__main__":
    test_queries = [
        "What happens if someone beats another person?",
        "Can you steal from a shop and get away with it?",
        "What is the punishment for murder in India?",
        "Someone threatened me with a knife",
    ]
    for q in test_queries:
        print(f"\nOriginal : {q}")
        for i, v in enumerate(expand_query(q, n=3), 1):
            print(f"  v{i}     : {v}")
