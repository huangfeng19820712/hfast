/**
 * @author:
 * @date: 15-1-8
 */

// Usage:
// Put this in a separate file and load it as the first module
// (See https://github.com/jrburke/requirejs/wiki/Internal-API:-onResourceLoad)
// Methods available after page load:
// rtree.map()
// - Fills out every module's map property under rtree.tree.
// - Print out rtree.tree in the console to see their map property.
// rtree.toUml()
// - Prints out a UML string that can be used to generate UML
// - UML Website: http://yuml.me/diagram/scruffy/class/draw
if($global.model == $cons.model.DEVELOP){
	requirejs.onResourceLoad = function (context, map, depMaps) {
		if (!window.rtree) {
			window.rtree = {
				tree: {},
				map: function() {
					for (var key in this.tree) {
						if (this.tree.hasOwnProperty(key)) {
							var val = this.tree[key];
							for (var i =0; i < val.deps.length; ++i) {
								var dep = val.deps[i];
								val.map[dep] = this.tree[dep];
							}
						}
					}
				},
				toUml: function() {
					var uml = [];

					for (var key in this.tree) {
						if (this.tree.hasOwnProperty(key)) {
							var val = this.tree[key];
							for (var i = 0; i < val.deps.length; ++i) {
								uml.push("[" + key + "]->[" + val.deps[i] + "]");
							}
						}
					}

					return uml.join("\n");
				}
			};
		}

		var tree = window.rtree.tree;

		function Node() {
			this.deps = [];
			this.map = {};
		}

		if (!tree[map.name]) {
			tree[map.name] = new Node();
		}

		// For a full dependency tree
		if (depMaps) {
			for (var i = 0; i < depMaps.length; ++i) {
				if(depMaps[i]&&depMaps[i].name){
					tree[map.name].deps.push(depMaps[i].name);
				}
			}
		}

// For a simple dependency tree

//    if (map.parentMap && map.parentMap.name) {
//        if (!tree[map.parentMap.name]) {
//            tree[map.parentMap.name] = new Node();
//        }
//
//        if (map.parentMap.name !== map.name) {
//            tree[map.parentMap.name].deps.push(map.name);
//        }
//    }

	};
}


define(["underscore","URI","backbone"], function (_,URI) {

	//获取location
	var $uri = URI(location.href);
	var data = $uri.query(true);
	var jsPath= data[$cons.jsPathParamName];
	if(_.isString(jsPath)){
		run(jsPath);
	}else{
		//如果没有查询值，则把查找当前文件的后缀换成js
		var pathName =  $uri.pathname();
		//
		if(_.isString(pathName)){
			var len = pathName.lastIndexOf(".");
			pathName = pathName.substring(0, len)+".js";
			run(pathName);
	}
	}

	function run(pathName){
		require([pathName],function(Application){
			if(_.isObject(Application)){
				$global.app = new Application();
				if(_.isFunction($global.app.run)){
					$global.app.run();
				}
			}
		});
	}

});
