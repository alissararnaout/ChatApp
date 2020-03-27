let app = require('express')();

let http = require('http').Server(app);

let io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


// listen for socket connection
io.on('connections', (socket) => {
    io.emit('connections',Object.keys(io.sockets.connected).length) // number of connections

    socket.on('disconnect', () => {
        console.log('Disconnected')
        io.emit('connections', Object.keys(io.sockets.connected).length);
    })

    // listen for created events
    socket.on('chat-message',(msg) => {
        socket.broadcast.emit('chat-message', msg)
    })

    // user is typing
    socket.on('typing',(data) => {
        socket.broadcast.emit('typing', data)
    })

    // user has stopped typing
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping')
    })

    // user joined the chat / connected
    socket.on('joined', (name) => {
        socket.broadcast.emit('joined', name)
    })

    // user has left the chat / disconnected
    socket.on('left', (name) => {
        socket.broadcast.emit('left', name)
    })

})

http.listen(3000, () => {
    console.log('server started at http://localhost:3000')
})