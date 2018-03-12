$('#convert-from').on('change', function()
{
    var selected = $(this).val();

    //console.log('selected? ', selected);

    var $to = $('#convert-to');
    var $toOpt = $('#convert-to option[value="' + selected + '"]');

    //console.log('toOpt? ', $toOpt);

    // first enable all options
    $to.children().attr('disabled', false);

    // then disable selected option
    $toOpt.attr('disabled', true);

    // hide all formats
    $('.format').hide();

    // reset select value of to input
    $to.val('');

    if (selected === 'visual_code')
    {
        $('.scope-select').show();
        $('select[name=scope_from]').attr('required', true);

    } else {

        $('.scope-select').hide();
        $('select[name=scope_from]').attr('required', false);

        $('#format-' + selected).show();
    }
});


$('#converter-form').submit(function(event)
{
    event.preventDefault();

    // hide error's if needed
    toggleInputError('#from-fg', false);

    var error = false;

    // Find the value of select
    var from = $('select[name=convert_from]').val();
    var to = $('select[name=convert_to]').val();

    // var $toTextArea = $('textarea[name=convert_to_text]');

    // Grab the text from the FROM textarea
    var snipText = $('textarea[name=convert_from_text]').val();

    ////console.log('from? ', from);
    ////console.log('to? ', to);
    ////console.log('snipText? ', snipText);

    // Handle if select is atom
    if (from === 'atom')
    {
        ////console.log('Convert from is atom!');

        var snipObj = parseAtom(snipText);
        console.log(`parseAtom snipObj? ${snipObj.error}`);
        
        if (snipObj)
        {
            if (!snipObj.error) 
            {
                if (to === 'sublime')
                {
                    populateToText('textarea[name=convert_to_text]', createSublime(snipObj.content, snipObj.trigger, snipObj.scope, snipObj.description));
                }

                if (to === 'brackets')
                {
                    populateToText('textarea[name=convert_to_text]', createBrackets(snipObj.content, snipObj.trigger, snipObj.scope, snipObj.description));
                }

                if (to === 'visual_code')
                {
                    console.log('snipObj content? ', snipObj.content);

                    populateToText('textarea[name=convert_to_text]', createVisualCode(snipObj.content, snipObj.trigger, snipObj.scope, snipObj.description));
                }
            } else {
                
                error = true;
                toggleInputError('#from-fg', true, 'atom');
            }
            
        } else {
            error = true;
            toggleInputError('#from-fg', true, 'atom');
        }

    }

    // Handle if select is sublime
    if (from === 'sublime')
    {
        // Parse the xml
        var $xml = parseSublime(snipText);
        if ($xml)
        {
            var $content = $xml.find('content'),
            $trigger = $xml.find('tabTrigger'),
            $scope = $xml.find('scope'),
            $description = $xml.find('description');

            ////console.log('xml? ', $xml);
            // Convert the parsed data into Atom's format
            if (to === 'atom')
            {
                populateToText('textarea[name=convert_to_text]', createAtom($content.text(), $trigger.text(), $scope.text(), $description.text()));
            }

            // Convert the parsed data into Bracket's format
            if (to === 'brackets')
            {
                ////console.log('To brackets!');

                populateToText('textarea[name=convert_to_text]', createBrackets($content.text(), $trigger.text(), $scope.text(), $description.text()));
            }

            if (to === 'visual_code')
            {
                populateToText('textarea[name=convert_to_text]', createVisualCode($content.text(), $trigger.text(), $scope.text(), $description.text()));
            }
        } else {
            error = true;
            toggleInputError('#from-fg', true, 'sublime');
        }


    }

    // Handle if select is visual studio code
    if (from === 'visual_code')
    {
        var $json = parseVisualCode(snipText);
        if ($json)
        {
            var $inJson;
            for (var key in $json)
            {
               ////console.log(' name=' + key + ' value=' + $json[key]);
               $inJson = $json[key];
            }

            // var content = $body.split('\n');
            var contentVC = '';
            $.each($inJson['body'], function (index, value)
            {
                contentVC += value + '\n';
                ////console.log('content: ', value);

            });

            ////console.log('content: ', content);

            // ////console.log('visual code content? ', content);
            var triggerVC = $inJson['prefix'];
            var scopeVC = $('select[name=scope_from]').val();
            var descriptionVC = $inJson['description'];

            ////console.log('createSublime CONTENT: ' + content + ' TRIGGER: ' + trigger + ' SCOPE: ' + scope + ' DESC: ' + description);

            // create the snippet and populate the textarea
            if (to === 'sublime')
            {
                populateToText('textarea[name=convert_to_text]', createSublime(contentVC, triggerVC, scopeVC, descriptionVC));
            }

            if (to === 'atom')
            {
                populateToText('textarea[name=convert_to_text]', createAtom(contentVC, triggerVC, scopeVC, descriptionVC));
            }

            if (to === 'brackets')
            {
                populateToText('textarea[name=convert_to_text]', createBrackets(contentVC, triggerVC, scopeVC, descriptionVC));
            }

        } else {
            error = true;
            toggleInputError('#from-fg', true, 'viscode');
        }
    }

    if (from === 'brackets')
    {
        var $jsonBracObj = parseBrackets(snipText);

        //console.log('jsonBracObj? ', $jsonBracObj);

        if ($jsonBracObj)
        {
            var $jsonBrac = $jsonBracObj[0];

            var content = $jsonBrac['template'];
            var trigger = $jsonBrac['trigger'];
            var scope = $jsonBrac['usage'];
            var description = $jsonBrac['description'];

            ////console.log('brackets jsonBrac? ', $jsonBrac);

            if (to === 'sublime')
            {
                populateToText('textarea[name=convert_to_text]', createSublime(content, trigger, scope, description));
            }

            if (to === 'atom')
            {
                populateToText('textarea[name=convert_to_text]', createAtom(content, trigger, scope, description));
            }

            if (to === 'visual_code')
            {
                populateToText('textarea[name=convert_to_text]', createVisualCode(content, trigger, scope, description));
            }

        } else {
            error = true;
            toggleInputError('#from-fg', true, 'brackets');
        }

    }

    // Uncomment if using Share overlay!!!!
    // if (!error)
    // {
    //     $('.share-overlay').toggle();
    //     $('body').addClass('modal-open');
    // }
});

