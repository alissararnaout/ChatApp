var socket = io();

        let app = new Vue({
            el: '#app',
            data: {
                newmessage: null,
                messages: [],
                typing: false,
                online: [],
                name: null,
                ready: false,
                info: [],
                connectionCount: 0
            },
            methods: {
                send() {
                    socket.emit('chat-message', { message: this.newmessage, user: this.name })
                    this.messages.push({ message: this.newmessage, type: 0, by: 'Me' })
                    this.newmessage = null
                },
                isTyping() {
                    socket.emit('typing', this.name)
                },
                setName() {
                    socket.emit('joined', this.name)
                    this.ready = true
                }
            },
            mounted() {
                window.onbeforeunload = () => {
                    socket.emit('left', this.name)
                }
                socket.on('connections', (count) => {
                    this.connectionCount = count
                })
            },
            watch: {
                newmessage(value) {
                    value ? socket.emit('typing', this.name) : socket.emit('stopTyping')
                }
            },
            created() {
                socket.on('chat-message', (data) => {
                    this.messages.push({ message: data.message, type: 1, by: data.user })
                    this.typing = false
                })

                socket.on('typing', (data) => {
                    console.log(data)
                    this.typing = data
                })
                socket.on('stopTyping', () => {
                    this.typing = false
                })

                socket.on('left', (name) => {
                    this.online.splice(this.online.indexOf(name))
                    this.info.push({ name: name, type: 'Left' })
                    setTimeout(() => {
                        this.info = []
                    }, 5000);
                })

                socket.on('joined', (name) => {
                    this.online.push(name)
                    this.info.push({ name: name, type: 'Joined' })
                    setTimeout(() => {
                        this.info = []
                    }, 5000);
                })
            }
        });