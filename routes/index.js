// Routes

const express = require('express');
const router = express.Router();

const path = 'http://localhost:3000'

// create constants
const date = new Date();
const year = date.getFullYear();

// GET /login
router.get('/login', (req, res, next) => {

});

// POST /login
router.post('/login', (req, res, next) => {

});


// GET /register
router.get('/register', (req, res, next) => {

});

// POST /register
router.post('/login', (req, res, next) => {
    if (req.body.email && 
        req.body.name && 
        req.body.password && 
        req.body.confirmPassword)
    {
        // confirm that password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) 
        {
            const err = new Error('Passwords do not match.')
            err.status = 400;
            return next(err);
        }

        var userData = {
            email: req.body.email,
            name: req.body.name,
            favoriteBook: req.body.favoriteBook,
            password: req.body.password
        };

        // use schema's  `create` method to insert document in Mongo
        User.create(userData, (error, user) => {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/profile');
            }
        });

    } else {
        const err = new Error('All fields required.')
        err.status = 400;
        return next(err);
    }
});

// GET /
router.get('/', (req, res, next) => {

    // create constants
    const code = `<snippet><content><![CDATA[
console.log('$1: ', $2);
]]></content>
	<tabTrigger>log</tabTrigger>
	<scope>source.js</scope>
	<description>Log to the Console</description>
</snippet>`;
    return res.render('home', {title: 'Home', canonical: path, year: year, bgColor: '#222', code});
});

// GET /details
router.get('/details', (req, res, next) => {
    return res.render('details', {title: 'Details', canonical: `${path}details`, year: year, bgColor: '#ffffff', scroll: 'scroll', scrollTarget: '#sidebar-content'});
});

// GET /about
router.get('/about', (req, res, next) => {
    return res.render('about', {title: 'About', canonical: `${path}about`, year: year, bgColor: '#ffffff'});
});

module.exports = router;