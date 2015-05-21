var $ = require('$'),
    Popup = require('popup/popup'),
    Events = require('events/events'),
    Templatable = require('templatable/templatable');

var BUTTONS_TEMPLATE = {
	confirm : {
		role : 'confirm',
		cls : 'ui-dialog-button-orange',
		text : '确定'
	},
	cancel : {
		role : 'cancel',
		cls : 'ui-dialog-button-white',
		text : '取消'
	}
};

// Dialog
// ---
// Dialog 是通用对话框组件，提供显隐关闭、遮罩层、内嵌iframe、内容区域自定义功能。
// 是所有对话框类型组件的基类。
var Dialog = Popup.extend({

	Implements: Templatable,

	attrs :{
	    // 模板
	    template: require('./dialog.tpl'),

	    // 标题
	    title: '默认标题',

	    // 按钮
	    buttons : null,

		// 统一样式前缀
		classPrefix : 'ui-dialog',

		// 对话框主题
		skin : '',

		// 指定内容元素，可以是 iframe 地址
		content: {
			value: null,
			setter: function (val) {
				var that = this;
				if(isString(val)){
					this._type = 'html';
					val = val.replace(/^iframe:|^ajax:|^html|^dom:/,function(word){
						that._type = word.substring(0,word.length-1);
						return '';
					})
				} else {
					this._type = 'dom';
				}
		    	return val;
			}
		},

		// 关闭按钮可以自定义
		closeTpl: '×',

		// iframe,ajax 类型时，dialog 的最初高度
		initialHeight: 300,

		// iframe,ajax 类型时，dialog 的最初宽度
		initialWidth: 500,

		// 是否自适应
		autoFit: true,

		// 默认定位左右居中，略微靠上
		align: {
			value: {
					selfXY: ['50%', '50%'],
					baseXY: ['50%', '42%']
			},
			getter: function (val) {
				// 高度超过窗口的 42/50 浮层头部顶住窗口
				// https://github.com/aralejs/dialog/issues/41
				if (this.element.height() > $(window).height() * 0.84) {
					return {
						selfXY: ['50%', '0'],
						baseXY: ['50%', '0']
					};
				}
				return val;
			}
		}
	},

	parseElement: function () {
		this.set("model", {
			classPrefix: this.get('classPrefix'),
			skin: this.get('skin'),
			title: this.get('title'),
			buttons : this.get('buttons')
		});

		Dialog.superclass.parseElement.call(this);
		this.contentElement = this.$('[data-role=content]');

		// 必要的样式
		this.contentElement.css({
			height: '100%',
			zoom: 1
		});

		// 关闭按钮先隐藏
		// 后面当 onRenderCloseTpl 时，如果 closeTpl 不为空，会显示出来
		// 这样写是为了回避 arale.base 的一个问题：
		// 当属性初始值为''时，不会进入 onRender 方法
		// https://github.com/aralejs/base/issues/7
		this.$('[data-role=close]').hide();
	},

	events: {
		'click [data-role=close]': function (e) {
			e.preventDefault();
			this.hide();
		},
		'click [data-role=confirm]': function (e) {
			e.preventDefault();
			this.trigger('confirm');
		},
		'click [data-role=cancel]': function (e) {
			e.preventDefault();
			this.trigger('cancel');
			this.hide();
		}
	},

	destroy: function () {
		this._removeIframe();
		return Dialog.superclass.destroy.call(this);
	},

	setup: function () {
		Dialog.superclass.setup.call(this);
		this._setupKeyEvents();
	},

	// onRender
	//---
	_onRenderContent: function (val) {
		var ele = this.contentElement.empty()
		this._removeIframe()

		if (this._type == 'ajax' || this._type == 'iframe') {
			// iframe 还未请求完，先设置一个固定高度
			!this.get('height') && ele.css('height', this.get('initialHeight'));
			// iframe 还未请求完，先设置一个固定宽度
			!this.get('width') && ele.css('width', this.get('initialWidth'));

			// ajax 读入内容并 append 到容器中
			if(this._type == 'ajax'){
				this._ajaxHtml();

			// iframe 要在载入完成才显示
			} else {
				this._showIframe();
			}
		} else if ( this._type == 'dom' ) {
			ele.append($(val))
		} else {
			ele.html(val)
		}

		// #38 #44
		this._setPosition();
	},

	_onRenderCloseTpl: function (val) {
		if (val === '') {
			this.$('[data-role=close]').html(val).hide();
		} else {
			this.$('[data-role=close]').html(val).show();
		}
	},

	_onRenderWidth: function (val) {
		this.contentElement.css('width', val);
		this._setPosition();
	},

	_onRenderHeight: function (val) {
		this.contentElement.css('height', val);
		this._setPosition();
	},

	// 绑定键盘事件，ESC关闭窗口
	_setupKeyEvents: function () {
		this.delegateEvents($(document), 'keyup.esc', function (e) {
			if (e.keyCode === 27) {
				this.get('visible') && this.hide();
			}
		});
	},

	_showIframe: function () {
		var that = this;
		// 若未创建则新建一个
		if (!this.iframe) {
			this._createIframe();
		}

		// 开始请求 iframe
		this.iframe.attr({
			src: this.get('content'),
			name: 'dialog-iframe' + new Date().getTime()
		});

		// 因为在 IE 下 onload 无法触发
		// http://my.oschina.net/liangrockman/blog/24015
		// 所以使用 jquery 的函数来代替 onload
		 this.iframe.on('load', function(){
		 	if (!that.get('visible')) {
				return;
			}

			// 是否跨域的判断需要放入iframe load之后
			that._isCrossDomainIframe = isCrossDomainIframe(that.iframe);

			if (that.get('autoFit') && !that._isCrossDomainIframe) {
				!that.get('height') && that.contentElement.height(getIframeHeight(that.iframe));
				!that.get('width') && that.contentElement.width(getIframeHeight(that.iframe));
			}

			that._setPosition();
			that.trigger('complete');
		});
	},

	_createIframe: function () {
		var that = this;

		this.iframe = $('<iframe>', {
			src: 'javascript:\'\';',
			scrolling: 'no',
			frameborder: 'no',
			allowTransparency: 'true',
			css: {
				border: 'none',
				width: '100%',
				display: 'block',
				height: '100%',
				overflow: 'hidden'
			}
		}).appendTo(this.contentElement);

		// 给 iframe 绑一个 close 事件
		// iframe 内部可通过 window.frameElement.trigger('close') 关闭
		Events.mixTo(this.iframe[0]);
		this.iframe[0].on('close', function () {
			that.hide();
		});

		// 跨域则使用messenger进行通信,在IE6-8中有BUG
		/*var m = new Messenger('parent', 'fnx-dialog');
		m.addTarget(this.iframe[0].contentWindow, 'iframe1');
		m.listen(function (data) {
			data = $.parseJSON(data);
			switch (data.event) {
				case 'close':
					that.hide();
				break;
				case 'syncArea':
					that._setArea(data.width, data.height);
				default:
          		break;
			}
		});*/
	},

	_removeIframe : function(){
		// 重要！需要重置iframe地址，否则下次出现的对话框在IE6、7无法聚焦input
		// IE删除iframe后，iframe仍然会留在内存中出现上述问题，置换src是最容易解决的方法
		this.iframe && this.iframe.attr('src', 'about:blank').remove();
		this.iframe = null;
	},

	_setArea: function (w,h) {
		h && this.contentElement.css('height', h);
		w && this.contentElement.css('width', w);
		// force to reflow in ie6
		// http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
		this.element[0].className = this.element[0].className;
		this._setPosition();
	},

	_ajaxHtml: function () {
		var that = this;
		this.contentElement.load(this.get('content'), function () {

			that.contentElement.css({
				height : '',
				width : ''
			});
			that._setPosition();
			that.trigger('complete');
		});
	},

	// onChange
	//---
	_onChangeTitle: function (val) {
		this.$('[data-role=title]').html(val);
	},

	Statics: {
		'buttons' : BUTTONS_TEMPLATE
	}
});


