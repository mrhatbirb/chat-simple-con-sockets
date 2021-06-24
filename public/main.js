const socket = io();

const chatContent = document.getElementById('chat-content');
const messageInput = document.getElementById('message-input');
const userCountNumber = document.getElementById('user-count-number')

// Notifications

function pushSystemNotification(message) {
    chatContent.innerHTML += `
    <div class="system-notification">
        <div class="notification-message">${message}</div>
        <div class="notification-date">${new Intl.DateTimeFormat('en-US', {
        timeStyle: 'short'
    }).format(Date.now())}</div>
    </div>
    `
}
socket.on('system_message', (payload) => {
    pushSystemNotification(payload)
})

// User count

socket.on('user_count', (count) => {
    userCountNumber.innerHTML = count;
})


// Message handling

function newMessage(message, user = "Me") {
    chatContent.innerHTML += `
    <div class="message-container ${user}">
        <img src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" class="message-avatar">
        
        <div class="message-text">
            <div class="message-user">${user}</div>
            ${message}
        </div>
        <div class="message-date">${new Intl.DateTimeFormat('en-US', {
        timeStyle: 'short'
    }).format(Date.now())}</div>
    </div>
    `
}


messageInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        newMessage(messageInput.value);
        socket.emit('new_message', messageInput.value)

        messageInput.value = "";
    }
});

socket.on('new_message_send', (payload) => {
    newMessage(payload.message, payload.user)
});
