// Routes

const express = require('express');
const router = express.Router();
var seedData = require('../src/logic/snippet.seed.json');
var snippetRouter = require('./snippets').snippetRouter;
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

router.use('/snippets', snippetRouter);

// GET /
router.get('/', (req, res, next) => {

    // create constants
    const code = `<snippet><content><![CDATA[
//console.log('$1: ', $2);
]]></content>
	<tabTrigger>log</tabTrigger>
	<scope>source.js</scope>
	<description>Log to the Console</description>
</snippet>`;
    return res.render('home', { title: 'Home | Snippets', active: 'home', desc, canonical: path, year: year, bgColor: '#222', code, currentUser: res.locals.currentUser });
});

// GET /details
router.get('/details', (req, res, next) => {
    return res.render('details', { title: 'Details | Snippets', active: 'details', desc, canonical: `${path}details`, year: year, bgColor: '#ffffff', scroll: 'scroll', scrollTarget: '#sidebar-content' });
});

// GET /about
router.get('/about', (req, res, next) => {
    return res.render('about', { title: 'About | Snippets', active: 'about', desc, canonical: `${path}about`, year: year, bgColor: '#ffffff' });
});

// GET /profile
router.get('/profile/:editor/:scope/:ext', mid.requiresLogin, (req, res, next) => 
{
    let {editor, scope, ext} = req.params;

    let fullScope = `${scope}.${ext}`;

    User.findById(req.session.userId)
        .exec((error, user) => {
            if (error) {
                return next(error);
            } else {

                // let editor = user.codeEditor.toLowerCase().replace(/ /g, '_');
                // let scope = 'source.js';

                //console.log(`load snippets for editor? ${editor}`);

                Snippet.findUserSnippetsForEditorAndScope(req.session.userId, editor, fullScope, (err, snippets) => {
                    if (err) return next(err);
                    // //console.log(`profile snippets? ${snippets}`);
                    return res.render('profile', { title: 'Profile | Snippets', active: 'profile', desc, canonical: `${path}profile`, year: year, bgColor: '#ffffff', name: user.name, email: user.email, editor: user.codeEditor, activeEditor: editor, scopes: user.scopes, activeScope: scope, fullScope, ext: ext, snippets });
                });
            }
        });
});

// GET /register
router.get('/register', mid.loggedOut, (req, res, next) => {
    return res.render('register', { title: 'Sign Up | Snippets', active: 'register', desc, canonical: `${path}register`, bgColor: '#ffffff' });
});

// GET /logout
// ERROR FIX: downgraded from Mongoose 5 to 4.50 to prevent error when destroying session
router.get("/logout", (req, res, next) => 
{
    if (req.session) 
    {
        // delete session object
        req.session.destroy(function (err) 
        {
            // req.session.userId = -1;
            
            if (err) 
            {
                return next(err);
            } else {
                res.redirect('/');
            }
        });
    }
});

// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => 
{
    console.log(`Logging In! `);
    return res.render('login', { title: 'Log In | Snippets', active: 'login', desc, canonical: `${path}login`, bgColor: '#ffffff' });
});

// GET /library
router.get('/library/:editor', (req, res, next) => 
{
    let editor = req.params.editor.replace(/-/g, '_');
    let editorName = editor.toUpperCase().replace(/_/g, ' ');
    let scope = 'source.js';
    
    Snippet.find({editor: editor, scope, duplicated: {$ne: true}})
        .exec((err, snippets) => {
            if (err) return next(err);
            // if no snippets were found insert seed data into database
            if (!snippets.length) 
            {   
                var allSnipLength = checkForSnippets();

                Snippet.find()
                    .exec((err, snippets) => {
                        if (err) return next(err);

                        if (!snippets.length) 
                        {

                            if (seedTheData()) 
                            {
                                Snippet.find({ editor: editor, scope, duplicated: { $ne: true } })
                                    .exec((err, snippets) => {
                                        if (err) return next(err);
                                        // if no snippets were found insert seed data into database
                                        res.render('library', { title: 'Library | Snippets', active: 'library', activeEditor: editorName, desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor: editorName, currentUser: res.locals.currentUser });
                                    });
                            } else {
                                return next(new Error("Error seeding data"));
                            }
                        } else {
                            res.render('library', { title: 'Library | Snippets', active: 'library', activeEditor: editorName, desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor: editorName, currentUser: res.locals.currentUser });
                        }
                    });
                //console.log(`allSnipLength? ${allSnipLength}`);
                
            } else {
                res.render('library', { title: 'Library | Snippets', active: 'library', activeEditor: editorName, desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor: editorName, currentUser: res.locals.currentUser });
            }
        });
});

// GET /details
router.get('/password', (req, res, next) => {
    return res.render('password', { title: 'Password Support | Snippets', desc, canonical: `${path}password`, year: year, bgColor: '#ffffff' });
});

// POST ROUTES //

// POST /login 
router.post('/login', (req, res, next) => 
{
    console.log(`POST login ${req.session.userId}`);
    if (req.body.email &&
        req.body.password) {
        console.log(`POST login have email and pass`);

        User.authenticate(req.body.email, req.body.password, function (error, user) {

            console.log(`POST login authenticate error? ${error} user? ${user}`);

            if (error || !user) {
                const err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            } else {

                req.session.userId = user._id;

                // console.log(`Redirecting to profile!!!`);
                return res.redirect(`profile/visual_studio_code/source/js`);
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
        req.body.confirmPassword) {
        // confirm that password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) {
            const err = new Error('Passwords do not match.')
            err.status = 400;
            return next(err);
        }

        // hash password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
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

                //console.log(`Created user! ${user}`);

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
router.post('/password', (req, res, next) => {
    if (req.body.email &&
        req.body.password &&
        req.body.confirmPassword) {
        // confirm that password and confirmPassword match
        if (req.body.password !== req.body.confirmPassword) {
            const err = new Error('Passwords do not match.')
            err.status = 400;
            return next(err);
        }

        // hash password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
            if (err) {
                return next(err);
            }

            // TODO TODO TODO:  Eventually an email will need to be sent to verify user
            db.collection('users').findAndModify(
                { email: req.body.email },
                [['_id', 'asc']],
                { $set: { password: hash } },
                { new: true, upsert: false },
                (err, result) => {
                    if (err) return next(err);
                    return res.redirect('/login');
                });
        });

    } else {
        const err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
});

const checkForSnippets = () => 
{
    // Check if any snippets exist in db
    Snippet.find()
        .exec((err, snippets) => {
            if (err) return 0;
            //console.log(`checkForSnippets snippets length? ${snippets.length}`);
            
            return snippets.length;
        });
}

const seedTheData = () => {

    let error = false;
    for (let index = 0; index < seedData.length; index++) 
    {
        let seed = seedData[index];

        //console.log(`seed? ${JSON.stringify(seed)}`);
        var snippetData = {
            editor: seed.editor,
            scope: seed.scope,
            description: seed.description,
            trigger: seed.trigger,
            code: seed.code,
            content: seed.content,
            duplicated: seed.duplicated
        };

        //console.log(`snippetData? ${JSON.stringify(snippetData)}`);
        var snippet = new Snippet(snippetData);
        snippet.save((err, newSnippet) => {
            if (err) error = true;
            //console.log(`index? ${index} seed snippet saved. ${newSnippet} `);
        });
        
        if ((index === seedData.length-1) && !error) 
        {
            return true;
        }
    }
};

module.exports = router;