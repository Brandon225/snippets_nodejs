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

    console.log('editor: ' + editor + ' scope: ' + scope + ' desc: ' + desc + ' trigger: ' + trigger + ' content: ' + content);

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
    
    console.log(`code-form submit url? ${url}`);
    // Send the data using post
    $.ajax({
            type: 'POST',
            url: url,
            data: form.serialize(),
            dataType: 'json'
        })
        .done(function (response) {
            console.log("We have posted the data!");
            // TODO: Update UI to notify user of success
        })
        .fail(function (error) {
            console.log("Failures at posting, we are", error.responseText);
            // TODO: Update UI to notify user of error
        });
});

$('.lib-add').on('click', function(e) {
    console.log(`lib-add clicked!`);
});

$('.addSnip-form').on('submit', function(event) 
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

$(document.body).on('submit', '.removeSnip-form', function(event) 
{
    event.preventDefault();

    console.log(`removeSnip-form submit! ${event.target}`);

    var submit = $(this).find('[type="submit"]');
    $(submit).attr('disabled', true);  

    var target = $(submit.data('target'));

    console.log(`remove target? ${target}`);


    // &#128542;
    const remove = confirm('You really wanna remove me? 😞');
    console.log(`remove? ${remove}`);
    if (remove) 
    {
        var form = $(this),
            url = form.attr('action');

        var ajax = $.ajax({ url, type: 'DELETE', data: form.serialize() })
            .then(res => {

                console.log("Results from remove snippet", res);

                if (res.error) {

                    // Show user the error
                    alert(res.error);

                    // Re-enable submit button
                    $(submit).attr('disabled', false);
                    
                } else {
                    target.remove();
                }
            })
            .fail(err => {

                console.log("Error in remove snippet", err);

                // Re-enable submit button
                $(submit).attr('disabled', false);

                // Show user the error
                alert(err);

                throw err;
            }
            );
    } else {

        // Re-enable submit button
        $(submit).attr('disabled', false);

    }
    
});

// $('#profileList a').click(function(e) 
// {
//     e.preventDefault()

//     console.log(`profileList a clicked!`);

    
//     // add active class only on mobile devices -- other devices are auto selected
//     if (!$(this).hasClass('active')) 
//     {
//         $('#profileList a').removeClass('active');
//         $(this).addClass('active');
//     }

//     var editor = $(this).data('editor');
//     var uID = $(this).data('uid');
    
//     const exportUrl = `/snippets/export/user/${uID}/editor/${editor}/source/js`;

//     // update forms url
//     $('#export-form').attr('action', exportUrl);

//     // update filter scope buttons editor value
//     var scopeBtns = document.getElementsByClassName('btn-scope-filter');
//     for (let index = 0; index < scopeBtns.length; index++) {
//         const btn = scopeBtns[index];
//         btn.dataset.editor = editor;
//     }

//     const url = `/snippets/user/${uID}/editor/${editor}`;

//     loadSnippetsAtUrlIntoTemplate(url, '#snippet-card-template', '#snippets-row', editor);

// });

$('#lib-nav a').click(function(e) {

    console.log(`Library nav clicked! ${e.target}`);

    var editor = $(this).data('editor');
    var scope = $(this).data('scope');
    var ext = $(this).data('ext');

    $('#lib-nav a.active').removeClass('active');

    $(this).addClass('active');
    
    const url = `/snippets/editor/${editor}/scope/${scope}/${ext}`;
    
    loadSnippetsAtUrlIntoTemplate(url, '#snippet-card-template', '#lib-snippets-row');
});

// const filterClick = (e) => 
// {
//     console.log(`btn-scope-filter clicked! ${$(e).data('scope')}`);
    
//     var scope = $(e).data('scope');
//     var ext = $(e).data('ext');

//     // toggle selected state
//     $('.btn-scope-filter.back-red').toggleClass('back-red').toggleClass('btn-secondary');
//     $(e).toggleClass('back-red');

//     // Remove the btn-secondary class to ensure double clicks don't disable selection
//     $(e).removeClass('btn-secondary');

//     const url = `/snippets/editor/${editor}/scope/${scope}/${ext}`;

//     loadSnippetsAtUrlIntoTemplate(url, '#snippet-card-template', '#lib-snippets-row');
// }

const download = (filename, type, text) => 
{
    // Create a temporary link element to allow file downloading
    var element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);

    // Hide the link
    element.style.display = 'none';

    // Add the link to the document body
    document.body.appendChild(element);

    element.click();

    // Remove the link
    document.body.removeChild(element);
}

$('#export-form').submit((e) => 
{
    // console.log(`Export form submit! ${$('this').attr('action')}`);

    e.preventDefault();

    var form = $('#export-form'),
        url = form.attr('action');

    console.log(`url? ${form.attr('action')}`);

    $.ajax(url)
        .then(res => {
            console.log("Results export form submit", res.error);
            if (!res.error)
            {
                download(res.name, res.type, res.text);
                
            } else {
                alert(res.error);
            }
            
        })
        .fail(err => {
            console.log("Error export form submit", err);
            throw err;
        });

});

function loadSnippetsAtUrlIntoTemplate(url, tempId, parentId, editor=null)
{
    const template = $(tempId).html();
    const compiledTemplate = Handlebars.compile(template);
    
    // Then is a javascript "Promises"
    getDataFromURL(url)
        .then(results => {
            // console.log(`currentUser? ${results.currentUser}`);

            // Toggle export button if parent is snippets-row (profile)
            if (parentId === '#snippets-row') 
            {
                let disabled = !results.snippets.length || editor==='sublime'
                $('#export-btn').attr('disabled', disabled);
            }
            
            
            const data = {
                snippets: results.snippets,
                currentUser: results.currentUser
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

