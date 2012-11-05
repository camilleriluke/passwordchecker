(function (exports, $) {
    // Place the script in strict mode
    'use strict';

    /*global define, log, document, jQuery*/
    /*jslint plusplus: true */

    function PasswordComplexity() {}

    PasswordComplexity.Version = "0.1.9d84e93";

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
                minLength: 6,
                maxLength: 30,
                top: 0,
                sideBarTop : 0
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
        //
        reusltCutOffPoints = {
            WEAK: 33,
            STRONG: 66,
            SECURE: 99
        },
        //
        regexTests = {
            lower: /[a-z]/g,
            upper: /[A-Z]/g,
            numbers: /[0-9]/g,
            symbols: /([_,#,@,%,\^,&,~,{,},(,),\-, ])/g
        },
        //
        score,
        pluginElement,
        numberSpan,
        lowerSpan,
        upperSpan,
        lengthSpan,
        meterStrength,
        charFactor = (24 / 4),
        complexityFactor = {
            lower: (charFactor),
            upper: (charFactor),
            numbers: (charFactor),
            symbols: (charFactor * 2)
        };

    function analysePassword() {

        passValue = targetElement.value;
        passChar = passValue.split('');
        passLength = passChar.length;

        var length = passLength,
            currentChar;

        while (length--) {

            currentChar = passChar[length];

            if (currentChar.match(regexTests.lower)) {
                passwordAnalytics.lower++;
            }

            if (currentChar.match(regexTests.upper)) {
                passwordAnalytics.upper++;
            }

            if (currentChar.match(regexTests.numbers)) {
                passwordAnalytics.number++;
            }

            if (currentChar.match(regexTests.symbols)) {
                passwordAnalytics.symbols++;
            }
        }
    }

    function calculateResult() {

        var match = passValue.match(/[0-9a-zA-Z_,#,@,%,\^,&,~,{,},(,),\-, ]/g);
        if (match && (match.length !== passValue.length)) {
            return;
        }

        if (passwordAnalytics.lower <= 0 || passwordAnalytics.upper <= 0 || passwordAnalytics.number <= 0 || passLength <= pluginOptions.config.minLength || passLength >= pluginOptions.config.maxLength) {
            score = 0;
            return;
        } else {
            score += (passwordAnalytics.upper * complexityFactor.upper);
            score += (passwordAnalytics.lower * complexityFactor.lower);
            score += (passwordAnalytics.number * complexityFactor.numbers);
            score += (passwordAnalytics.symbol * complexityFactor.symbols);
        }
    }

    function resetPasswordAnalytics() {
        // reset password analytics object
        // FIXME this could probably be improved into a reset object function
        score = 0;
        passwordAnalytics.lower = 0;
        passwordAnalytics.upper = 0;
        passwordAnalytics.symbol = 0;
        passwordAnalytics.number = 0;
    }

    function updatePluginView() {
        var lowerClass = lowerSpan.className,
            upperClass = upperSpan.className,
            numberClass = numberSpan.className,
            lengthClass = lengthSpan.className,
            bgColor;

        if (passwordAnalytics.lower > 0) {
            lowerClass = (lowerClass.match(/checked/)) ? lowerClass : lowerClass += ' checked';
        } else {
            lowerClass = lowerClass.replace('checked', '');
        }
        lowerSpan.className = lowerClass;


        if (passwordAnalytics.upper > 0) {
            upperClass = (upperClass.match(/checked/)) ? upperClass : upperClass += ' checked';
        } else {
            upperClass = upperClass.replace('checked', '');
        }
        upperSpan.className = upperClass;

        if (passwordAnalytics.number > 0) {
            numberClass = (numberClass.match(/checked/)) ? numberClass : numberClass += ' checked';
        } else {
            numberClass = numberClass.replace('checked', '');
        }
        numberSpan.className = numberClass;

        if (passLength >= pluginOptions.config.minLength && passLength <= pluginOptions.config.maxLength) {
            lengthClass = (lengthClass.match(/checked/)) ? lengthClass : lengthClass += ' checked';
        } else {
            lengthClass = lengthClass.replace('checked', '');
        }
        lengthSpan.className = lengthClass;


        if (score < 33) {

            meterStrength.innerHTML = "Invalid";
            bgColor = 'red';

        } else if (score >= 0 && score < 66) {

            meterStrength.innerHTML = "Weak";
            bgColor = 'yellow';
        } else if (score >= 66 && score < 99) {

            meterStrength.innerHTML = "Strong";
            bgColor = 'orange';
        } else if (score >= 99) {

            meterStrength.innerHTML = "Secure";
            bgColor = 'green';

        }

        document.getElementById('meter-inner').style['background-color'] = bgColor;
        document.getElementById('meter-inner').style.width = score + '%';


    }

    function keyUpEventHandler() {
        resetPasswordAnalytics();
        analysePassword();
        calculateResult();
        updatePluginView();
    }

    function focusEventHandler() {
        pluginElement.style.left = ($(targetElement).width() + 25) + "px";
        pluginElement.style.display = "block";
    }

    function blurEventHandler() {
        pluginElement.style.display = "none";
    }

    function bindPluginEvents() {
        if (targetElement.addEventListener) {
            targetElement.addEventListener('keyup', keyUpEventHandler);
            targetElement.addEventListener('focus', focusEventHandler);
            targetElement.addEventListener('blur', blurEventHandler);
        } else if (targetElement.attachEvent) {
            targetElement.attachEvent('onkeyup', keyUpEventHandler);
            targetElement.attachEvent('onfocus', focusEventHandler);
            targetElement.attachEvent('onblur', blurEventHandler);
        }
    }

    function createElementWithId(elementTag, id) {
        var e = document.createElement(elementTag);
        e.setAttribute('id', id);
        return e;
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function updatePluginElements() {

        // Template for the plugin
        // FIXME this can be moved to a parameter configured by the user

        //var template = '<div id="password-strength-direction" class="">' + '</div>' + '<div id="password-strength-direction2" class="">' + '</div>' + '<span id="title">' + 'Password Strength' + '</span>' + '<div id="meter-container">' + '<div id="meter-outer" style="display:block; width: 100%; height: 5px; background-color: #efefef; overflow: hidden;">' + '<span id="meter-inner" style="display:block; height: 100%;">' + '</span>' + '</div>' + '<span id="meter-strength">' + 'Invalid' + '</span>' + '</div>' + '<div>' + 'Password should:' + '<ul>' + '<li>' + '<span id="numbers" class="check-icon"></span>' + '<label for="numbers">' + 'have one number' + '</label>' + '</li>' + '<li>' + '<span id="lower" class="check-icon"></span>' + '<label for="lower">' + 'have one lowercase character' + '</label>' + '</li>' + '<li>' + '<span id="upper" class="check-icon"></span>' + '<label for="upper">' + 'have one uppercase character' + '</label>' + '</li>' + '<li>' + '<span id="length" class="check-icon"></span>' + '<label for="length">' + 'be between 6 and 30 characters' + '</label>' + '</li>' + '</ul>' + '<span style="font-size: small;">' + 'Note: Special characters allowed are: _ # % ^ &amp; ~ { } ( ) -' + '</span>' + '</div>';

        var template = document.getElementById('pass-meter-template').textContent || document.getElementById('pass-meter-template').text;

        // create the plug-in main element
        pluginElement = createElementWithId('div', 'password-strength-meter');

        pluginElement.innerHTML = template;

        insertAfter(targetElement, pluginElement);
        // document.body.appendChild(pluginElement);

        // FIXME on IE7
        pluginElement.style.left = ($(targetElement).width() + 25) + "px";
        pluginElement.style.top = pluginOptions.config.top + "px";

        document.getElementById('password-strength-meter-sidebar-arrow').style.top = pluginOptions.config.sideBarTop + "px";

        // pluginElement.style.top = (targetElement.offsetTop + (targetElement.offsetHeight / 2) - 28) + 'px';
        // pluginElement.style.left = (targetElement.offsetWidth + targetElement.offsetLeft + 15) + 'px';


        // console.log($(pluginElement).offset());
        // console.log($(pluginElement).position());

        lowerSpan = document.getElementById('password-strength-meter-lower');
        upperSpan = document.getElementById('password-strength-meter-upper');
        numberSpan = document.getElementById('password-strength-meter-numbers');
        lengthSpan = document.getElementById('password-strength-meter-length');
        meterStrength = document.getElementById('password-strength-meter-meter-strength');

    }

    proto.bindTo = function bindTo(element, options) {

        if (!element) {
            throw 'element is missing';
        }

        pluginOptions.config.top = options.top || pluginOptions.config.top;
        pluginOptions.config.sideBarTop = options.sideBarTop || pluginOptions.config.sideBarTop;

        // set the local variables
        targetElement = element;

        // update the plug-in elements - this will create the plug-in body and attach it to the dom
        updatePluginElements();

        // bind the events to the plug-in body
        bindPluginEvents();

        // prepare the analytics object by resetting it
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
}(this, jQuery));