var mongoose = require('mongoose');

var SnippetSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    editor: {
        type: String,
        required: true,
    },
    scope: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    trigger: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});


// hash password before saving to db
SnippetSchema.pre('save', function(next) 
{
    var snippet = this;
    if (snippet.editor === 'visual_code') {
        snippet.editor = 'Visual Studio Code';
    } else {
        snippet.editor = snippet.editor.toUpperCase();
    }
});

var Snippet = mongoose.model('Snippet', SnippetSchema);
module.exports = Snippet;
