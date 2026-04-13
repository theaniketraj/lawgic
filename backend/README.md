# BNS Legal RAG Assistant

A Retrieval-Augmented Generation pipeline for querying the
**Bharatiya Nyaya Sanhita (BNS)**, India's criminal code.

---

## Project structure

```
llm_project_v2/
├── config.py           ← All settings (paths, model, thresholds)
├── load_bns_data.py    ← CSV loader & validator
├── embed_store.py      ← Embed sections and persist to ChromaDB
├── query_expander.py   ← NEW: rewrites colloquial queries into legal phrasings
├── reranker.py         ← NEW: deduplicates + keyword-boosts retrieved chunks
├── retriever.py        ← Multi-variant search → rerank → format context
├── rag_pipeline.py     ← Interactive CLI with streaming, history & CoT prompt
└── data/
    └── Law Sheet - Sheet1.csv
```

---

## Quick start

### 1. Install dependencies

```bash
pip install chromadb sentence-transformers requests
```

### 2. Build the vector store (one-time)

```bash
python embed_store.py
# To rebuild from scratch: python embed_store.py --reset
```

### 3. Start Ollama

```bash
ollama serve
ollama pull phi3
```

### 4. Run the assistant

```bash
python rag_pipeline.py
```

---

## What changed in v2 (vs v1 improved)

### Slow retrieval → fixed with query expansion + warm-up

| Before                            | After                                                       |
| --------------------------------- | ----------------------------------------------------------- |
| One vector search per query       | N searches across legal rephrasing variants                 |
| Model loads on first query (slow) | `warm_up()` at startup — first query is as fast as the rest |
| Top-K returned blindly            | Merged, deduplicated, then reranked                         |

**How query expansion works:**  
A colloquial question like _"what if someone beats me?"_ is expanded into variants like _"assault causing hurt grievous hurt"_ and _"BNS section punishment for beats"_ before searching. This catches sections that use legal terminology the user didn't know.

### Poor answer quality → fixed with reranking + better context format

| Before                                    | After                                                              |
| ----------------------------------------- | ------------------------------------------------------------------ |
| Vector distance only                      | Distance − keyword-overlap boost                                   |
| Duplicate sections from multiple variants | Deduplication keeps best-scoring copy                              |
| Raw chunk text in context                 | Structured with section header, cause, punishment clearly labelled |

### LLM prompt → chain-of-thought + few-shot + confidence

| Before               | After                                                   |
| -------------------- | ------------------------------------------------------- |
| Simple instruction   | Strict numbered rules (no hallucination guardrail)      |
| No examples          | Two few-shot examples anchor the exact output format    |
| No reasoning step    | Model reasons before formatting → more accurate answers |
| No confidence signal | Model outputs HIGH / MEDIUM / LOW confidence per answer |
| `temperature` unset  | `temperature=0.1` for factual, deterministic answers    |
