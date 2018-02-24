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
        case 'visual_studio_code':
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
    
    var ajax = $.ajax({url, type: 'PUT', data: form.serialize()})
        .then(res => {
            console.log("Results from put snippet in user's library: ", res);
            // return res;
        })
        .fail(err => {

            console.log("Error in put snippet in user's library", err);
            
            // Re-enable submit button
            $(submit).attr('disabled', false);

            // TODO TODO TODO:  Show login modal
            alert(err);
            
            throw err;
        }
    );
    
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
            // return res;
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
    
});

$('#profileList a').on('click', function(e) 
{
    e.preventDefault()

    console.log(`profileList a clicked!`);

    var editor = $(this).data('editor');
    var uID = $(this).data('uid');

    const url = `/snippets/user/${uID}/editor/${editor}`;
    
    loadSnippetsAtUrlIntoTemplate(url, '#snippet-template', '#snippets-row');
});


$('#lib-nav a').on('click', function(e) {

    console.log(`Library nav clicked! ${e}`);

    var editor = $(this).data('editor');
    var scope = $(this).data('scope');
    var ext = $(this).data('ext');

    $('#lib-nav a.active').removeClass('active');

    $(this).addClass('active');
    
    const url = `/snippets/editor/${editor}/scope/${scope}/${ext}`;
    
    loadSnippetsAtUrlIntoTemplate(url, '#snippet-template', '#lib-snippets-row');
});

function loadSnippetsAtUrlIntoTemplate(url, tempId, parentId)
{
    // const url = `/snippets/user/${uID}/editor/${editor}`;

    const template = $(tempId).html();
    const compiledTemplate = Handlebars.compile(template);

    // Then is a javascript "Promises"
    getDataFromURL(url)
        .then(snippets => {
            console.log(`snippets? ${snippets}`);
            const data = {
                snippets: snippets
            };
            const html = compiledTemplate(data);

            $(parentId).html(html);
        });
}



function getDataFromURL(url) {
    console.log(`getDataFromURL? ${url}`);
    // then and fail are like "Promises" fail is "Catch-ish"
    return $.ajax(url)
        .then(res => {
            console.log("Results from getDataFromURL()", res);
            return res;
        })
        .fail(err => {
            console.log("Error in getDataFromURL()", err);
            throw err;
        });
}

// function refreshFileList() {
//     const template = $('#list-template').html();
//     const compiledTemplate = Handlebars.compile(template);

//     // Then is a javascript "Promises"
//     getFiles()
//         .then(files => {
//             const data = { files: files };
//             const html = compiledTemplate(data);
//             console.log(``);

//             $('#list-container').html(html);
//         });
// }


// $('a[data-toggle="list"]').on('show.bs.tab', function (e) 
// {
//     var target = e.target;
//     console.log(`target? ${target}`);
//     console.log(`this? ${this}`);

//     // #snippets-row
    
    // var ajax = $.ajax('/')
    //     .then(res => {
    //         console.log("Results:", res);
    //     })
    //     .fail(err => {
    //         console.log("Error:", err);
    //     });
// });