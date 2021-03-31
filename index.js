const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

//  constants
const PORT = 3001

/*
* How user is:
* const user = {
*   name: String
* }
* */

//  mocks
const users = []

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('USER:JOINED', user => {
        users.push(user)
        console.log(users)
        io.emit('USER:JOINED', users)
    })

    socket.on('disconnect', socket => {
        console.log('User disconnected.')
        users.pop()
        console.log(users)
        io.emit('USER:DISCONNECT', users)
    })
});

http.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});