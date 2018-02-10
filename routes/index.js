// Routes

const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Snippet = require('../models/snippet');
var mid = require('../middleware');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var db = mongoose.connection;

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
    return res.render('home', {title: 'Home | Snippets', active: 'home', desc, canonical: path, year: year, bgColor: '#222', code});
});

// GET /details
router.get('/details', (req, res, next) => {
    return res.render('details', {title: 'Details | Snippets', active: 'details', desc, canonical: `${path}details`, year: year, bgColor: '#ffffff', scroll: 'scroll', scrollTarget: '#sidebar-content'});
});

// GET /about
router.get('/about', (req, res, next) => {
    return res.render('about', {title: 'About | Snippets', active: 'about', desc, canonical: `${path}about`, year: year, bgColor: '#ffffff'});
});

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {

    User.findById(req.session.userId)
        .exec((error, user) => {
            if (error) 
            {
                return next(error);    
            } else {                
                return res.render('profile', {title: 'Profile | Snippets', active: 'profile', desc, canonical: `${path}profile`, year: year, bgColor: '#ffffff', name: user.name, email: user.email, editor: user.codeEditor});
            }
        });
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
    return res.render('register', { title: 'Sign Up | Snippets', active: 'register', desc, canonical: `${path}register`,  bgColor: '#ffffff' });
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
router.get('/login', mid.loggedOut, (req, res, next) => {
    return res.render('login', { title: 'Log In | Snippets', active: 'login', desc, canonical: `${path}login`, bgColor: '#ffffff' });
});

// GET /library
router.get('/library/:editor', (req, res, next) => {

    let { editor } = req.params;
    let editorName = editor.toUpperCase();
    if (editor === 'visual_code') 
    {
        editorName = 'VISUAL STUDIO CODE';
    }

    console.log(`editor? ${editor}`);
    Snippet.find({editor: editor, duplicated: {$ne: true}})
        .exec((err, snippets) => {
            if (err) return next(err);
            console.log(`Found snippets: ${snippets}`);

            res.render('library', { title: 'Library | Snippets', active: 'library', desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor: editorName});

        });
});

// GET /details
router.get('/password', (req, res, next) => {
    return res.render('password', {title: 'Password Support | Snippets', desc, canonical: `${path}password`, year: year, bgColor: '#ffffff'});
});


// POST /add-snippet  -- Add snippet to users library
router.post('/add-snippet', (req, res, next) => {
    console.log(`add snippet! ${req.body.snipId}`);
    if (req.session && req.session.userId) 
    {
        const snipId = req.body.snipId;
        console.log(`add-snippet user loggedin snipId? ${snipId}`);
        if (snipId) 
        {
            Snippet.findById(snipId)
                .exec((error, snippet) => {
                    if (error) 
                    {
                        console.log(`Error finding snippet!`);
                        return next(error);    
                    } else {

                        console.log(`add-snippet found snippet! ${snippet}`);

                        var snippetData = {
                            userId: req.session.userId,
                            editor: snippet.editor,
                            scope: snippet.scope,
                            description: snippet.description,
                            trigger: snippet.trigger,
                            code: snippet.code,
                            content: snippet.content,
                            duplicated: true
                        };

                        Snippet.create(snippetData, (error, newSnippet) => {
        
                            if (error) {
                    
                                return res.send({
                                    success: null,
                                    error: `There was an error adding snippet!`,
                                    user: null
                                });
                    
                            } else {
                                
                                console.log(`Created newSnippet! ${newSnippet}`);
                    
                                // return success response
                                // return snippet;
                                User.findById(req.session.userId)
                                .exec((error, user) => {
                                    if (error) 
                                    {
                                        console.log(`Error finding user!`);
                                        return next(error);    
                                    } else {

                                        console.log(`add-snippet found user! ${user}`);

                                        // TODO TODO TODO:  Add snippet to users snippetList
                                        user.snippets.push(newSnippet._id);
                                        user.save((err, theUser) => {
                                            if(err)
                                            {
                                                console.log(`add-snippet error saving snippet! ${err}`);
                                                
                                                return res.send({
                                                            success: null,
                                                            error: `There was an error saving snippet! ${err}`,
                                                            snippet: newSnippet
                                                        });
                                            }
                                            console.log(`add-snippet saved snippet! ${newSnippet} ${theUser}`);
                                            
                                            return res.send({
                                                        success: `Successfully added snippet.`,
                                                        error: null,
                                                        snippet: newSnippet
                                                    });
                                        });         
                                    }
                                });
                            }
                        });
                    }
                });
        } else {
            
            console.log(`Error! No snipId! ${snipId}`);

            const error = new Error('There was an issue adding snippet!');
            error.status = 404;
            return next(error);
        }

    } else {

        console.log(`Add snippet ERROR!`);

        // return error response
        res.send({
            success: null,
            error: `You must be logged in to add snippets!`,
            snippet: null
        });
    }
    
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
router.post('/login', (req, res, next) => {
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
                return res.redirect('/profile');
            }
        });
        
    } else {

        const err = new Error('Email and password required.')
        err.status = 401;
        return next(err);
    }
});

// POST /register
router.post('/register', (req, res, next) => {
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

        // hash password
        bcrypt.hash(req.body.password, 10, function(err, hash)
        {
            if (err) 
            {
                return next(err);
            }

            var userData = {
                email: req.body.email,
                name: req.body.name,
                codeEditor: req.body.codeEditor,
                password: hash,
                snippets: []
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
        });



    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});


// POST /register
router.post('/update-password', (req, res, next) => {
    if (req.body.email && 
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

        // hash password
        bcrypt.hash(req.body.password, 10, function(err, hash)
        {
            if (err) 
            {
                return next(err);
            }

            // TODO TODO TODO:  Eventually an email will need to be sent to verify user
            db.collection('users').findAndModify(
                    {email: req.body.email}, 
                    [['_id','asc']], 
                    {$set: {password: hash}},
                    {new: true, upsert: false}, 
                    (err, result) => {
                        console.log(`update-passord results: ${result}`);
                        if(err) return next(err);
                        return res.redirect('/login');
                    });
            
            // TODO TODO TODO:  Grab user and update password
            // User.findOne({email: req.body.email})
            // .exec(function(error, user) {
            //     if (error) {
            //         return callback(error);
            //     } else if (!user) {
            //         console.log(`User not found!`);
            //         const error = new Error('User not found.');
            //         error.status = 401;
            //         return callback(error);
            //     } else {
                
            //         // TODO TODO TODO:  Eventually an email will need to be sent to verify user
            //         user.findAndModify({_id: user._id},  {$set: {password: hash}}, (err, result) => {
            //             console.log(`update-passord results: `);
            //             if(err) return next(err);
            //             return res.redirect('/login');
            //         });
            //     }
            // });
        });

    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});



module.exports = router;