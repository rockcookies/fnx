var Engine = require('./engine');

// 提供 Template 模板支持
module.exports = {
	// 根据配置的模板和传入的数据，构建 this.element 和 templateElement
	parseElementFromTemplate: function () {
		// template 支持 id 选择器
		var t, template = this.get('template');
		if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
			template = t.innerHTML;
			this.set('template', template);
		}
		this.element = $(this.compile());
	},

	// 编译模板，混入数据，返回 html 结果
	compile: function (template, model) {
		template || (template = this.get('template'));

		model || (model = this.get('model')) || (model = {});

		if (model.toJSON) model = model.toJSON();

		// 生成 html
		var html = Engine.compile(template)(model);

		return html;
	}
}

require('class/class-loader').register('templatable/templatable', module.exports);