(function (exports) {
    // Place the script in strict mode
    'use strict';

    /*jslint browser: true*/
    /*jslint plusplus: true*/
    /*global log, define*/

    /**
     * The PasswordComplexity Class.
     *
     * @class Provides password complexity functions.
     */
    function PasswordComplexity() {}

    // Easy access to the prototype
    // Refernce to the target element on which the plugin is attached.
    var proto = PasswordComplexity.prototype,
        targetElement,
        config = {
            minLength: 6,
            maxLength: 30
        },
        charFactor = (24 / 4),
        complexityFactor = {
            lower: (charFactor),
            upper: (charFactor),
            numbers: (charFactor * 2),
            symbols: (charFactor * 2)
        },
        charValue,
        score = 0,
        strAnalysis = {
            opts: {
                lower: false,
                upper: false,
                number: false,
                amount: false
            },
            upper: 0,
            lower: 0,
            numbers: 0,
            symbols: 0,
            reset: function () {
                this.opts = {
                    lower: false,
                    upper: false,
                    number: false,
                    amount: false
                };
                this.upper = 0;
                this.lower = 0;
                this.numbers = 0;
                this.symbols = 0;
                return this;
            }
        };

    /**
     * Validation method that performs checks on the plug-in configuration object.
     *
     * @throws exception on first violation
     */
    function validateConfig() {
        if (config.minLength < 0 || config.maxLength < 0) {
            throw "Configuration error. minLength and maxLength cannot be less than 0";
        }
        if (config.minLength > config.maxLength) {
            throw "Configuration error. minLength[" + config.minLength + "] cannot be bigger tha maxLength[" + config.maxLength + "]";
        }
    }

    function analyzeString() {

        // Start the complexity score with a base score
        var targetValue = targetElement.value;

        charValue = targetValue.split('');

        var length = charValue.length;



        if (length < config.minLength || length > config.maxLength) {
            strAnalysis.opts.amount = false;
            return;
        }

        strAnalysis.opts.amount = true;

        if (targetValue.match(/[0-9a-zA-Z_,#,@,%,\^,&,~,{,},(,),\-, ]/g).length !== targetValue.length) {
            return;
        }

        while (length--) {
            //var charv = charValue[length];

            if (charValue[length].match(/[a-z]/g)) {
                strAnalysis.opts.lower = true;
                strAnalysis.lower++;
            }

            if (charValue[length].match(/[A-Z]/g)) {
                strAnalysis.opts.upper = true;
                strAnalysis.upper++;
            }

            if (charValue[length].match(/[0-9]/g)) {
                strAnalysis.opts.number = true;
                strAnalysis.numbers++;
            }

            if (charValue[length].match(/([_,#,@,%,\^,&,~,{,},(,),\-, ])/g)) {
                strAnalysis.symbols++;
            }
        }

        log(targetValue, strAnalysis);

    }

    function resetAnalysis() {
        strAnalysis.reset();
        score = 0;
    }


    function calculateResult() {

        if (strAnalysis.lower && strAnalysis.upper && strAnalysis.numbers) {
            score = 0;
        } else {
            return;
        }


        score += (strAnalysis.upper * complexityFactor.upper);
        score += (strAnalysis.lower * complexityFactor.lower);
        score += (strAnalysis.numbers * complexityFactor.numbers);
        score += (strAnalysis.symbols * complexityFactor.symbols);

        /*
        Invalid < 25
        Weak    < 50
        Average < 75
        Strong  < 100
        Secure  > 100
        */
    }

    // Key-up event hander
    function keyUpHandler(e) {

        resetAnalysis();
        //if (charValue.length >= config.minLength && charValue.length <= config.maxLength) {
        analyzeString();
        calculateResult();
        //}

        var r,
            c = 'red',
            mb = document.getElementById('meter-inner'),
            cl = document.getElementById("lower"),
            cu = document.getElementById("upper"),
            cn = document.getElementById("numbers"),
            clg = document.getElementById("length"),
            clss,
            mstrenght = document.getElementById('meter-strength');

        if (score < 33) {
            r = "Invalid";
        } else if (score >= 0 && score < 66) {
            r = "Weak";
            c = 'lightcoral';
        } else if (score >= 66 && score < 99) {
            r = "Strong";
            c = 'orange';
        } else if (score >= 99) {
            r = "Secure";
            c = 'green';
        }

        mb.style.width = score + "%";
        mb.style.background = c;

        // FIX the replace this will not work on IE
        if (strAnalysis.opts.lower) {
            clss = cl.getAttribute('class');
            cl.setAttribute("class", clss + " checked");
        } else {
            clss = cl.getAttribute('class');
            cl.setAttribute("class", clss.replace("checked", ""));
        }

        if (strAnalysis.opts.upper) {
            clss = cu.getAttribute('class');
            cu.setAttribute("class", clss + " checked");
        } else {
            clss = cu.getAttribute('class');
            cu.setAttribute("class", clss.replace("checked", ""));
        }

        if (strAnalysis.opts.number) {
            clss = cn.getAttribute('class');
            cn.setAttribute("class", clss + " checked");
        } else {
            clss = cn.getAttribute('class');
            cn.setAttribute("class", clss.replace("checked", ""));
        }

        if (strAnalysis.opts.amount) {
            clss = clg.getAttribute('class');
            clg.setAttribute("class", clss + " checked");
        } else {
            clss = clg.getAttribute('class');
            clg.setAttribute("class", clss.replace("checked", ""));
        }

        /*
        cl.checked = strAnalysis.opts.lower;
        cu.checked = strAnalysis.opts.upper;
        cn.checked = strAnalysis.opts.number;
        clg.checked = strAnalysis.opts.amount;
        */


        mstrenght.innerHTML = r;


        //log("Value\t%o\r\nResult\t%o", charValue, score);
    }

    // Bind the event handler to the target element.
    function bindEvent() {
        if (targetElement.addEventListener) {
            targetElement.addEventListener('keyup', keyUpHandler);
        } else if (targetElement.attachEvent) {
            targetElement.attachEvent('onkeyup', keyUpHandler);
        }
    }

    /**
     * Initialization function. Binds the plug in to the target element
     * and apply any configurations passed.
     *
     * @param {HTMLElement} The element on which the plug-in should be attached.
     * @param {Object} Configuration object for the current plug-in.
     */
    proto.bind = function bind(target, configuration) {

        configuration = configuration || {};
        /*
        if (!(target instanceof HTMLElement)) {
            throw "Invalid Argument. Cannot bind PasswordComplexity on the target argument.";
        }
        */
        // Update the local target element reference
        targetElement = target;

        // Override the configuration values passed
        config.minLength = configuration.minLength || config.minLength;
        config.maxLength = configuration.maxLength || config.maxLength;

        // validate the configuration values. This might raise an exception
        validateConfig();

        // Bind the events
        bindEvent();
    };

    proto.testing = {
        configuration: config,
        analytics: strAnalysis
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