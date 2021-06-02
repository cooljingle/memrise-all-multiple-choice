// ==UserScript==
// @name           Memrise All Multiple Choice
// @namespace      https://github.com/cooljingle
// @description    All multiple choice when doing Memrise typing courses
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @match          https://app.memrise.com/course/*/garden/*
// @match          https://app.memrise.com/garden/review/*
// @version        0.0.10
// @updateURL      https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {
    const linkHtml = `<a id='all-multiple-choice-link'>All Multiple Choice</a>
            <div id='all-multiple-choice-options' style='display:none'>
               <em style='font-size:85%'>number of choices:</em>
               <select id='all-multiple-choice-options-num-choices'>
                   <option value="">Default</option>
                   ${[2,4,6,8,10].map(num => `<option value="${num}">${num}</option>`)}
               </select>
            </div>`,
          localStorageIdentifier = "memrise-all-multiple-choice",
          savedChoices = JSON.parse(localStorage.getItem(localStorageIdentifier)) || {};
    let num_choices = savedChoices.num_choices;

    $('#left-area').append(linkHtml);
    $('#all-multiple-choice-link').click(function () {
        $('#all-multiple-choice-options').toggle();
    });
    if(num_choices)
        $('#all-multiple-choice-options-num-choices').val(savedChoices.num_choices);
    $('#all-multiple-choice-options-num-choices').change(function () {
        num_choices = $(this).val();
        localStorage.setItem(localStorageIdentifier, JSON.stringify({...savedChoices, num_choices: num_choices}));
    });

    MEMRISE.garden._events.start.push(() => {
        enableAllMultipleChoice();
    });

    function enableAllMultipleChoice() {
        MEMRISE.garden.session.box_factory.make = (function() {
            var cached_function = MEMRISE.garden.session.box_factory.make;
            return function() {
                var result = cached_function.apply(this, arguments);
                var canMultipleChoice = MEMRISE.garden.session.box_factory.isTestPossible(result, "multiple_choice");
                var shouldSetMultipleChoice = canMultipleChoice && ["presentation", "copytyping", "multiple_choice", "reversed_multiple_choice"].indexOf(result.template) < 0;
                if(shouldSetMultipleChoice) {
                    result.template = "multiple_choice";
                }
                if(result.template.includes("multiple_choice")) {
                    if(num_choices) result.num_choices = Number(num_choices);
                }
                return result;
            };
        }());
    }
});
