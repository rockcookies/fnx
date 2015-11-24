var ns = window.FNX = (window.FNX || {});

var classes = ns.__cls = ns.__cls || {};

exports.register = ns.register = ns.register || function (name, Clz) {
	classes[name] = Clz;
};

exports.include = ns.include = ns.include || function (name) {
	return classes[name];
};