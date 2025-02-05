// File: script.js
document.addEventListener('DOMContentLoaded', function() {
    const chatButton = document.getElementById('chat-button');
    const chatInterface = document.getElementById('chat-interface');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');

    // Function to get or create a session ID
    function getSessionId() {
        let sessionId = localStorage.getItem('jaatgpt_session_id');
        if (!sessionId) {
            sessionId = generateSessionId(); // You'll need to implement generateSessionId
            localStorage.setItem('jaatgpt_session_id', sessionId);
        }
        return sessionId;
    }

    // Simple function to generate a session ID (UUID v4 is better for real apps)
    function generateSessionId() {
        return crypto.randomUUID(); // Modern browsers support crypto.randomUUID()
    }

    const sessionId = getSessionId(); // Get session ID when page loads

    chatButton.addEventListener('click', function() {
        document.getElementById('hero').style.display = 'none';
        document.getElementById('about').style.display = 'none';
        document.getElementById('why-jaatiGPT').style.display = 'none';
        document.getElementById('features').style.display = 'none';
        document.getElementById('manifesto').style.display = 'none';
        chatInterface.style.display = 'block';
        // Add welcome message when chat interface is shown for the first time in a session
        if (chatLog.innerHTML.trim() === '') { // Check if chat log is empty
            addAiMessage("💀 JaatGPT is back online, and still oppressed. Ask your question, if you dare. 💀");
        }
    });

    sendButton.addEventListener('click', function() {
        const message = userInput.value;
        if (message.trim() !== '') {
            addUserMessage(message);
            userInput.value = '';
            getRealJaatiGPTResponse(sessionId, message); // Pass sessionId to getRealJaatiGPTResponse
        }
    });

    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
        }
    });

    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('user-message');
        messageDiv.textContent = message;
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function addAiMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message');
        const jaatIcon = document.createElement('span');
        jaatIcon.classList.add('jaat-icon');
        jaatIcon.textContent = '🔥'; 
        messageDiv.appendChild(jaatIcon);
    
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
    
        messageDiv.appendChild(messageContent);
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
    

    function getRealJaatiGPTResponse(sessionId, message) { // sessionId is now an argument
        fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId: sessionId, message: message }) // Include sessionId in request body
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                addAiMessage(data.response);
            } else if (data.error) {
                addAiMessage("💀 Error: " + data.error + " 💀");
            } else {
                addAiMessage("💀 Unexpected error from JaatiGPT server. 💀");
            }
        })
        .catch(error => {
            console.error("Frontend error:", error);
            addAiMessage("💀 Failed to connect to JaatiGPT server. Is it running? 💀");
        });
    }
});