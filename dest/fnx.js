/**
name    : FNX-UI
author  : by FNX-UI Team
version : 1.0.0
email   : hqy321@gmail.com
**/



/**===============================
modules : 
class/class	
events/events	
base/base	
widget/widget	
position/position	
templatable/templatable	
easing/easing	
iframe-shim/iframe-shim	
overlay/overlay	
overlay/mask	
popup/popup	
popup/dialog	
messager/messager	
switchable/switchable	
switchable/slide	
switchable/carousel	
calendar/dateparser	
calendar/calendar
===============================**/


!(function(factory,window){
	if(typeof define == 'function' && define.cmd){
		define(function(require){
			require("$")

			factory(window);
			return window.FNX;
		})
	} else {
		factory(window);
	}
}(function(window){
//script

!(function(window){
	var ns = window.FNX || (window.FNX = {});
	ns.__clz__ || (ns.__clz__ = {});
	ns.__loader__ = function(){
		var modules = {};

		var using = this.using = function(id){
			var mod = modules[id],exports = 'exports';

			if (typeof mod === 'object') {
		        return mod;
		    }

		    if (!mod[exports]) {
		        mod[exports] = {};
		        mod[exports] = mod.call(mod[exports], using, mod[exports], mod) || mod[exports];
		    }

		    return mod[exports];
		};

		this.namespace = function(path, fn){
			modules[path] = fn;
		};
	};

	ns.include = function(id){
		return ns.__clz__[id];
	}
}(window));


/**===============================
component : class/class
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('class/class',function(__using__,exports,module){

// Class
// -----------------
// Thanks to:
//  - http://mootools.net/docs/core/Class/Class
//  - http://ejohn.org/blog/simple-javascript-inheritance/
//  - https://github.com/ded/klass
//  - http://documentcloud.github.com/backbone/#Model-extend
//  - https://github.com/joyent/node/blob/master/lib/util.js
//  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js


// The base Class implementation.
function Class(o) {
  // Convert existed function to Class.
  if (!(this instanceof Class) && isFunction(o)) {
    return classify(o)
  }
}

module.exports = Class


// Create a new Class.
//
//  var SuperPig = Class.create({
//    Extends: Animal,
//    Implements: Flyable,
//    initialize: function() {
//      SuperPig.superclass.initialize.apply(this, arguments)
//    },
//    Statics: {
//      COLOR: 'red'
//    }
// })
//
Class.create = function(parent, properties) {
  if (!isFunction(parent)) {
    properties = parent
    parent = null
  }

  properties || (properties = {})
  parent || (parent = properties.Extends || Class)
  properties.Extends = parent

  // The created class constructor
  function SubClass() {
    // Call the parent constructor.
    parent.apply(this, arguments)

    // Only call initialize in self constructor.
    if (this.constructor === SubClass && this.initialize) {
      this.initialize.apply(this, arguments)
    }
  }

  // Inherit class (static) properties from parent.
  if (parent !== Class) {
    mix(SubClass, parent, parent.StaticsWhiteList)
  }

  // Add instance properties to the subclass.
  implement.call(SubClass, properties)

  // Make subclass extendable.
  return classify(SubClass)
}


function implement(properties) {
  var key, value

  for (key in properties) {
    value = properties[key]

    if (Class.Mutators.hasOwnProperty(key)) {
      Class.Mutators[key].call(this, value)
    } else {
      this.prototype[key] = value
    }
  }
}


// Create a sub Class based on `Class`.
Class.extend = function(properties) {
  properties || (properties = {})
  properties.Extends = this

  return Class.create(properties)
}


function classify(cls) {
  cls.extend = Class.extend
  cls.implement = implement
  return cls
}


// Mutators define special properties.
Class.Mutators = {

  'Extends': function(parent) {
    var existed = this.prototype
    var proto = createProto(parent.prototype)

    // Keep existed properties.
    mix(proto, existed)

    // Enforce the constructor to be what we expect.
    proto.constructor = this

    // Set the prototype chain to inherit from `parent`.
    this.prototype = proto

    // Set a convenience property in case the parent's prototype is
    // needed later.
    this.superclass = parent.prototype
  },

  'Implements': function(items) {
    isArray(items) || (items = [items])
    var proto = this.prototype, item

    while (item = items.shift()) {
      mix(proto, item.prototype || item)
    }
  },

  'Statics': function(staticProperties) {
    mix(this, staticProperties)
  }
}


// Shared empty constructor function to aid in prototype-chain creation.
function Ctor() {
}

// See: http://jsperf.com/object-create-vs-new-ctor
var createProto = Object.__proto__ ?
    function(proto) {
      return { __proto__: proto }
    } :
    function(proto) {
      Ctor.prototype = proto
      return new Ctor()
    }


// Helpers
// ------------

function mix(r, s, wl) {
  // Copy "all" properties including inherited ones.
  for (var p in s) {
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue

      // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}


var toString = Object.prototype.toString

var isArray = Array.isArray || function(val) {
    return toString.call(val) === '[object Array]'
}

var isFunction = function(val) {
  return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function(arr, item) {
      return arr.indexOf(item)
    } :
    function(arr, item) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
          return i
        }
      }
      return -1
    }


});


FNX.__clz__['fnx/cmp/class/class'] = __using__('class/class');

})(window);
/**===============================
component : events/events
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('events/events',function(__using__,exports,module){

// Events
// -----------------
// Thanks to:
//  - https://github.com/documentcloud/backbone/blob/master/backbone.js
//  - https://github.com/joyent/node/blob/master/lib/events.js


// Regular expression used to split event strings
var eventSplitter = /\s+/


// A module that can be mixed in to *any object* in order to provide it
// with custom events. You may bind with `on` or remove with `off` callback
// functions to an event; `trigger`-ing an event fires all callbacks in
// succession.
//
//     var object = new Events();
//     object.on('expand', function(){ alert('expanded'); });
//     object.trigger('expand');
//
function Events() {
}


// Bind one or more space separated events, `events`, to a `callback`
// function. Passing `"all"` will bind the callback to all events fired.
Events.prototype.on = function(events, callback, context) {
  var cache, event, list
  if (!callback) return this

  cache = this.__events || (this.__events = {})
  events = events.split(eventSplitter)

  while (event = events.shift()) {
    list = cache[event] || (cache[event] = [])
    list.push(callback, context)
  }

  return this
}

Events.prototype.once = function(events, callback, context) {
  var that = this
  var cb = function() {
    that.off(events, cb)
    callback.apply(context || that, arguments)
  }
  return this.on(events, cb, context)
}

// Remove one or many callbacks. If `context` is null, removes all callbacks
// with that function. If `callback` is null, removes all callbacks for the
// event. If `events` is null, removes all bound callbacks for all events.
Events.prototype.off = function(events, callback, context) {
  var cache, event, list, i

  // No events, or removing *all* events.
  if (!(cache = this.__events)) return this
  if (!(events || callback || context)) {
    delete this.__events
    return this
  }

  events = events ? events.split(eventSplitter) : keys(cache)

  // Loop through the callback list, splicing where appropriate.
  while (event = events.shift()) {
    list = cache[event]
    if (!list) continue

    if (!(callback || context)) {
      delete cache[event]
      continue
    }

    for (i = list.length - 2; i >= 0; i -= 2) {
      if (!(callback && list[i] !== callback ||
          context && list[i + 1] !== context)) {
        list.splice(i, 2)
      }
    }
  }

  return this
}


// Trigger one or many events, firing all bound callbacks. Callbacks are
// passed the same arguments as `trigger` is, apart from the event name
// (unless you're listening on `"all"`, which will cause your callback to
// receive the true name of the event as the first argument).
Events.prototype.trigger = function(events) {
  var cache, event, all, list, i, len, rest = [], args, returned = true;
  if (!(cache = this.__events)) return this

  events = events.split(eventSplitter)

  // Fill up `rest` with the callback arguments.  Since we're only copying
  // the tail of `arguments`, a loop is much faster than Array#slice.
  for (i = 1, len = arguments.length; i < len; i++) {
    rest[i - 1] = arguments[i]
  }

  // For each event, walk through the list of callbacks twice, first to
  // trigger the event, then to trigger any `"all"` callbacks.
  while (event = events.shift()) {
    // Copy callback lists to prevent modification.
    if (all = cache.all) all = all.slice()
    if (list = cache[event]) list = list.slice()

    // Execute event callbacks except one named "all"
    if (event !== 'all') {
      returned = triggerEvents(list, rest, this) && returned
    }

    // Execute "all" callbacks.
    returned = triggerEvents(all, [event].concat(rest), this) && returned
  }

  return returned
}

Events.prototype.emit = Events.prototype.trigger


// Helpers
// -------

var keys = Object.keys

if (!keys) {
  keys = function(o) {
    var result = []

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name)
      }
    }
    return result
  }
}

function forEach(array,fn){
  for(var i=0;i<array.length;i++){
    fn(array[i]);
  }
}

// Mix `Events` to object instance or Class function.
Events.mixTo = function(receiver) {
  var proto = Events.prototype

  if (isFunction(receiver)) {
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        receiver.prototype[key] = proto[key]
      }
    }
    forEach(keys(proto), function(key) {
      receiver.prototype[key] = proto[key]
    });
  }
  else {
    var event = new Events
    for (var key in proto) {
      if (proto.hasOwnProperty(key)) {
        copyProto(key)
      }
    }
  }

  function copyProto(key) {
    receiver[key] = function() {
      proto[key].apply(event, Array.prototype.slice.call(arguments))
      return this
    }
  }
}

// Execute callbacks
function triggerEvents(list, args, context) {
  var pass = true

  if (list) {
    var i = 0, l = list.length, a1 = args[0], a2 = args[1], a3 = args[2]
    // call is faster than apply, optimize less than 3 argu
    // http://blog.csdn.net/zhengyinhui100/article/details/7837127
    switch (args.length) {
      case 0: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context) !== false && pass} break;
      case 1: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1) !== false && pass} break;
      case 2: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2) !== false && pass} break;
      case 3: for (; i < l; i += 2) {pass = list[i].call(list[i + 1] || context, a1, a2, a3) !== false && pass} break;
      default: for (; i < l; i += 2) {pass = list[i].apply(list[i + 1] || context, args) !== false && pass} break;
    }
  }
  // trigger will return false if one of the callbacks return false
  return pass;
}

function isFunction(func) {
  return Object.prototype.toString.call(func) === '[object Function]'
}

module.exports = Events


});


FNX.__clz__['fnx/cmp/events/events'] = __using__('events/events');

})(window);
/**===============================
component : base/base
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('base/aspect',function(__using__,exports,module){

// Aspect
// ---------------------
// Thanks to:
//  - http://yuilibrary.com/yui/docs/api/classes/Do.html
//  - http://code.google.com/p/jquery-aop/
//  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/


// 在指定方法执行前，先执行 callback
exports.before = function(methodName, callback, context) {
  return weave.call(this, 'before', methodName, callback, context);
};


// 在指定方法执行后，再执行 callback
exports.after = function(methodName, callback, context) {
  return weave.call(this, 'after', methodName, callback, context);
};


// Helpers
// -------

var eventSplitter = /\s+/;

function weave(when, methodName, callback, context) {
  var names = methodName.split(eventSplitter);
  var name, method;

  while (name = names.shift()) {
    method = getMethod(this, name);
    if (!method.__isAspected) {
      wrap.call(this, name);
    }
    this.on(when + ':' + name, callback, context);
  }

  return this;
}


function getMethod(host, methodName) {
  var method = host[methodName];
  if (!method) {
    throw new Error('Invalid method name: ' + methodName);
  }
  return method;
}


function wrap(methodName) {
  var old = this[methodName];

  this[methodName] = function() {
    var args = Array.prototype.slice.call(arguments);
    var beforeArgs = ['before:' + methodName].concat(args);

    // prevent if trigger return false
    if (this.trigger.apply(this, beforeArgs) === false) return;

    var ret = old.apply(this, arguments);
    var afterArgs = ['after:' + methodName, ret].concat(args);
    this.trigger.apply(this, afterArgs);

    return ret;
  };

  this[methodName].__isAspected = true;
}


});

__namespace__('base/attribute',function(__using__,exports,module){

// Attribute
// -----------------
// Thanks to:
//  - http://documentcloud.github.com/backbone/#Model
//  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
//  - https://github.com/berzniz/backbone.getters.setters


// 负责 attributes 的初始化
// attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
exports.initAttrs = function(config) {
  // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
  var attrs = this.attrs = {};

  // Get all inherited attributes.
  var specialProps = this.propsInAttrs || [];
  mergeInheritedAttrs(attrs, this, specialProps);

  // Merge user-specific attributes from config.
  if (config) {
    mergeUserValue(attrs, config);
  }

  // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
  setSetterAttrs(this, attrs, config);

  // Convert `on/before/afterXxx` config to event handler.
  parseEventsFromAttrs(this, attrs);

  // 将 this.attrs 上的 special properties 放回 this 上
  copySpecialProps(specialProps, this, attrs, true);
};


// Get the value of an attribute.
exports.get = function(key) {
  var attr = this.attrs[key] || {};
  var val = attr.value;
  return attr.getter ? attr.getter.call(this, val, key) : val;
};


// Set a hash of model attributes on the object, firing `"change"` unless
// you choose to silence it.
exports.set = function(key, val, options) {
  var attrs = {};

  // set("key", val, options)
  if (isString(key)) {
    attrs[key] = val;
  }
  // set({ "key": val, "key2": val2 }, options)
  else {
    attrs = key;
    options = val;
  }

  options || (options = {});
  var silent = options.silent;
  var override = options.override;

  var now = this.attrs;
  var changed = this.__changedAttrs || (this.__changedAttrs = {});

  for (key in attrs) {
    if (!attrs.hasOwnProperty(key)) continue;

    var attr = now[key] || (now[key] = {});
    val = attrs[key];

    if (attr.readOnly) {
      throw new Error('This attribute is readOnly: ' + key);
    }

    // invoke setter
    if (attr.setter) {
      val = attr.setter.call(this, val, key);
    }

    // 获取设置前的 prev 值
    var prev = this.get(key);

    // 获取需要设置的 val 值
    // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
    // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
    if (!override && isPlainObject(prev) && isPlainObject(val)) {
      val = merge(merge({}, prev), val);
    }

    // set finally
    now[key].value = val;

    // invoke change event
    // 初始化时对 set 的调用，不触发任何事件
    if (!this.__initializingAttrs && !isEqual(prev, val)) {
      if (silent) {
        changed[key] = [val, prev];
      }
      else {
        this.trigger('change:' + key, val, prev, key);
      }
    }
  }

  return this;
};


// Call this method to manually fire a `"change"` event for triggering
// a `"change:attribute"` event for each changed attribute.
exports.change = function() {
  var changed = this.__changedAttrs;

  if (changed) {
    for (var key in changed) {
      if (changed.hasOwnProperty(key)) {
        var args = changed[key];
        this.trigger('change:' + key, args[0], args[1], key);
      }
    }
    delete this.__changedAttrs;
  }

  return this;
};

// for test
exports._isPlainObject = isPlainObject;

// Helpers
// -------

var toString = Object.prototype.toString;
var hasOwn = Object.prototype.hasOwnProperty;

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

var isArray = Array.isArray || function(val) {
  return toString.call(val) === '[object Array]';
};

function isString(val) {
  return toString.call(val) === '[object String]';
}

function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

function isWindow(o) {
  return o != null && o == o.window;
}

function isPlainObject(o) {
  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor
  // property. Make sure that DOM nodes and window objects don't
  // pass through, as well
  if (!o || toString.call(o) !== "[object Object]" ||
      o.nodeType || isWindow(o)) {
    return false;
  }

  try {
    // Not own constructor property must be Object
    if (o.constructor &&
        !hasOwn.call(o, "constructor") &&
        !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
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

function isEmptyObject(o) {
  if (!o || toString.call(o) !== "[object Object]" ||
      o.nodeType || isWindow(o) || !o.hasOwnProperty) {
    return false;
  }

  for (var p in o) {
    if (o.hasOwnProperty(p)) return false;
  }
  return true;
}

function merge(receiver, supplier) {
  var key, value;

  for (key in supplier) {
    if (supplier.hasOwnProperty(key)) {
      receiver[key] = cloneValue(supplier[key], receiver[key]);
    }
  }

  return receiver;
}

// 只 clone 数组和 plain object，其他的保持不变
function cloneValue(value, prev){
  if (isArray(value)) {
    value = value.slice();
  }
  else if (isPlainObject(value)) {
    isPlainObject(prev) || (prev = {});

    value = merge(prev, value);
  }

  return value;
}

var keys = Object.keys;

if (!keys) {
  keys = function(o) {
    var result = [];

    for (var name in o) {
      if (o.hasOwnProperty(name)) {
        result.push(name);
      }
    }
    return result;
  };
}

function mergeInheritedAttrs(attrs, instance, specialProps) {
  var inherited = [];
  var proto = instance.constructor.prototype;

  while (proto) {
    // 不要拿到 prototype 上的
    if (!proto.hasOwnProperty('attrs')) {
      proto.attrs = {};
    }

    // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
    copySpecialProps(specialProps, proto.attrs, proto);

    // 为空时不添加
    if (!isEmptyObject(proto.attrs)) {
      inherited.unshift(proto.attrs);
    }

    // 向上回溯一级
    proto = proto.constructor.superclass;
  }

  // Merge and clone default values to instance.
  for (var i = 0, len = inherited.length; i < len; i++) {
    mergeAttrs(attrs, normalize(inherited[i]));
  }
}

function mergeUserValue(attrs, config) {
  mergeAttrs(attrs, normalize(config, true), true);
}

function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
  for (var i = 0, len = specialProps.length; i < len; i++) {
    var key = specialProps[i];

    if (supplier.hasOwnProperty(key)) {
      receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
    }
  }
}


var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;

function parseEventsFromAttrs(host, attrs) {
  for (var key in attrs) {
    if (attrs.hasOwnProperty(key)) {
      var value = attrs[key].value, m;

      if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
        host[m[1]](getEventName(m[2]), value);
        delete attrs[key];
      }
    }
  }
}

// Converts `Show` to `show` and `ChangeTitle` to `change:title`
function getEventName(name) {
  var m = name.match(EVENT_NAME_PATTERN);
  var ret = m[1] ? 'change:' : '';
  ret += m[2].toLowerCase() + m[3];
  return ret;
}


function setSetterAttrs(host, attrs, config) {
  var options = { silent: true };
  host.__initializingAttrs = true;

  for (var key in config) {
    if (config.hasOwnProperty(key)) {
      if (attrs[key].setter) {
        host.set(key, config[key], options);
      }
    }
  }

  delete host.__initializingAttrs;
}


var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

// normalize `attrs` to
//
//   {
//      value: 'xx',
//      getter: fn,
//      setter: fn,
//      readOnly: boolean
//   }
//
function normalize(attrs, isUserValue) {
  var newAttrs = {};

  for (var key in attrs) {
    var attr = attrs[key];

    if (!isUserValue &&
        isPlainObject(attr) &&
        hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
      newAttrs[key] = attr;
      continue;
    }

    newAttrs[key] = {
      value: attr
    };
  }

  return newAttrs;
}

var ATTR_OPTIONS = ['setter', 'getter', 'readOnly'];
// 专用于 attrs 的 merge 方法
function mergeAttrs(attrs, inheritedAttrs, isUserValue){
  var key, value;
  var attr;

  for (key in inheritedAttrs) {
    if (inheritedAttrs.hasOwnProperty(key)) {
      value = inheritedAttrs[key];
      attr = attrs[key];

      if (!attr) {
        attr = attrs[key] = {};
      }

      // 从严谨上来说，遍历 ATTR_SPECIAL_KEYS 更好
      // 从性能来说，直接 人肉赋值 更快
      // 这里还是选择 性能优先

      // 只有 value 要复制原值，其他的直接覆盖即可
      (value['value'] !== undefined) && (attr['value'] = cloneValue(value['value'], attr['value']));

      // 如果是用户赋值，只要考虑value
      if (isUserValue) continue;

      for (var i in ATTR_OPTIONS) {
        var option = ATTR_OPTIONS[i];
        if (value[option] !== undefined) {
          attr[option] = value[option];
        }
      }
    }
  }

  return attrs;
}

function hasOwnProperties(object, properties) {
  for (var i = 0, len = properties.length; i < len; i++) {
    if (object.hasOwnProperty(properties[i])) {
      return true;
    }
  }
  return false;
}


// 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
function isEmptyAttrValue(o) {
  return o == null || // null, undefined
      (isString(o) || isArray(o)) && o.length === 0 || // '', []
      isEmptyObject(o); // {}
}

// 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
function isEqual(a, b) {
  if (a === b) return true;

  if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;

  // Compare `[[Class]]` names.
  var className = toString.call(a);
  if (className != toString.call(b)) return false;

  switch (className) {

    // Strings, numbers, dates, and booleans are compared by value.
    case '[object String]':
      // Primitives and their corresponding object wrappers are
      // equivalent; thus, `"5"` is equivalent to `new String("5")`.
      return a == String(b);

    case '[object Number]':
      // `NaN`s are equivalent, but non-reflexive. An `equal`
      // comparison is performed for other numeric values.
      return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);

    case '[object Date]':
    case '[object Boolean]':
      // Coerce dates and booleans to numeric primitive values.
      // Dates are compared by their millisecond representations.
      // Note that invalid dates with millisecond representations
      // of `NaN` are not equivalent.
      return +a == +b;

    // RegExps are compared by their source patterns and flags.
    case '[object RegExp]':
      return a.source == b.source &&
          a.global == b.global &&
          a.multiline == b.multiline &&
          a.ignoreCase == b.ignoreCase;

    // 简单判断数组包含的 primitive 值是否相等
    case '[object Array]':
      var aString = a.toString();
      var bString = b.toString();

      // 只要包含非 primitive 值，为了稳妥起见，都返回 false
      return aString.indexOf('[object') === -1 &&
          bString.indexOf('[object') === -1 &&
          aString === bString;
  }

  if (typeof a != 'object' || typeof b != 'object') return false;

  // 简单判断两个对象是否相等，只判断第一层
  if (isPlainObject(a) && isPlainObject(b)) {

    // 键值不相等，立刻返回 false
    if (!isEqual(keys(a), keys(b))) {
      return false;
    }

    // 键相同，但有值不等，立刻返回 false
    for (var p in a) {
      if (a[p] !== b[p]) return false;
    }

    return true;
  }

  // 其他情况返回 false, 以避免误判导致 change 事件没发生
  return false;
}


});

__namespace__('base/base',function(__using__,exports,module){

// Base
// ---------
// Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。

var Class = __include__["class/class"];
var Events = __include__["events/events"];
var Aspect = __using__("base/aspect");
var Attribute = __using__("base/attribute");


module.exports = Class.create({
  Implements: [Events, Aspect, Attribute],

  initialize: function(config) {
    this.initAttrs(config);

    // Automatically register `this._onChangeAttr` method as
    // a `change:attr` event handler.
    parseEventsFromInstance(this, this.attrs);
  },

  destroy: function() {
    this.off();

    for (var p in this) {
      if (this.hasOwnProperty(p)) {
        delete this[p];
      }
    }

    // Destroy should be called only once, generate a fake destroy after called
    // https://github.com/aralejs/widget/issues/50
    this.destroy = function() {};
  }
});


function parseEventsFromInstance(host, attrs) {
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      var m = '_onChange' + ucfirst(attr);
      if (host[m]) {
        host.on('change:' + attr, host[m]);
      }
    }
  }
}

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
}


});


__include__['class/class'] = FNX.__clz__['fnx/cmp/class/class'];
__include__['events/events'] = FNX.__clz__['fnx/cmp/events/events'];
FNX.__clz__['fnx/cmp/base/base'] = __using__('base/base');

})(window);
/**===============================
component : widget/widget
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('widget/daparser',function(__using__,exports,module){

// DAParser
// --------
// data api 解析器，提供对单个 element 的解析，可用来初始化页面中的所有 Widget 组件。

var $ = __include__["$"]


// 得到某个 DOM 元素的 dataset
exports.parseElement = function(element, raw) {
  var dataset = {},
  config = {},
  options = {}

  var s = $.trim(element.attr('widget-options'));
  if (s){
    if (s.substring(0, 1) != '{'){
      s = '{' + s + '}';
    }
    options = (new Function('return ' + s))();
  }

  element = $(element)[0]

  // ref: https://developer.mozilla.org/en/DOM/element.dataset
  if (element.dataset) {
    // 转换成普通对象
    dataset = $.extend({}, element.dataset)
  }
  else {
    var attrs = element.attributes

    for (var i = 0, len = attrs.length; i < len; i++) {
      var attr = attrs[i]
      var name = attr.name

      if (name.indexOf('data-') === 0) {
        name = camelCase(name.substring(5))
        dataset[name] = attr.value
      }
    }
  }

  config = raw === true ? dataset : normalizeValues(dataset)
  $.extend(config, options)

  return config
}


// Helpers
// ------

var RE_DASH_WORD = /-([a-z])/g
var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/
var parseJSON = this.JSON ? JSON.parse : $.parseJSON

// 仅处理字母开头的，其他情况转换为小写："data-x-y-123-_A" --> xY-123-_a
function camelCase(str) {
  return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
    return (letter + '').toUpperCase()
  })
}

// 解析并归一化配置中的值
function normalizeValues(data) {
  for (var key in data) {
    if (data.hasOwnProperty(key)) {

      var val = data[key]
      if (typeof val !== 'string') continue

      if (JSON_LITERAL_PATTERN.test(val)) {
        val = val.replace(/'/g, '"')
        data[key] = normalizeValues(parseJSON(val))
      }
      else {
        data[key] = normalizeValue(val)
      }
    }
  }

  return data
}

// 将 'false' 转换为 false
// 'true' 转换为 true
// '3253.34' 转换为 3253.34
function normalizeValue(val) {
  if (val.toLowerCase() === 'false') {
    val = false
  }
  else if (val.toLowerCase() === 'true') {
    val = true
  }
  else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
    var number = parseFloat(val)
    if (number + '' === val) {
      val = number
    }
  }

  return val
}


});

__namespace__('widget/auto-render',function(__using__,exports,module){

var $ = __include__["$"]
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

});

__namespace__('widget/widget',function(__using__,exports,module){

// Widget
// ---------
// Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
// Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
// 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。

var Base = __include__["base/base"]
var $ = __include__["$"]
var DAParser = __using__("widget/daparser")
var AutoRender = __using__("widget/auto-render")

var DELEGATE_EVENT_NS = '.delegate-events-'
var ON_RENDER = '_onRender'
var DATA_WIDGET_CID = 'data-widget-cid'

// 所有初始化过的 Widget 实例
var cachedInstances = {}

var Widget = Base.extend({

  // config 中的这些键值会直接添加到实例上，转换成 properties
  propsInAttrs: ['initElement', 'element', 'events'],

  // 与 widget 关联的 DOM 元素
  element: null,

  // 事件代理，格式为：
  //   {
  //     'mousedown .title': 'edit',
  //     'click {{attrs.saveButton}}': 'save'
  //     'click .open': function(ev) { ... }
  //   }
  events: null,

  // 属性列表
  attrs: {
    // 基本属性
    id: null,
    className: null,
    style: null,

    //i18n
    locale: 'zh-cn',

    // 默认模板
    template: '<div></div>',

    // 默认数据模型
    model: null,

    // 组件的默认父节点
    parentNode: 'body'
  },

  // 初始化方法，确定组件创建时的基本流程：
  // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
  initialize: function(config) {
    this.cid = uniqueCid()

    // 初始化 attrs
    var dataAttrsConfig = this._parseDataAttrsConfig(config)
    Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig)

    // 初始化 props
    this.parseElement()
    this.initProps()

    // 初始化 events
    this.delegateEvents()

    // 子类自定义的初始化
    this.setup()

    // 保存实例信息
    this._stamp()

    // 是否由 template 初始化
    this._isTemplate = !(config && config.element)
  },

  // 解析通过 data-attr 设置的 api
  _parseDataAttrsConfig: function(config) {
    var element, dataAttrsConfig
    if (config) {
      element = config.initElement ? $(config.initElement) : $(config.element)
    }

    // 解析 data-api 时，只考虑用户传入的 element，不考虑来自继承或从模板构建的
    if (element && element[0] && !AutoRender.isDataApiOff(element)) {
      dataAttrsConfig = DAParser.parseElement(element)
    }

    return dataAttrsConfig
  },

  // 构建 this.element
  parseElement: function() {
    var element = this.element

    if (element) {
      this.element = $(element)
    }
    // 未传入 element 时，从 template 构建
    else if (this.get('template')) {
      this.parseElementFromTemplate()
    }

    // 如果对应的 DOM 元素不存在，则报错
    if (!this.element || !this.element[0]) {
      throw new Error('element is invalid')
    }
  },

  // 从模板中构建 this.element
  parseElementFromTemplate: function() {
    this.element = $(this.get('template'))
  },

  // 负责 properties 的初始化，提供给子类覆盖
  initProps: function() {
  },

  // 注册事件代理
  delegateEvents: function(element, events, handler) {
    var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

    // widget.delegateEvents()
    if (argus.length === 0) {
      events = getEvents(this)
      element = this.element
    }

    // widget.delegateEvents({
    //   'click p': 'fn1',
    //   'click li': 'fn2'
    // })
    else if (argus.length === 1) {
      events = element
      element = this.element
    }

    // widget.delegateEvents('click p', function(ev) { ... })
    else if (argus.length === 2) {
      handler = events
      events = element
      element = this.element
    }

    // widget.delegateEvents(element, 'click p', function(ev) { ... })
    else {
      element || (element = this.element)
      this._delegateElements || (this._delegateElements = [])
      this._delegateElements.push($(element))
    }

    // 'click p' => {'click p': handler}
    if (isString(events) && isFunction(handler)) {
      var o = {}
      o[events] = handler
      events = o
    }

    // key 为 'event selector'
    for (var key in events) {
      if (!events.hasOwnProperty(key)) continue

      var args = parseEventKey(key, this)
      var eventType = args.type
      var selector = args.selector

      ;(function(handler, widget) {

        var callback = function(ev) {
          if (isFunction(handler)) {
            handler.call(widget, ev)
          } else {
            widget[handler](ev)
          }
        }

        // delegate
        if (selector) {
          $(element).on(eventType, selector, callback)
        }
        // normal bind
        // 分开写是为了兼容 zepto，zepto 的判断不如 jquery 强劲有力
        else {
          $(element).on(eventType, callback)
        }

      })(events[key], this)
    }

    return this
  },

  // 卸载事件代理
  undelegateEvents: function(element, eventKey) {
    var argus = trimRightUndefine(Array.prototype.slice.call(arguments))

    if (!eventKey) {
      eventKey = element
      element = null
    }

    // 卸载所有
    // .undelegateEvents()
    if (argus.length === 0) {
      var type = DELEGATE_EVENT_NS + this.cid

      this.element && this.element.off(type)

      // 卸载所有外部传入的 element
      if (this._delegateElements) {
        for (var de in this._delegateElements) {
          if (!this._delegateElements.hasOwnProperty(de)) continue
          this._delegateElements[de].off(type)
        }
      }

    } else {
      var args = parseEventKey(eventKey, this)

      // 卸载 this.element
      // .undelegateEvents(events)
      if (!element) {
        this.element && this.element.off(args.type, args.selector)
      }

      // 卸载外部 element
      // .undelegateEvents(element, events)
      else {
        $(element).off(args.type, args.selector)
      }
    }
    return this
  },

  // 提供给子类覆盖的初始化方法
  setup: function() {
  },

  // 将 widget 渲染到页面上
  // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
  // 约定：子类覆盖时，需保持 `return this`
  render: function() {

    // 让渲染相关属性的初始值生效，并绑定到 change 事件
    if (!this.rendered) {
      this._renderAndBindAttrs()
      this.rendered = true
    }

    // 插入到文档流中
    var parentNode = this.get('parentNode')
    if (parentNode && !isInDocument(this.element[0])) {
      // 隔离样式，添加统一的命名空间
      // https://github.com/aliceui/aliceui.org/issues/9
      var outerBoxClass = this.constructor.outerBoxClass
      if (outerBoxClass) {
        var outerBox = this._outerBox = $('<div></div>').addClass(outerBoxClass)
        outerBox.append(this.element).appendTo(parentNode)
      } else {
        this.element.appendTo(parentNode)
      }
    }

    return this
  },

  // 让属性的初始值生效，并绑定到 change:attr 事件上
  _renderAndBindAttrs: function() {
    var widget = this
    var attrs = widget.attrs

    for (var attr in attrs) {
      if (!attrs.hasOwnProperty(attr)) continue
      var m = ON_RENDER + ucfirst(attr)

      if (this[m]) {
        var val = this.get(attr)

        // 让属性的初始值生效。注：默认空值不触发
        if (!isEmptyAttrValue(val)) {
          this[m](val, undefined, attr)
        }

        // 将 _onRenderXx 自动绑定到 change:xx 事件上
        (function(m) {
          widget.on('change:' + attr, function(val, prev, key) {
            widget[m](val, prev, key)
          })
        })(m)
      }
    }
  },

  _onRenderId: function(val) {
    this.element.attr('id', val)
  },

  _onRenderClassName: function(val) {
    this.element.addClass(val)
  },

  _onRenderStyle: function(val) {
    this.element.css(val)
  },

  // 让 element 与 Widget 实例建立关联
  _stamp: function() {
    var cid = this.cid

    ;(this.initElement || this.element).attr(DATA_WIDGET_CID, cid)
    cachedInstances[cid] = this
  },

  // 在 this.element 内寻找匹配节点
  $: function(selector) {
    return this.element.find(selector)
  },

  destroy: function() {
    this.undelegateEvents()
    delete cachedInstances[this.cid]

    // For memory leak
    if (this.element && this._isTemplate) {
      this.element.off()
      // 如果是 widget 生成的 element 则去除
      if (this._outerBox) {
        this._outerBox.remove()
      } else {
        this.element.remove()
      }
    }
    this.element = null

    Widget.superclass.destroy.call(this)
  }
})

// For memory leak
$(window).unload(function() {
  for(var cid in cachedInstances) {
    cachedInstances[cid].destroy()
  }
})

// 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
Widget.query = function(selector) {
  var element = $(selector).eq(0)
  var cid

  element && (cid = element.attr(DATA_WIDGET_CID))
  return cachedInstances[cid]
}

Widget.switchLocale = function(locale){
for(var cid in cachedInstances) {
    cachedInstances[cid].set('locale', locale)
  }
}


Widget.autoRender = AutoRender.autoRender
Widget.autoRenderAll = AutoRender.autoRenderAll
Widget.StaticsWhiteList = ['autoRender']

module.exports = Widget


// Helpers
// ------

var toString = Object.prototype.toString

function uniqueCid() {
	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
	}
	return 'widget-' + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4()
}

function isString(val) {
  return toString.call(val) === '[object String]'
}

function isFunction(val) {
  return toString.call(val) === '[object Function]'
}

// Zepto 上没有 contains 方法
var contains = $.contains || function(a, b) {
  //noinspection JSBitwiseOperatorUsage
  return !!(a.compareDocumentPosition(b) & 16)
}

function isInDocument(element) {
  return contains(document.documentElement, element)
}

function ucfirst(str) {
  return str.charAt(0).toUpperCase() + str.substring(1)
}


var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/
var EXPRESSION_FLAG = /{{([^}]+)}}/g
var INVALID_SELECTOR = 'INVALID_SELECTOR'

function getEvents(widget) {
  if (isFunction(widget.events)) {
    widget.events = widget.events()
  }
  return widget.events
}

function parseEventKey(eventKey, widget) {
  var match = eventKey.match(EVENT_KEY_SPLITTER)
  var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid

  // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
  var selector = match[2] || undefined

  if (selector && selector.indexOf('{{') > -1) {
    selector = parseExpressionInEventKey(selector, widget)
  }

  return {
    type: eventType,
    selector: selector
  }
}

// 解析 eventKey 中的 {{xx}}, {{yy}}
function parseExpressionInEventKey(selector, widget) {

  return selector.replace(EXPRESSION_FLAG, function(m, name) {
    var parts = name.split('.')
    var point = widget, part

    while (part = parts.shift()) {
      if (point === widget.attrs) {
        point = widget.get(part)
      } else {
        point = point[part]
      }
    }

    // 已经是 className，比如来自 dataset 的
    if (isString(point)) {
      return point
    }

    // 不能识别的，返回无效标识
    return INVALID_SELECTOR
  })
}


// 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
function isEmptyAttrValue(o) {
  return o == null || o === undefined
}

function trimRightUndefine(argus) {
  for (var i = argus.length - 1; i >= 0; i--) {
    if (argus[i] === undefined) {
      argus.pop()
    } else {
      break
    }
  }
  return argus
}


});


__include__['base/base'] = FNX.__clz__['fnx/cmp/base/base'];
__include__['$'] = $;
FNX.__clz__['fnx/cmp/widget/widget'] = __using__('widget/widget');

})(window);
/**===============================
component : position/position
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('position/position',function(__using__,exports,module){

// Position
// --------
// 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
// 代码易改，人生难得

var Position = exports,
    VIEWPORT = { _id: 'VIEWPORT', nodeType: 1 },
    $ = __include__["$"],
    isPinFixed = false,
    ua = (window.navigator.userAgent || "").toLowerCase(),
    isIE6 = ua.indexOf("msie 6") !== -1;


// 将目标元素相对于基准元素进行定位
// 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
Position.pin = function(pinObject, baseObject) {

    // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
    pinObject = normalize(pinObject);
    baseObject = normalize(baseObject);

    // if pinObject.element is not present
    // https://github.com/aralejs/position/pull/11
    if (pinObject.element === VIEWPORT ||
        pinObject.element._id === 'VIEWPORT') {
        return;
    }

    // 设定目标元素的 position 为绝对定位
    // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
    var pinElement = $(pinObject.element);

    if (pinElement.css('position') !== 'fixed' || isIE6) {
        pinElement.css('position', 'absolute');
        isPinFixed = false;
    }
    else {
        // 定位 fixed 元素的标志位，下面有特殊处理
        isPinFixed = true;
    }

    // 将位置属性归一化为数值
    // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
    //    否则获取的宽高有可能不对
    posConverter(pinObject);
    posConverter(baseObject);

    var parentOffset = getParentOffset(pinElement);
    var baseOffset = baseObject.offset();

    // 计算目标元素的位置
    var top = baseOffset.top + baseObject.y -
            pinObject.y - parentOffset.top;

    var left = baseOffset.left + baseObject.x -
            pinObject.x - parentOffset.left;

    // 定位目标元素
    pinElement.css({ left: left, top: top });
};


// 将目标元素相对于基准元素进行居中定位
// 接受两个参数，分别为目标元素和定位的基准元素，都是 DOM 节点类型
Position.center = function(pinElement, baseElement) {
    Position.pin({
        element: pinElement,
        x: '50%',
        y: '50%'
    }, {
        element: baseElement,
        x: '50%',
        y: '50%'
    });
};


// 这是当前可视区域的伪 DOM 节点
// 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
Position.VIEWPORT = VIEWPORT;


// Helpers
// -------

// 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
function normalize(posObject) {
    posObject = toElement(posObject) || {};

    if (posObject.nodeType) {
        posObject = { element: posObject };
    }

    var element = toElement(posObject.element) || VIEWPORT;
    if (element.nodeType !== 1) {
        throw new Error('posObject.element is invalid.');
    }

    var result = {
        element: element,
        x: posObject.x || 0,
        y: posObject.y || 0
    };

    // config 的深度克隆会替换掉 Position.VIEWPORT, 导致直接比较为 false
    var isVIEWPORT = (element === VIEWPORT || element._id === 'VIEWPORT');

    // 归一化 offset
    result.offset = function() {
        // 若定位 fixed 元素，则父元素的 offset 没有意义
        if (isPinFixed) {
            return {
                left: 0,
                top: 0
            };
        }
        else if (isVIEWPORT) {
            return {
                left: $(document).scrollLeft(),
                top: $(document).scrollTop()
            };
        }
        else {
            return getOffset($(element)[0]);
        }
    };

    // 归一化 size, 含 padding 和 border
    result.size = function() {
        var el = isVIEWPORT ? $(window) : $(element);
        return {
            width: el.outerWidth(),
            height: el.outerHeight()
        };
    };

    return result;
}

// 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
function posConverter(pinObject) {
    pinObject.x = xyConverter(pinObject.x, pinObject, 'width');
    pinObject.y = xyConverter(pinObject.y, pinObject, 'height');
}

// 处理 x, y 值，都转化为数字
function xyConverter(x, pinObject, type) {
    // 先转成字符串再说！好处理
    x = x + '';

    // 处理 px
    x = x.replace(/px/gi, '');

    // 处理 alias
    if (/\D/.test(x)) {
        x = x.replace(/(?:top|left)/gi, '0%')
             .replace(/center/gi, '50%')
             .replace(/(?:bottom|right)/gi, '100%');
    }

    // 将百分比转为像素值
    if (x.indexOf('%') !== -1) {
        //支持小数
        x = x.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
            return pinObject.size()[type] * (d / 100.0);
        });
    }

    // 处理类似 100%+20px 的情况
    if (/[+\-*\/]/.test(x)) {
        try {
            // eval 会影响压缩
            // new Function 方法效率高于 for 循环拆字符串的方法
            // 参照：http://jsperf.com/eval-newfunction-for
            x = (new Function('return ' + x))();
        } catch (e) {
            throw new Error('Invalid position value: ' + x);
        }
    }

    // 转回为数字
    return numberize(x);
}

// 获取 offsetParent 的位置
function getParentOffset(element) {
    var parent = element.offsetParent();

    // IE7 下，body 子节点的 offsetParent 为 html 元素，其 offset 为
    // { top: 2, left: 2 }，会导致定位差 2 像素，所以这里将 parent
    // 转为 document.body
    if (parent[0] === document.documentElement) {
        parent = $(document.body);
    }

    // 修正 ie6 下 absolute 定位不准的 bug
    if (isIE6) {
        parent.css('zoom', 1);
    }

    // 获取 offsetParent 的 offset
    var offset;

    // 当 offsetParent 为 body，
    // 而且 body 的 position 是 static 时
    // 元素并不按照 body 来定位，而是按 document 定位
    // http://jsfiddle.net/afc163/hN9Tc/2/
    // 因此这里的偏移值直接设为 0 0
    if (parent[0] === document.body &&
        parent.css('position') === 'static') {
            offset = { top:0, left: 0 };
    } else {
        offset = getOffset(parent[0]);
    }

    // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
    offset.top += numberize(parent.css('border-top-width'));
    offset.left += numberize(parent.css('border-left-width'));

    return offset;
}

function numberize(s) {
    return parseFloat(s, 10) || 0;
}

function toElement(element) {
    return $(element)[0];
}

// fix jQuery 1.7.2 offset
// document.body 的 position 是 absolute 或 relative 时
// jQuery.offset 方法无法正确获取 body 的偏移值
//   -> http://jsfiddle.net/afc163/gMAcp/
// jQuery 1.9.1 已经修正了这个问题
//   -> http://jsfiddle.net/afc163/gMAcp/1/
// 这里先实现一份
// 参照 kissy 和 jquery 1.9.1
//   -> https://github.com/kissyteam/kissy/blob/master/src/dom/sub-modules/base/src/base/offset.js#L366
//   -> https://github.com/jquery/jquery/blob/1.9.1/src/offset.js#L28
function getOffset(element) {
    var box = element.getBoundingClientRect(),
        docElem = document.documentElement;

    // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
    return {
        left: box.left + (window.pageXOffset || docElem.scrollLeft) -
              (docElem.clientLeft || document.body.clientLeft  || 0),
        top: box.top  + (window.pageYOffset || docElem.scrollTop) -
             (docElem.clientTop || document.body.clientTop  || 0)
    };
}


});


__include__['$'] = $;
FNX.__clz__['fnx/cmp/position/position'] = __using__('position/position');

})(window);
/**===============================
component : templatable/templatable
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('templatable/engine',function(__using__,exports,module){

/*!
 * artTemplate - Template Engine
 * https://github.com/aui/artTemplate
 * Released under the MIT, BSD, and GPL Licenses
 */

/**
 * 模板引擎
 * @name    template
 * @param   {String}            模板名
 * @param   {Object, String}    数据。如果为字符串则编译并缓存编译结果
 * @return  {String, Function}  渲染好的HTML字符串或者渲染方法
 */
var template = function (filename, content) {
    return typeof content === 'string'
    ?   compile(content, {
            filename: filename
        })
    :   renderFile(filename, content);
};


template.version = '3.0.0';


/**
 * 设置全局配置
 * @name    template.config
 * @param   {String}    名称
 * @param   {Any}       值
 */
template.config = function (name, value) {
    defaults[name] = value;
};



var defaults = template.defaults = {
    openTag: '<%',    // 逻辑语法开始标签
    closeTag: '%>',   // 逻辑语法结束标签
    escape: true,     // 是否编码输出变量的 HTML 字符
    cache: true,      // 是否开启缓存（依赖 options 的 filename 字段）
    compress: false,  // 是否压缩输出
    parser: null      // 自定义语法格式器 @see: template-syntax.js
};


var cacheStore = template.cache = {};


/**
 * 渲染模板
 * @name    template.render
 * @param   {String}    模板
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
template.render = function (source, options) {
    return compile(source, options);
};


/**
 * 渲染模板(根据模板名)
 * @name    template.render
 * @param   {String}    模板名
 * @param   {Object}    数据
 * @return  {String}    渲染好的字符串
 */
var renderFile = template.renderFile = function (filename, data) {
    var fn = template.get(filename) || showDebugInfo({
        filename: filename,
        name: 'Render Error',
        message: 'Template not found'
    });
    return data ? fn(data) : fn;
};


/**
 * 获取编译缓存（可由外部重写此方法）
 * @param   {String}    模板名
 * @param   {Function}  编译好的函数
 */
template.get = function (filename) {

    var cache;

    if (cacheStore[filename]) {
        // 使用内存缓存
        cache = cacheStore[filename];
    } else if (typeof document === 'object') {
        // 加载模板并编译
        var elem = document.getElementById(filename);

        if (elem) {
            var source = (elem.value || elem.innerHTML)
            .replace(/^\s*|\s*$/g, '');
            cache = compile(source, {
                filename: filename
            });
        }
    }

    return cache;
};


var toString = function (value, type) {

    if (typeof value !== 'string') {

        type = typeof value;
        if (type === 'number') {
            value += '';
        } else if (type === 'function') {
            value = toString(value.call(value));
        } else {
            value = '';
        }
    }

    return value;

};


var escapeMap = {
    "<": "&#60;",
    ">": "&#62;",
    '"': "&#34;",
    "'": "&#39;",
    "&": "&#38;"
};


var escapeFn = function (s) {
    return escapeMap[s];
};

var escapeHTML = function (content) {
    return toString(content)
    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
};


var isArray = Array.isArray || function (obj) {
    return ({}).toString.call(obj) === '[object Array]';
};


var each = function (data, callback) {
    var i, len;
    if (isArray(data)) {
        for (i = 0, len = data.length; i < len; i++) {
            callback.call(data, data[i], i, data);
        }
    } else {
        for (i in data) {
            callback.call(data, data[i], i);
        }
    }
};


var utils = template.utils = {

	$helpers: {},

    $include: renderFile,

    $string: toString,

    $escape: escapeHTML,

    $each: each

};/**
 * 添加模板辅助方法
 * @name    template.helper
 * @param   {String}    名称
 * @param   {Function}  方法
 */
template.helper = function (name, helper) {
    helpers[name] = helper;
};

var helpers = template.helpers = utils.$helpers;




/**
 * 模板错误事件（可由外部重写此方法）
 * @name    template.onerror
 * @event
 */
template.onerror = function (e) {
    var message = 'Template Error\n\n';
    for (var name in e) {
        message += '<' + name + '>\n' + e[name] + '\n\n';
    }

    if (typeof console === 'object') {
        console.error(message);
    }
};


// 模板调试器
var showDebugInfo = function (e) {

    template.onerror(e);

    return function () {
        return '{Template Error}';
    };
};


/**
 * 编译模板
 * 2012-6-6 @TooBug: define 方法名改为 compile，与 Node Express 保持一致
 * @name    template.compile
 * @param   {String}    模板字符串
 * @param   {Object}    编译选项
 *
 *      - openTag       {String}
 *      - closeTag      {String}
 *      - filename      {String}
 *      - escape        {Boolean}
 *      - compress      {Boolean}
 *      - debug         {Boolean}
 *      - cache         {Boolean}
 *      - parser        {Function}
 *
 * @return  {Function}  渲染方法
 */
var compile = template.compile = function (source, options) {

    // 合并默认配置
    options = options || {};
    for (var name in defaults) {
        if (options[name] === undefined) {
            options[name] = defaults[name];
        }
    }


    var filename = options.filename;


    try {

        var Render = compiler(source, options);

    } catch (e) {

        e.filename = filename || 'anonymous';
        e.name = 'Syntax Error';

        return showDebugInfo(e);

    }


    // 对编译结果进行一次包装

    function render (data) {

        try {

            return new Render(data, filename) + '';

        } catch (e) {

            // 运行时出错后自动开启调试模式重新编译
            if (!options.debug) {
                options.debug = true;
                return compile(source, options)(data);
            }

            return showDebugInfo(e)();

        }

    }


    render.prototype = Render.prototype;
    render.toString = function () {
        return Render.toString();
    };


    if (filename && options.cache) {
        cacheStore[filename] = render;
    }


    return render;

};




// 数组迭代
var forEach = utils.$each;


// 静态分析模板变量
var KEYWORDS =
    // 关键字
    'break,case,catch,continue,debugger,default,delete,do,else,false'
    + ',finally,for,function,if,in,instanceof,new,null,return,switch,this'
    + ',throw,true,try,typeof,var,void,while,with'

    // 保留字
    + ',abstract,boolean,byte,char,class,const,double,enum,export,extends'
    + ',final,float,goto,implements,import,int,interface,long,native'
    + ',package,private,protected,public,short,static,super,synchronized'
    + ',throws,transient,volatile'

    // ECMA 5 - use strict
    + ',arguments,let,yield'

    + ',undefined';

var REMOVE_RE = /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
var SPLIT_RE = /[^\w$]+/g;
var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"].join('|'), 'g');
var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
var BOUNDARY_RE = /^,+|,+$/g;
var SPLIT2_RE = /^$|,+/;


// 获取变量
function getVariable (code) {
    return code
    .replace(REMOVE_RE, '')
    .replace(SPLIT_RE, ',')
    .replace(KEYWORDS_RE, '')
    .replace(NUMBER_RE, '')
    .replace(BOUNDARY_RE, '')
    .split(SPLIT2_RE);
};


// 字符串转义
function stringify (code) {
    return "'" + code
    // 单引号与反斜杠转义
    .replace(/('|\\)/g, '\\$1')
    // 换行符转义(windows + linux)
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n') + "'";
}


function compiler (source, options) {

    var debug = options.debug;
    var openTag = options.openTag;
    var closeTag = options.closeTag;
    var parser = options.parser;
    var compress = options.compress;
    var escape = options.escape;



    var line = 1;
    var uniq = {$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1};



    var isNewEngine = ''.trim;// '__proto__' in {}
    var replaces = isNewEngine
    ? ["$out='';", "$out+=", ";", "$out"]
    : ["$out=[];", "$out.push(", ");", "$out.join('')"];

    var concat = isNewEngine
        ? "$out+=text;return $out;"
        : "$out.push(text);";

    var print = "function(){"
    +      "var text=''.concat.apply('',arguments);"
    +       concat
    +  "}";

    var include = "function(filename,data){"
    +      "data=data||$data;"
    +      "var text=$utils.$include(filename,data,$filename);"
    +       concat
    +   "}";

    var headerCode = "'use strict';"
    + "var $utils=this,$helpers=$utils.$helpers,"
    + (debug ? "$line=0," : "");

    var mainCode = replaces[0];

    var footerCode = "return new String(" + replaces[3] + ");"

    // html与逻辑语法分离
    forEach(source.split(openTag), function (code) {
        code = code.split(closeTag);

        var $0 = code[0];
        var $1 = code[1];

        // code: [html]
        if (code.length === 1) {

            mainCode += html($0);

        // code: [logic, html]
        } else {

            mainCode += logic($0);

            if ($1) {
                mainCode += html($1);
            }
        }


    });

    var code = headerCode + mainCode + footerCode;

    // 调试语句
    if (debug) {
        code = "try{" + code + "}catch(e){"
        +       "throw {"
        +           "filename:$filename,"
        +           "name:'Render Error',"
        +           "message:e.message,"
        +           "line:$line,"
        +           "source:" + stringify(source)
        +           ".split(/\\n/)[$line-1].replace(/^\\s+/,'')"
        +       "};"
        + "}";
    }



    try {


        var Render = new Function("$data", "$filename", code);
        Render.prototype = utils;

        return Render;

    } catch (e) {
        e.temp = "function anonymous($data,$filename) {" + code + "}";
        throw e;
    }




    // 处理 HTML 语句
    function html (code) {

        // 记录行号
        line += code.split(/\n/).length - 1;

        // 压缩多余空白与注释
        if (compress) {
            code = code
            .replace(/\s+/g, ' ')
            .replace(/<!--[\w\W]*?-->/g, '');
        }

        if (code) {
            code = replaces[1] + stringify(code) + replaces[2] + "\n";
        }

        return code;
    }


    // 处理逻辑语句
    function logic (code) {

        var thisLine = line;

        if (parser) {

             // 语法转换插件钩子
            code = parser(code, options);

        } else if (debug) {

            // 记录行号
            code = code.replace(/\n/g, function () {
                line ++;
                return "$line=" + line +  ";";
            });

        }


        // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
        // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
        if (code.indexOf('=') === 0) {

            var escapeSyntax = escape && !/^=[=#]/.test(code);

            code = code.replace(/^=[=#]?|[\s;]*$/g, '');

            // 对内容编码
            if (escapeSyntax) {

                var name = code.replace(/\s*\([^\)]+\)/, '');

                // 排除 utils.* | include | print

                if (!utils[name] && !/^(include|print)$/.test(name)) {
                    code = "$escape(" + code + ")";
                }

            // 不编码
            } else {
                code = "$string(" + code + ")";
            }


            code = replaces[1] + code + replaces[2];

        }

        if (debug) {
            code = "$line=" + thisLine + ";" + code;
        }

        // 提取模板中的变量名
        forEach(getVariable(code), function (name) {

            // name 值可能为空，在安卓低版本浏览器下
            if (!name || uniq[name]) {
                return;
            }

            var value;

            // 声明模板变量
            // 赋值优先级:
            // [include, print] > utils > helpers > data
            if (name === 'print') {

                value = print;

            } else if (name === 'include') {

                value = include;

            } else if (utils[name]) {

                value = "$utils." + name;

            } else if (helpers[name]) {

                value = "$helpers." + name;

            } else {

                value = "$data." + name;
            }

            headerCode += name + "=" + value + ",";
            uniq[name] = true;


        });

        return code + "\n";
    }


};



// 定义模板引擎的语法


defaults.openTag = '{{';
defaults.closeTag = '}}';


var filtered = function (js, filter) {
    var parts = filter.split(':');
    var name = parts.shift();
    var args = parts.join(':') || '';

    if (args) {
        args = ', ' + args;
    }

    return '$helpers.' + name + '(' + js + args + ')';
}


defaults.parser = function (code, options) {

    // var match = code.match(/([\w\$]*)(\b.*)/);
    // var key = match[1];
    // var args = match[2];
    // var split = args.split(' ');
    // split.shift();

    code = code.replace(/^\s/, '');

    var split = code.split(' ');
    var key = split.shift();
    var args = split.join(' ');



    switch (key) {

        case 'if':

            code = 'if(' + args + '){';
            break;

        case 'else':

            if (split.shift() === 'if') {
                split = ' if(' + split.join(' ') + ')';
            } else {
                split = '';
            }

            code = '}else' + split + '{';
            break;

        case '/if':

            code = '}';
            break;

        case 'each':

            var object = split[0] || '$data';
            var as     = split[1] || 'as';
            var value  = split[2] || '$value';
            var index  = split[3] || '$index';

            var param   = value + ',' + index;

            if (as !== 'as') {
                object = '[]';
            }

            code =  '$each(' + object + ',function(' + param + '){';
            break;

        case '/each':

            code = '});';
            break;

        case 'echo':

            code = 'print(' + args + ');';
            break;

        case 'print':
        case 'include':

            code = key + '(' + split.join(',') + ');';
            break;

        default:

            // 过滤器（辅助方法）
            // {{value | filterA:'abcd' | filterB}}
            // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
            // TODO: {{ddd||aaa}} 不包含空格
            if (/^\s*\|\s*[\w\$]/.test(args)) {

                var escape = true;

                // {{#value | link}}
                if (code.indexOf('#') === 0) {
                    code = code.substr(1);
                    escape = false;
                }

                var i = 0;
                var array = code.split('|');
                var len = array.length;
                var val = array[i++];

                for (; i < len; i ++) {
                    val = filtered(val, array[i]);
                }

                code = (escape ? '=' : '=#') + val;

            // 即将弃用 {{helperName value}}
            } else if (template.helpers[key]) {

                code = '=#' + key + '(' + split.join(',') + ');';

            // 内容直接输出 {{value}}
            } else {

                code = '=' + code;
            }

            break;
    }


    return code;
};

module.exports = template;

});

__namespace__('templatable/templatable',function(__using__,exports,module){

var TemplateEngine = __using__("templatable/engine");

var compiledTemplates = {};

// 提供 Template 模板支持
module.exports = {

	// template 对应的 DOM-like object
	templateObject: null,

	// 根据配置的模板和传入的数据，构建 this.element 和 templateElement
	parseElementFromTemplate: function () {
		// template 支持 id 选择器
		var t, template = this.get('template');
		if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
			template = t.innerHTML;
			this.set('template', template);
		}
		this.templateObject = convertTemplateToObject(template);
		this.element = $(this.compile());
	},

	// 编译模板，混入数据，返回 html 结果
	compile: function (template, model) {
		template || (template = this.get('template'));

		model || (model = this.get('model')) || (model = {});

		if (model.toJSON) model = model.toJSON();

		var compiledTemplate = compiledTemplates[template];
		if (!compiledTemplate) {
			compiledTemplate = compiledTemplates[template] = TemplateEngine.compile(template);
		}

		// 生成 html
		var html = compiledTemplate(model);

		return html;
	},

	// 刷新 selector 指定的局部区域
	renderPartial: function (selector) {
		if (this.templateObject) {
			var template = convertObjectToTemplate(this.templateObject, selector);

			if (template) {
				if (selector) {
					this.$(selector).html(this.compile(template));
				} else {
					this.element.html(this.compile(template));
				}
			} else {
				this.element.html(this.compile());
			}
		}

		// 如果 template 已经编译过了，templateObject 不存在
		else {
			var all = $(this.compile());
			var selected = all.find(selector);
			if (selected.length) {
				this.$(selector).html(selected.html());
			} else {
				this.element.html(all.html());
			}
		}

		return this;
	}
};

// Helpers
// -------


// 将 template 字符串转换成对应的 DOM-like object
function convertTemplateToObject(template) {
	return isFunction(template) ? null : $(encode(template));
}

// 根据 selector 得到 DOM-like template object，并转换为 template 字符串
function convertObjectToTemplate(templateObject, selector) {
	if (!templateObject) return;

	var element;
	if (selector) {
		element = templateObject.find(selector);
		if (element.length === 0) {
			throw new Error('Invalid template selector: ' + selector);
		}
	} else {
		element = templateObject;
	}
	return decode(element.html());
}


function encode(template) {
	return template
	// 替换 {{xxx}} 为 <!-- {{xxx}} -->
	.replace(/({[^}]+}})/g, '<!--$1-->')
	// 替换 src="{{xxx}}" 为 data-TEMPLATABLE-src="{{xxx}}"
	.replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g, ' data-templatable-$1=$2$3$2');
}

function decode(template) {
	return template.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, '$1').replace(/data-templatable-/ig, '');
}

var toString = Object.prototype.toString

var isFunction = function(val) {
	return toString.call(val) === '[object Function]'
}


// 调用 renderPartial 时，Templatable 对模板有一个约束：
// ** template 自身必须是有效的 html 代码片段**，比如
//   1. 代码闭合
//   2. 嵌套符合规范
//
// 总之，要保证在 template 里，将 `{{...}}` 转换成注释后，直接 innerHTML 插入到
// DOM 中，浏览器不会自动增加一些东西。比如：
//
// tbody 里没有 tr：
//  `<table><tbody>{{#each items}}<td>{{this}}</td>{{/each}}</tbody></table>`
//
// 标签不闭合：
//  `<div><span>{{name}}</div>`

});


