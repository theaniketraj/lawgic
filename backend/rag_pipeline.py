"""
rag_pipeline.py — Interactive BNS legal assistant (CLI).

Improvements over v1
--------------------
* Query expansion + reranking for dramatically better retrieval
* Retriever warm-up at startup — first query is as fast as subsequent ones
* Chain-of-thought prompt: model reasons before it formats its answer
* Few-shot examples in the system prompt anchor the output format
* Confidence indicator: model explicitly flags when context is insufficient
* Conversation history (last 3 turns) for coherent follow-up questions
* Streaming output so responses feel instant
* Structured error handling (connection, timeout, HTTP, unexpected)
"""

from __future__ import annotations

import json
import logging
import sys

import requests

from config import OLLAMA_MODEL, OLLAMA_TIMEOUT, OLLAMA_URL, FINAL_TOP_K
from retriever import retrieve, warm_up

logging.basicConfig(level=logging.WARNING, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)


# ── Prompt templates ───────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are a precise legal assistant for the Bharatiya Nyaya Sanhita (BNS), \
India's criminal code that replaced the Indian Penal Code in 2023.

STRICT RULES:
1. Answer ONLY using information found in the provided Legal Context.
2. If the context does not contain enough information, say explicitly:
   "The provided context does not cover this. Please consult a qualified lawyer."
3. Never invent section numbers, punishments, or legal definitions.
4. Cite the exact BNS section number(s) you are drawing from.
5. If multiple sections apply, list all of them.

REASONING APPROACH:
Before writing your final answer, briefly think through:
  - What type of offence is being described?
  - Which section(s) in the context match most closely?
  - What is the exact punishment stated in that section?
""".strip()

# Few-shot examples are wrapped in [EXAMPLES] tags so phi3 treats them
# as reference format only and does NOT answer them as real questions.
FEW_SHOT_EXAMPLES = """\
[EXAMPLES — reference format only, do NOT answer these]

Q: What is the punishment for murder?
A:
Reasoning: The user asks about murder. BNS S. 101 defines culpable homicide amounting to murder.
Crime Identified: Murder
Relevant BNS Section(s): S. 101
Punishment: Death, or imprisonment for life, and fine.
Explanation: BNS S. 101 covers culpable homicide with intent to cause death. Punishment is death or life imprisonment plus fine.
Confidence: HIGH — section directly addresses the question.

Q: What is the fine for littering?
A:
Reasoning: Littering is a municipal/civic matter, not a BNS criminal offence.
Crime Identified: Not applicable
Relevant BNS Section(s): None
Punishment: Not covered by BNS
Explanation: Littering is governed by local municipal bylaws, not the BNS.
Confidence: LOW — outside scope of BNS.

[END EXAMPLES — now answer only the User Question below]
""".strip()

ANSWER_FORMAT = """\
Now answer the user's question in EXACTLY this format:

Reasoning:
<2-4 sentences identifying the offence type and matching section(s)>

Crime Identified:
<name of the crime, or "Not applicable">

Relevant BNS Section(s):
<section number(s), or "None">

Punishment:
<exact punishment text from the context, or "Not covered by BNS">

Explanation:
<plain-language explanation of how the section applies to the situation>

Confidence:
<HIGH / MEDIUM / LOW — and one sentence explaining why>
""".strip()


def build_prompt(query: str, context: str, history: list[dict]) -> str:
    """Assemble the full prompt sent to the LLM."""
    history_block = ""
    if history:
        lines: list[str] = []
        for turn in history[-3:]:   # last 3 turns = 6 messages
            lines.append(f"User: {turn['query']}")
            short_ans = turn["answer"][:400].rsplit("\n", 1)[0] + " …"
            lines.append(f"Assistant: {short_ans}")
        history_block = "\n\nConversation so far:\n" + "\n".join(lines)

    blocks = [
        SYSTEM_PROMPT,
        FEW_SHOT_EXAMPLES,
    ]
    if history_block:
        blocks.append(history_block.strip())
    blocks += [
        f"Legal Context (retrieved BNS sections):\n{context}",
        f"[NOW ANSWER THIS] User Question:\n{query}",
        ANSWER_FORMAT,
    ]
    return "\n\n".join(blocks).replace("\n\n\n", "\n\n")


# ── LLM call ───────────────────────────────────────────────────────────────────

def ask_llm(prompt: str, stream: bool = True) -> str:
    """Send a prompt to Ollama and return the full response text."""
    payload = {
        "model":   OLLAMA_MODEL,
        "prompt":  prompt,
        "stream":  stream,
        "options": {
            "temperature": 0.1,
            "top_p":       0.9,
            "repeat_penalty": 1.1,
        },
    }

    try:
        response = requests.post(
            OLLAMA_URL, json=payload,
            timeout=OLLAMA_TIMEOUT,
            stream=stream,
        )
        response.raise_for_status()

        if stream:
            parts: list[str] = []
            print()
            for raw_line in response.iter_lines():
                if not raw_line:
                    continue
                chunk = json.loads(raw_line)
                token = chunk.get("response", "")
                print(token, end="", flush=True)
                parts.append(token)
                if chunk.get("done"):
                    break
            print()
            return "".join(parts)

        data = response.json()
        if "error" in data:
            return f"⚠️  Ollama error: {data['error']}"
        return data.get("response", "No response from model.")

    except requests.exceptions.ConnectionError:
        return (
            "\n⚠️  Cannot connect to Ollama.\n"
            "   → Run: ollama serve\n"
            f"   → Then ensure the model is pulled: ollama pull {OLLAMA_MODEL}"
        )
    except requests.exceptions.Timeout:
        return (
            "\n⚠️  Request timed out.\n"
            "   → Try a shorter question, or increase OLLAMA_TIMEOUT in config.py."
        )
    except requests.exceptions.HTTPError as exc:
        return f"\n⚠️  HTTP error from Ollama: {exc}"
    except Exception as exc:
        logger.exception("Unexpected LLM error")
        return f"\n⚠️  Unexpected error: {exc}"


# ── CLI loop ───────────────────────────────────────────────────────────────────

def main() -> None:
    print("\n⚖️  BNS Legal Assistant  (type 'exit' or Ctrl+C to quit)")
    print(f"   Model: {OLLAMA_MODEL}  |  Retrieved sections per query: {FINAL_TOP_K}")
    print("─" * 60)

    # Pre-load the embedding model so the first query is fast
    print("\n⏳ Loading retriever …", end="", flush=True)
    warm_up()
    print(" ready.\n")

    history: list[dict] = []

    while True:
        try:
            query = input("🔎 Your question: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n\nGoodbye!")
            sys.exit(0)

        if not query:
            continue
        if query.lower() in {"exit", "quit", "q"}:
            print("Goodbye!")
            sys.exit(0)

        # ── Retrieve ───────────────────────────────────────────────────────
        print("\n📚 Searching BNS sections …", end="", flush=True)
        context, hits = retrieve(query)

        if not hits:
            print("\n⚠️  No relevant sections found. Try rephrasing your question.\n")
            continue

        matched = ", ".join(h["section"] for h in hits)
        print(f" found {len(hits)} section(s): {matched}")

        # ── Generate answer ────────────────────────────────────────────────
        prompt = build_prompt(query, context, history)
        print("\n⚖️  Legal Answer:")
        print("─" * 60)

        answer = ask_llm(prompt, stream=True)

        print("─" * 60, "\n")

        history.append({"query": query, "answer": answer})


if __name__ == "__main__":
    main()