"""
config.py — Central configuration for the BNS RAG pipeline.
Edit values here; no need to touch any other file.
"""

from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DB_DIR   = BASE_DIR / "bns_db"

CSV_PATH = DATA_DIR / "Law Sheet - Sheet1.csv"

# ── Embeddings ─────────────────────────────────────────────────────────────────
EMBED_MODEL  = "all-MiniLM-L6-v2"
COLLECTION   = "bns"
EMBED_BATCH  = 64

# ── Retrieval ──────────────────────────────────────────────────────────────────
TOP_K              = 6      # chunks fetched per query variant before reranking
FINAL_TOP_K        = 4      # chunks actually sent to the LLM after reranking
DISTANCE_THRESHOLD = 1.4    # cosine distance — chunks above this are discarded

# Query expansion: fetch results for N rephrased versions of the user query,
# then merge + deduplicate before reranking.
QUERY_EXPANSION_N  = 3

# ── Reranking ──────────────────────────────────────────────────────────────────
# BM25-style keyword boost: weight added per keyword match found in a chunk.
# Set to 0.0 to disable keyword reranking entirely.
KEYWORD_BOOST = 0.15

# ── LLM (Ollama) ───────────────────────────────────────────────────────────────
OLLAMA_URL     = "http://localhost:11434/api/generate"
OLLAMA_MODEL   = "phi3"
OLLAMA_TIMEOUT = 180   # seconds — increased for chain-of-thought prompts
