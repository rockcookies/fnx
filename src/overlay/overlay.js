var $ = require("$"),
    Position = require("position/position"),
    DomEvents = require('events/dom/dom-events'),
    Widget = require("widget/widget");


// Overlay
// -------
// Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
// 是一切悬浮类 UI 组件的基类
var Overlay = Widget.extend({

  attrs: {
    // 基本属性
    width: null,
    height: null,
    zIndex: 99,
    visible: false,

    // 定位配置
    align: {
      // element 的定位点，默认为左上角
      selfXY: [0, 0],
      // 基准定位元素，默认为当前可视区域
      baseElement: Position.VIEWPORT,
      // 基准定位元素的定位点，默认为左上角
      baseXY: [0, 0]
    },

    // 父元素
    parentNode: 'body'
  },

  show: function () {
    // 若从未渲染，则调用 render
    if (!this.rendered) {
      this.render();
    }
    this.set('visible', true);
    return this;
  },

  hide: function () {
    this.set('visible', false);
    return this;
  },

  reset: function() {
    this._setPosition();
    return this;
  },

  setup: function () {
    var that = this;
    // 窗口resize时，重新定位浮层
    this._setupResize();

    this.after('render', function () {
      var _pos = this.element.css('position');
      if (_pos === 'static' || _pos === 'relative') {
        this.element.css({
          position: 'absolute',
          left: '-9999px',
          top: '-9999px'
        });
      }
    });
    // 统一在显示之后重新设定位置
    this.after('show', function () {
      that._setPosition();
    });
  },

  destroy: function () {
    // 销毁两个静态数组中的实例
    erase(this, Overlay.allOverlays);
    return Overlay.superclass.destroy.call(this);
  },

  // 进行定位
  _setPosition: function (align) {
    // 不在文档流中，定位无效
    if (!isInDocument(this.element[0])) return;

    align || (align = this.get('align'));

    // 如果align为空，表示不需要使用js对齐
    if (!align) return;

    var isHidden = this.element.css('display') === 'none';

    // 在定位时，为避免元素高度不定，先显示出来
    if (isHidden) {
      this.element.css({
        visibility: 'hidden',
        display: 'block'
      });
    }

    Position.pin({
      element: this.element,
      x: align.selfXY[0],
      y: align.selfXY[1]
    }, {
      element: align.baseElement,
      x: align.baseXY[0],
      y: align.baseXY[1]
    });

    // 定位完成后，还原
    if (isHidden) {
      this.element.css({
        visibility: '',
        display: 'none'
      });
    }

    return this;
  },

  // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
  _setupResize: function () {
    Overlay.allOverlays.push(this);
    this.on('windowResize', this._onWindowResize);
  },

  // 用于 set 属性后的界面更新
  _onRenderWidth: function (val) {
    this.element.css('width', val);
  },

  _onRenderHeight: function (val) {
    this.element.css('height', val);
  },

  _onRenderZIndex: function (val) {
    this.element.css('zIndex', val);
  },

  _onRenderAlign: function (val) {
    this._setPosition(val);
  },

  _onRenderVisible: function (val) {
    this.element[val ? 'show' : 'hide']();
  },

  _onWindowResize: function () {
    // 当实例为空或隐藏时，不处理
    this.get('visible') && this._setPosition();
  }

});

// 绑定 resize 重新定位事件
Overlay.allOverlays = [];

DomEvents.on('window:resize', function (data) {
  $(Overlay.allOverlays).each(function (i, item) {
    item.trigger('windowResize', data.width, data.height);
  });
});

module.exports = Overlay;


require('class/class-loader').register('overlay/overlay', module.exports);



// Helpers
// -------

function isInDocument(element) {
  return $.contains(document.documentElement, element);
}

// 从数组中删除对应元素


function erase(target, array) {
  for (var i = 0; i < array.length; i++) {
    if (target === array[i]) {
      array.splice(i, 1);
      return array;
    }
  }
}
