const jwt = require('jsonwebtoken')

function generateToken(user) {
    const token = jwt.sign({ data: user }, process.env.PRIVATE_KEY_JWT , { expiresIn: '24h' })
    return token
}

module.exports = generateToken