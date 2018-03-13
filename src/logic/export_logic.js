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
            return createAtom(getSnippetsForEditor(editor);
            break;
        case 'brackets':
            return createBrackets(getSnippetsForEditor(editor));
            break;
        case 'sublime': // Not yet supported
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

const createAtom = (snippets) => {

    var atomSnip = "";

    snippets.forEach(snippet => {
    });

    // append a period to the beginning of scope
    atomSnip += '".' + scope + '":\n   ';
    atomSnip += '"' + description + '":\n       ';
    atomSnip += '"prefix": "' + trigger + '"\n       ';
    atomSnip += '"body": """' + content + '""" \n       ';

    return atomSnip;
}

const createBrackets = (snippets) => {

    var parentArray = [];

    snippets.forEach(snippet => 
    {
        var jsonObj = new Object();

        jsonObj["name"] = snippet.description;
        jsonObj["trigger"] = snippet.trigger;
        jsonObj["usage"] = snippet.scope;
        jsonObj["description"] = snippet.description;
        jsonObj["template"] = snippet.code;

        parentArray.push(jsonObj);
    });

    return parentArray;
}

const createSublime = (snippets) => 
{   
    // NOT YET SUPPORTED
    // Sublime requires one snippet per file
    // snippets.forEach(snippet => 
    // {

    // });

    // var subText = '<snippet><content><![CDATA[' + content + ']]></content>';
    // subText += '<tabTrigger>' + trigger + '</tabTrigger>';
    // subText += '<scope>' + scope + '</scope>';
    // subText += '<description>' + description + '</description></snippet>';

    // return subText;
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