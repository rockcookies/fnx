/**
name    : FNX-UI
author  : by FNX-UI Team
version : 0.0.2
email   : hqy321@gmail.com
**/


/**===============================
component : switchable/slide
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




__namespace__('switchable/slide',function(__using__,exports,module){

var Switchable = __include__["switchable/switchable"];

// 卡盘轮播组件
var Slide = Switchable.extend({
  attrs: {
    autoplay: true,
    circular: true
  },

  setup: function () {
  	Slide.superclass.setup.call(this);
  	this.render();
  }
});

 module.exports = Slide;

});


if(typeof define == 'function' && define.cmd){
	define('fnx/cmp/switchable/slide',['fnx/cmp/switchable/switchable'],function(require){
		__include__['switchable/switchable'] = require('fnx/cmp/switchable/switchable');
		return __using__('switchable/slide');
	});
}


})(window);