"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const allSocket = [];
wss.on('connection', (socket) => {
    socket.on('message', (message) => {
        const parsedMsg = JSON.parse(message.toString());
        if (parsedMsg.type == 'join') {
            console.log('user joined: ' + parsedMsg.payload.roomId);
            allSocket.push({
                socket: socket,
                roomId: parsedMsg.payload.roomId
            });
        }
        if (parsedMsg.type == 'chat') {
            console.log('user sent message: ' + parsedMsg.payload.message);
            let currentUserRoom = null;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].socket == socket) {
                    currentUserRoom = allSocket[i].roomId;
                }
            }
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].roomId == currentUserRoom) {
                    allSocket[i].socket.send(parsedMsg.payload.message);
                }
            }
        }
    });
    socket.on('close', () => {
        const index = allSocket.findIndex(user => user.socket === socket);
        if (index !== -1) {
            allSocket.splice(index, 1);
            console.log('User disconnected');
        }
    });
});
