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
    switch (editor) {
        case 'atom':
            return false;
            break;
        case 'brackets':
            return false;
            break;
        case 'sublime':
            return false;
            break;
        case 'visual_studio_code':
            return createVisualCode(getSnippetsForEditor(editor));
            break;
        default:
            return false;
            break;
    }
}

const createVisualCode = (snippets) =>
{   
    var parentObject = new Object();

    snippets.forEach(snippet => {

        var jsonObj = new Object();

        jsonObj.prefix = snippets.trigger;
        jsonObj.body = snippets.code;
        var description = snippets.description;
        jsonObj.description = description;

        parentObject[description] = jsonObj;
    });

    return parentObject;
}


module.exports.getSnippetsForEditor = getSnippetsForEditor;
module.exports.exportSnippetsForEditor = exportSnippetsForEditor;