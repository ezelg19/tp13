const sessionExpirada = (req,res,nex)=>{
    if (req.session?.user){
        if(req.cookies.time){
            return nex()
        }
        req.session.destroy(error => {
            if (error) console.log(error)
        })
        return res.redirect('/auth/expiro')
    }
    return res.redirect('/auth')
}

module.exports = { sessionExpirada }