// ==UserScript==
// @name           Memrise All Multiple Choice
// @namespace      https://github.com/cooljingle
// @description    All multiple choice when doing Memrise typing courses
// @match          http://www.memrise.com/course/*/garden/*
// @match          http://www.memrise.com/garden/review/*
// @version        0.0.2
// @updateURL      https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @downloadURL    https://github.com/cooljingle/memrise-all-multiple-choice/raw/master/Memrise_All_Multiple_Choice.user.js
// @grant          none
// ==/UserScript==

$(document).ready(function() {
    MEMRISE.garden.boxes.load = (function() {
        var cached_function = MEMRISE.garden.boxes.load;
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
                if(result.template === "typing") {
                    result.template = "multiple_choice";
                }
                return result;
            };
        }());
    }
});
