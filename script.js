const chatInput = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send");
const chatContainer = document.querySelector(".container");
const welcomeText = document.querySelector(".welcome-text");

welcomeText.style.display = "block";

let userText = null;
const API_KEY = "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";

const createElement = (html, className) => {
    const chatDiv = document.createElement('div');
    chatDiv.classList.add('chat', className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const getChatResponse = async () => {
    const API_URL = "https://api.openai.com/v1/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null,
        }),
    };

    try {
        const response = await (await fetch(API_URL, requestOptions)).json();
        console.log(response);

        if (response && response.choices && response.choices[0] && response.choices[0].text) {
            const botReply = response.choices[0].text;
            showBotReply(botReply);
        } else {
            showBotReply("Oops! An error occurred or the response structure is unexpected.");
        }
    } catch (error) {
        console.log(error);
        showBotReply("Oops! An error occurred.");
    }
};

const showBotReply = (message) => {
    const html = `<div class="content">
        <div class="details">
            <img src="img/logo.webp" alt="user-image">
            <p>${message}</p>
        </div>
        <span><i class="bx bx-copy" id="copy"></i></span>
    </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);

    const copyButton = incomingChatDiv.querySelector("#copy");
    copyButton.addEventListener("click", () => {
        copyToClipboard(message);
        copyButton.textContent = "Copied";
    });
}

function copyToClipboard(text) {
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand("copy");
    document.body.removeChild(tempTextArea);
}

const showTypingAnimation = () => {
    const html = `<div class="content">
        <div class="details">
            <img src="img/logo.webp" alt="user-image">
            <div class="type-animation">
                <div class="typing-dot" style="--delay: 0.2s"></div>
                <div class="typing-dot" style="--delay: 0.3s"></div>
                <div class="typing-dot" style="--delay: 0.4s"></div>
            </div>
        </div>
        <span><i class="bx bx-copy"></i></span>
    </div>`;
    const incomingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    getChatResponse().then(() => {
        incomingChatDiv.remove();
    });
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (userText) {
        const html = `<div class="content">
            <div class="details">
                <img src="img/profile.png" alt="user-image">
                <p>${userText}</p>
            </div>
        </div>`;
        const outgoingChatDiv = createElement(html, "outgoing");
        chatContainer.appendChild(outgoingChatDiv);
        chatInput.value = "";
        setTimeout(showTypingAnimation, 500);
        welcomeText.style.display = "none";
    }
}

sendBtn.addEventListener("click", handleOutgoingChat);

chatInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        handleOutgoingChat();
    }
});
