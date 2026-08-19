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

<script>
const sendChatBtn = document.getElementById("sendChatBtn");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

sendChatBtn.addEventListener("click", async function () {

    const message = chatInput.value.trim();

    if (!message) return;

    chatMessages.innerHTML += `
        <div class="bg-blue-100 p-3 rounded-lg text-right">
            ${message}
        </div>
    `;

    chatInput.value = "";

    try {

        const response = await fetch(
            "https://YOUR-BACKEND-URL/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: message
                })
            }
        );

        const data = await response.json();

        chatMessages.innerHTML += `
            <div class="bg-gray-100 p-3 rounded-lg">
                ${data.reply}
            </div>
        `;

    } catch (error) {

        chatMessages.innerHTML += `
            <div class="bg-red-100 p-3 rounded-lg">
                Chatbot connection failed.
            </div>
        `;

    }

});
</script>