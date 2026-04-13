from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

from config import OLLAMA_MODEL, FINAL_TOP_K
from retriever import retrieve, warm_up
from rag_pipeline import build_prompt, ask_llm

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Warm up on startup
logger.info("Warming up retriever...")
warm_up()
logger.info("Retriever ready.")

# Simple in-memory history per session could be added, but for now we'll keep history stateless or pass it from frontend
# If frontend passes history in request, we use it.

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    query = data.get("message", "")
    history = data.get("history", []) # Expected format: [{"query": str, "answer": str}]
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
        
    try:
        # 1. Retrieve
        context, hits = retrieve(query)
        
        if not hits:
            # Tell user no sections found, but still let LLM answer maybe?
            # Or just return a standard fallback
            return jsonify({
                "response": "I couldn't find relevant sections in the BNS for your query. Try rephrasing.",
                "emotion": "confused"
            })
            
        # 2. Build prompt
        prompt = build_prompt(query, context, history)
        
        # 3. Get LLM response
        answer = ask_llm(prompt, stream=False)
        
        return jsonify({
            "response": answer,
            "hits": hits,
            "emotion": "happy" # Simplistic emotion, can be enhanced
        })
        
    except Exception as e:
        logger.error(f"Error handling chat: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
