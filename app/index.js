const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: '*'
    }
});

//  constants
const PORT = process.env.PORT || 3001

//  mocks
let users = []
let messages = []

app.get('/', (req, res) => {
    res.send('<h1>Может быть даже работает, lel.</h1>')
})

let msgId = 0
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
            message.id = msgId
            message.socketId = socket.id
            messages.push(message)
            msgId = msgId + 1
        }
        console.log(messages)
        io.emit('USER:MESSAGE', messages)
    })

    socket.on('USER:DELETE_MESSAGE', idx => {
        console.log(idx)
        // messages = messages.filter(msg => msg.msg !== idx && msg.socketId === correntId)
        messages = messages.filter(msg => {
            if(msg.socketId === correntId){
                return msg.msg !== idx
            } else if(msg.socketId !== correntId){
                return msg.msg
            }
        })
        io.emit('USER:DELETE_MESSAGE', messages)
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