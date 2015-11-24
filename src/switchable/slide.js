var Switchable = require('switchable/switchable');

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

 require('class/class-loader').register('switchable/slide', Slide);