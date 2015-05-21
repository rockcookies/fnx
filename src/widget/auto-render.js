var $ = require('$')
var DATA_WIDGET_AUTO_RENDERED = 'data-widget-auto-rendered'
var DATA_WIDGET_CLZ_PREFIX = 'clz:'

// 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
exports.autoRender = function(config) {
  return new this(config).render()
}


// 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
exports.autoRenderAll = function(root, callback) {
  if (typeof root === 'function') {
    callback = root
    root = null
  }

  root = $(root || 'body')
  var seaModules = []
  var seaElements = []
  var clzWidgets = []

  root.find('[data-widget]').each(function(i, element) {
    if (!exports.isDataApiOff(element)) {
      var id = element.getAttribute('data-widget') || '';

      //用class方式初始化
      if (id.indexOf(DATA_WIDGET_CLZ_PREFIX) === 0){
        clzWidgets.push({
            clz : loadClass(id.substring(DATA_WIDGET_CLZ_PREFIX.length)),
            emt : $(element)
        })
      }
      //用Seajs方式初始化
      else{
        seaModules.push(id.toLowerCase())
        seaElements.push($(element))
      }
    }
  })


  //Class方式初始化
  each(clzWidgets, function(i, widget){
    renderWidget(widget.clz, widget.emt)
  })

  //Seajs方式初始化
  if (seaModules.length) {
    seajs.use(seaModules, function() {
      each(arguments, function(i, widget){
        renderWidget(widget, seaElements[i])
      });

      // 在所有自动渲染完成后，执行回调
      callback && callback()
    })
  }
  // 在所有自动渲染完成后，执行回调
  else{
    callback && callback()
  }
}


var isDefaultOff = $('body').attr('data-api') === 'off'

// 是否没开启 data-api
exports.isDataApiOff = function(element) {
  var elementDataApi = $(element).attr('data-api')

  // data-api 默认开启，关闭只有两种方式：
  //  1. element 上有 data-api="off"，表示关闭单个
  //  2. document.body 上有 data-api="off"，表示关闭所有
  return  elementDataApi === 'off' ||
      (elementDataApi !== 'on' && isDefaultOff)
}

// Helpers
// ------

function each(arr, fn){
  for(var i = 0; i < arr.length; i++){
    fn(i, arr[i])
  }
}

function loadClass(id){
  return FNX.include(id)
}

function renderWidget(SubWidget, element){
  // 已经渲染过
  if (element.attr(DATA_WIDGET_AUTO_RENDERED)) return

  var config = {
    initElement: element,
    renderType: 'auto'
  };

  // data-widget-role 是指将当前的 DOM 作为 role 的属性去实例化，默认的 role 为 element
  var role = element.attr('data-widget-role')
  config[role ? role : 'element'] = element

  // 调用自动渲染接口
  SubWidget.autoRender && SubWidget.autoRender(config)

  // 标记已经渲染过
  element.attr(DATA_WIDGET_AUTO_RENDERED, 'true')
}