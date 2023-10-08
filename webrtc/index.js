const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors'); // Add this line

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enable CORS for all routes
app.use(cors()); // Add this line

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle the offer from the frontend
    socket.on('offer', (data) => {
        console.log('Received offer from client');
        socket.broadcast.emit('offer', data);
    });

    // Handle the answer from the backend
    socket.on('answer', (data) => {
        console.log('Received answer from backend');
        socket.broadcast.emit('answer', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    // Handle the video chunk from the frontend
    socket.on('videoChunk', (data) => {
        console.log(data);
        console.log('GOT DATA');
        // Broadcast the video chunk to all connected clients (including sender)
        io.emit('videoChunk', data);
    });
});

server.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});

