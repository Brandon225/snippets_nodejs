var expect = require('chai').expect;
var chai = require('chai');
chai.use(require('chai-json'));

// Test suite
describe('getSnippetsForEditor', () =>
{
    let getSnippetsForEditor = require('../src/logic/export_logic.js').getSnippetsForEditor;

    // Verify snippets is an array
    it('should load an array of snippets', () => 
    {
        expect(getSnippetsForEditor('atom')).to.be.an('array');
    });

    // Verify snippets is an array of objects
    it('should contain json objects', () => 
    {
        expect(getSnippetsForEditor('visual_studio_code')[0]).to.be.an('object');
    });

    // Return false when no snippets found for editor
    it('it should correctly report no snippets found for editor', () => 
    {
        expect(getSnippetsForEditor('sublime')).to.be.false;
    });

    // Return true when WERE snippets found for editor
    it('it should correctly report snippets WERE found for editor', () => 
    {
        expect(getSnippetsForEditor('atom')).to.be.an('array');
    });
});

// Test suite
describe('exportSnippets', () =>
{
    let exportSnippetsForEditor = require('../src/logic/export_logic.js').exportSnippetsForEditor;
    // // Return false when no snippets found for editor
    it('should export visual studio code snipets in json format', () => 
    {
        expect(exportSnippetsForEditor('visual_studio_code')).to.be.jsonObj();
    });
});