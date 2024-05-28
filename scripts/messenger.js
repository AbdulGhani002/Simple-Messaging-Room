document.addEventListener("DOMContentLoaded", () => {
    const socket = io("http://127.0.0.1:3000");
  
    const messageContainer = document.getElementById("message-container");
    const messageForm = document.getElementById("message-form");
    const messageInput = document.getElementById("message-input");
    const roomIdInput = document.getElementById("room-id");
    const submitButton = document.getElementById("submit");
    const yourRoomDisplay = document.querySelector(".yourroom");
    const roomIdDisplay = document.querySelector(".roomId");
  
    socket.on("message", ({ message, roomId }) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = message;
      messageContainer.appendChild(messageElement);
      roomIdInput.value = roomId;
    });
  
    messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const message = messageInput.value;
      const roomId = roomIdInput.value;
  
      if (message && roomId) {
        socket.emit("joinRoom", roomId);
        socket.emit("sendMessage", { message, roomId });
        messageInput.value = "";
      }
    });
  
    socket.on("yourRoomId", (roomId) => {
      yourRoomDisplay.textContent = `Your Room ID: ${roomId}`;
    });
  
    socket.on("connectedRoomId", (roomId) => {
      roomIdDisplay.textContent = `Connected to Room: ${roomId}`;
    });
  });
  