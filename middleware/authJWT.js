const jwt = require('jsonwebtoken')

function auth(req, res, next) {
    const authHeader = req.cookies.token

    if (!authHeader) {
        return res.status(401).redirect('/auth')
    }

    const token = authHeader

    jwt.verify(token, process.env.PRIVATE_KEY_JWT, (err, decoded) => {
        if (err) {
            return res.status(401).redirect('/auth')
        }

        req.user = decoded.data

        next()

    })
}

module.exports = { auth }