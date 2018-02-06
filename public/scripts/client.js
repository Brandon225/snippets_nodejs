$('input[name="options"]').on('change', function()
{
    //console.log('HA radio changed! ', $(this).attr('data-type'));

    switch ($(this).attr('data-type'))
    {
        case 'conversion':
            //console.log('conversion clicked! ', $(this).attr('name'));
            $('#conversion-container').toggle();
            $('#migration-container').toggle();
            break;

        case 'migration':
            //console.log('migration clicked! ', $(this).attr('name'));
            $('#conversion-container').toggle();
            $('#migration-container').toggle();
            break;
    }
});

$('#code-form').submit(function(event)
{
    event.preventDefault();

    console.log('code-form submitted!');

    var editor = $('#code-editor').val();
    var content = $('#code-content').val();
    var trigger = $('#code-trigger').val();
    var scope = $('#code-scope').val();
    var desc = $('#code-description').val();

    //console.log('editor: ' + editor + ' scope: ' + scope + ' desc: ' + desc + ' trigger: ' + trigger + ' content: ' + content);

    switch (editor)
    {
        case 'atom':
            populateToText('#snippet-output', createAtom(content, trigger, scope, desc));
            break;
        case 'brackets':
            populateToText('#snippet-output', createBrackets(content, trigger, scope, desc));
            break;
        case 'sublime':
            populateToText('#snippet-output', createSublime(content, trigger, scope, desc));
            break;
        case 'visual_code':
            populateToText('#snippet-output', createVisualCode(content, trigger, scope, desc));
            break;
        default:

    }

    
    var form = $(this),
    url = form.attr('action');
    
    const formData = {
        code_editor: $('[name=code_editor]').val(),
        code_scope: $('[name=code_scope]').val(),
        code_description: $('[name=code_description]').val(),
        code_trigger: $('[name=code_trigger]').val(),     
        snippet_output: $('[name=snippet_output]').val(),
    };

    console.log(`formData? ${formData}`);

    // Send the data using post
    var posting = $.post( url, JSON.stringify(formData),
        function( data )
        {
            // if data returned no errors
            if (data.success)
            {
                console.log('Successfully posted data!', data.success);
            } else {
                console.log('Error posted data!', data.error);
            }

        } ,'json' );
    
});

function toJSONString( form ) {
    var obj = {};
    var elements = form.find('.form-control');
    console.log('elements? ', elements);
    for( var i = 0; i < elements.length; ++i ) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;

        if( name ) {
            obj[ name ] = value;
        }
    }

    return JSON.stringify( obj );
}