$('input[name="options"]').on("change",function(){switch($(this).attr("data-type")){case"creation":$("#creation-container").toggle(),$("#migration-container").toggle();break;case"migration":$("#creation-container").toggle(),$("#migration-container").toggle();break}}),$("#code-form").submit(function(e){e.preventDefault(),console.log("code-form submitted!");var t=$("#code-editor").val(),o=$("#code-content").val(),a=$("#code-trigger").val(),c=$("#code-scope").val(),r=$("#code-description").val();switch(t){case"atom":populateToText("#snippet-output",createAtom(o,a,c,r));break;case"brackets":populateToText("#snippet-output",createBrackets(o,a,c,r));break;case"sublime":populateToText("#snippet-output",createSublime(o,a,c,r));break;case"visual_code":populateToText("#snippet-output",createVisualCode(o,a,c,r));break;default:}var s=$(this),n=s.attr("action"),i=$.post(n,s.serialize(),function(e){e.success?console.log("Successfully loaded data!",e.success):console.log("Error loading data!",e.error)},"json")}),$(".addSnip-form").submit(function(e){e.preventDefault();var t=$(this),o=t.attr("action"),a=$.post(o,t.serialize(),function(e){e.success?console.log("Successfully loaded data!",e.success):(console.log("Error loading data!",e.error),alert(e.error))},"json")});