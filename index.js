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
    console.log('there is a connection')

    socket.on('disconnect', () => {
        console.log('Disconnected');
    })

    // listen for created event - multiple connections
    socket.on('Created',(data) => {
        socket.broadcast.emit('Created', (data))
    })

})