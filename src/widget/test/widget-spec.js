var $ = require('$');
var Widget = require('../widget');

describe('Widget', function() {
  var globalVar = {}

  afterEach(function() {
    for (var v in globalVar) {
      globalVar[v].destroy();
    }
    globalVar = {}
  })

  it('initAttrs', function() {
    var div = $('<div id="a"></div>').appendTo(document.body)

    var WidgetA = Widget.extend({
      attrs: {
        element: '#default',
        foo: 'foo',
        template: '<span></span>',
        model: {
          title: 'default title',
          content: 'default content'
        }
      }
    })

    var a = globalVar.a = new WidgetA({
      element: '#a',
      bar: 'bar',
      template: '<a></a>',
      model: {
        title: 'title a'
      }
    })

    // 传入的
    expect(a.get('bar')).toEqual('bar')

    // 继承的
    expect(a.get('foo')).toEqual('foo')

    // 覆盖的
    expect(a.get('template')).toEqual('<a></a>')

    // 混入的
    expect(a.get('model').title).toEqual('title a')
    expect(a.get('model').content).toEqual('default content')

    // attr 式属性
    expect(a.element[0].id).toEqual('a')

    div.remove()
  })

  it('parseElement', function() {
    var div = $('<div id="a"></div>').appendTo(document.body)

    // 如果 config 里不传 element，默认用 $('<div></div>') 构建
    var widget = globalVar.widget = new Widget()
    expect(widget.element[0].tagName).toEqual('DIV')

    // 如果传入 selector，会自动转为为 $ 对象
    widget = globalVar.widget = new Widget({ element: '#a' })
    expect(widget.element[0].id).toEqual('a')

    // 如果传入 DOM 对象，会自动转换为 $ 对象
    widget = globalVar.widget = new Widget({ element: document.getElementById('a') })
    expect(widget.element[0].id).toEqual('a')

    // 如果传入 $ 对象，保持不变
    widget = globalVar.widget = new Widget({ element: $('#a') })
    expect(widget.element[0].id).toEqual('a')

    // 如果传入的 dom 对象不存在，则报错
    try {
      new Widget({ element: '#b' })
      expect('应该抛错').toEqual('没有抛错')
    } catch (e) {
    }

    // 同时传入 template 和 element 时，element 优先
    widget = globalVar.widget = new Widget({ element: '#a', template: '<span></span>' })
    expect(widget.element[0].tagName).toEqual('DIV')

    // 只传入 template 时，从 template 构建
    widget = globalVar.widget = new Widget({ template: '<span></span>' })
    expect(widget.element[0].tagName).toEqual('SPAN')

    div.remove()
  })

  describe('delegateEvents / undelegateEvents', function() {
    it('delegateEvents()', function() {
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var event;
      var TestWidget = Widget.extend({
        events: {
          'click p': 'fn1',
          'click li': 'fn2',
          'mouseenter span': 'fn3'
        },
        fn1: spy1,
        fn2: spy2,
        fn3: function(ev) {
          spy3()
          event = ev
          that = this
        }
      })

      var widget = globalVar.widget = new TestWidget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.$('p').trigger('click')
      expect(spy1.called).toBe(true)
      spy1.reset()

      widget.$('li').trigger('click')
      expect(spy2.called).toBe(true)
      spy2.reset()

      widget.element.trigger('click')
      expect(spy1.called).not.toBe(true)
      expect(spy2.called).not.toBe(true)
      spy1.reset()
      spy2.reset()

      widget.$('span').trigger('mouseenter')
      expect(spy3.called).toBe(true)
      expect(event.currentTarget.tagName).toEqual('SPAN')
      expect(that).toEqual(widget)
    })

    it('delegateEvents(eventsObject)', function() {
      var spy1 = sinon.spy()
      var spy2 = sinon.spy()
      var TestWidget = Widget.extend({
        fn1: spy1
      })
      var widget = globalVar.widget = new TestWidget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents({
        'click p': 'fn1',
        'click span': spy2
      })

      widget.$('p').trigger('click')
      expect(spy1.called).toBe(true)

      widget.$('span').trigger('click')
      expect(spy1.called).toBe(true)
    });

    it('delegateEvents(events, handler)', function() {
      var spy = sinon.spy()
      var widget = globalVar.widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents('click p', spy)
      widget.$('p').trigger('click')
      expect(spy.called).toBe(true)
    });

    it('delegateEvents(element, events, handler)', function() {
      var dom = $('<div><p></p></div>')
      var spy1 = sinon.spy()
      var spy2 = sinon.spy()
      var widget = globalVar.widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents(dom, 'click', spy1)
      widget.delegateEvents(dom, 'click p', spy2)

      widget.$('p').trigger('click')
      expect(spy2.called).not.toBe(true)

      dom.trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).not.toBe(true)
      spy1.reset()
      spy2.reset()

      dom.find('p').trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).toBe(true)
    });

    it('delegateEvents support normal element', function() {
      var dom = $('<div><p></p></div>')[0];
      var spy = sinon.spy()
      var widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents(dom, 'click', spy)

      $(dom).trigger('click')
      expect(spy.called).toBe(true)

      widget.destroy()
    })

    it('undelegateEvents()', function() {
      var spy1 = sinon.spy()
      var spy2 = sinon.spy()
      var spy3 = sinon.spy()
      var widget = globalVar.widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents({
        'click p': spy1,
        'mouseenter': spy2
      })

      var dom = $('<div></div>')
      widget.delegateEvents(dom, 'click', spy3)

      widget.$('p').trigger('click')
      widget.element.trigger('mouseenter')
      dom.trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).toBe(true)
      expect(spy3.called).toBe(true)
      spy1.reset()
      spy2.reset()
      spy3.reset()

      widget.undelegateEvents()
      widget.$('p').trigger('click')
      widget.element.trigger('mouseenter')
      dom.trigger('click')
      expect(spy1.called).not.toBe(true)
      expect(spy2.called).not.toBe(true)
      expect(spy3.called).not.toBe(true)
    });

    it('undelegateEvents(events)', function() {
      var spy1 = sinon.spy()
      var spy2 = sinon.spy()
      var spy3 = sinon.spy()
      var widget = globalVar.widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents({
        'click p': spy1,
        'click span': spy2,
        'click li': spy3
      })

      widget.$('p').trigger('click')
      widget.$('span').trigger('click')
      widget.$('li').trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).toBe(true)
      expect(spy3.called).toBe(true)
      spy1.reset()
      spy2.reset()
      spy3.reset()

      widget.undelegateEvents('click span')
      widget.$('p').trigger('click')
      widget.$('span').trigger('click')
      widget.$('li').trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).not.toBe(true)
      expect(spy3.called).toBe(true)
      spy1.reset()
      spy2.reset()
      spy3.reset()

      widget.undelegateEvents('click')
      widget.$('p').trigger('click')
      widget.$('span').trigger('click')
      widget.$('li').trigger('click')
      expect(spy1.called).not.toBe(true)
      expect(spy2.called).not.toBe(true)
      expect(spy3.called).not.toBe(true)
    })

    it('undelegateEvents(element, events)', function() {
      var dom = $('<div><p></p><ul><li></li></ul><span></span></div>')
      var spy1 = sinon.spy()
      var spy2 = sinon.spy()
      var spy3 = sinon.spy()
      var widget = globalVar.widget = new Widget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.delegateEvents(dom, 'click p', spy1)
      widget.delegateEvents(dom, 'click li', spy2)
      widget.delegateEvents(dom, 'click span', spy3)

      widget.undelegateEvents(dom, 'click li')
      dom.find('p').trigger('click')
      dom.find('li').trigger('click')
      dom.find('span').trigger('click')
      expect(spy1.called).toBe(true)
      expect(spy2.called).not.toBe(true)
      expect(spy3.called).toBe(true)
      spy1.reset()
      spy2.reset()
      spy3.reset()

      widget.undelegateEvents(dom, 'click')
      dom.find('p').trigger('click')
      dom.find('li').trigger('click')
      dom.find('span').trigger('click')
      expect(spy1.called).not.toBe(true)
      expect(spy2.called).not.toBe(true)
      expect(spy3.called).not.toBe(true)
    })

    it('#66 extend delegateEvents', function() {
      var spy = sinon.spy()
      var TestWidget = Widget.extend({
        events: {
          'click p': spy
        },
        delegateEvents: function(element, events, handler) {
          return TestWidget.superclass.delegateEvents.call(this, element, events, handler);
        },
        undelegateEvents: function(element, eventKey) {
          return TestWidget.superclass.undelegateEvents.call(this, element, eventKey);
        }
      })
      var widget = globalVar.widget = new TestWidget({
        template: '<div><p></p><ul><li></li></ul><span></span></div>'
      }).render()

      widget.$('p').trigger('click')
      expect(spy.called).toBe(true)
    });
  })

  it('events hash can be a function', function() {
    var counter = 0

    var TestWidget = Widget.extend({

      events: function() {
        return {
          'click h3': 'incr',
          'click p': 'incr'
        }
      },

      incr: function() {
        counter++
      }
    })

    var widget = globalVar.widget = new TestWidget({
      template: '<div><h3></h3><p></p></div>'
    }).render()

    widget.$('h3').trigger('click')
    expect(counter).toEqual(1)

    counter = 0
    widget.$('p').trigger('click')
    expect(counter).toEqual(1)
  })

  it('the default event target is `this.element`', function() {
    var counter = 0

    var TestWidget = Widget.extend({

      events: function() {
        return {
          'click': 'incr'
        }
      },

      incr: function() {
        counter++
      }
    })

    var widget = globalVar.widget = new TestWidget().render()
    widget.element.trigger('click')
    expect(counter).toEqual(1)
  })

  it('parentNode is a document fragment', function() {
    var id = 'test' + new Date()
    var divs = $('<div id="' + id + '"></div><div></div>')

    new Widget({
      element: divs.eq(0),
      parentNode: document.body
    }).render()

    expect(document.getElementById(id).nodeType).toEqual(1)
  })

  it('template in delegate-events', function() {
    var counter = 0

    var A = Widget.extend({

      attrs: {
        buttons: 'button'
      },

      events: {
        'click p': 'incr',
        'click button': 'incr'
      },

      incr: function() {
        counter++
      }
    })

    var a = globalVar.a = new A({
      template: '<div><header>x</header><button>x</button><p>x</p><div id="ttt"></div></div>'
    }).render()

    a.$('p').trigger('click')
    expect(counter).toEqual(1)

    counter = 0
    $(a.get('buttons')).trigger('click')
    expect(counter).toEqual(1)
  })

  it('delegate events inherited from ancestors', function() {
    var counter = 0

    function incr() {
      counter++
    }

    var A = Widget.extend({
      events: {
        'click p': incr
      }
    })

    var B = A.extend({
      events: {
        'click div': incr
      }
    })

    var object = globalVar.object = new B({
      template: '<section><p></p><div></div><span></span></section>',
      events: {
        'click span': incr
      }
    }).render()

    counter = 0
    object.$('p').trigger('click')
    expect(counter).toEqual(1)

    counter = 0
    object.$('div').trigger('click')
    expect(counter).toEqual(1)

    counter = 0
    object.$('span').trigger('click')
    expect(counter).toEqual(1)
  })

  it('#76: set default attrs automatically', function() {

    var A = Widget.extend({
      attrs: {
        a: 1,
        b: 1
      },

      _onRenderA: function(val) {
        this.a = val
      }
    })

    var a = globalVar.a = new A({ b: 2 })
    expect(a.get('a')).toEqual(1)
    expect(a.get('b')).toEqual(2)
    expect(a.a).toEqual(undefined)

    a.render()
    expect(a.a).toEqual(1)
  })

  it('set attribute before render method', function() {
    var r = [], p = []

    var A = Widget.extend({
      attrs: {
        a: 1
      },

      _onRenderA: function(val, prev) {
        r.push(val)
        p.push(prev)
      }
    })

    var a = globalVar.a = new A({ a: 2 })
    a.set('a', 3)
    a.render()

    expect(r.join()).toEqual('3')
    expect(p.join()).toEqual('')
  })

  it('default values in attrs', function() {
    var boolSpy = sinon.spy()
    var strSpy = sinon.spy()
    var str2Spy = sinon.spy()
    var objSpy = sinon.spy()
    var obj2Spy = sinon.spy()
    var arrSpy = sinon.spy()
    var nullSpy = sinon.spy()
    var undefinedSpy = sinon.spy()
    var functionSpy = sinon.spy()

    var A = Widget.extend({
      attrs: {
        bool: false,
        str: '',
        str2: 'x',
        obj: {},
        obj2: {a: 1},
        arr: [],
        n: null,
        u: undefined,
        fn: function() {}
      },

      _onRenderBool: boolSpy,
      _onRenderStr: strSpy,
      _onRenderStr2: str2Spy,
      _onRenderObj: objSpy,
      _onRenderObj2: obj2Spy,
      _onRenderArr: arrSpy,
      _onRenderN: nullSpy,
      _onRenderU: undefinedSpy,
      _onRenderFn: functionSpy
    })

    var a = globalVar.a = new A()

    // 未调用 render() 之前都未执行
    expect(boolSpy.calledOnce).not.toBe(true)
    expect(strSpy.calledOnce).not.toBe(true)
    expect(str2Spy.calledOnce).not.toBe(true)
    expect(objSpy.calledOnce).not.toBe(true)
    expect(obj2Spy.calledOnce).not.toBe(true)
    expect(arrSpy.calledOnce).not.toBe(true)
    expect(nullSpy.calledOnce).not.toBe(true)
    expect(undefinedSpy.calledOnce).not.toBe(true)
    expect(functionSpy.calledOnce).not.toBe(true)

    // 只有 bool / str2 / fn3 的改变会触发事件
    a.render()
    expect(boolSpy.calledOnce).toBe(true)
    expect(strSpy.calledOnce).toBe(true)
    expect(str2Spy.calledOnce).toBe(true)
    expect(objSpy.calledOnce).toBe(true)
    expect(obj2Spy.calledOnce).toBe(true)
    expect(arrSpy.calledOnce).toBe(true)
    expect(nullSpy.calledOnce).not.toBe(true)
    expect(undefinedSpy.calledOnce).not.toBe(true)
    expect(functionSpy.calledOnce).toBe(true)
    boolSpy.reset()
    str2Spy.reset()

    // 测试 onXxx
    var b = globalVar.b = new A({
      bool: null,
      str2: ''
    }).render()

    expect(boolSpy.called).not.toBe(true)
    expect(str2Spy.calledOnce).toBe(true)
  })

  it('call render() after first render', function() {
    var counter = 0

    function incr() {
      counter++
    }

    var A = Widget.extend({
      attrs: {
        a: 1
      },

      _onRenderA: incr
    })

    var a = globalVar.a = new A()
    a.render()
    expect(counter).toEqual(1)

    a.render()
    expect(counter).toEqual(1)
  })

  it('statics white list', function() {

    var A = Widget.extend()

    expect(typeof A.autoRender).toEqual('function')
    expect(typeof A.autoRenderAll).toEqual('undefined')
  })

  it('data attr api', function() {
    var div = $('<div id="data-attr-api-test" widget-options=\'a:1,b:"b",arr:[1,2,3],c:true,d:{num: 1, str: "s", bool: true}\'></div>')
        .appendTo(document.body)

    var t = globalVar.t = new Widget({ element: '#data-attr-api-test', b: 'b2' })

    expect(t.get('a')).toEqual(1)
    expect(t.get('b')).toEqual('b2')
    expect(t.get('c')).toEqual(true)
    expect(t.get('d').num).toEqual(1)
    expect(t.get('d').str).toEqual('s')
    expect(t.get('d').bool).toEqual(true)
    expect(t.get('arr')).toEqual([1, 2, 3])
  })

  it('onXx setter in attrs', function() {
    var counter = 0

    function incr() {
      counter++
    }

    var helpers = { 'a': incr }

    var TestWidget = Widget.extend({

      attrs: {
        onXx: function() {
          counter++
        },
        onYy: {
          setter: function(val) {
            return helpers[val]
          }
        }
      },

      test: function() {
        this.trigger('xx')
        this.trigger('yy')
      }
    })

    var t = globalVar.t = new TestWidget({ onYy: 'a' })
    t.test()

    expect(counter).toEqual(2)
  })

  it('inherited attrs', function() {

    var A = Widget.extend({
      attrs: {
        a: '',
        b: null
      }
    })

    var B = A.extend({
      attrs: {
        a: '1'
      }
    })

    var C = B.extend({
      attrs: {
        a: '2',
        b: 'b'
      }
    })

    var c = globalVar.c = new C()

    expect(c.get('a')).toEqual('2')
    expect(c.get('b')).toEqual('b')
  })

  it('#3: parentNode is a jQuery object', function() {

    $('<div id="test1"></div>').appendTo('body');

    var w = globalVar.w = new Widget({ parentNode: $('#test1') })
    w.render()

    expect($('#test1 div').html()).toEqual('')
    $('#test1').remove();
  })

  it('override object in prototype', function() {

    var B = Widget.extend({
      o: { p1: '1' }
    })

    var C = B.extend({
      o: { p2: '2' }
    })

    var c = globalVar.c = new C()
    expect(c.o.p1).toEqual(undefined)
    expect(c.o.p2).toEqual('2')
  })

  it('mix events object in prototype', function() {

    var B = Widget.extend({
      events: { p1: '1' }
    })

    var C = B.extend({
      events: { p2: '2' }
    })

    var c = globalVar.c = new C()
    expect(c.events.p1).toEqual('1')
    expect(c.events.p2).toEqual('2')
  })

  it('#38 destroy', function() {

    var A = new Widget({
      template: '<div id="destroy"><a></a></div>'
    }).render()

    expect(A.element[0]).toEqual($('#destroy')[0])

    A.destroy()
    expect($('#destroy')[0]).toBe(undefined)
    expect(A.element).toBe(null)
  })

  it('#25 destroy is called twice', function() {

    var A = new Widget({
      template: '<div id="destroy"><a></a></div>'
    }).render()

    expect(function() {
      A.destroy()
      A.destroy()
    }).not.toThrow()
  })

  it('style attribute', function() {
    var A = new Widget({
      style: {
        padding: '1px'
      },
      template: '<div id="destroy"><a></a></div>'
    }).render()

    expect(A.element.css('paddingTop')).toBe('1px')
  })

  it('_isTemplate', function() {
    var dom = $('<p id="test"></p>').appendTo(document.body)
    var A = new Widget({element: '#test'})
    expect(A.__isTemplate).not.toBe(true)

    var B = new Widget()
    expect(B.__isTemplate).toBe(true)

    var C = new Widget({template: '<p></p>'})
    expect(C.__isTemplate).toBe(true)

    dom.remove()
  })

  it('attr change callback', function() {
    var spy = sinon.spy()
    var Test = Widget.extend({
      attrs: {
        a: 1
      },
      _onChangeA: spy
    })

    var test = new Test()
    test.set('a', 2)
    expect(spy.calledOnce).toBe(true)
  })

  it('set call onRender', function() {
    var spy = sinon.spy()
    var A = Widget.extend({
      attrs: {
        a: 1
      },
      _onRenderA: spy
    })

    var a = new A()

    a.render()
    expect(spy.calledOnce).toBe(true)

    a.set('a', 2)
    expect(spy.calledTwice).toBe(true)
  })

  it('destroy once', function() {
    var calledA = 0, calledB = 0
    var A = Widget.extend({
      destroy: function() {
        calledA++
        A.superclass.destroy.call(this)
      }
    })

    var B = A.extend({
      destroy: function() {
        calledB++
        B.superclass.destroy.call(this)
      }
    })

    var c = new B().render()
    c.destroy()
    c.destroy()

    expect(calledA).toBe(1)
    expect(calledB).toBe(1)
  })

  // https://github.com/aralejs/base/issues/22
  it('set attribute to htmlElement', function() {
    var A = Widget.extend({
      attrs: {
        testElement: null
      }
    })
    var a = new A();
    a.set('testElement', document.body)
    expect(a.get('testElement')).toBe(document.body)
  })
})