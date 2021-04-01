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
let users = []
const messages = []

io.on('connection', (socket) => {
    console.log('a user connected');
    //  попробуем замкнуть
    const correntId = socket.id

    socket.on('USER:JOINED', user => {
        //  добавить id и удалять по id
        user.id = socket.id
        users.push(user)
        console.log(users)
        io.emit('USER:JOINED', users)
    })

    socket.on('USER:MESSAGE', message => {
        if(message){
            messages.push(message)
        }
        console.log(messages)
        io.emit('USER:MESSAGE', messages)
    })

    //  что будет если удалит socket?
    socket.on('disconnect', socket => {
        console.log('User disconnected.')
        users = users.filter((item) => item.id !== correntId)
        console.log(users)
        io.emit('USER:DISCONNECT', users)
    })
});

http.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});