<banner>
<info>

!(function(factory,window){
	if(typeof define == 'function' && define.cmd){
		define(function(require){
			<requires>
			factory(window);
			return window.<namespace>;
		})
	} else {
		factory(window);
	}
}(function(window){
//script

!(function(window){
	var ns = window.<namespace> || (window.<namespace> = {});
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

<modules>

//script
}, window));


