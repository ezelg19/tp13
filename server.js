require('dotenv').config()
const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const hbs = require('express-handlebars')
const MongoStore = require('connect-mongo')
const yargs = require("yargs/yargs")(process.argv.slice(2))

//-----------------------modulos------------------------//
// const { productos } = require('./modulos/class/productos.js')
// const mensajes = require('./modulos/class/mensajes.js')
const initSocket = require('./utils/initSocket.js')
const routerProd = require('./routers/productoRouter.js')
const routerCarrito = require('./routers/carritoRouter.js')
const routerAuth = require('./routers/authRouter.js')
const { passport, initPassport } = require('./middleware/passport.js')

const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const initServer = () => {
    try {
        const app = express()
        const httpServer = new HttpServer(app)
        const io = new IOServer(httpServer)


        // ----------- Handlebars ----------- //
        app.engine('hbs', hbs.engine({
            extname: '.hbs',
            partialsDir: __dirname + '/views/partials',
            layoutsDir: __dirname + '/views/layouts',
            defaultLayout: 'index.hbs'
        }))

        app.set('views', './views')
        app.set('view engine', 'hbs')

        // ----------- Session ----------- //
        
        app.use(session({
            secret: process.env.SECRET_KEY_SESSION,
            store: MongoStore.create({
                mongoUrl: process.env.MONGOURL,
                mongoOptions: config
            }),
            cookie: {
                httpOnly: false,
                secure: false,
                maxAge: 1000 * 60 * 5
            },
            rolling: true,
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        initPassport()

        app.use(express.static('public'))
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        app.use(cookieParser(process.env.SECRET_KEY_COOKIE))
        // app.use(cors())
        // app.use(logger('dev'))    

        //---------------------Rutas----------------------//

        const port = process.argv[2] || 8000

        app.use('/appi/productos', routerProd)
        app.use('/', routerAuth)
        app.use('/carrito', routerCarrito)
        app.get('/datos', (req, res)=>{
            console.log(`puerto ${port}`)
            const pid = process.pid
            res.send(`Servidor express - PORT ${port} - PID : ${pid} - FyH: ${new Date().toLocaleString()}`)
        })
    
        //------------------------------------------------//

        //---------------------Socket----------------------//
        initSocket(io)
        //-------------------------------------------------//

        return {
            listen: () => new Promise((res, rej) => {
                const server = httpServer.listen(port, () => {
                    res(server)
                })
                server.on('error', err => rej(err))
            })
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = initServer