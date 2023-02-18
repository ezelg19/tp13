const { productos } = require('../Daos(persistencia)/productoDao.js')
const mensajes = require('../Daos(persistencia)/mensajesDao.js')


let users = 0
const initSocket = (io) => {
    io.on('connection', async (socket) => {
        users++
        console.log(`usuario ${socket.id} conectado. N°:${users}`)

        socket.on('respuesta', async () => {
            io.sockets.emit('array', await productos.getAll())
            io.sockets.emit('mensajes', await mensajes.getAll())
        })
        //-----------------Productos-----------------//
        socket.on('newProduct', async data => {
            console.log('producto nuevo')
            productos.save(data)
            io.sockets.emit('array', await productos.getAll())
        })
        //-----------------Mensajes-----------------//
        socket.on('newMensaje', async data => {
            await mensajes.save(data.mensaje, data.user)
            io.sockets.emit('mensajes', await mensajes.getAll())
        })


        socket.on('disconnect', () => { console.log('user disconnected'), users-- })
    })
}

module.exports = initSocket