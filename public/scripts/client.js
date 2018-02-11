$('input[name="options"]').on('change', function()
{
    //console.log('HA radio changed! ', $(this).attr('data-type'));

    switch ($(this).attr('data-type'))
    {
        case 'creation':
            //console.log('creation clicked! ', $(this).attr('name'));
            $('#creation-container').toggle();
            $('#migration-container').toggle();
            break;

        case 'migration':
            //console.log('migration clicked! ', $(this).attr('name'));
            $('#creation-container').toggle();
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
    
    // Send the data using post
    var posting = $.post(url, form.serialize(),
    function(data)
    {
        // if data returned no errors
        if (data.success)
        {
            console.log('Successfully loaded data!', data.success);
        } else {
            console.log('Error loading data!', data.error);
        }

    } ,'json' );
});

$('.addSnip-form').submit(function(event) 
{
    event.preventDefault();

    var submit = $(this).find('[type="submit"]');
    $(submit).attr('disabled', true)
    
    var form = $(this),
    url = form.attr('action');
    
    // Send the data using post
    var posting = $.post(url, form.serialize(),
    function(data)
    {
        // if data returned no errors
        if (data.success)
        {
            console.log(`Successfully loaded data! ${data.success}`);
        } else {
            console.log(`Error loading data! ${data.error}`);

            // Re-enable submit button
            $(submit).attr('disabled', false);

            // TODO TODO TODO:  Show login modal
            alert(data.error);
        }

    } ,'json' );
    
});

$('.removeSnip-form').submit(function(event) 
{
    event.preventDefault();

    console.log(`removeSnip-form submit!`);

    var submit = $(this).find('[type="submit"]');
    $(submit).attr('disabled', true)
    
    var form = $(this),
    url = form.attr('action');
    
    var ajax = $.ajax({url, type: 'DELETE', data: form.serialize()})
        .then(res => {
            console.log("Results from remove snippet", res);
            return res;
        })
        .fail(err => {

            console.log("Error in remove snippet", err);
            
            // Re-enable submit button
            $(submit).attr('disabled', false);

            // TODO TODO TODO:  Show login modal
            alert(err);
            
            throw err;
        }
    );

    console.log(`ajax? ${ajax}`);
    
    // Send the data using post
    // $.post(url, form.serialize(),
    // function(data)
    // {
    //     // if data returned no errors
    //     if (data.success)
    //     {
    //         console.log(`Successfully loaded data! ${data.success}`);
    //     } else {
    //         console.log(`Error loading data! ${data.error}`);

            // // Re-enable submit button
            // $(submit).attr('disabled', false);

            // // TODO TODO TODO:  Show login modal
            // alert(data.error);
    //     }

    // } ,'json' );
    
});
