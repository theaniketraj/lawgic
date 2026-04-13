"""
embed_store.py — Embed BNS sections and persist them in ChromaDB.

Run once to populate the database.  Re-running is safe — existing data
is left untouched unless --reset is passed.

Usage:
    python embed_store.py              # populate (no-op if already done)
    python embed_store.py --reset      # wipe collection and re-embed
"""

import argparse
import logging
import sys

import chromadb
from sentence_transformers import SentenceTransformer

from config import (
    CSV_PATH, DB_DIR, EMBED_MODEL, EMBED_BATCH, COLLECTION
)
from load_bns_data import load_bns_csv

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


def build_store(reset: bool = False) -> None:
    """Embed all BNS sections and store them in ChromaDB."""

    # ── Load data ──────────────────────────────────────────────────────────────
    sections = load_bns_csv(CSV_PATH)
    if not sections:
        logger.error("No sections loaded — check CSV path in config.py")
        sys.exit(1)

    # ── Connect to ChromaDB ────────────────────────────────────────────────────
    DB_DIR.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(DB_DIR))

    if reset:
        try:
            client.delete_collection(COLLECTION)
            logger.info("Deleted existing collection '%s'.", COLLECTION)
        except Exception:
            pass   # collection didn't exist yet — that's fine

    collection = client.get_or_create_collection(
        name=COLLECTION,
        metadata={"hnsw:space": "cosine"},   # cosine similarity for legal text
    )

    existing = collection.count()
    if existing > 0 and not reset:
        logger.warning(
            "Collection '%s' already has %d documents. "
            "Run with --reset to rebuild.",
            COLLECTION, existing,
        )
        return

    # ── Embed in batches ───────────────────────────────────────────────────────
    logger.info("Loading embedding model '%s' …", EMBED_MODEL)
    embedder = SentenceTransformer(EMBED_MODEL)

    texts = [sec["text"] for sec in sections]
    total = len(texts)
    logger.info("Embedding %d sections in batches of %d …", total, EMBED_BATCH)

    all_embeddings = embedder.encode(
        texts,
        batch_size=EMBED_BATCH,
        show_progress_bar=True,
        convert_to_numpy=True,
    )

    # ── Upsert into ChromaDB ───────────────────────────────────────────────────
    ids        = [f"bns_{i}" for i in range(total)]
    documents  = texts
    embeddings = [emb.tolist() for emb in all_embeddings]
    metadatas  = [
        {
            "section":    sec["section"],
            "subsection": sec["subsection"],
            "cause":      sec["cause"],
            "effect":     sec["effect"],
        }
        for sec in sections
    ]

    # ChromaDB recommends batching upserts for large collections
    UPSERT_BATCH = 500
    for start in range(0, total, UPSERT_BATCH):
        end = min(start + UPSERT_BATCH, total)
        collection.upsert(
            ids=ids[start:end],
            documents=documents[start:end],
            embeddings=embeddings[start:end],
            metadatas=metadatas[start:end],
        )

    logger.info("✅ Stored %d sections in ChromaDB collection '%s'.", total, COLLECTION)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build the BNS vector store.")
    parser.add_argument(
        "--reset", action="store_true",
        help="Delete the existing collection before re-embedding."
    )
    args = parser.parse_args()
    build_store(reset=args.reset)
