const chatBox = document.getElementById("chatBox"); //For Chat Container.
const userInput = document.getElementById("userInput"); //For Input btn.
const sendButton = document.getElementById("sendButton"); //For send btn.

const typingIndicator = document.getElementById("typingIndicator");
const apiKey = "Paste your Api Key Here";

// You can add additional data here or modify the prompt below.
const customData = `
   - You are created by Sangappa and Darshan, MCA Students.
   - Institution: Shree Devi Institute of Technology (SDIT), Kenjar, Mangalore, Karnataka, India
   - Founded: 2006
   - Affiliation: Visvesvaraya Technological University (VTU), AICTE-approved
   - Programs offered: BE (CSE, IS, ECE, Mechanical, Civil, Aeronautical, AI/ML, AI & Data Science), M.Tech (Construction Tech), MBA, MCA, Ph.D.
   - Vision: To be an institution of academic excellence imparting technical and management education integrated with human values to face social and environmental challenges.
   - Mission:
   -   1. Disseminate quality education using student-centric learning.
   -   2. Engage and encourage students, faculty, and staff.
   -   3. Mentor students and provide career development support.
   -   4. Impart transformative education with entrepreneurial, social, and ethical values.
   - Contact:
   -   Address: Airport Road, Kenjar, Mangalore - 574142, Karnataka, India
   -   Phone: +91 8242254104 / 2254102
   -   Email: info@sdc.ac.in
   - Website for reference: https://sdit.ac.in
`;

const chatHistory = [];
let isFirstMessage = true;

function initializeChat() {
  chatHistory.push({
    role: "user",
    parts: [{ text: customData }]
  });

  chatHistory.push({
    role: "model",
    parts: [{
      text: "Hello. I am here to assist you with information about Shree Devi Institute of Technology."
    }]
  });

  addMessage("bot", chatHistory[1].parts[0].text);
}

async function sendMessage() {
  const inputText = userInput.value.trim();
  if (!inputText || sendButton.disabled) return;

  if (isFirstMessage) {
    const emptyState = document.querySelector('.empty-state');
    if (emptyState) emptyState.style.display = 'none';
    isFirstMessage = false;
  }

  addMessage("user", inputText);
  userInput.value = "";
  sendButton.disabled = true;
  showTypingIndicator();

  const enhancedMessage = `${inputText}\n\n[Keep response brief - maximum 2-3 sentences]`;

  chatHistory.push({
    role: "user",
    parts: [{ text: enhancedMessage }]
  });

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: chatHistory,
          generationConfig: {
            maxOutputTokens: 150,
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("API Error:", data.error);
      addMessage("bot", "Sorry, there was an error. Please try again!");
      hideTypingIndicator();
      sendButton.disabled = false;
      return;
    }

    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

    setTimeout(() => {
      hideTypingIndicator();
      addMessage("bot", botReply);

      chatHistory.push({
        role: "model",
        parts: [{ text: botReply }]
      });

      sendButton.disabled = false;
    }, 800);

  } catch (error) {
    console.error("Network Error:", error);
    hideTypingIndicator();
    addMessage("bot", "Network error. Please check your connection.");
    sendButton.disabled = false;
  }
}

function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = `chat-entry ${sender}-message`;

  const avatar = document.createElement("div");
  avatar.className = `message-avatar ${sender}-avatar`;
  avatar.textContent = sender === "user" ? "You" : "AI";

  const content = document.createElement("div");
  content.className = "message-content";
  content.textContent = text;

  div.appendChild(avatar);
  div.appendChild(content);
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  typingIndicator.style.display = 'flex';
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTypingIndicator() {
  typingIndicator.style.display = 'none';
}

userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && !sendButton.disabled) {
    sendMessage();
  }
});

userInput.addEventListener('input', function () {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
});

window.addEventListener('load', () => {
  initializeChat();
  userInput.focus();
});
