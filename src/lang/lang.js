var toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty;

/**
 * Detect the JScript [[DontEnum]] bug:
 * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
 * made non-enumerable as well.
 * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
 */
/** Detect if own properties are iterated after inherited properties (IE < 9) */
var iteratesOwnLast;
(function() {
	var props = [];
	function Ctor() { this.x = 1; }
	Ctor.prototype = { 'valueOf': 1, 'y': 1 };
	for (var prop in new Ctor()) { props.push(prop); }
	iteratesOwnLast = props[0] !== 'x';
}());

exports.toString = toString;

exports.isArray = Array.isArray || function(val) {
	return toString.call(val) === '[object Array]';
}

exports.isString = function(val) {
	return toString.call(val) === '[object String]';
}

exports.isFunction = function(val) {
	return toString.call(val) === '[object Function]';
}

function isWindow(o) {
	return o != null && o == o.window;
}

exports.isEmptyObject = function (o) {
	if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o) || !o.hasOwnProperty) {
		return false;
	}

	for (var p in o) {
		if (o.hasOwnProperty(p)) return false;
	}
	return true;
}

exports.isPlainObject = function (o) {
	// Must be an Object.
	// Because of IE, we also have to check the presence of the constructor
	// property. Make sure that DOM nodes and window objects don't
	// pass through, as well
	if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o)) {
		return false;
	}

	try {
		// Not own constructor property must be Object
		if (o.constructor && !hasOwn.call(o, "constructor") && !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
			return false;
		}
	} catch (e) {
		// IE8,9 Will throw exceptions on certain host objects #9897
		return false;
	}

	var key;

	// Support: IE<9
	// Handle iteration over inherited properties before own properties.
	// http://bugs.jquery.com/ticket/12199
	if (iteratesOwnLast) {
		for (key in o) {
			return hasOwn.call(o, key);
		}
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	for (key in o) {}

	return key === undefined || hasOwn.call(o, key);
}



function S4() {
	return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
}

exports.uuid = function (prefix) {
	var id = '' + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
	return prefix ? prefix + id : id;
};

exports.ucfirst = function (str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.substring(1);
}


exports.indexOf = Array.prototype.indexOf ?
function(arr, item) {
	return arr.indexOf(item);
} : function(arr, item) {
	for (var i = 0, len = arr.length; i < len; i++) {
		if (arr[i] === item) {
			return i;
		}
	}

	return -1;
};

exports.keys = Object.keys ? Object.keys : function(o) {
	var result = [];

	if (!o) return result;

	for (var name in o) {
		if (o.hasOwnProperty(name)) {
			result.push(name);
		}
	}

    return result;
};