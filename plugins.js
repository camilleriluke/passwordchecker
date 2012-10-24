// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});
	
    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
	
	window.log = function() {
		var args = arguments, newarr; 
		newarr = [].slice.call(args); 
		
		if (typeof console.log === 'object') {
			log.apply.call(console.log, console, newarr); 
		} else  {
			console.log.apply(console, newarr);
		}
	};
}());

// Place any jQuery/helper plugins in here.
