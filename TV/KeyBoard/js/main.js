/**
 * @file main - Main file shows Tizen IME usage
 * @date 2019/05/13
 *
 * @copyright Copyright (c) 2019 Samsung Electronics, Visual Display Division. All Rights Reserved.
 */

App = window.App || {};
App.Main = (function Main() {
    var logger;
    var imeElem;
    var outputElem;

    // Functions for handling IME - BEGIN
    function showIME() {
        logger.log('[showIME] IME is activated');
        imeElem.focus();
        logger.log('[showIME] Current active element:', document.activeElement);
    }

    function hideIME() {
        logger.log('[hideIME] Active element BEFORE blur', document.activeElement);

        // IMPORTANT! Blur the text input field and return focus to document.body
        // (or whatever element you use for gathering keypress events for navigation).
        // Otherwise unexpected behaviour may be expected,
        // eg. navigation in app may behave incorrectly.
        imeElem.blur();
        document.body.focus(); // IMPORTANT! Focus the document.body explicitely!

        logger.log('[hideIME] Active element AFTER blur', document.activeElement);
    }

    function clearIME() {
        logger.log('[clearIME] Displayed messages are cleared');
        outputElem.innerHTML = '';
    }

    function cancelIME() {
        logger.log('[cancelIME] IME is no longer visible');
        imeElem.value = ''; // We are clearing input field here, without it, it would still contain written text
        hideIME(); // IMPORTANT!
    }

    function onIMEChange(event) {
        logger.log('[onIMEChange] Data accessed with IME with usage of event.target.value >>> '
             + event.target.value
             + ' <<< or with imeElem.value: >>> ' + imeElem.value + ' <<<');
        hideIME(); // IMPORTANT!
        outputElem.innerHTML += (outputElem.innerHTML ? '\n' : '') + event.target.value;
        imeElem.value = ''; // We are clearing input field here, without it, it would still contain written text
    }
    // Functions for handling IME - END

    // Key handling - BEGIN

    function addButtonsHandlers() {
        var buttonsWithHandlers = [
            { elementSelector: '#text-input', handler: showIME }, // text input field for typing user input with IME
            { elementSelector: '#clear', handler: clearIME } // clear the text input field content
        ];
        App.KeyHandler.addHandlersForButtons(buttonsWithHandlers);
    }
    // Key handling - END

    function init() {
        // Initialize logger
        logger = App.Logger.create({
            loggerName: 'Main',
            logLevel: 'all',
            loggerEl: document.querySelector('.logsContainer')
        });

        // Register menus for navigation in application - BEGIN
        App.Navigation.getMenu('Basic').previousMenu = 'Main';

        App.Navigation.registerMenu({
            domEl: document.querySelector('#main'),
            name: 'Main',
            nextMenu: 'Basic'
        });
        // Register menus for navigation in application - END

        // Cache DOM elements frequently used in application code
        imeElem = document.getElementById('text-input');
        outputElem = document.getElementById('output');

        // Handle "Done" and "Cancel" buttons in IME.
        document.body.addEventListener('keydown', function (event) {
            switch (event.keyCode) {
                case 65376: // Done
                    onIMEChange(event);
                    break;
                case 65385: // Cancel
                    cancelIME();
                    break;
                default: // do nothing
                    break;
            }
        });

        addButtonsHandlers();

        document.body.focus(); // IMPORTANT! Focus the document.body explicitely!
        logger.log('[Main.init] App initialized with active element:', document.activeElement);
    }

    return {
        init: init
    };
}());

window.addEventListener('load', function () {
    App.Main.init();
});