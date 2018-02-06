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

var Snippet = mongoose.model('Snippet', SnippetSchema);
module.exports = Snippet;
