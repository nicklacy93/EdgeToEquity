from flask import Blueprint, request, jsonify
from services.model_router import ModelRouter
import time

rewrite_memory_bp = Blueprint('rewrite_memory', __name__)
router = ModelRouter()

@rewrite_memory_bp.route('/api/ai/rewriteMemory', methods=['POST'])
def rewrite_memory():
    data = request.get_json()
    content = data.get('content')
    tone = data.get('tone', 'encouraging')
    agent = data.get('agent', 'general')

    if not content:
        return jsonify({"error": "Missing content"}), 400

    prompt = f\"""You are a trading psychology coach. Rewrite the following trading insight using a {tone} tone for a trader who recently interacted with the {agent} agent. Include a relevant emoji and hashtags. Make it concise, emotionally intelligent, and easy to recall.

Insight: \\"{content}\\"

Respond in JSON:
{{
  "rewritten": "...",
  "tags": ["#tag1", "#tag2"],
  "emoji": "??"
}}
\""""

    try:
        start = time.time()
        result = router.send_to_model(prompt, model="claude-3-sonnet")
        elapsed = round(time.time() - start, 2)
        print(f"[Claude] Memory Rewrite: {elapsed}s")

        if result.success:
            parsed = router.extract_json_from_text(result.content)
            return jsonify(parsed)
        else:
            return jsonify({"error": result.error}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