function populateToText(element, text)
{
    $(element).val(text);
}

function createAtom(content, trigger, scope, description)
{
    ////console.log('createAtom content: ' + content + ' trigger: ' + trigger + ' scope: ' + scope + ' desc: ' + description);

    var atomSnip = "";


    // append a period to the beginning of scope
    atomSnip += '".' + scope + '":\n   ';
    atomSnip += '"' + description + '":\n       ';
    atomSnip += '"prefix": "' + trigger + '"\n       ';
    atomSnip += '"body": """' + content + '""" \n       ';

    return atomSnip;
}

function createBrackets(content, trigger, scope, description)
{
    var jsonObj = [];
    var snipArray = {};
    snipArray["name"] = description;
    snipArray["trigger"] = trigger;
    snipArray["usage"] = scope;
    snipArray["description"] = description;
    snipArray["template"] = content;

    jsonObj.push(snipArray);

    return JSON.stringify(jsonObj);
}

function createVisualCode(content, trigger, scope, description)
{

    var jsonObj = new Object();
    jsonObj.prefix = trigger;

    var body = content.split('\n');
    var bodyContent = '';
    $.each(body, function (index, value)
    {
        //console.log('body index: ' + index + ' value: ' + value);
        bodyContent += $.trim(value) + '\n';
    });

    //console.log('bodyContent? ', bodyContent);
    jsonObj.body = bodyContent.split('\n');

    //console.log('jsonObj body? ', jsonObj.body);

    jsonObj.description = description;

    var title = description;

    var jsonArray = {};
    jsonArray[title] = jsonObj;
    // {title: jsonObj}
    return JSON.stringify(jsonArray);
}

// function createVisualStudio(content, trigger, scope, description)
// {
//     var vsSnip = '<?xml version="1.0" encoding="utf-8"?><CodeSnippets xmlns="http://schemas.microsoft.com/VisualStudio/2005/CodeSnippet"><CodeSnippet Format="1.0.0"><Header><Title>' + $description + '</Title>';
//
//     vsSnip += '</Header><Snippet><Code Language="'+ $scope +'">';
//     vsSnip += '<![CDATA[' + content + ']]></Code></Snippet></CodeSnippet></CodeSnippets>';
//
//     return vsSnip;
// }

function createSublime(content, trigger, scope, description)
{
    ////console.log('createSublime content: ' + content + ' trigger: ' + trigger + ' scope: ' + scope + ' desc: ' + description);
    var subText = '<snippet><content><![CDATA['+ content + ']]></content>';
    subText += '<tabTrigger>' + trigger  + '</tabTrigger>';
    subText += '<scope>' + scope  + '</scope>';
    subText += '<description>' + description  + '</description></snippet>';

    return subText;
}

