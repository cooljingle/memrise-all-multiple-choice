// ==UserScript==
// @name           Memrise All Multiple Choice
// @namespace      https://github.com/cooljingle
// @description    All multiple choice when doing Memrise typing courses
// @match          https://www.memrise.com/course/*/garden/*
// @match          https://www.memrise.com/garden/review/*
// @version        0.0.6
// @updateURL      https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {
    MEMRISE.garden.session_start = (function() {
        var cached_function = MEMRISE.garden.session_start;
        return function() {
            enableAllMultipleChoice();
            return cached_function.apply(this, arguments);
        };
    }());

    function enableAllMultipleChoice() {
        MEMRISE.garden.session.box_factory.make = (function() {
            var cached_function = MEMRISE.garden.session.box_factory.make;
            return function() {
                var result = cached_function.apply(this, arguments);
                var shouldSetMultipleChoice = ["presentation", "copytyping", "multiple_choice", "reversed_multiple_choice"].indexOf(result.template) < 0 &&
                    MEMRISE.garden.session.box_factory.isTestPossible(result, "multiple_choice");
                if(shouldSetMultipleChoice)
                    result.template = "multiple_choice";
                return result;
            };
        }());
    }
});
