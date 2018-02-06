var loggedOut = (req, res, next) => {
    if (req.session && req.session.userId) 
    {
        return res.redirect('/profile');
    }
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
    // My code
    // if (!req.session.userId) 
    // {
        // const err = new Error('You are not authorized to view this page.');
        // err.status = 403;
        // return next(err); 
    // }
    // return next();
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
