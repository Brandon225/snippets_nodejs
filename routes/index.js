// Routes

const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Snippet = require('../models/snippet');
var mid = require('../middleware');

const path = 'http://localhost:3000'

// create constants
const date = new Date();
const year = date.getFullYear();

const desc = 'A software develper tool. Create, convert, and download code snippets for your preferred code editor.';


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
    return res.render('home', {title: 'Home | Snippets', desc, canonical: path, year: year, bgColor: '#222', code});
});

// GET /details
router.get('/details', (req, res, next) => {
    return res.render('details', {title: 'Details | Snippets', desc, canonical: `${path}details`, year: year, bgColor: '#ffffff', scroll: 'scroll', scrollTarget: '#sidebar-content'});
});

// GET /about
router.get('/about', (req, res, next) => {
    return res.render('about', {title: 'About | Snippets', desc, canonical: `${path}about`, year: year, bgColor: '#ffffff'});
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {

    User.findById(req.session.userId)
        .exec((error, user) => {
            if (error) 
            {
                return next(error);    
            } else {                
                return res.render('profile', {title: 'Profile | Snippets', desc, canonical: `${path}profile`, year: year, bgColor: '#ffffff', name: user.name, editor: user.codeEditor});
            }
        });
});

// GET /register
router.get('/register', (req, res, next) => {
    return res.render('register', { title: 'Sign Up | Snippets', desc, canonical: `${path}register`,  bgColor: '#ffffff' });
});

// GET /logout
// ERROR FIX: downgraded from Mongoose 5 to 4.50 to prevent error when destroying session
router.get("/logout", (req, res, next) =>
{
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
          if(err) {
            return next(err);
          } else {
            return res.redirect('/');
          }
        });
      }
});

// GET /login
router.get('/login', (req, res, next) => {
    if (!res.session) 
    {
        return res.render('login', { title: 'Log In | Snippets', desc, canonical: `${path}login`, bgColor: '#ffffff' });
    } else {
        return res.redirect('/');
    }
    
});


// GET /library
router.get('/library', mid.requiresLogin, (req, res, next) => {

    console.log(`editor? ${req.param.editor}`);
    Snippet.find({})
        .exec((err, snippets) => {
            if (err) return next(err);
            console.log(`Found snippets: ${snippets}`);
            res.render('library', { title: 'Library | Snippets', desc, canonical: `${path}library`, bgColor: '#ffffff', snippets});
        });
});

// GET /library
router.get('/library/:editor', mid.requiresLogin, (req, res, next) => {

    let { editor } = req.params;

    console.log(`editor? ${editor}`);
    Snippet.find({editor: editor})
        .exec((err, snippets) => {
            if (err) return next(err);
            // console.log(`Found snippets: ${snippets}`);
            res.render('library', { title: 'Library | Snippets', desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor});
        });
});

// POST /save-snippet
router.post('/save-snippet', (req, res, next) => {

    console.log(`save snippet!`);

    // SETTING HEADER IS NECESSARY FOR AJAX CLIENTSIDE CALLS
    res.setHeader('Content-Type', 'application/json');
    
    var snippetData = {
        userId: req.session.userId ? req.session.userId : '',
        editor: req.body.code_editor,
        scope: req.body.code_scope,
        description: req.body.code_description,
        trigger: req.body.code_trigger,
        code: req.body.code_text,
        content: req.body.snippet_output
    };

   console.log(`snippetData? ${snippetData}`);

    // use schema's  `create` method to insert document in Mongo
    Snippet.create(snippetData, (error, snippet) => {
        
        if (error) {

            console.log(`Error creating snippet! ${error}`);

            // return error response
            res.send({
                success: null,
                error: `There was an error saving this snippet. ${error}`,
                snippet: snippet
            });

            // return next(error);
        } else {
            
            console.log(`Created snippet! ${snippet}`);

            // return success response
            res.send({
                success: `Successfully saved snippet.`,
                error: null,
                snippet: snippet
            });

        }
    });
});

// POST /login
router.post('/login', mid.loggedOut, (req, res, next) => {
    if (req.body.email && 
        req.body.password)
    {
        User.authenticate(req.body.email, req.body.password, function(error, user) {
            if (error || !user) 
            {                
                const err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);    
            } else {

                req.session.userId = user._id;                
                return res.redirect('/');
            }
        });
        
    } else {

        const err = new Error('Email and password required.')
        err.status = 401;
        return next(err);
    }
});

// POST /register
router.post('/register', mid.loggedOut, (req, res, next) => {
    if (req.body.email && 
        req.body.name && 
        req.body.codeEditor && 
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
            codeEditor: req.body.codeEditor,
            password: req.body.password
        };
       
        // use schema's  `create` method to insert document in Mongo
        User.create(userData, (error, user) => {

            console.log(`Created user! ${user}`);
            
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });

    } else {
        const err = new Error('All fields required.')
        err.status = 400;
        return next(err);
    }
});

module.exports = router;