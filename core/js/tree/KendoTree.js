/**
 * @author:
 * @date: 15-1-9
 */
define([ "jquery", "kendo"],
		function($,kendo,template) {
			var tree = {
				menuTree : function(el) {
					homogeneous = new kendo.data.HierarchicalDataSource({
						type:"json",
						transport : {
							read : {
				            	dataType: "json",
				            	url:$route.getCorePath("Menu")
							}
						},
						schema : {
							model : {
								id : "id",
								hasChildren : "hasChildren"
							}
						}
					});
					$(el).kendoTreeView({
						dataSource : homogeneous,
						dataTextField : "title",
						select : function(event) {
							var dataItem = this.dataItem(event.node);
							var url = dataItem.menuUrl;
						}
					});
				}
			}
			return tree;
		});