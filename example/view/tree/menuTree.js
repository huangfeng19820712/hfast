/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel"],
    function (Panel) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",

            /*Panel 配置 End*/
            oninitialized:function(triggerEvent){
                this._super();
                this.mainRegion={
                    comXtype:$Component.TREE,
                        comConf:{
                        data:[this.getModuleTree("core/js/base/AbstractView")],
                    }
                };
                var that = this;
                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                        comConf: {
                        /*Panel的配置项 start*/
                        textAlign: $TextAlign.RIGHT,
                            items: [{
                            text: "展开所有节点",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().expandAll();
                            },
                        },{
                            text: "折叠所有节点",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().collapseAll();
                            },
                        }]
                        /*Panel 配置 End*/
                    }
                };
            }
        });
        return view;
    });