FNX.__clz__['fnx/cmp/templatable/templatable'] = __using__('templatable/templatable');

})(window);
/**===============================
component : easing/easing
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('easing/easing',function(__using__,exports,module){

// Based on Easing Equations (c) 2003 Robert Penner, all rights reserved.
// This work is subject to the terms in
// http://www.robertpenner.com/easing_terms_of_use.html
// Preview: http://www.robertpenner.com/Easing/easing_demo.html
//
// Thanks to:
//  - https://github.com/yui/yui3/blob/master/src/anim/js/anim-easing.js
//  - https://github.com/gilmoreorless/jquery-easing-molecules


var PI = Math.PI;
var pow = Math.pow;
var sin = Math.sin;
var MAGIC_NUM = 1.70158; // Penner's magic number


/**
 * 和 YUI 的 Easing 相比，这里的 Easing 进行了归一化处理，参数调整为：
 * @param {Number} t Time value used to compute current value 0 =< t <= 1
 * @param {Number} b Starting value  b = 0
 * @param {Number} c Delta between start and end values  c = 1
 * @param {Number} d Total length of animation d = 1
 */
var Easing = {

    /**
     * Uniform speed between points.
     */
    easeNone: function(t) {
        return t;
    },

    /**
     * Begins slowly and accelerates towards end. (quadratic)
     */
    easeIn: function(t) {
        return t * t;
    },

    /**
     * Begins quickly and decelerates towards end.  (quadratic)
     */
    easeOut: function(t) {
        return (2 - t) * t;
    },

    /**
     * Begins slowly and decelerates towards end. (quadratic)
     */
    easeBoth: function(t) {
        return (t *= 2) < 1 ?
                .5 * t * t :
                .5 * (1 - (--t) * (t - 2));
    },

    /**
     * Begins slowly and accelerates towards end. (quartic)
     */
    easeInStrong: function(t) {
        return t * t * t * t;
    },
    /**
     * Begins quickly and decelerates towards end.  (quartic)
     */
    easeOutStrong: function(t) {
        return 1 - (--t) * t * t * t;
    },

    /**
     * Begins slowly and decelerates towards end. (quartic)
     */
    easeBothStrong: function(t) {
        return (t *= 2) < 1 ?
                .5 * t * t * t * t :
                .5 * (2 - (t -= 2) * t * t * t);
    },

    /**
     * Backtracks slightly, then reverses direction and moves to end.
     */
    backIn: function(t) {
        if (t === 1) t -= .001;
        return t * t * ((MAGIC_NUM + 1) * t - MAGIC_NUM);
    },

    /**
     * Overshoots end, then reverses and comes back to end.
     */
    backOut: function(t) {
        return (t -= 1) * t * ((MAGIC_NUM + 1) * t + MAGIC_NUM) + 1;
    },

    /**
     * Backtracks slightly, then reverses direction, overshoots end,
     * then reverses and comes back to end.
     */
    backBoth: function(t) {
        var s = MAGIC_NUM;
        var m = (s *= 1.525) + 1;

        if ((t *= 2 ) < 1) {
            return .5 * (t * t * (m * t - s));
        }
        return .5 * ((t -= 2) * t * (m * t + s) + 2);
    },

    /**
     * Snap in elastic effect.
     */
    elasticIn: function(t) {
        var p = .3, s = p / 4;
        if (t === 0 || t === 1) return t;
        return -(pow(2, 10 * (t -= 1)) * sin((t - s) * (2 * PI) / p));
    },

    /**
     * Snap out elastic effect.
     */
    elasticOut: function(t) {
        var p = .3, s = p / 4;
        if (t === 0 || t === 1) return t;
        return pow(2, -10 * t) * sin((t - s) * (2 * PI) / p) + 1;
    },

    /**
     * Snap both elastic effect.
     */
    elasticBoth: function(t) {
        var p = .45, s = p / 4;
        if (t === 0 || (t *= 2) === 2) return t;

        if (t < 1) {
            return -.5 * (pow(2, 10 * (t -= 1)) *
                    sin((t - s) * (2 * PI) / p));
        }
        return pow(2, -10 * (t -= 1)) *
                sin((t - s) * (2 * PI) / p) * .5 + 1;
    },

    /**
     * Bounce off of start.
     */
    bounceIn: function(t) {
        return 1 - Easing.bounceOut(1 - t);
    },

    /**
     * Bounces off end.
     */
    bounceOut: function(t) {
        var s = 7.5625, r;

        if (t < (1 / 2.75)) {
            r = s * t * t;
        }
        else if (t < (2 / 2.75)) {
            r = s * (t -= (1.5 / 2.75)) * t + .75;
        }
        else if (t < (2.5 / 2.75)) {
            r = s * (t -= (2.25 / 2.75)) * t + .9375;
        }
        else {
            r = s * (t -= (2.625 / 2.75)) * t + .984375;
        }

        return r;
    },

    /**
     * Bounces off start and end.
     */
    bounceBoth: function(t) {
        if (t < .5) {
            return Easing.bounceIn(t * 2) * .5;
        }
        return Easing.bounceOut(t * 2 - 1) * .5 + .5;
    }
};