function parseAtom(snipText)
{
    //console.log('parseAtom snipText first char? ', snipText.charAt(0));

    // grab the first char and test to see if snippet is in the correct format
    var firstChar = snipText.charAt(0);

    if (firstChar === "\"" || firstChar === "\'")
    {
        //console.log('firstChar is quotation! ', firstChar);
        var snipObj = new Object();
        // snipText = snipText.replace(/"/g, "").replace(/'/g, "");
        snipText = $.trim(snipText);
        // console.log('SnipText? ', snipText);
        var snippet = snipText.split('\n');
        console.log('snippet? ', snippet);
        for (var i = 0; i < snippet.length; i++)
        {
            var row = $.trim(snippet[i]);

            // console.log('row? ', row);
            if (row.startsWith('"prefix"'))
            {
                // console.log('prefix row');
                // var value = $.trim(row.replace('"prefix:"', ''));
                var value = row.split(':');

                // console.log('prefix: ', value);

                // var updatedRow = $.trim(row.replace(value[1], ''));

                snipObj.trigger = removeQuotes($.trim(value[1]));

                //console.log('snipObj trigger? ' + snipObj.trigger + ' i? ' + i);

            } else if (i === snippet.length-1)
            {
                if (snippet.length > 4)
                {
                    var content = '';
                    for (var idx = 3; idx < snippet.length; idx++)
                    {
                        var contentRow = snippet[idx];

                        // console.log('contentRow? ' + contentRow + ' idx? ' + idx);
                        if (idx === 3)
                        {
                            contentRow = contentRow.split(`":`);

                            console.log(`idx 3 contentRow: ${contentRow}`);
                            
                            try {

                                content += $.trim(removeTripleQuotes(contentRow[1]));

                            } catch (error) {

                                // Atom snippet doesn't have the scope (first line)
                                const err = new Error('Missing snippet scope!');
                                err.status = 401;
                                snipObj.error = err;
                                return snipObj;
                            }

                        } else {

                            content += '\n' + removeTripleQuotes(contentRow);
                        }
                    }

                    snipObj.content = content;

                    //console.log('snipObj content? ' + snipObj.content + ' i? ' + i);
                } else {

                    var value = $.trim(row).split(`":`);

                    snipObj.content = $.trim(removeTripleQuotes(value[1]));

                    //console.log('snipObj content? ' + snipObj.content + ' i? ' + i);

                }

            } else if (i === 1) {

                //console.log('index is 1!');
                var value = $.trim(row.replace(':', ''));

                snipObj.description = removeQuotes(value);
                //console.log('snipObj description? ' + snipObj.description + ' i? ' + i);


            } else if (i === 0)
            {

                //console.log('index is 2!');

                var value = $.trim(row.replace(':', ''));

                snipObj.scope = removeQuotes(value.replace('.',''));
                //console.log('snipObj scope? ' + snipObj.scope + ' i? ' + i);

            }
        }
        return snipObj;

    } else {
        return;
    }

}

function parseBrackets(snipText)
{
    try {
        //console.log('IS valid json: ', json);
        return JSON.parse(snipText);

    } catch (err) {

        //console.log('NOT valid json err: ', err);
        return;
    }
}

function parseVisualCode(snipText)
{
    try {
        //console.log('IS valid json: ', json);
        return JSON.parse(snipText);

    } catch (err) {

        //console.log('NOT valid json err: ', err);
        return;
    }
}

function parseSublime(snipText)
{

    var xmlDoc = '';

    try {
        //console.log('IS valid xmlDoc');
        xmlDoc = $.parseXML(snipText); //is valid XML
        return $( xmlDoc );

    } catch (err) {
        //console.log('NOT valid xmlDoc err: ', err);
        // was not XML
        return;
    }
}

function removeQuotes(text)
{
    return text.replace(/"/g, "").replace(/'/g, "");
}

function removeTripleQuotes(text)
{
    console.log('removeTripleQuotes: ', text);
    return text.replace('\"\"\"', '').replace('\"\"\"', '');
}

function toggleInputError(input, show, type)
{
    //console.log('toggleInputError: '+ input + ' show? ' + show + ' type? ' + type);

    if (show)
    {
        if (type)
        {
            $('#error-link').prop('href', 'details.html#' + type);
        }
        $(input).addClass('has-error');
        $(input).find('.error-block').css('display', 'block');

    } else {

        $(input).removeClass('has-error');
        $(input).find('.error-block').css('display', 'none');
    }
}


/*Smooth link animation*/
$('a[href*="#"]:not([href="#"])').click(function()
{
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || location.hostname == this.hostname)
    {
        smoothScroll(this.hash);
    }
});

function smoothScroll(id)
{
    var target = $(id);
    target = target.length ? target : $('[name=' + id.slice(1) + ']');
    if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top - 80
        }, 1000);
        return false;
    }
}
