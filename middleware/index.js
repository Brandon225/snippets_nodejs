var loggedOut = (req, res, next) => {
    console.log(`loggedOut?!`);
    
    if (req.session && req.session.userId) 
    {
        console.log(`User is logged in!`);
        return res.redirect('/profile');
    }
    console.log(`User is NOT logged in!`);
    return next();
}

var requiresLogin = (req, res, next) => {
    if (req.session && req.session.userId) 
    {        
        return next();
    } else {
        const err = new Error('You are not authorized to view this page.');
        err.status = 403;
        return next(err); 
    }
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