Dialog.alert = function (title, content, callback, options) {
	var defaults = {
		content: content,
		title: title,
		closeTpl: '',
		buttons : [BUTTONS_TEMPLATE.confirm],
		onConfirm: function () {
			callback && callback(true);
			this.hide();
		}
	};

  return destoryDialog(defaults, options);
}



Dialog.confirm = function (title, content, callback, options) {
	var defaults = {
		content: content,
		title: title,
		closeTpl: '',
		buttons : [BUTTONS_TEMPLATE.confirm, BUTTONS_TEMPLATE.cancel],
		onConfirm: function () {
			callback && callback(true);
			this.hide();
		},
		onCancel: function () {
			callback && callback(false);
			this.hide();
		}
	};

	return destoryDialog(defaults, options);
}


Dialog.show = function(content, callback, options){
	var defaults = {
		content: content,
		title: ''
	};

	return destoryDialog(defaults, options);
}


module.exports = Dialog;

// Helpers
// ----

function isString(val) {
  return Object.prototype.toString.call(val) === '[object String]'
}

// 获取 iframe 内部的高度
function getIframeHeight(iframe) {
	return getIframeArea(iframe, 'scrollHeight');
}

// 获取 iframe 内部的宽度
function getIframeWidth(iframe) {
	return getIframeArea(iframe, 'scrollWidth');
}

function getIframeArea(iframe, area){
	var D = iframe[0].contentWindow.document;
	if (D.body[area] && D.documentElement[area]) {
		return Math.min(D.body[area], D.documentElement[area]);
	} else if (D.documentElement[area]) {
		return D.documentElement[area];
	} else if (D.body[area]) {
		return D.body[area];
	}
}

// iframe 是否和当前页面跨域
function isCrossDomainIframe(iframe) {
	var isCrossDomain = false;
	try {
		iframe[0].contentWindow.document;
	} catch (e) {
		isCrossDomain = true;
	}
	return isCrossDomain;
}

// 返回一个消失后摧毁的对话框
function destoryDialog(defaults, options){
  return new Dialog($.extend(null, defaults, options)).after('hide', function () {
    this.destroy();
  }).show();
}