// routes/snippets

const express = require('express');
const router = express.Router();
var User = require('../models/user');
var Snippet = require('../models/snippet');
var mid = require('../middleware');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var exportLogic = require('../src/logic/export_logic');

// PARAM OBJECT LOADING
router.param('uID', (req, res, next, id) => {
    User.findById(id, (err, doc) => {
        if(err) return next(err);
        if (!doc) {
            err = new Error('Not Found');
            err.status = 404;
            return next(err);
        }
        req.user = doc;
        //console.log(`req.user? ${req.user}`);
        return next();
    });
});

router.param('snipID', (req, res, next, id) => {
    // //console.log(`param snipID? ${id}`);
    Snippet.findById(id, (err, doc) => {
        if(err) return next(err);
        if (!doc) {
            err = new Error('Not Found');
            err.status = 404;
            return next(err);
        }
        req.snippet = doc;
        // //console.log(`snippets req.snippet? ${req.snippet}`);
        
        return next();
    });
});

// GET ROUTES

// GET /snippets
// Route for getting snippets
router.get('/', (req, res, next) => {

    Snippet.find()
        .exec((err, snippets) => {
            if (err) return next(err);
            res.render('library', { title: 'Library | Snippets', active: 'library', desc, canonical: `${path}library`, bgColor: '#ffffff', snippets, editor: editorName});
        });
});

// GET /snippets/editor/:editor
// Route for getting snippets filtered by editor
router.get('/editor/:editor', (req, res, next) => {

    let { editor } = req.params;

    Snippet.find({editor: editor, duplicated: {$ne: true}})
        .exec((err, snippets) => {
            if (err)
            {
                // //console.log(`findUserSnippetsForEditor err: ${err}`);
                return res.json({
                    success: null,
                    error: 'There was an issue removing this snippet!',
                    snippets: null
                });
            } 
            // //console.log(`findUserSnippetsForEditor success: ${snippets}`);
            
            return res.json({
                success: 'Successfully loaded snippets',
                error: null,
                snippets: snippets
            });
        });
});

// GET /snippets/editor/:editor/scope/:scope
// Route for getting snippets filtered by editor and scope
router.get('/editor/:editor/scope/:scope/:ext', (req, res, next) => {

    let { editor } = req.params;
    let fullScope = `${req.params.scope}.${req.params.ext}`;

    // //console.log(`fullScope? ${fullScope}`);

    Snippet.find({ editor: editor, scope: fullScope , duplicated: { $ne: true } })
        .exec((err, snippets) => {
            if (err) {
                // //console.log(`findUserSnippetsForEditor err: ${err}`);
                return res.status(404).end(`Could not find snippets for '${editor}'`)

            }
            //console.log(`findUserSnippetsForEditor success: ${req.session.userId}`);

            return res.json({ snippets, currentUser: req.session.userId});
        });
});

// GET /snippets/user/:uID/editor/:editor
// Route for getting snippets filtered by editor
router.get('/user/:uID/editor/:editor', (req, res, next) => {
    
    let { uID } = req.params;
    let { editor } = req.params;

    // //console.log(`get snippets for editor: ${editor}`);
    Snippet.findUserSnippetsForEditor(uID, editor, (err, snippets) => {
        if (err) return next(err);
        return res.json({ snippets, currentUser: req.session.userId });
    });
});


// GET /snippets/export/user/:uID/editor/:editor
// Route for exporting snippets for editor
router.get('/export/user/:uID/editor/:editor/:scope/:ext', (req, res, next) => 
{
    let { uID, editor } = req.params;

    let scope = `${req.params.scope}.${req.params.ext}`;
    
    // //console.log(`export snippets for editor ${editor} scope ${scope}.`);
    // //console.log(`get snippets for editor: ${editor}`);

    Snippet.findUserSnippetsForEditorAndScope(uID, editor, scope, (err, snippets) => {
        if (err) return next(err);

        //console.log(`export snippets for editor? ${editor}`);
        var data = exportLogic.exportSnippetsForEditor(snippets, editor, scope);
        
        //console.log(`data? ${JSON.stringify(data)}`);
        if (data.error) return res.json({error});
        
        let text = data.text;//JSON.stringify(data.text);
        let type = data.type;
        let name = data.name;
        return res.json({ text, type, name });
        // return res.json({ snippets, currentUser: req.session.userId });
    });
});

const end = (res) => 
{
    //console.log(`end: ${res}`);
    res.end();
}

