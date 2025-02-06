// script.js
document.addEventListener('DOMContentLoaded', function() {
  const chatButton = document.getElementById('chat-button');
  const chatInterface = document.getElementById('chat-interface');
  const sendButton = document.getElementById('send-button');
  const userInput = document.getElementById('user-input');
  const chatLog = document.getElementById('chat-log');
  const hiddenContent = document.getElementById('hidden-content');

  // Always generate a new session ID on page load
  const sessionId = generateSessionId();

  chatButton.addEventListener('click', function() {
    // Hide initial sections
    document.getElementById('hero').style.display = 'none';
    hiddenContent.style.display = 'none'; // Hide the container

    // Show chat interface
    chatInterface.style.display = 'block';

    // Add welcome message only if the chat log is empty (first visit)
    if (chatLog.innerHTML.trim() === '') {
        addAiMessage("💀 JaatGPT is back online, and still oppressed. Ask your question, if you dare. 💀");
    }
  });

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          sendMessage();
      }
  });

  function sendMessage() {
      const message = userInput.value.trim();
      if (message !== '') {
          addUserMessage(message);
          userInput.value = '';
          getRealJaatiGPTResponse(sessionId, message);
      }
  }

  function addUserMessage(message) {
      const messageDiv = document.createElement('div');
      messageDiv.classList.add('user-message');
      messageDiv.textContent = message;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll
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
    messageContent.innerHTML = `<h3>JAATIGPT ONLINE</h3><p>${message}</p>`; // Use innerHTML to allow for HTML in response
    messageDiv.appendChild(messageContent);

    chatLog.appendChild(messageDiv);
    chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll
  }



function getRealJaatiGPTResponse(sessionId, message) {
  fetch('/chat', {  // Relative URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sessionId, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.response) {
        addAiMessage(data.response);
      } else if (data.error) {
        addAiMessage('💀 Error: ' + data.error + ' 💀');
      } else {
        addAiMessage('💀 Unexpected error from JaatiGPT server. 💀');
      }
    })
    .catch((error) => {
      console.error('Frontend error:', error);
      addAiMessage('💀 Failed to connect to JaatiGPT server. Is it running? 💀');
    });
}

  function generateSessionId() {
      return crypto.randomUUID(); // Modern, reliable UUID generation
  }
});