// 可以通过 require 获取
module.exports = Easing;


// 也可以直接通过 jQuery.easing 来使用
var $ = __include__["$"];
$.extend($.easing, Easing);


});


__include__['$'] = $;
FNX.__clz__['fnx/cmp/easing/easing'] = __using__('easing/easing');

})(window);
/**===============================
component : iframe-shim/iframe-shim
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('iframe-shim/iframe-shim',function(__using__,exports,module){

var $ = __include__["$"];
var Position = __include__["position/position"];

var isIE6 = (window.navigator.userAgent || '').toLowerCase().indexOf('msie 6') !== -1;

// target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
function Shim(target) {
    // 如果选择器选了多个 DOM，则只取第一个
    this.target = $(target).eq(0);
}

// 根据目标元素计算 iframe 的显隐、宽高、定位
Shim.prototype.sync = function() {
    var target = this.target;
    var iframe = this.iframe;

    // 如果未传 target 则不处理
    if (!target.length) return this;

    var height = target.outerHeight();
    var width = target.outerWidth();

    // 如果目标元素隐藏，则 iframe 也隐藏
    // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
    // http://api.jquery.com/hidden-selector/
    if (!height || !width || target.is(':hidden')) {
        iframe && iframe.hide();
    } else {
        // 第一次显示时才创建：as lazy as possible
        iframe || (iframe = this.iframe = createIframe(target));

        iframe.css({
            'height': height,
            'width': width
        });

        Position.pin(iframe[0], target[0]);
        iframe.show();
    }

    return this;
};

// 销毁 iframe 等
Shim.prototype.destroy = function() {
    if (this.iframe) {
        this.iframe.remove();
        delete this.iframe;
    }
    delete this.target;
};

if (isIE6) {
    module.exports = Shim;
} else {
    // 除了 IE6 都返回空函数
    function Noop() {}

    Noop.prototype.sync = function() {return this};
    Noop.prototype.destroy = Noop;

    module.exports = Noop;
}

// Helpers

// 在 target 之前创建 iframe，这样就没有 z-index 问题
// iframe 永远在 target 下方
function createIframe(target) {
    var css = {
        display: 'none',
        border: 'none',
        opacity: 0,
        position: 'absolute'
    };

    // 如果 target 存在 zIndex 则设置
    var zIndex = target.css('zIndex');
    if (zIndex && zIndex > 0) {
        css.zIndex = zIndex - 1;
    }

    return $('<iframe>', {
        src: 'javascript:\'\'', // 不加的话，https 下会弹警告
        frameborder: 0,
        css: css
    }).insertBefore(target);
}


});


__include__['$'] = $;
__include__['position/position'] = FNX.__clz__['fnx/cmp/position/position'];
FNX.__clz__['fnx/cmp/iframe-shim/iframe-shim'] = __using__('iframe-shim/iframe-shim');

})(window);
/**===============================
component : overlay/overlay
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('overlay/overlay',function(__using__,exports,module){

var $ = __include__["$"],
    Position = __include__["position/position"],
    Shim = __include__["iframe-shim/iframe-shim"],
    Widget = __include__["widget/widget"];


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
    // 加载 iframe 遮罩层并与 overlay 保持同步
    this._setupShim();
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
    erase(this, Overlay.blurOverlays);
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

  // 加载 iframe 遮罩层并与 overlay 保持同步
  _setupShim: function () {
    var shim = new Shim(this.element);

    // 在隐藏和设置位置后，要重新定位
    // 显示后会设置位置，所以不用绑定 shim.sync
    this.after('hide _setPosition', shim.sync, shim);

    // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
    var attrs = ['width', 'height'];
    for (var attr in attrs) {
      if (attrs.hasOwnProperty(attr)) {
        this.on('change:' + attr, shim.sync, shim);
      }
    }

    // 在销魂自身前要销毁 shim
    this.before('destroy', shim.destroy, shim);
  },

  // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
  _setupResize: function () {
    Overlay.allOverlays.push(this);
    this.on('windowResize', this._onWindowResize);
  },

  // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
  _blurHide: function (arr) {
    arr = $.makeArray(arr);
    arr.push(this.element);
    this._relativeElements = arr;
    Overlay.blurOverlays.push(this);
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

// 绑定 blur 隐藏事件
Overlay.blurOverlays = [];
$(document).on('click', function (e) {
  hideBlurOverlays(e);
});

// 绑定 resize 重新定位事件
var timeout;
var winWidth = $(window).width();
var winHeight = $(window).height();
Overlay.allOverlays = [];

$(window).resize(function () {
  timeout && clearTimeout(timeout);
  timeout = setTimeout(function () {
    var winNewWidth = $(window).width();
    var winNewHeight = $(window).height();

    // IE678 莫名其妙触发 resize
    // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
    if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
      $(Overlay.allOverlays).each(function (i, item) {
        item.trigger('windowResize', winNewWidth, winNewHeight);
      });
    }

    winWidth = winNewWidth;
    winHeight = winNewHeight;
  }, 80);
});

module.exports = Overlay;


// Helpers
// -------

function isInDocument(element) {
  return $.contains(document.documentElement, element);
}

function hideBlurOverlays(e) {
  $(Overlay.blurOverlays).each(function (index, item) {
    // 当实例为空或隐藏时，不处理
    if (!item || !item.get('visible')) {
      return;
    }

    // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
    for (var i = 0; i < item._relativeElements.length; i++) {
      var el = $(item._relativeElements[i])[0];
      if (el === e.target || $.contains(el, e.target)) {
        return;
      }
    }

    // 到这里，判断触发了元素的 blur 事件，隐藏元素
    item.hide();
  });
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


});


__include__['$'] = $;
__include__['position/position'] = FNX.__clz__['fnx/cmp/position/position'];
__include__['iframe-shim/iframe-shim'] = FNX.__clz__['fnx/cmp/iframe-shim/iframe-shim'];
__include__['widget/widget'] = FNX.__clz__['fnx/cmp/widget/widget'];
FNX.__clz__['fnx/cmp/overlay/overlay'] = __using__('overlay/overlay');

})(window);
/**===============================
component : overlay/mask
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('overlay/mask',function(__using__,exports,module){

var $ = __include__["$"],
  Overlay = __include__["overlay/overlay"],
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

});


__include__['$'] = $;
__include__['overlay/overlay'] = FNX.__clz__['fnx/cmp/overlay/overlay'];
FNX.__clz__['fnx/cmp/overlay/mask'] = __using__('overlay/mask');

})(window);
/**===============================
component : popup/popup
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('popup/popup',function(__using__,exports,module){

var $ = __include__["$"],
    Overlay = __include__["overlay/overlay"],
    OverlayMask = __include__["overlay/mask"];

var mask = null;

// Popup
// ---
// Popup 是通用弹出层组件，提供遮罩层、内容区域自定义功能。
// 是所有弹出层类型组件的基类。

var Popup = Overlay.extend({
	attrs : {
		// 是否有背景遮罩层
		hasMask: false,

		// 设置遮罩背景颜色
		maskBackgroundColor: '#000',

		// 设置遮罩透明度
		maskBackgroundOpacity: 0.2,

		// 默认宽度
		width: null,

		// 默认高度
		height: null,

		// 不用解释了吧
		zIndex: 999,

		// 简单的动画效果 none | fade
		effect: 'none',

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

	destroy: function () {
		this.element.remove();
		this._hideMask();
		return Popup.superclass.destroy.call(this);
	},

	setup: function () {
		//加载全局遮罩
		if (!mask) {
			mask = new OverlayMask();
			//设置Mask的tabindex
			toTabed(mask.element,0);
		}

		Popup.superclass.setup.call(this);

		this._setupMask();
		this._setupFocus();
		toTabed(this.element);
	},

	// 绑定遮罩层事件
	_setupMask: function () {
		var that = this;

		// 存放 mask 对应的对话框
		mask._dialogs = mask._dialogs || [];

		this.after('show', function () {
			if (!this.get('hasMask')) {
				return;
			}
			// not using the z-index
			// because multiable dialogs may share same mask
			mask.set('zIndex', that.get('zIndex'))
				.set('backgroundColor', that.get('maskBackgroundColor'))
				.set('backgroundOpacity', that.get('maskBackgroundOpacity'))
				.show();
			mask.element.insertBefore(that.element);

			// 避免重复存放
			var existed;
			for (var i=0; i<mask._dialogs.length; i++) {
				if (mask._dialogs[i] === that) {
					existed = mask._dialogs[i];
				}
			}
			if (existed) {
				// 把已存在的对话框提到最后一个
				erase(existed, mask._dialogs);
				mask._dialogs.push(existed);
			} else {
				// 存放新的对话框
				mask._dialogs.push(that);
			}
		});

		this.after('hide', this._hideMask);
	},

	// 隐藏 mask
	_hideMask: function () {
		if (!this.get('hasMask')) {
			return;
		}

		// 移除 mask._dialogs 当前实例对应的 dialog
		var dialogLength = mask._dialogs ? mask._dialogs.length : 0;
		for (var i=0; i<dialogLength; i++) {
			if (mask._dialogs[i] === this) {
				erase(this, mask._dialogs);

				// 如果 _dialogs 为空了，表示没有打开的 dialog 了
				// 则隐藏 mask
				if (mask._dialogs.length === 0) {
					mask.hide();
				}
				// 如果移除的是最后一个打开的 dialog
				// 则相应向下移动 mask
				else if (i === dialogLength - 1) {
					var last = mask._dialogs[mask._dialogs.length - 1];
					mask.set('zIndex', last.get('zIndex'));
					mask.element.insertBefore(last.element);
				}
			}
		}
	},

	// 绑定元素聚焦状态
	_setupFocus: function () {
		this.after('show', function () {
			this.element.focus();
		});
	},

	// onRender
	//---
	_onRenderVisible: function (val) {
		if (val) {
			if (this.get('effect') === 'fade') {
				// 固定 300 的动画时长，暂不可定制
				this.element.fadeIn(300);
			} else {
				this.element.show();
			}
		} else {
			this.element.hide();
		}
	}
})


module.exports = Popup;

// Helpers
// ----

// 让目标节点可以被 Tab
function toTabed(element, num) {
	num = parseInt(num);
	element.attr('tabindex', isNaN(num) ? -1 : num);
}

// erase item from array
function erase(item, array) {
	var index = -1;
	for (var i=0; i<array.length; i++) {
		if (array[i] === item) {
			index = i;
			break;
		}
	}
	if (index !== -1) {
		array.splice(index, 1);
	}
}

});


__include__['$'] = $;
__include__['overlay/overlay'] = FNX.__clz__['fnx/cmp/overlay/overlay'];
__include__['overlay/mask'] = FNX.__clz__['fnx/cmp/overlay/mask'];
FNX.__clz__['fnx/cmp/popup/popup'] = __using__('popup/popup');

})(window);
/**===============================
component : popup/dialog
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('popup/dialog.tpl',function(__using__,exports,module){

module.exports = '\
<div class="{{classPrefix}} {{skin}}">\
 <a class="{{classPrefix}}-close" title="Close" href="javascript:;" data-role="close">×</a>\
 <table class="{{classPrefix}}-grid">\
 {{if title}}\
 <tr>\
 <td class="{{classPrefix}}-header" data-role="header">\
 <div class="{{classPrefix}}-title" data-role="title">{{title}}</div>\
 </td>\
 </tr>\
 {{/if}}\
 <tr>\
 <td class="{{classPrefix}}-body" data-role="body">\
 <div data-role="content" class="{{classPrefix}}-content"></div>\
 </td>\
 </tr>\
 {{if buttons}}\
 <tr>\
 <td class="{{classPrefix}}-footer" data-role="footer">\
 <div class="{{classPrefix}}-operation" data-role="buttons">\
 {{each buttons as btn i}}\
 <div class="{{classPrefix}}-button-item">\
 <a class="{{classPrefix}}-button {{btn.cls}}" data-role="{{btn.role}}" href="javascript:;">{{btn.text}}</a>\
 </div>\
 {{/each}}\
 </div>\
 </td>\
 </tr>\
 {{/if}}\
 </table>\
</div>\
';

});

__namespace__('popup/dialog',function(__using__,exports,module){

var $ = __include__["$"],
    Popup = __include__["popup/popup"],
    Events = __include__["events/events"],
    Templatable = __include__["templatable/templatable"];

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
	    template: __using__("popup/dialog.tpl"),

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

});


__include__['$'] = $;
__include__['popup/popup'] = FNX.__clz__['fnx/cmp/popup/popup'];
__include__['events/events'] = FNX.__clz__['fnx/cmp/events/events'];
__include__['templatable/templatable'] = FNX.__clz__['fnx/cmp/templatable/templatable'];
FNX.__clz__['fnx/cmp/popup/dialog'] = __using__('popup/dialog');

})(window);
/**===============================
component : messager/messager
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('messager/messager',function(__using__,exports,module){

/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 */

