const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

io.on('connection', socket => {
    socket.on('join-room', (room) => {
        socket.join(room);
    });
    socket.on('message-send', (room, data) => {
        socket.to(room).broadcast.emit('message', data);
    });
    socket.on('room-added', (room) => {
        socket.to('waiting-room').broadcast.emit('new-room-added', room);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`))