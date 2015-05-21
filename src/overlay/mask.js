var $ = require("$"),
  Overlay = require("overlay/overlay"),
  win = $(window),
  doc = $(document),

ua = (window.navigator.userAgent || "").toLowerCase(),
isIE6 = ua.indexOf("msie 6") !== -1;

// Mask
// ----------
// 全屏遮罩层组件
var Mask = Overlay.extend({

  attrs: {
    width: isIE6 ? 0 : '100%',//IE6将script放入head中 doc.outerWidth(true) 报错
    height: isIE6 ? 0 : '100%',

    className: 'ui-mask',
    opacity: 0.2,
    backgroundColor: '#000',
    style: {
      position: isIE6 ? 'absolute' : 'fixed',
      top: 0,
      left: 0
    },

    align: {
      // undefined 表示相对于当前可视范围定位
      baseElement: isIE6 ? 'body' : undefined
    }
  },

  show: function () {
    if (isIE6) {
      this.set('width', win.width());
      this.set('height', win.height());
    }
    return Mask.superclass.show.call(this);
  },

  _onWindowResize: function(w, h){
    this.get('visible') && isIE6 && this.set('width', w).set('height', h);
    Mask.superclass._onWindowResize.call(this, w, h);
  },

  _onRenderBackgroundColor: function (val) {
    this.element.css('backgroundColor', val);
  },

  _onRenderOpacity: function (val) {
    this.element.css('opacity', val);
  }
});

// 单例
module.exports = Mask;