module.exports = (function(){

    // 消息前缀, 建议使用自己的项目名, 避免多项目之间的冲突
    var prefix = "fnx-messenger",
        supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name){
        var errMsg = '';
        if(arguments.length < 2){
            errMsg = 'target error - target and name are both required';
        } else if (typeof target != 'object'){
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string'){
            errMsg = 'target error - target name must be string type';
        }
        if(errMsg){
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if ( supportPostMessage ){
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg){
            this.target.postMessage(prefix + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg){
            var targetFunc = window.navigator[prefix + this.name];
            if ( typeof targetFunc == 'function' ) {
                targetFunc(prefix + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    function Messenger(messengerName, projectName){
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        prefix = projectName || prefix;
        this.initListen();
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name){
        var targetObj = new Target(target, name);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function(){
        var self = this;
        var generalCallback = function(msg){
            if(typeof msg == 'object' && msg.data){
                msg = msg.data;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }
        };

        if ( supportPostMessage ){
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', generalCallback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function(){
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg){
        var targets = this.targets,
            target;
        for(target in targets){
            if(targets.hasOwnProperty(target)){
                targets[target].send(msg);
            }
        }
    };

    return Messenger;

})();


});


FNX.__clz__['fnx/cmp/messager/messager'] = __using__('messager/messager');

})(window);
/**===============================
component : switchable/switchable
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('switchable/basic/switchable-basic',function(__using__,exports,module){

var $ = __include__["$"],
	Widget = __include__["widget/widget"];

var SwitchableBasic = Widget.extend({
	attrs: {
		// 用户传入的 triggers，可以是 Selector、jQuery 对象
		triggers: {
			value : null,
			getter : function (val) {
				return $(val);
			}
		},

		// 用户传入的 panels，可以是 Selector、jQuery 对象
		panels: {
			value : null,
			getter : function (val) {
				return $(val);
			}
		},

		//样式前缀
		classPrefix: 'ui-switchable',

		// 是否包含 triggers，用于没有传入 triggers 时，是否自动生成的判断标准
		hasTriggers: true,

		// 触发类型 hover 或者是 click
		triggerType: 'hover',

		// 触发延迟
		delay: 100,

		// 初始切换到哪个面板
		activeIndex: {
			value : 0,
			setter : function (val) {
				return parseInt(val) || 0;
			}
		},

		// 步进值
		step: 1,

		// 有多少屏
		length: {
			readOnly : true,
			getter : function () {
				var panels = this.get('panels');

				if (panels.length) {
					return Math.ceil(panels.length / this.get('step'));
				} else {
					return 0;
				}
			}
		},

		// 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
		viewSize: null,

		activeTriggerClass: {
			getter: function (val) {
				return val ? val : this.get("classPrefix") + '-active';
			}
		}
	},

	setup: function () {
		SwitchableBasic.superclass.setup.call(this);

		this._initConstClass();
		this._initElement();

		var role = this._getDatasetRole();
		this._initPanels(role);
		// 配置中的 triggers > dataset > 自动生成
		this._initTriggers(role);
		this._bindTriggers();
		this._initEffect();
	},

	_initConstClass: function () {
		this.CONST = constClass(this.get('classPrefix'));
	},

	_initElement: function () {
		this.element.addClass(this.CONST.UI_SWITCHABLE);
	},

	_parseDatasetRole: function (roles) {
		var self = this,
			role = {};

		for (var i = 0; i < roles.length; i++) {
			var key = roles[i];
			var elems = self.$('[data-role=' + key + ']');
			if (elems.length) {
				role[key] = elems;
			}
		}

		return role;
	},

	// 从 HTML 标记中获取各个 role, 替代原来的 markupType
	_getDatasetRole: function () {
		return this._parseDatasetRole(['trigger', 'panel', 'nav', 'content'])
	},

	//初始化面板
	_initPanels: function (role) {
		var panels = this.get('panels');

		// 先获取 panels 和 content
		if (panels.length > 0) {
			//Do nothing
		} else if (role.panel) {
			this.set('panels', panels = role.panel);
		} else if (role.content) {
			this.set('panels', panels = role.content.find('> *'));
			this.content = role.content;
		}

		if (!this.content) {
			this.content = panels.parent();
		}

		this.content.addClass(this.CONST.CONTENT_CLASS)
	},

	//初始化触发器
	_initTriggers: function (role) {
		var triggers = this.get('triggers');

		// 再获取 triggers 和 nav
		if (triggers.length > 0) {}
		// attr 里没找到时，才根据 data-role 来解析
		else if (role.trigger) {
			this.set('triggers', triggers = role.trigger);
		} else if (role.nav) {
			triggers = role.nav.find('> *');

			// 空的 nav 标记
			if (triggers.length === 0) {
				triggers = generateTriggersMarkup(
						this.get('length'),
						this.get('activeIndex'),
						this.get('activeTriggerClass'),
						true
					).appendTo(role.nav);
			}
			this.set('triggers', triggers);

			this.nav = role.nav;
		}
		// 用户没有传入 triggers，也没有通过 data-role 指定时，如果
		// hasTriggers 为 true，则自动生成 triggers
		else if (this.get('hasTriggers')) {
			this.nav = generateTriggersMarkup(
					this.get('length'),
					this.get('activeIndex'),
					this.get('activeTriggerClass')
				).appendTo(this.element);

			this.set('triggers', triggers = this.nav.children());
		}

		if (!this.nav && triggers.length) {
			this.nav = triggers.parent();
		}

		this.nav && this.nav.addClass(this.CONST.NAV_CLASS);
		triggers.addClass(this.CONST.TRIGGER_CLASS).each(function (i, trigger) {
			$(trigger).data('value', i);
		});
	},

	_bindTriggers: function () {
		var that = this,
			triggers = this.get('triggers'),
			type = this.get('triggerType').
			switchTimer = null;

		if (type === 'click') {
			triggers.click(function () {
				that.switchTo($(this).data('value'));
			});
		}
		// hover
		else {
			triggers.hover(
				function () {
					var _that = this;
					switchTimer = setTimeout(function () {
						that.switchTo($(_that).data('value'));
					}, that.get('delay'));
				}, function () {
					clearTimeout(switchTimer);
				}
			);
		}
	},

	// 初始化效果
	_initEffect: function () {
		this.get('panels').hide();
	},

	// change 事件触发的前提是当前值和先前值不一致, 所以无需验证 toIndex !== fromIndex
	_onRenderActiveIndex: function (toIndex, fromIndex) {
		this._switchTo(toIndex, fromIndex);
	},

	// 切换的内部实现
	_switchTo: function (toIndex, fromIndex) {
		this.trigger('switch', toIndex, fromIndex);
		this._switchTrigger(toIndex, fromIndex);
		this._switchPanel(toIndex, fromIndex);
	},

	_switchTrigger: function (toIndex, fromIndex) {
		var triggers = this.get('triggers');
		if (triggers.length < 1)
			return;

		triggers.eq(fromIndex).removeClass(this.get('activeTriggerClass'));
		triggers.eq(toIndex).addClass(this.get('activeTriggerClass'));
	},

	_switchPanel: function (toIndex, fromIndex) {
		var panelInfo = this._getPanelInfo(toIndex, fromIndex);
		// 默认是最简单的切换效果：直接隐藏/显示
		panelInfo.fromPanels.hide();
		panelInfo.toPanels.show();
	},

	_getPanelInfo: function (toIndex, fromIndex) {
		var panels = this.get('panels').get();
		var step = this.get('step');

		var fromPanels,
			toPanels;

		// 初始情况下 fromIndex 为 undefined
		if (fromIndex > -1) {
			fromPanels = panels.slice(fromIndex * step, (fromIndex + 1) * step);
		}

		toPanels = panels.slice(toIndex * step, (toIndex + 1) * step);

		return {
			toIndex: toIndex,
			fromIndex: fromIndex,
			toPanels: $(toPanels),
			fromPanels: $(fromPanels)
		};
	},

	// 切换到指定 index
	switchTo: function (toIndex) {
		this.set('activeIndex', toIndex);
	},

	// 切换到上一视图
	prev: function () {
		//  设置手工向后切换标识, 外部调用 prev 一样
		//this._isBackward = true;
		var fromIndex = this.get('activeIndex');
		// 考虑循环切换的情况
		var index = (fromIndex - 1 + this.get('length')) % this.get('length');
		this.switchTo(index);
	},

	// 切换到下一视图
	next: function () {
		//this._isBackward = false;

		var fromIndex = this.get('activeIndex');
		var index = (fromIndex + 1) % this.get('length');
		this.switchTo(index);
	}
});

module.exports = SwitchableBasic;

// Helpers
// -------
function generateTriggersMarkup(length, activeIndex, activeTriggerClass, justChildren) {
	var nav = $('<ul>');

	for (var i = 0; i < length; i++) {
		var className = i === activeIndex ? activeTriggerClass: '';

		$('<li>', {
			'class': className,
			'html': '<span>' + (i + 1) + '</span>'
		}).appendTo(nav);
	}

	return justChildren ? nav.children(): nav;
}

// 内部默认的 className

function constClass(classPrefix) {
	return {
		UI_SWITCHABLE: classPrefix || '',
		NAV_CLASS: classPrefix ? classPrefix + '-nav': '',
		CONTENT_CLASS: classPrefix ? classPrefix + '-content': '',
		TRIGGER_CLASS: classPrefix ? classPrefix + '-trigger': '',
		PANEL_CLASS: classPrefix ? classPrefix + '-panel': ''
	}
}

});

__namespace__('switchable/basic/effects',function(__using__,exports,module){

var $ = __include__["$"],
	Easing = __include__["easing/easing"];


var SCROLLX = 'scrollx',
	SCROLLY = 'scrolly',
	FADE = 'fade';

var Effects = module.exports = {};

//==============================================
// 默认是最简单的切换效果：直接隐藏/显示
//==============================================
Effects.none = {
	initEffect: function () {
		var panels = this.get('panels');

		if (panels.length > this.get('step')) {
			panels.hide();
		} else {
			return false;
		}
	},

	switchPanel: function (panelInfo) {
		panelInfo.fromPanels.hide();
		panelInfo.toPanels.show();
	}
};

//==============================================
// 淡隐淡现效果
//==============================================
Effects.fade = {
	initEffect: function () {
		var panels = this.get('panels'),
			step = this.get('step');
		// 不支持 step > 1 的情景。若需要此效果时，可修改结构来达成。
		if (step > 1 || panels.length <= step) {
			//throw new Error('Effect "fade" only supports step === 1');
			return false;
		}
		// 初始化
		else {
			panels.css({
				position: 'absolute',
				opacity: 0,
				zIndex: 1
			}).show();
		}
	},

	switchPanel: function (panelInfo) {
		var fromPanel = panelInfo.fromPanels.eq(0),
			toPanel = panelInfo.toPanels.eq(0),
			that = this;

		// 立刻停止，以开始新的
		this.anim && this.anim.stop(false, true);

		// 首先显示下一张
		toPanel.css('opacity', 1);
		toPanel.show();

		if (panelInfo.fromIndex > -1) {
			// 动画切换
			this.anim = fromPanel.animate({
				opacity: 0
			}, this.get('duration'), this.get('easing'), function () {
				that.anim = null; // free
				// 切换 z-index
				toPanel.css('zIndex', 9);
				fromPanel.css('zIndex', 1);
				fromPanel.css('display', 'none');

				that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
			});
		}
		// 初始情况下没有必要动画切换
		else {
			toPanel.css('zIndex', 9);
			this.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
		}
	}
};

//==============================================
// 滚动效果
//==============================================
Effects.__scroll = {
	initPanels: function () {
		this.before('next', function () {
			this._forceNext = true;
		});

		this.before('prev', function () {
			this._forcePrev = true;
		});

		this.after('_switchTo', function () {
			this._forceNext = this._forcePrev = undefined;
		});

		var panels = this.get('panels'),
			step = this.get('step'),
			size = this.get('size'),
			circular = this.get('circular'),
			panelsLength = panels.length;

		//clone条件判断
		if (
			// 尺寸不足一屏，或是不足一个步长，则不执行clone操作
			panelsLength <= size || panelsLength <= step ||

			// 不循环，则不执行clone操作
			!circular ||

			// 简单的情况，则不执行clone操作
			(step == size && panelsLength % step == 0)
		) return;

		//补足
		this._clonePanels = panels.slice(0, size + 1).clone(true).addClass(this.get('classPrefix') + '-clone');
		panels.last().after(this._clonePanels);
	},

	initEffect: function () {
		var panels = this.get('panels'),
			step = this.get('step'),
			size = this.get('size'),
			effect = this.get('effect'),
			content = this.content,
			firstPanel = panels.eq(0);


		if (panels.length <= size || panels.length <= step) {
			return false;
		}

		// 设置定位信息，为滚动效果做铺垫
		content.css('position', 'relative');

		// 注：content 的父级不一定是 container
		if (content.parent().css('position') === 'static') {
			content.parent().css('position', 'relative');
		}

		// 水平排列
		if (effect === SCROLLX) {
			panels.css('float', 'left');
			this._clonePanels && this._clonePanels.css('float', 'left');
			// 设置最大宽度，以保证有空间让 panels 水平排布，35791197px 为 360 下 width 最大数值
			content.width('35791197px');
		}

		// 只有 scrollX, scrollY 需要设置 viewSize
		// 其他情况下不需要
		var viewSize = this.get('viewSize');
		if (!viewSize) {
			viewSize = [],
			viewSize[0] = firstPanel.outerWidth(),
			viewSize[1] = firstPanel.outerHeight();
			this.set('viewSize', viewSize);
		}


		if (!viewSize) {
			throw new Error('Please specify viewSize manually');
		}
	},

	switchPanel: function (panelInfo) {
		var isX = this.get('effect') === SCROLLX,
			viewsize = this.get('viewSize')[isX ? 0 : 1],
			fn = null;

		// 开始动画前，先停止掉上一动画
		this.anim && this.anim.stop(false, true);

		if (this.get('circular')) {
			fn = scrollCarousel;
		} else {
			fn = scrollSlide;
		}

		fn.call(this, panelInfo, isX, viewsize);
	}
};

Effects[SCROLLX] = Effects[SCROLLY] = Effects.__scroll;


// Helpers
// -------

function scrollSlide (panelInfo, isX, viewsize) {
	var props = {};
	props[isX ? 'left' : 'top'] = -(viewsize * panelInfo.toIndex * this.get('step')) + 'px';

	if (panelInfo.fromIndex > -1) {
		var that = this;

		this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
			that.anim = null; // free
			that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
		});
	}
	else {
		this.content.css(props);
		this.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
	}
};

function scrollCarousel (panelInfo, isX, viewsize) {
	var prop = isX ? 'left' : 'top',
		step = this.get('step'),
		toIndex = panelInfo.toIndex,
		fromIndex = panelInfo.fromIndex,
		len = this.get('length'),
		panels = this.get('panels'),
		props = {};

	props[prop] = -(viewsize * toIndex * step) + 'px';

	// 开始动画
	if (fromIndex > -1) {
		var that = this;

		// 0 -> len-1
		var isPrevCritical = fromIndex === 0 && toIndex === len - 1 && this._forcePrev;
		// len-1 -> 0
		var isNextCritical = fromIndex === len - 1 && toIndex === 0 && this._forceNext;


		if (isPrevCritical || isNextCritical) {
			scrollCarouselCritical.call(this, panelInfo, isNextCritical, prop, viewsize);
		}
		// 直接执行动画
		else {
			this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
				that.anim = null; // free
				that.trigger('switched', toIndex, fromIndex);
			});
		}
	}
	// 初始化
	else {
		this.content.css(props);
		this.trigger('switched', toIndex, fromIndex);
	}
};


function scrollCarouselCritical (panelInfo, isNext, prop, viewsize) {
	var that = this,
		toPanels = panelInfo.toPanels,
		step = this.get('step'),
		size = this.get('size'),
		panels = this.get('panels'),
		panelsLength = panels.length,
		props = {},
		resetOffset = 0,
		isSimple = size == step && panelsLength % step == 0,
		fullLength = viewsize * panelsLength;

	// len-1 -> 0
	if (isNext) {
		// 把 0 的面板移动到 len-1 的后面
		if (isSimple) {
			toPanels.css('position', 'relative').css(prop, fullLength + 'px');
		}

		// 设置滚动到 len
		props[prop] = -fullLength + 'px';
		// 动画结束后设置到 0 的位置
		resetOffset = '0px';
	}
	// 0 -> len-1
	else {
		var lenMinus1Diff =  (panelsLength - (panelsLength % step || step)) * viewsize;

		// 把 len-1 的面板移动到 0 的前面
		if (isSimple) {
			toPanels.css('position', 'relative').css(prop, -fullLength + 'px');

			// 设置滚动到 -1 的位置
			props[prop] = (step * viewsize) + 'px';

			// 动画结束后设置到 len-1 的位置
			resetOffset = -lenMinus1Diff + 'px';
		}
		// clone 的模式下
		else {
			// 设置到 len 的位置
			this.content.css(prop, -fullLength + 'px');

			// 设置滚动到 len-1 的位置
			props[prop] = -lenMinus1Diff + 'px';
		}
	}

	this.anim = this.content.animate(props, this.get('duration'), this.get('easing'), function () {
		isSimple && toPanels.css(prop, '0px');
		resetOffset && that.content.css(prop, resetOffset);

		that.anim = null; // free
		that.trigger('switched', panelInfo.toIndex, panelInfo.fromIndex);
	});
}

});

__namespace__('switchable/switchable',function(__using__,exports,module){

var $ = __include__["$"],
	SwitchableBasic = __using__("switchable/basic/switchable-basic"),
	Effects = __using__("switchable/basic/effects");

var Switahable = SwitchableBasic.extend({
	attrs: {
		// 自动播放标记
		autoplay: false,

		// 自动播放的间隔时间
		interval: 5000,

		// 是否循环播放
		circular: false,

		// 循环模式是旋转木马还是幻灯片 slide，carousel
		circularMode: 'carousel',

		// 动画效果
		effect: {
			value : 'none',
			setter: function (val) {
				return Effects[val] ? val.toLowerCase() : 'none';
			}
		},

		// 缓动函数
		easing: 'linear',

		// 动画时长
		duration: 500,

		// 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
		viewSize: null,

		// 可视窗口有多少个显示面板
		size: 1,

		// 步长不能超过 size
		step: {
			value: 1,
			getter: function (val) {
				var size = this.get('size');
				return val > size ? size : val;
			}
		}
	},

	events: {
		'mouseenter': function () {
			if (this.get('autoplay')) {
				this.stop();
				this._mouseEnterStop = true;
			}
		},
		'mouseleave': function () {
			if (this._mouseEnterStop) {
				this._mouseEnterStop = false;
				this.start();
			}
		}
	},

	//初始化面板
	_initPanels: function (role) {
		Switahable.superclass._initPanels.call(this, role);
		var panels = this._effectFunction('initPanels').call(this, this.get('panels'));

		if (panels) {
			this.set('panels', panels);
		}
	},

	// 初始化效果
	_initEffect: function () {
		if (this._effectFunction('initEffect').call(this) === false) {
			this._ineffective = true;
		}
	},

	_effectFunction: function (fn) {
		var ef = Effects[this.get('effect')];
		if (!ef) return $.noop;
		return ef[fn] ? ef[fn] : $.noop;
	},

	//切换面板
	_switchPanel: function (toIndex, fromIndex) {
		if (this.ineffective) return;

		var panelInfo = this._getPanelInfo(toIndex, fromIndex);
		this._effectFunction('switchPanel').call(this, panelInfo);
	},

	_onRenderAutoplay: function (auto) {
		var that = this,
			interval = this.get('interval');

		if (auto) {
			stopTimer();
			that._autoplayTimer = setInterval(function () {
				if (!that._autoplayTimer) return;
				that.next();
			}, interval)
		} else {
			stopTimer();
		}

		function stopTimer () {
			if (that._autoplayTimer) {
				clearInterval(that._autoplayTimer);
				that._autoplayTimer = null;
			}
		}
	},

	start: function () {
		this.set('autoplay', true);
	},

	stop: function () {
		this.set('autoplay', false);
	},

	destroy: function () {
		this._effectFunction('destroy').call(this);
	}
});

module.exports = Switahable;

// Helpers
// -------

});


__include__['$'] = $;
__include__['widget/widget'] = FNX.__clz__['fnx/cmp/widget/widget'];
__include__['easing/easing'] = FNX.__clz__['fnx/cmp/easing/easing'];
FNX.__clz__['fnx/cmp/switchable/switchable'] = __using__('switchable/switchable');

})(window);
/**===============================
component : switchable/slide
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



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


__include__['switchable/switchable'] = FNX.__clz__['fnx/cmp/switchable/switchable'];
FNX.__clz__['fnx/cmp/switchable/slide'] = __using__('switchable/slide');

})(window);
/**===============================
component : switchable/carousel
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('switchable/carousel',function(__using__,exports,module){

var Switchable = __include__["switchable/switchable"];
var $ = __include__["$"];

// 旋转木马组件
var Carousel = Switchable.extend({
	attrs : {
		circular : true,

		autoplay: false,

		prevBtn : {
			getter : function (val) {
				return $(val).eq(0);
			}
		},

		nextBtn : {
			getter : function (val) {
				return $(val).eq(0);
			}
		},

		disabledBtnClass : {
			getter : function (val) {
				return val ? val : this.get("classPrefix") + '-disabled-btn';
			}
		}
	},

	setup: function () {
		Carousel.superclass.setup.call(this);
		this.render();
	},

	_initConstClass: function () {
		Carousel.superclass._initConstClass.call(this);
		$.extend(this.CONST, constClass(this.get('classPrefix')));
	},

	_initTriggers : function (role) {
		Carousel.superclass._initTriggers.call(this, role);

		// attr 里没找到时，才根据 data-role 来解析
		var prevBtn = this.get('prevBtn');
		var nextBtn = this.get('nextBtn');

		if (!prevBtn[0] && role.prev) {
			prevBtn = role.prev;
			this.set('prevBtn', prevBtn);
		}

		if (!nextBtn[0] && role.next) {
			nextBtn = role.next;
			this.set('nextBtn', nextBtn);
		}

		prevBtn.addClass(this.CONST.PREV_BTN_CLASS);
		nextBtn.addClass(this.CONST.NEXT_BTN_CLASS);
	},

	_bindTriggers : function () {
		Carousel.superclass._bindTriggers.call(this);

		var that = this;
		var circular = this.get('circular');

		this.get('prevBtn').click(function (ev) {
			ev.preventDefault();
			if (circular || that.get('activeIndex') > 0) {
				that.prev();
			}
		});

		this.get('nextBtn').click(function (ev) {
			ev.preventDefault();
			var len = that.get('length') - 1;
			if (circular || that.get('activeIndex') < len) {
				that.next();
			}
		});

		// 注册 switch 事件，处理 prevBtn/nextBtn 的 disable 状态
		// circular = true 时，无需处理
		if (!circular) {
			this.on('switch', function (toIndex) {
				that._updateButtonStatus(toIndex);
			});
		}
	},

	_getDatasetRole : function () {
		var role = Carousel.superclass._getDatasetRole.call(this);
		var btnRoles = Carousel.superclass._parseDatasetRole.call(this, ['next', 'prev']);

		$.extend(role, btnRoles);

		return role;
	},

	_updateButtonStatus : function (toIndex) {
		var prevBtn = this.get('prevBtn');
		var nextBtn = this.get('nextBtn');
		var disabledBtnClass = this.get("disabledBtnClass");

		prevBtn.removeClass(disabledBtnClass);
		nextBtn.removeClass(disabledBtnClass);

		if (toIndex === 0) {
			prevBtn.addClass(disabledBtnClass);
		} else if (toIndex === this.get('length') - 1) {
			nextBtn.addClass(disabledBtnClass);
		}
	}
});

module.exports = Carousel;


// Helpers
// -------
function constClass(classPrefix) {
	return {
		PREV_BTN_CLASS: classPrefix ? classPrefix + '-prev-btn': '',
		NEXT_BTN_CLASS: classPrefix ? classPrefix + '-next-btn': ''
	}
}


});


__include__['switchable/switchable'] = FNX.__clz__['fnx/cmp/switchable/switchable'];
__include__['$'] = $;
FNX.__clz__['fnx/cmp/switchable/carousel'] = __using__('switchable/carousel');

})(window);
/**===============================
component : calendar/dateparser
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



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


FNX.__clz__['fnx/cmp/calendar/dateparser'] = __using__('calendar/dateparser');

})(window);
/**===============================
component : calendar/calendar
===============================**/

(function (window) {
var __clz__ = new FNX.__loader__,
	__using__ = __clz__.using,
    __namespace__ = __clz__.namespace,
	__clz__ = FNX.__clz__,
    __include__ = {};



__namespace__('calendar/calendar-base',function(__using__,exports,module){

var $ = __include__["$"],
    Widget = __include__["widget/widget"],
    Templatable = __include__["templatable/templatable"]

var current_date = new Date()

var BaseCalendar = Widget.extend({

	Implements: Templatable,

		attrs: {
		// 统一样式前缀
		classPrefix: 'ui-calendar',
		skin: '',
		disableClass: 'disabled-element',
		focusClass: 'focused-element',
		process: null,
		template: '',
		selected: {
			value: null,
			getter: function(val){
				val = this.parse(val)
				return this.inRange(val) ? val : null
			}
		},
		model: {
			getter: function(){
				return this._createModel()
			}
		},
		focus: {
			value: null,
			setter: function(val){
				return this.parse(val)
			}
		},
		range: {
			value: null,
			setter: function(val){
				if(!val) return null

				if(isString(val)){
					return [this.parse(val), null]
				}

				if (isArray(val)) {
					var start = (val[0] === 0 || val[0]) && this.parse(val[0])
					var end = (val[1] === 0 || val[1]) && this.parse(val[1])
					return [start, end]
				}

				return val
			}
		}
	},

	parse: function(val){
		return val
	},

	inRange: function (date){
		var range = this.get('range')

		if(!range){
			return true
		}

		if (isArray(range)) {
			var start = range[0],
				end = range[1],
				result = true

			if (start || start === 0) {
				result = result && date >= start
			}

			if (end || end === 0) {
				result = result && date <= end
			}

			return result
		}

		if (isFunction(range)){
			return range(date)
		}

		return true
	},

	_createModel: function(){
		return {
			classPrefix: this.get('classPrefix'),
			disableClass: this.get('disableClass'),
			focusClass: this.get('focusClass'),
			skin: this.get('skin')
		}
	},

	Statics: {
		currentDate : current_date
	}
})


module.exports = BaseCalendar


// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

/*function isFunction (val) {
	return tostring.call(val) === '[object Function]'
}*/

function isArray (val) {
	return tostring.call(val)  === '[object Array]'
}

});

__namespace__('calendar/column/column-base',function(__using__,exports,module){

var $ = __include__["$"],
	BaseCalendar = __using__("calendar/calendar-base")

var BaseColumn = BaseCalendar.extend({
	show: function() {
		this.render()
		this.element.show()
		return this
	},

	hide: function() {
		this.element.hide()
		return this
	},

	refresh: function() {
		this.element.html($(this.compile()).html())
		return this
	}
})

module.exports = BaseColumn


// Helpers
// ----

});

__namespace__('calendar/column/column-year-month.tpl',function(__using__,exports,module){

module.exports = '\
<table class="{{classPrefix}}-{{type}} {{skin}}" data-role="{{type}}-column">\
 <tr class="{{classPrefix}}-{{type}}-column">\
 {{each items as item index}}\
 {{if index%3 == 0 && index > 0 && index < items.length}}\
 </tr><tr class="ui-calendar-{{type}}-column">\
 {{/if}}\
 <td data-role="{{item.role}}" data-value="{{item.value}}" class="\
 {{if item.disable}}\
 {{disableClass}}\
 {{else}}\
 {{if selected == item.value}} {{focusClass}}{{/if}}\
 {{/if}}\
 ">{{item.label}}</td>\
 {{/each}}\
 </tr>\
</table>\
';

});

__namespace__('calendar/column/column-year',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base")

var current = BaseColumn.currentDate

var YearColumn = BaseColumn.extend({
	attrs: {
		selected: {
			value: current.getFullYear()
		},
		focus: {
			getter: function(val){
				if(val || val === 0){
					return val
				} else {
					val = this.get('selected')
					return (val === 0 || val) ? val : current.getFullYear()
				}
			}
		},
		template: __using__("calendar/column/column-year-month.tpl"),
		model: {
			getter: function(){
				return this._createModel()
			}
		}
	},

	events: {
		'click [data-role=year]': function(ev) {
			var value = $(ev.target).data('value')
			this.select(value)
		},
		'click [data-role=prev],[data-role=next]': function(ev) {
			var value = $(ev.target).data('value')
			this.set('focus', value)
		}
	},

	setup: function(){
		YearColumn.superclass.setup.call(this)

		this.on('change:range change:focus', function() {
			this.refresh()
		})
	},

	parse: function(val){
		val = parseInt(val)
		return isNaN(val) ? null : val
	},

	select: function(year) {
		year = this.parse(year)

		if(year === null){
			this.trigger('selectDisable', year)
			return this
		}

		var el = this.$('[data-role=year][data-value="' + year + '"]'),
			focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(year)){

			this.set('selected', year)

			//如果未在当前页找到年份，则focus选择的年份
			if(!el.length){
				this.set('focus', year)
			} else {
				this.$('.' + focusClass).removeClass(focusClass)
				el.addClass(focusClass)
			}

			this.trigger('select', year)
		} else {
			this.trigger('selectDisable', year)
		}

		return this
	},

	_createModel: function(){
		var year = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process')

		var items = [process({
			value: year - 10,
			label: '. . .',
			disable: false,
			role: 'prev'
		}, fn)]


		for (var i = year - 6; i < year + 4; i++) {
			items.push(process({
				value: i,
				label: i,
				disable: !this.inRange(i),
				role: 'year'
			}, fn))
		}

		items.push(process({
			value: year + 10,
			label: '. . .',
			disable: false,
			role: 'next'
		}, fn))

		var model = YearColumn.superclass._createModel.call(this)

		$.extend(model, {
			items: items,
			type: 'year'
		})

		if(selected != items[0].value && selected != items[items.length - 1].value){
			model.selected = selected
		}

		return model
	}
})

module.exports = YearColumn

// Helpers
// ----
function process(item, fn) {
	if (!fn) {
		return item;
	}
	item.type = 'year';
	return fn(item);
}

});

__namespace__('calendar/calendar-i18n',function(__using__,exports,module){

//--zh-cn
exports['zh-cn'] = exports['default'] = {
	months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
	dates: ['日', '一', '二', '三', '四', '五', '六']
}

//--en-us
exports['en-us'] = {
	months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	dates: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
}

});

__namespace__('calendar/column/column-month',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base"),
	i18n = __using__("calendar/calendar-i18n")

var current = BaseColumn.currentDate;

var MonthColumn = BaseColumn.extend({
	attrs: {
		selected: {
			value: current.getMonth()
		},
		focus: {
			getter: function(val){
				if(val || val === 0){
					return val
				} else {
					val = this.get('selected')
					return (val === 0 || val) ? val : current.getMonth()
				}
			}
		},
		template: __using__("calendar/column/column-year-month.tpl"),
		lang: {
			value: i18n['default'].months,
			setter: function(val){
				if(isString(val)){
					return (i18n[val] && i18n[val].months) || i18n['default'].months
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=month]': function(ev) {
			var value = $(ev.target).data('value')
			this.select(value)
		}
	},

	setup: function() {
		MonthColumn.superclass.setup.call(this)

		this.on('change:range change:lang', function() {
			this.refresh()
		})

	},

	parse: function(val){
		val = parseInt(val)

		if(isNaN(val) || val < 0 || val > 11){
			return null
		} else {
			return val
		}
	},

	select: function(month) {
		month = this.parse(month)

		if(month === null){
			this.trigger('selectDisable', month)
			return this
		}

		var el = this.$('[data-role=month][data-value="' + month + '"]'),
		focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(month)){
			this.$('.' + focusClass).removeClass(focusClass)
			el.addClass(focusClass)
			this.set('selected', month)
			this.trigger('select', month)
		} else {
			this.trigger('selectDisable', month)
		}

		return this;
	},

	_createModel: function(){
		var month = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process'),
			lang = this.get('lang'),
			items = []

		for (var i = 0; i < 12; i++){
			items.push(process({
				value: i,
				label: lang[i] || i,
				disable: !this.inRange(i),
				role: 'month'
			}, fn))
		}

		var model = MonthColumn.superclass._createModel.call(this)

		$.extend(model, {
			items: items,
			selected: selected,
			type: 'month'
		})

		return model
	}
})

module.exports = MonthColumn

// Helpers
// ----
function process(item, fn) {
	if (!fn) {
		return item;
	}
	item.type = 'month';
	return fn(item);
}

});

__namespace__('calendar/column/column-date.tpl',function(__using__,exports,module){

module.exports = '\
<table class="{{classPrefix}}-date {{skin}}" data-role="date-column">\
 <tr class="{{classPrefix}}-day-column">\
 {{each day as item index}}\
 <th class="{{classPrefix}}-day {{classPrefix}}-day-{{item.value}}" data-role="{{item.role}}" data-value="{{item.value}}">{{item.label}}</th>\
 {{/each}}\
 </tr>\
 <tr class="{{classPrefix}}-date-column">\
 {{each date as item index}}\
 {{if index%7 == 0 && index > 0 && index < date.length}}\
 </tr><tr class="{{classPrefix}}-date-column">\
 {{/if}}\
 <td data-role="{{item.role}}" data-value="{{item.value}}" class="\
 {{item.className}} {{classPrefix}}-day-{{item.day}}\
 {{if item.disable}}\
 {{disableClass}}\
 {{else}}\
 {{if selected == item.value}} {{focusClass}}{{/if}}\
 {{/if}}\
 ">{{item.label}}</td>\
 {{/each}}\
 </tr>\
</table>\
';

});

__namespace__('calendar/column/column-date',function(__using__,exports,module){

var $ = __include__["$"],
	BaseColumn = __using__("calendar/column/column-base"),
	i18n = __using__("calendar/calendar-i18n")

var current = BaseColumn.currentDate

var DateColumn = BaseColumn.extend({
	attrs: {
		previousMonthClass: 'previous-month',
		currentMonthClass: 'current-month',
		nextMonthClass: 'next-month',
		startDay: 0,
		selected: {
			value: current,
			getter: function(val){
				return cloneDate(val)
			}
		},
		focus: {
			getter: function(val){
				val = val || this.get('selected') || current
				return cloneDate(val)
			}
		},
		template: __using__("calendar/column/column-date.tpl"),
		lang: {
			value: i18n['default'].dates,
			setter: function(val){
				if(isString(val)){
					return (i18n[val] && i18n[val].dates) || i18n['default'].dates
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=date]': function(ev) {
			var value = $(ev.target).data('value')
			var date = valueToDate(value)
			var val = this.get('focus')

			val.setDate(1)
			val.setMonth(date.getMonth())
			val.setFullYear(date.getFullYear())
			val.setDate(date.getDate())

			this.select(val)
		}
	},

	setup: function() {
		DateColumn.superclass.setup.call(this)

		this.on('change:range change:focus change:lang', function() {
			this.refresh()
		})
	},

	parse: function(val){
		var p = parseInt,v

		if(isString(val)){
			v = valueToDate(val)
		} else {
			v = new Date(val)
		}

		return isNaN(v.getTime()) ? null : v
	},

	select: function(_date) {
		var date = parseDate(_date)

		if(date === null){
			this.trigger('selectDisable', date)
			return this
		}

		var el = this.$('[data-role=date][data-value="' + dateToValue(date) + '"]'),
			previousMonthClass = this.get('previousMonthClass'),
			nextMonthClass = this.get('nextMonthClass'),
			focusClass = this.get('focusClass')

		//如果在区间内
		if(this.inRange(date)){

			this.set('selected', date)

			//如果未在当前页找到日期
			if(!el.length || el.hasClass(previousMonthClass) || el.hasClass(nextMonthClass)){
				this.set('focus', date)
			} else {
				this.$('.' + focusClass).removeClass(focusClass)
				el.addClass(focusClass)
			}

			this.trigger('select', date)
		} else {
			this.trigger('selectDisable', date)
		}

		return this
	},

	_createModel: function(){
		var that = this,
			date = this.get('focus'),
			selected = this.get('selected'),
			fn = this.get('process'),
			startDay = this.get('startDay'),
			lang = this.get('lang'),
			previousMonthClass = this.get('previousMonthClass'),
			currentMonthClass = this.get('currentMonthClass'),
			nextMonthClass = this.get('nextMonthClass'),
			items = [],
			days = [],
			delta = 0,
			daysInMonth = 0,
			tmpDate = null,
			d = null,
			i = 0

		for (i = startDay; i < 7; i++) {
			days.push({
				label: lang[i] || i,
				value: i,
				role: 'day'
			})
		}
		for (i = 0; i < startDay; i++) {
			days.push({
				label: lang[i] || i,
				value: i,
				role: 'day'
			})
		}

		var pushData = function(d, className) {
			var item = {
				value: dateToValue(d),
				label: d.getDate(),
				day: d.getDay(),
				className: className,
				disable: !that.inRange(d),
				role: 'date'
			}

			if (fn) {
				item.type = 'date'
				item = fn(item)
			}
			items.push(item)
		}

		var currMonth = cloneDate(date)
		currMonth.setDate(1)//提前设置为1号，如果当前日期为3月31号，月份加1后为4月31号会出问题

		// Calculate days of previous month
		tmpDate = cloneDate(currMonth)
		delta = tmpDate.getDay() - startDay
		if (delta <= 0) {
			delta += 7
		}

		for (i = delta - 1; i >= 0; i--) {
			d = cloneDate(tmpDate)
			d.setDate(-i)
			pushData(d, previousMonthClass)
		}

		// Calculate days of current month
		tmpDate = cloneDate(currMonth)
		tmpDate.setMonth(tmpDate.getMonth() + 1)
		tmpDate.setDate(0)//设置为0则返回上个月的最后一天
		daysInMonth = tmpDate.getDate()
		for (i = 1; i <= daysInMonth; i++) {
			d = cloneDate(tmpDate)
			d.setDate(i)
			pushData(d, currentMonthClass)
		}

		// Calculate days of next month
		delta = 42 - items.length
		tmpDate = cloneDate(currMonth)
		tmpDate.setMonth(tmpDate.getMonth() + 1)
		for (i = 1; i <= delta; i++){
			d = cloneDate(tmpDate)
			d.setDate(i)
			pushData(d, nextMonthClass)
		}

		var model = DateColumn.superclass._createModel.call(this)

		$.extend(model, {
			day: days,
			date: items,
			selected: dateToValue(selected)
		})

		return model
	}
})

module.exports = DateColumn

// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

function cloneDate (date) {
	return new Date(date.getTime())
}

function dateToValue (date) {
	return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}

function valueToDate (val) {
	var p = parseInt,
		val = val.split('-')
	return new Date(p(val[0]), p(val[1])-1, p(val[2]))
}

function parseDate (val) {
	if(isString(val)){
		return valueToDate(val)
	} else {
		return new Date(val)
	}
}

});

__namespace__('calendar/calendar.tpl',function(__using__,exports,module){

module.exports = '\
<div class="{{classPrefix}} {{skin}}">\
 <div class="{{classPrefix}}-pannel" data-role="pannel">\
 <span class="{{classPrefix}}-control" data-role="prev-year">&lt;&lt;</span>\
 <span class="{{classPrefix}}-control" data-role="prev-month">&lt;</span>\
 <span class="{{classPrefix}}-control month" data-role="current-month"></span>\
 <span class="{{classPrefix}}-control year" data-role="current-year"></span>\
 <span class="{{classPrefix}}-control" data-role="next-month">&gt;</span>\
 <span class="{{classPrefix}}-control" data-role="next-year">&gt;&gt;</span>\
 </div>\
 <div class="{{classPrefix}}-container" data-role="container"></div>\
</div>\
';

});

__namespace__('calendar/calendar',function(__using__,exports,module){

var $ = __include__["$"],
    BaseCalendar = __using__("calendar/calendar-base"),
    YearColumn = __using__("calendar/column/column-year"),
    MonthColumn = __using__("calendar/column/column-month"),
    DateColumn = __using__("calendar/column/column-date"),
	i18n = __using__("calendar/calendar-i18n")

var current = BaseCalendar.currentDate

var Calendar = BaseCalendar.extend({
	attrs: {
		template: __using__("calendar/calendar.tpl"),
		mode: 'dates',
		startDay: 0,
		selected: {
			value: current,
			getter: function(val){
				return cloneDate(val)
			}
		},
		focus: {
			getter: function(val){
				val = val || this.get('selected') || current
				return cloneDate(val)
			}
		},
		lang: {
			value: i18n['default'],
			setter: function(val){
				if(isString(val)){
					return i18n[val] || i18n['default']
				} else {
					return val
				}
			}
		}
	},

	events: {
		'click [data-role=current-month]': function(ev) {
			if (this.get('mode') === 'months') {
				this.renderContainer('dates')
			} else {
				this.renderContainer('months')
			}
		},
		'click [data-role=current-year]': function(ev) {
			if (this.get('mode') === 'years') {
				this.renderContainer('dates')
			} else {
				this.renderContainer('years')
			}
		},
		'click [data-role=prev-year]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setFullYear(focus.getFullYear() - 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=next-year]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setFullYear(focus.getFullYear() + 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=prev-month]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setMonth(focus.getMonth() - 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		},
		'click [data-role=next-month]': function(ev) {
			var focus = this.get('focus')

			focus.setDate(1)
			focus.setMonth(focus.getMonth() + 1)

			this.months.select(focus.getMonth())
			this.years.select(focus.getYear())

			this.set('focus', focus)
			this.renderPannel()
		}
	},

	setup: function() {
		Calendar.superclass.setup.call(this)

		this.set('selected', this.get('focus'))

		this.renderPannel()
		this._createColumns()
		this._bindEvents()

		this.renderContainer('dates')
	},

	parse: function(val){
		var p = parseInt,v

		if(isString(val)){
			v = val.split('-')
			v = new Date(p(v[0]), p(v[1])-1, p(v[2]))
		} else {
			v = new Date(val)
		}

		return isNaN(v.getTime()) ? null : v
	},

	select: function(date) {
		this.dates.select(date)
		return this
	},

	renderContainer: function(mode, focus) {
		this.set('mode', mode)

		focus = focus || this.get('focus')

		this.dates.hide()
		this.months.hide()
		this.years.hide()

		this.set('focus', focus)

		if (mode === 'dates') {
			this.dates.element.show()
		} else if (mode === 'months') {
			this.months.element.show()
		} else if (mode === 'years') {
			this.years.element.show()
		}

		return this
	},

	renderPannel: function() {
		var focus = this.get('focus'),
			monthPannel = this.element.find('[data-role=current-month]'),
			yearPannel = this.element.find('[data-role=current-year]'),
			lang = this.get('lang')

		monthPannel.text(lang.months[focus.getMonth()])
		yearPannel.text(focus.getFullYear())
	},

	_createColumns: function() {
		var attrs = {
			process: this.get('process'),
			classPrefix: this.get('classPrefix'),
			disableClass: this.get('disableClass'),
			focusClass: this.get('focusClass')
		}

		var focus = this.get('focus'),
			range = this.get('range')

		this.dates = new DateColumn($.extend({}, attrs, {
			focus: focus,
			range: range
		}))

		this.months = new MonthColumn($.extend({}, attrs, {
			focus: focus.getMonth()
		}))

		this.years = new YearColumn($.extend({}, attrs, {
			focus: focus.getFullYear()
		}))

		var container = this.element.find('[data-role=container]')

		container.append(this.dates.element)
		container.append(this.months.element)
		container.append(this.years.element)
	},

	_bindEvents: function() {
		var that = this

		this.on('change:focus', function(focus) {
			that.dates.set('focus', focus)
			that.months.set('focus', focus.getMonth())
			that.years.set('focus', focus.getFullYear())
		})

		this.on('change:range', function(range) {
			that.dates.set('range', convertRange('dates', range))
			that.months.set('range', convertRange('months', range))
			that.years.set('range', convertRange('years', range))
		})

		this.dates.on('select', function(date) {
			that.set('focus', date)
			that.renderPannel()

			that.months.select(date.getMonth())
			that.years.select(date.getFullYear())

			that.set('selected', date)
			that.trigger('select', date)
		})



		this.months.on('select', function(month) {
			var focus = that.get('focus')

			if(focus.getMonth() != month){
				focus.setDate(1)
				focus.setMonth(month)
				that.set('focus', focus)
				that.renderPannel()
				that.renderContainer('dates')
			}
		})

		this.years.on('select', function(year) {
			var focus = that.get('focus')

			if(focus.getFullYear() != year){
				focus.setDate(1)
				focus.setFullYear(year)
				that.set('focus', focus)
				that.renderPannel()
				that.renderContainer('dates')
			}
		})
	},

	destroy: function() {
		this.dates.destroy()
		this.months.destroy()
		this.years.destroy()
		Calendar.superclass.destroy.call(this)
	}
})

Calendar.YearColumn = YearColumn;
Calendar.MonthColumn = MonthColumn;
Calendar.DateColumn = DateColumn;

module.exports = Calendar;

// Helpers
// ----
var tostring = Object.prototype.toString

function isString (val) {
	return tostring.call(val) === '[object String]'
}

function isFunction (val) {
	return tostring.call(val) === '[object Function]'
}

function isArray (val) {
	return tostring.call(val)  === '[object Array]'
}

function cloneDate (date) {
	return new Date(date.getTime())
}

/*function yearMove(date, fullYear){
	var tmpDate = cloneDate(date),
		result = cloneDate(date)

	//获取选择的月份的最后一天
	tmpDate.setDate(1)
	tmpDate.setFullYear(fullYear)
	tmpDate.setMonth(tmpDate.getMonth() + 1)
	tmpDate.setDate(0)

	//处理最后一天是31号，而选择的月份是30号的情况，会自动修正到30号
	if (result.getDate() > tmpDate.getDate()) {
		result = tmpDate
	} else {
		result.setFullYear(fullYear)
	}

	return result
}

function monthMove(date, month){
	var tmpDate = cloneDate(date),
		result = cloneDate(date)

	//获取选择的月份的最后一天
	tmpDate.setDate(1)
	tmpDate.setMonth(month + 1)
	tmpDate.setDate(0)


	//处理最后一天是31号，而选择的月份是30号的情况，会自动修正到30号
	if (result.getDate() > tmpDate.getDate()) {
		result = tmpDate
	} else {
		result.setMonth(month)
	}

	return result
}*/

});


__include__['$'] = $;
__include__['widget/widget'] = FNX.__clz__['fnx/cmp/widget/widget'];
__include__['templatable/templatable'] = FNX.__clz__['fnx/cmp/templatable/templatable'];
FNX.__clz__['fnx/cmp/calendar/calendar'] = __using__('calendar/calendar');

})(window);

//script
}, window));


