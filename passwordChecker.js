(function (exports) {
    // Place the script in strict mode
    'use strict';

    /*global define, log, document*/
    /*jslint plusplus: true */

    function PasswordComplexity() {}

    var proto = PasswordComplexity.prototype,
        // the element on which the plug-in is bound
        targetElement,
        // object with the plug-in options
        pluginOptions = {
            text: {
                title: "Password Strength meter",
                invalid: "Invalid",
                weak: "Weak",
                strong: "String",
                secure: "Secure"
            },
            config: {
                minLength: 0,
                maxLength: 30
            }
        },
        // the password values that will be retrieved from the target element
        passValue,
        // array representation of the password value
        passChar,
        // the length of the password array
        passLength,
        //
        passwordAnalytics = {
            lower: 0,
            upper: 0,
            symbol: 0,
            number: 0
        },
        reusltCutOffPoints = {
            WEAK: 33,
            STRONG: 66,
            SECURE: 99
        },
        regexTests = {
            lower: /[a-z]/g,
            upper: /[A-Z]/g,
            numbers: /[0-9]/g,
            symbols: /([_,#,@,%,\^,&,~,{,},(,),\-, ])/g
        };

    function analysePassword() {
        var length = passLength,
            currentChar;

        if (length < pluginOptions.config.minLength || length > pluginOptions.config.maxLength) {
            return;
        }

        while (length--) {

            currentChar = passChar[length];

            if (currentChar.match(regexTests.lower)) {
                passwordAnalytics.lower++;
            }

            if (currentChar.match(regexTests.upper)) {
                passwordAnalytics.upper++;
            }

            if (currentChar.match(regexTests.numbers)) {
                passwordAnalytics.numbers++;
            }

            if (currentChar.match(regexTests.symbols)) {
                passwordAnalytics.symbols++;
            }
        }
    }

    function calculateResult() {

    }

    function resetPasswordAnalytics() {
        // reset password analytics object
        // FIXME this could probably be improved into a reset object function
        passwordAnalytics.lower = 0;
        passwordAnalytics.upper = 0;
        passwordAnalytics.symbol = 0;
        passwordAnalytics.number = 0;
    }

    function keyUpHandler() {
        resetPasswordAnalytics();
        analysePassword();
        calculateResult();
    }

    function bindEvent() {
        if (targetElement.addEventListener) {
            targetElement.addEventListener('keyup', keyUpHandler);
        } else if (targetElement.attachEvent) {
            targetElement.attachEvent('onkeyup', keyUpHandler);
        }
    }


    function updatePluginView() {
        // update here
    }

    function createElementWithId(elementTag, id) {
        var e = document.createElement(elementTag);
        e.setAttribute('id', id);
        return e;
    }

    function updatePluginElements() {
        var template = '<div id="password-strength-direction" class="">' + '</div>' + '<div id="password-strength-direction2" class="">' + '</div>' + '<span id="title">' + 'Password Strength' + '</span>' + '<div id="meter-container">' + '<div id="meter-outer" style="display:block; width: 100%; height: 5px; background-color: #efefef; overflow: hidden;">' + '<span id="meter-inner" style="display:block; height: 100%;">' + '</span>' + '</div>' + '<span id="meter-strength">' + 'Invalid' + '</span>' + '</div>' + '<div>' + 'Password should:' + '<ul>' + '<li>' + '<span id="numbers" class="check-icon"></span>' + '<label for="numbers">' + 'have one number' + '</label>' + '</li>' + '<li>' + '<span id="lower" class="check-icon"></span>' + '<label for="lower">' + 'have one lowercase character' + '</label>' + '</li>' + '<li>' + '<span id="upper" class="check-icon"></span>' + '<label for="upper">' + 'have one uppercase character' + '</label>' + '</li>' + '<li>' + '<span id="length" class="check-icon"></span>' + '<label for="length">' + 'be between 6 and 30 characters' + '</label>' + '</li>' + '</ul>' + '<span style="font-size: small;">' + 'Note: Special characters allowed are: _ # % ^ &amp; ~ { } ( ) -' + '</span>' + '</div>',
            e = createElementWithId('div', 'password-strength-meter');

        e.innerHTML = template;

        document.body.appendChild(e);
        /*var direction1 = createElementWithId('div', 'password-strength-direction'),
            direction2 = createElementWithId('div', 'password-strength-direction2'),
            title = createElementWithId('span', 'title'),
            meterContainer  = createElementWithId('div', 'meter-container'),
            meterOuter = createElementWithId('div', 'meter-outer'),
            meterInner = createElementWithId('span', 'meter-inner'),
            meterInner = createElementWithId('span', 'meter-strength'),*/
    }

    proto.bindTo = function bindTo(element, options) {

        if (!element) {
            throw 'element is missing';
        }

        targetElement = element;
        passValue = element.value;
        passChar = passValue.split('');
        passLength = passChar.length;

        updatePluginElements();

        bindEvent();

        resetPasswordAnalytics();
    };



    // Expose the class either via AMD or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return PasswordComplexity;
        });
    } else {
        exports.PasswordComplexity = PasswordComplexity;
    }
}(this));