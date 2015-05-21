/**
name    : FNX-UI
author  : by FNX-UI Team
version : 0.0.2
email   : hqy321@gmail.com
**/


/**===============================
component : calendar/dateparser
===============================**/

!(function (window) {
var __modules__ = {},__include__ = {};

function __using__ (id) {
    var mod = __modules__[id];
    var exports = 'exports';

    if (typeof mod === 'object') {
        return mod;
    }

    if (!mod[exports]) {
        mod[exports] = {};
        mod[exports] = mod.call(mod[exports], __using__, mod[exports], mod) || mod[exports];
    }

    return mod[exports];
}

function __namespace__ (path, fn) {
    __modules__[path] = fn;
}




__namespace__('calendar/dateparser-i18n',function(__using__,exports,module){

//--zh-cn
var days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
	months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

exports['zh-cn'] = exports['default'] = {
	dayNames: days,
	dayNamesShort: days,
	monthNames: months,
	monthNamesShort: months,
	amPm: ['上午', '下午'],
	DoFn: function(D){
		return D;
	}
}


//--en-us
function shorten(arr, sLen) {
	var newArr = [];
	for (var i = 0, len = arr.length; i < len; i++) {
		newArr.push(arr[i].substr(0, sLen));
	}
	return newArr;
}

days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

exports['en-us'] = {
	dayNames: days,
	dayNamesShort: shorten(days, 3),
	monthNames: months,
	monthNamesShort: shorten(months, 3),
	amPm: ['am', 'pm'],
	DoFn: function(){
		return D + [ 'th', 'st', 'nd', 'rd' ][ D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10 ];
	}
};


});

__namespace__('calendar/dateparser',function(__using__,exports,module){

/*
	Token	Output
Month	M	1 2 ... 11 12
MM	01 02 ... 11 12
MMM	Jan Feb ... Nov Dec
MMMM	January February ... November December
Day of Month	D	1 2 ... 30 31
Do	1st 2nd ... 30th 31st
DD	01 02 ... 30 31
Day of Week	d	0 1 ... 5 6
ddd	Sun Mon ... Fri Sat
dddd	Sunday Monday ... Friday Saturday
Year	YY	70 71 ... 29 30
YYYY	1970 1971 ... 2029 2030
AM/PM	A	AM PM
a	am pm
Hour	H	0 1 ... 22 23
HH	00 01 ... 22 23
h	1 2 ... 11 12
hh	01 02 ... 11 12
Minute	m	0 1 ... 58 59
mm	00 01 ... 58 59
Second	s	0 1 ... 58 59
ss	00 01 ... 58 59
Fractional Second	S	0 1 ... 8 9
SS	0 1 ... 98 99
SSS	0 1 ... 998 999
Timezone	ZZ	-0700 -0600 ... +0600 +0700
*/

var langs = __using__("calendar/dateparser-i18n");

var DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss',
	token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g,
	twoDigits = /\d\d?/,
	threeDigits = /\d{3}/,
	fourDigits = /\d{4}/,
	word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i,
	noop = function () {};


function Fecha(data){
	data = data || {};

	var i18n = data.lang;
	if(isString(i18n) || !i18n){
		i18n = langs[data.lang] || langs['default'];
	}
	this.i18n = i18n;

	var parseFlags = this.parseFlags = {
		D: [twoDigits, function (d, v) {
			d.day = v;
		}],
		M: [twoDigits, function (d, v) {
			d.month = v - 1;
		}],
		YY: [twoDigits, function (d, v) {
			var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
			d.year = '' + (v > 68 ? cent - 1 : cent) + v;
		}],
		h: [twoDigits, function (d, v) {
			d.hour = v;
		}],
		m: [twoDigits, function (d, v) {
			d.minute = v;
		}],
		s: [twoDigits, function (d, v) {
			d.second = v;
		}],
		YYYY: [fourDigits, function (d, v) {
			d.year = v;
		}],
		S: [/\d/, function (d, v) {
			d.millisecond = v * 100;
		}],
		SS: [/\d{2}/, function (d, v) {
			d.millisecond = v * 10;
		}],
		SSS: [threeDigits, function (d, v) {
			d.millisecond = v;
		}],
		d: [twoDigits, noop],
		ddd: [word, noop],
		MMM: [word, monthUpdate(i18n, 'monthNamesShort')],
		MMMM: [word, monthUpdate(i18n, 'monthNames')],
		a: [word, function (d, v) {
			if (amPm.indexOf(v.toLowerCase())) {
				d.isPm = true;
			}
		}],
		ZZ: [/[\+\-]\d\d:?\d\d/, function (d, v) {
			var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

			if (parts) {
				minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
				d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
			}
		}]
	};

	parseFlags.dd = parseFlags.d;
	parseFlags.dddd = parseFlags.ddd;
	parseFlags.Do = parseFlags.DD = parseFlags.D;
	parseFlags.mm = parseFlags.m;
	parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
	parseFlags.MM = parseFlags.M;
	parseFlags.ss = parseFlags.s;
	parseFlags.A = parseFlags.a;
};

/***
 * Format a date
 * @method format
 * @param {Date} dateObj
 * @param {string} mask Format of the date, i.e. 'YYYY-MM-DD HH:mm:ss'
 */
Fecha.prototype.format = function(dateObj, mask){
	var i18n = this.i18n;

	if(isString(dateObj)){
		mask = dateObj;
	}
	mask = mask || DEFAULT_FORMAT;
	dateObj = dateObj || new Date();

	if (isNaN(dateObj)) {
		throw new SyntaxError('invalid date');
	}

	var D = dateObj.getDate(),
		d = dateObj.getDay(),
		M = dateObj.getMonth(),
		y = dateObj.getFullYear(),
		H = dateObj.getHours(),
		m = dateObj.getMinutes(),
		s = dateObj.getSeconds(),
		S = dateObj.getMilliseconds(),
		o = dateObj.getTimezoneOffset(),
		flags = {
			D: D,
			DD: pad(D),
			Do: i18n.DoFn(D),
			d: d,
			dd: pad(d),
			ddd: i18n.dayNamesShort[d],
			dddd: i18n.dayNames[d],
			M: M + 1,
			MM: pad(M + 1),
			MMM: i18n.monthNamesShort[M],
			MMMM: i18n.monthNames[M],
			YY: String(y).slice(2),
			YYYY: y,
			h: H % 12 || 12,
			hh: pad(H % 12 || 12),
			H: H,
			HH: pad(H),
			m: m,
			mm: pad(m),
			s: s,
			ss: pad(s),
			S: Math.round(S / 100),
			SS: pad(Math.round(S / 10), 2),
			SSS: pad(S, 3),
			a: H < 12 ? i18n.amPm[0] : i18n.amPm[1],
			A: H < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase(),
			ZZ: (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
		};

	return mask.replace(token, function ($0) {
		return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
	});
};

/**
 * Parse a date string into an object, changes - into /
 * @method parse
 * @param {string} dateStr Date string
 * @param {string} format Date parse format
 * @returns {Date|boolean}
 */
Fecha.prototype.parse = function(dateStr, format){
	var time, isValid, dateInfo, today, date, info, index,
		parseFlags = this.parseFlags;

	if (!format) {
		time = Date.parse(dateStr.replace(/\-/g, '/'));
		if (!isNaN(time)) {
			return new Date(time);
		} else {
			return false;
		}

	} else {
		format = format || DEFAULT_FORMAT;

		isValid = true;
		dateInfo = {};
		format.replace(token, function ($0) {
			if (parseFlags[$0]) {
				info = parseFlags[$0];
				index = dateStr.search(info[0]);
				if (!~index) {
					isValid = false;
				} else {
					dateStr.replace(info[0], function (result) {
						info[1](dateInfo, result);
						dateStr = dateStr.substr(index + result.length);
						return result;
					});
				}
			}

			return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
		});
	}

	if (!isValid) {
		throw new SyntaxError('invalid mask');
	}

	today = new Date();
	if (dateInfo.isPm && dateInfo.hour) {
		dateInfo.hour = +dateInfo.hour + 12
	}

	if (dateInfo.timezoneOffset) {
		dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
		date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
			dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
	} else {
		date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
			dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
	}
	return date;

};


module.exports = Fecha;


// Helpers
// ----
function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]'
}

function monthUpdate(i18n, arrName) {
	return function (d, v) {
		var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
		if (~index) {
			d.month = index;
		}
	}
}

function pad(val, len) {
	val = String(val);
	len = len || 2;
	while (val.length < len) {
		val = '0' + val;
	}
	return val;
}

});


if(typeof define == 'function' && define.cmd){
	define('fnx/cmp/calendar/dateparser',[],function(require){
		return __using__('calendar/dateparser');
	});
}


})(window);