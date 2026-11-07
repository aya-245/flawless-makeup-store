const isDriver = (req, res, next)=>{
    if(req.session.user && req.session.user.role === "driver"){
        return next()
    }
    res.redirect('/')
}

module.exports = isDriver