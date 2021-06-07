const express = require('express')
const app = express()
const server = require('http').createServer(app)
const cors = require('cors')
const helmet = require('helmet')

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

app.use(cors())
app.use(helmet())

const PORT = process.env.PORT || 1110;

app.get('/', (req, res) => {
    res.send("Server is running")
})

io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.on('callUser', ({userToCall, signalData, from, name}) => {
        io.to(userToCall).emit('callUser', {signal: signalData, from, name})
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal)
    })
})


server.listen(PORT, () => console.log(`APP is up on http://localhost:${PORT}`))