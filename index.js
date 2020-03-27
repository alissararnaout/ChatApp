let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

// connect to local host
http.listen(3000, () => {
    console.log('connected')
})

// listen for socket connection
io.on('connection', (socket) => {
    io.emit('connections',Object.keys(io.sockets.connected).length) // number of connections

    socket.on('disconnect', () => {
        console.log('Disconnected');
    })

    // listen for created events
    socket.on('Created',(data) => {
        socket.broadcast.emit('Created', (data))
    })

    // user is typing
    socket.on('typing',(data) => {
        socket.broadcast.emit('typing',(data))
    })

    // user has stopped typing
    socket.on('stopTyping',(data) => {
        socket.broadcast.emit('stopTyping',(data))
    })

    // user joined the chat / connected
    socket.on('joined', (data) => {
        socket.broadcast.emit('joined',(data))
    })

    // user has left the chat / disconnected
    socket.on('left', (data) => {
        socket.broadcast.emit('left',(data))
    })


})