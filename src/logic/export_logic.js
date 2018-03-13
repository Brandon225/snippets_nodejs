const getSnippetsForEditor = (editor) => {

    const snippets = require('./snippet.seed.json');

    let hasSnippets;

    hasSnippets = snippets.filter((snippet) => {
        return snippet.editor === editor;
    });

    if (hasSnippets.length) {
        return hasSnippets;
    }
    return false;
}

const exportSnippetsForEditor = (editor) => 
{   
    return false;
}




module.exports.getSnippets = getSnippets;
module.exports.exportSnippetsForEditor = exportSnippetsForEditor;