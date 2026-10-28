
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os

app = Flask(__name__)
CORS(app)

client = genai.Client(
    api_key=os.environ.get("GEMINI_API_KEY")
)

@app.route("/")
def home():
    return "NGO AI Chatbot Backend Running"


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "").strip()

    if not isinstance(message, str) or not message:
        return jsonify({
            "reply": "Please enter a message."
        })

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"""
You are a friendly AI assistant for an NGO Management System.

Your responsibilities:
- Explain NGO activities in simple English.
- Help users understand volunteering and donations.
- Explain how NGOs support needy people.
- Answer questions about beneficiaries and community activities.
- Keep answers short, clear, and friendly.
- Use bullet points when helpful.
- If a question is unrelated to NGOs, politely guide the user back to NGO-related topics.
- Never claim that a donation, registration, or volunteer application has been completed.
- Never invent this NGO's contact details, donation methods, or policies.

User's question: {message}
"""
        )

        return jsonify({
            "reply": response.text or "Sorry, I couldn't generate an answer. Please try again."
        })

    except Exception as error:
        print(error)
        return jsonify({
            "reply": "Sorry, the AI assistant is temporarily unavailable. Please try again."
        }), 500


if __name__ == "__main__":
    app.run()
