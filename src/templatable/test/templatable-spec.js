var Templatable = require('../templatable');
var Widget = require('widget/widget');
var $ = require('$');


describe('Templatable', function () {

var globalVar = {};

afterEach(function () {
	for (var v in globalVar) {
		globalVar[v].destroy();
	}
	globalVar = {};
});

var TemplatableWidget = Widget.extend({
	Implements: Templatable
});

it('normal usage', function () {

	var widget = globalVar.widget = new TemplatableWidget({
		template: '<div><h3><%=title%></h3><p><%=content%></p></div>',
		model: {
			title: 'Big Bang',
			content: 'It is very cool.'
		}
	});

	expect(widget.$('h3').text()).toEqual('Big Bang');
	expect(widget.$('p').text()).toEqual('It is very cool.');
});

it('model.toJSON()', function () {

	var A = TemplatableWidget.extend({});

	var a = globalVar.a = new A({
		template: '<div><%=content%></div>',
		model: {
			toJSON: function () {
				return {
					'content': 'xx'
				};
			}
		}
	});

	a.render();
	expect(a.element.html()).toEqual('xx');
});

});