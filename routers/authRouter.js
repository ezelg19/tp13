require('dotenv').config()
const { Router } = require('express')
const { createHash, isValidPassword } = require('.././middleware/passport.js')
// const { sessionExpirada } = require('.././middleware/auth.js')
const { auth } = require('.././middleware/authJWT.js')
const { authors } = require('../Daos(persistencia)/authorDao.js')
const generateToken = require('../middleware/generateJWT.js')
const intlTelInput = require('intl-tel-input')
const Mail = require('../utils/nodemailer.js')
// const { authors } = require('../Daos(persistencia)/authorDao.js')
// const { checkAuth } = require('../middleware/checkAuth.js')

const router = Router()

router.get('/', auth, (req, res) => {

    res.cookie('user', req.session.user)
    res.cookie('time', '1min', { maxAge: 60000 }).render('main', { root: __dirname })
})

router.get('/contador', (req, res) => {
    if (req.session.contador) {
        req.session.contador++
        res.cookie('time', '1min', { maxAge: 60000 }).send(`sessiones ${req.session.contador}`)
    }
    else { res.cookie('time', '1min', { maxAge: 60000 }).send('Inicie session') }
})

//----------------------------Login-------------------------------------//

router.get('/auth', (req, res) => {
    if (req.params.expiro) { return res.render('login', { expiro: true }) }
    if (req.query.iniciar) { return res.render('login', { iniciar: true }) }
    res.render('login')
})

// router.post('/auth', passport.authenticate('login', {
//     failureRedirect: '/register'
// }),
//     (req, res) => {
//         console.log('auth post')
//         req.session.user = req.body.username
//         req.session.time = new Date().getMinutes()
//         res.cookie('time', '1min', { maxAge: 60000 }).redirect('./')
//     }
// )

router.post('/auth', async (req, res) => {
    try {
        const { mail, password } = req.body
        const user = await authors.getByUser({ email: mail })
        if (user === null) {
            return res.json({ error: 'Usuario invalido' })
        }
        if (!isValidPassword(user, password)) {
            return res.json({ error: 'Contraseña invalida' })
        }
        const { name, email, avatar } = user
        const access_token = generateToken({ name, email, avatar })

        // return res.json({ access_token })
        console.log('auth post: ', access_token)
        // return res.status(200).cookie('token',access_token).json({token:`token: ${access_token}`})
        return res.status(200).cookie('token', access_token).redirect('/')
    } catch (error) {
        res.status(500).send(error)
    }
})

//----------------------------register-------------------------------------//

router.get('/register/:existe?', (req, res) => {
    if (req.params.existe) { return res.render('register', { repetido: true }) }
    res.render('register')
})

router.post('/register', async (req, res) => {
    const { email, name, password, dir, edad, phone, avatar } = req.body
    if (!email || !name || !password || !dir || !phone) {
        return res.json({ error: 'Complete todos los datos para poder registrarse' })
    }
    if (!avatar) {
        const avatar = "public/defaultAvatar.jpeg"
    }
    const usuario = { email: email, name: name, password: createHash(password), direccion: dir, edad: edad, numTel: phone, avatar: avatar }
    const existe = await authors.getByUser(usuario)

    if (existe) {
        if (existe.username) {
            return res.json({ error: 'Username ya utilizado, elija otro' })
        }
        return res.json({ error: 'ya existe este usuario' })
    }

    await authors.save(usuario)
    const { password: pass, ...user } = usuario

    const access_token = generateToken(user)
    const html = `<h4>Mail: ${user.email} <!h4>
    <h4>Nombre: ${user.name} <!h4>
    <h4>Direccion: ${user.direccion} <!h4>
    <h4>Edad: ${user.edad} <!h4>
    <h4>Numero: ${user.numTel} <!h4>
    `
    await Mail(process.env.EMAIL_ADMIN, process.env.PASS_ADMIN, html, "Nuevo registro")
    return res.status(200).cookie('token', access_token).redirect('/')
})

//----------------------------logout-------------------------------------//

router.post('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send(error)
    })
    console.log(req.cookies.token)
    res.cookie('token').redirect('/auth')
})

module.exports = router