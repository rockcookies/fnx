/**
name    : FNX-UI
author  : by FNX-UI Team
version : 1.0.0
email   : hqy321@gmail.com
**/



/**===============================
modules : 
switchable/switchable	
switchable/carousel	
switchable/slide
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

//script
}, window));


