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
