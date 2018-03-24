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

const getFileNameForType = (type) => 
{
    var fileTypesFile = require('./file.types.json');

    let fileTypes = fileTypesFile.filter((fileType) => {
        return fileType.type === type;
    });

    return fileTypes[0].name.toLowerCase();
}

const exportSnippetsForEditor = (snippets, editor, scope) => 
{   
    console.log(`exportSnippetsForEditor ${snippets.length} ${editor} ${scope}`);
    if (snippets === false) 
    {
        return false;
    }
    
    let text;
    let type;
    let name;
    let error;
    switch (editor) {
        case 'atom':
            text = createAtom(snippets);
            type = 'source.coffee';
            name = 'snippets.cson';
            break;
        case 'brackets':
            text = createBrackets(snippets);
            type = scope;
            name = `${getFileNameForType(scope)}.json`;
            break;
        case 'sublime': // Not yet supported
            error = 'Exporting Sublime snippets is not yet supported';
            break;
        case 'visual_studio_code':
            text = createVisualCode(snippets);
            type = scope;
            name = `${getFileNameForType(scope)}.json`;
            break;
        default:
            error = 'Invalid editor'
            break;
    }

    console.log(`exportSnippetsForEditor text? ${text}`);
    if (error) return {error};
    return {text, type, name};


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
            let atomSnip = `    "${snippet.description}":\n`;
            atomSnip += `        "prefix": "${snippet.trigger}"\n`;
            atomSnip += `        "body": """${snippet.code}"""\n`;
            scopeString += atomSnip;
        });
        parentString += scopeString;
    });

    console.log(`parentString? \n${parentString}`);
    
    return parentString;
}

const createBrackets = (snippets) => 
{
    console.log(`Export Brackets!`);
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

const createVisualCode = (snippets) =>
{   
    console.log(`Export VisualCode!`);
    
    let parentObject = new Object();

    snippets.forEach(snippet => {

        let jsonObj = new Object();

        jsonObj.prefix = snippet.trigger;
        jsonObj.body = snippet.code;
        let description = snippet.description;
        jsonObj.description = description;

        parentObject[description] = jsonObj;

    });

    return parentObject;
}


const createFile = (res, name, type, text) => 
{
    console.log(`createFile ${res} ${name} ${type} ${text}`);
    // download(name, type, text);
    // return new Promise((resolve, reject) => {
    //     res.setHeader('Content-disposition', `attachment; filename=${name}`);
    //     res.setHeader('Content-type', type);
    //     res.charset = 'UTF-8';
    //     // res.write(text);

    //     if (res.write(text)) 
    //     {
    //         resolve(res);
    //     } else {
    //         reject(`Error writing file! ${text}`)
    //     }
    // });
    // res.end();
}

module.exports.getSnippetsForEditor = getSnippetsForEditor;
module.exports.exportSnippetsForEditor = exportSnippetsForEditor;
module.exports.createFile = createFile;