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
    it('should export visual studio code snippets in json format', () => 
    {
        expect(exportSnippetsForEditor('visual_studio_code')).to.be.jsonObj();
    });

    it('should return false if no snippets for editor', () => 
    {
        expect(exportSnippetsForEditor('sublime')).to.be.false;
    });

    it('should export brackets snippets in json array of objects', () => 
    {
        expect(exportSnippetsForEditor('brackets')).to.be.an('array');
        expect(exportSnippetsForEditor('brackets')[0]).to.be.jsonObj();
    });

    it('should export atom snippets in a string', () => {
        expect(exportSnippetsForEditor('atom')).to.be.an('string');
    });
});