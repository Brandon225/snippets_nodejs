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
    let snippets = getSnippetsForEditor(editor);

    if (snippets === false) 
    {
        return false;
    }
    switch (editor) {
        case 'atom':
            return createAtom(getSnippetsForEditor(editor));
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

const getScopes = (snippets) => 
{
    let scopes = [];
    snippets.forEach(snippet => 
    {
        scopes.push(snippet.scope);
    })
    return scopes;
}

const createAtom = (snippets) => {

    let scopes = getScopes(snippets);

    console.log(`scopes? ${JSON.stringify(scopes)}`);

    let parentString = "";
    scopes.forEach(scope => 
    {
        // console.log(`scope? ${scope}`);

        let snipsFiltered = snippets.filter((snippet) => {
            return (snippet.scope === scope)
        });

        console.log(`snipsFiltered.length? ${JSON.stringify(snipsFiltered)}`);

        let scopeString = '".' + scope + '":\n';
        
        // append a period to the beginning of scope
        snipsFiltered.forEach(snippet => {
            let atomSnip = "";
            atomSnip += `    "${snippet.description}":\n`;
            atomSnip += `        "prefix": "${snippet.trigger}"\n`;
            atomSnip += `        "body": """${snippet.code}"""\n`;
            scopeString += atomSnip;
        });
        parentString += scopeString;
    });

    console.log(`parentString? \n${parentString}`);
    
    return parentString;
}

const createBrackets = (snippets) => {

    let parentArray = [];

    snippets.forEach(snippet => 
    {
        let jsonObj = new Object();

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
    let parentObject = new Object();

    snippets.forEach(snippet => {

        let jsonObj = new Object();

        jsonObj.prefix = snippets.trigger;
        jsonObj.body = snippets.code;
        let description = snippets.description;
        jsonObj.description = description;

        parentObject[description] = jsonObj;
    });

    return parentObject;
}

const createFile = (res, type, text) => 
{
    res.setHeader('Content-disposition', 'attachment; filename=theDocument.txt');
    res.setHeader('Content-type', type);
    res.charset = 'UTF-8';
    res.write(text);
    res.end();
}

module.exports.getSnippetsForEditor = getSnippetsForEditor;
module.exports.exportSnippetsForEditor = exportSnippetsForEditor;