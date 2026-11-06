const isCustomer = (req, res, next)=>{
    if(req.session.user && req.session.user.role === "customer"){
        return next()
    }
    res.redirect("/")
}

module.exports = isCustomer