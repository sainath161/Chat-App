// Client side

const socket = io('http://localhost:3000');

let username = '';

document.getElementById('join-chat').addEventListener('click', (event) => {
    event.preventDefault()

    username = document.getElementById('username-input').value
    
    if (username.trim() !== '' ) {
        document.querySelector('.form-username').style.display = 'none';
        document.querySelector('.chatroom-container').style.display = 'block';
        // document.querySelector('.chatroom-header').innerText = `Chatroom - ${username}`;

        //from client to server
        socket.emit('username enter', username);
    } else {
        alert("Username cannot be empty");
    }
});

document.getElementById('send-btn').addEventListener('click', (event) => {
    event.preventDefault();

    const data = {
        username: username,
        message: document.getElementById('message-input').value
    }
    
    //frontend -> Add message on the screen
    addMessage(data, true);

    //Socket -> send the message to the server
    socket.emit('message', data);
});

// flag -> weather we have received the message or sent
function addMessage(data, flag) {
    var msgDiv = document.createElement('div');
    msgDiv.innerText = `${data.username}: ${data.message}`

    if(flag) {
        // I have sent the message
        msgDiv.setAttribute('class', 'message sent');
        msgDiv.style.alignSelf = 'flex-end'
    } else {
        // I have recieved the message
        msgDiv.setAttribute('class', 'message received');
    }

    document.querySelector('#messages-container').appendChild(msgDiv);
}

// for exit
document.getElementById('exit-btn').addEventListener('click', () => {
    socket.emit('username left', username)
    });

    // When the user enter the chat
socket.on('username enter', (username) => {
    var msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<b>${username}</b> has entered the chat!`;
    // add timer to the data
    setTimeout(()=>{
        msgDiv.remove()
        },2000)

    document.querySelector('#messages-container').appendChild(msgDiv);
});

socket.on('message', (data) => {
    if(data.username !== username) {
        addMessage(data, false);
    }
});

socket.on('username left', (data) => {
    if(data !== username) {
        var msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<b>${data}</b> left the chat!!`;
        setTimeout(()=>{
            msgDiv.remove()
            },2000)

        document.querySelector('#messages-container').appendChild(msgDiv)
    } else {
        var msgDiv = document.createElement('div');
        msgDiv.innerHTML = `<b>You</b> have left!`;
        setTimeout(()=>{
            msgDiv.remove()
            },2000)

        document.querySelector('#messages-container').appendChild(msgDiv)
    }
});