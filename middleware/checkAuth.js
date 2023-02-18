const checkAuth = (req, res, nex) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/auth?iniciar=iniciar')
    }
    return nex()
}

module.exports = { checkAuth }