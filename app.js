const initServer = require('./server.js')

const app = initServer()
// const port = process.env.PORT || 8080
const port = process.argv[2] || 8080

try {
    app.listen(port)
    console.log(`escuchando en el puerto ${port}`)
} catch (error) {
    console.log(error)
}