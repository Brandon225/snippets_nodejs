var expect = require('chai').expect;

// Test suite
describe('getSnippets', () =>
{
    let getSnippets = require('../src/logic/export_logic.js').getSnippets;

    // Verify snippets is an array
    it('should load an array of snippets', () => 
    {
        expect(getSnippets('atom')).to.be.an('array');
    });

    // Verify snippets is an array of objects
    it('should contain json objects', () => 
    {
        expect(getSnippets('visual_studio_code')[0]).to.be.an('object');
    });

    // Return false when no snippets found for editor
    it('it should correctly report no snippets found for editor', () => 
    {
        expect(getSnippets('sublime')).to.be.false;
    });

    // Return true when WERE snippets found for editor
    it('it should correctly report snippets WERE found for editor', () => 
    {
        expect(getSnippets('atom')).to.be.an('array');
    });
});

// Test suite
describe('exportSnippets', () =>
{
    let exportSnippetsForEditor = require('../src/logic/export_logic.js').exportSnippetsForEditor;
    
    // Return false when no snippets found for editor
    it('it should correctly report no snippets found for editor', () => 
    {
        expect(exportSnippetsForEditor('sublime')).to.be.false;
    });

    // Return true when WERE snippets found for editor
    it('it should correctly report snippets WERE found for editor', () => {
        expect(exportSnippetsForEditor('atom')).to.be.an('array');
    });


});