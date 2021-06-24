const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server);

const users = {};

const USER_LIMIT = 2;

io.on('connection', (socket) => {


    if(Object.keys(users).length >= USER_LIMIT){
        socket.emit('system_message', "The chat reached its user limit :(")
        return;
    }

    users[socket.id] = socket;

    const welcome_message = `${socket.id} se unió al chat! Esperamos que haya traido a Canqui.`
    socket.broadcast.emit('system_message', welcome_message);
    socket.broadcast.emit('user_count', Object.keys(users).length);
    socket.emit('user_count', Object.keys(users).length);

    socket.emit('system_message', welcome_message);

    socket.on('new_message', (payload) =>{
        socket.broadcast.emit('new_message_send', {
            message: payload,
            user: socket.id
        })
    })

    socket.on('disconnect', () => {
        delete users[socket.id];
        socket.broadcast.emit('user_count', Object.keys(users).length);

    })

});


app.use(express.static('public'));


const SERVER_PORT = 3000;
server.listen(SERVER_PORT, () => {
    console.log(`El servidor se está ejecutando en http://localhost:${SERVER_PORT}`)
})