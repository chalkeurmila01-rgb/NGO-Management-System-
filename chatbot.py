from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "NGO AI Chatbot Backend Running"

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message", "").strip()

    if not message:
        return jsonify({
            "reply": "Please enter a message."
        })

    return jsonify({
        "reply": "AI connection is ready to be added."
    })


if __name__ == "__main__":
    app.run()