// POST /snippets
// Route for creating snippets
router.post('/post', (req, res, next) => 
{
    //console.log(`save snippet!`);

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

    //console.log(`snippetData? ${snippetData}`);

    var snippet = new Snippet(snippetData);
    snippet.save((err, snippet) => {
        //console.log(`POST snippet err? ${err}`);
        if (err) return next(err);
        //console.log(`req.session.userId? ${req.session.userId}`);
        if (req.session.userId) 
        {   

            User.findById(req.session.userId, (err, user) => {
                if (err) return next(err);
                if (user) 
                {
                    //console.log(`post snippet user? ${user}`);

                    // Add snippet's id to user's snippets
                    user.addSnippet(snippet._id, function (err, result) {
                        if (err) return next(err);
                        //console.log(`Updated user's snippets!  ${result}`);

                        user.addScope(snippet.scope, function (err, result) {
                            if (err) return next(err);
                            //console.log(`Updated user's scopes!  ${result}`);

                            res.status(201);
                            res.json(snippet);
                        });

                    });
                } else {
                    res.status(201);
                    res.json(snippet);
                }
            });            
        } else {
            res.status(201);
            res.json(snippet);
        }
    });
});

// PUT /snippet/:snipID/user/:uID  -- 
// Route for inserting duplicate snippet into user's library
router.put('/:snipID/user/:uID', (req, res, next) => 
{
    //console.log(`PUT snippet in users library! ${req.snippet}`);
    
    
    if (req.session && req.session.userId)
    {
        //console.log(`PUT snippet in users library user logged in req.session.userId? body ${req.params.uID} session ${req.session.userId} user ${req.user._id}`);
        // //console.log(`PUT snippet in users library user scope? ${req.snippet.scope}`);

        if (req.snippet)
        {
            var snippetData = {
                userId: req.params.uID,
                editor: req.snippet.editor,
                scope: req.snippet.scope,
                description: req.snippet.description,
                trigger: req.snippet.trigger,
                code: req.snippet.code,
                content: req.snippet.content,
                duplicated: true
            };

            //console.log(`snippetData? ${JSON.stringify(snippetData)}`);

            // Insert the Snippets scope into the users scopes array -- SCOPE OF CODE LANGUAGES
            Snippet.create(snippetData, (error, snippet) => {

                if (error) {
        
                    return res.send({
                        success: null,
                        error: `There was an error adding snippet!`,
                        user: null
                    });
        
                } else {
                    
                    //console.log(`Created newSnippet! ${snippet}`);
                    
                    // Add snippet's id to user's snippets
                    req.user.addSnippet(snippet._id, function(err, result) {
                        if(err) return next(err);

                        //console.log(`Updated user's snippets!  ${result}`);

                        req.user.addScope(snippet.scope, function (err, result) {
                            if (err) return next(err);
                            //console.log(`PUT snippet Updated user's scopes!  ${result}`);
                            
                            res.json({
                                success: `Successfully added snippet!`,
                                error: null,
                                snippet: snippet
                            });

                        });

                        
                    });
                }
            });
        } else {
            
            //console.log(`Error! No req snippet! ${req.snippet}`);

            const error = new Error('There was an issue adding snippet!');
            error.status = 404;
            return next(error);
        }

    } else {

        //console.log(`Add snippet ERROR!`);

        // return error response
        res.send({
            success: null,
            error: `You must be logged in to add snippets!`,
            snippet: null
        });
    }
    
});

// DELETE ROUTES //

// DELETE /snippet/:snipID/user/:uID
// Route for deleting snippet from user's library
router.delete('/:snipID/user/:uID', mid.requiresLogin, (req, res, next) => {
    
    //console.log(`Delete snippet called!`);

    if (req.snippet.userId === req.session.userId) 
    {
        //console.log(`Snippet is owned by logged in user!`);
        if (req.snippet) 
        {
            //console.log(`Req snippet does exist!`);
            
            // Remove snippet from user's snippets
            req.user.removeSnippet(req.snippet._id, function(err, result) 
            {
                if (err) {
                    return res.json({
                        success: null,
                        error: 'There was an issue removing this snippet!'
                    });
                }
                //console.log(`Removed snippet from users list!`);
                
                // Remove snippet from snippets collection
                req.snippet.remove((err) => {
                    // if(err) return next(err);
                    if (err) 
                    {
                        return res.json({
                            success: null,
                            error: 'There was an issue removing this snippet!'
                        });
                    }
                    return res.json({
                        success: `Successfully removed snippet!`,
                        error: null
                    });
                });
            });

        } else {
        
            //console.log(`Req snippet does NOT exist!`);
            
            return res.json({
                success: null,
                error: 'There was an issue removing this snippet!'
            });
        }
    } else {

        //console.log(`Snippet is NOT owned by logged in user!`);
        
        // return error response
        return res.json({
            success: null,
            error: `You don't have permission to remove this snippet!`,
        });
    }
    
});

module.exports.snippetRouter = router;
