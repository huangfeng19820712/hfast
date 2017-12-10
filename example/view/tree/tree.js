/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant"],
    function (Panel,ToolStripItem,CommonConstant) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",

            /*Panel 配置 End*/
            beforeInitializeHandle:function(options, triggerEvent){
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
                    textAlign: $TextAlign.RIGHT,
                    comConf: {
                        /*Panel的配置项 start*/
                        spacing: CommonConstant.Spacing.DEFAULT,
                        itemOptions: [{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "展开所有节点",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().expandAll();
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "折叠所有节点",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().collapseAll();
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "销毁树",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().destroy();
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "修改树节点信息",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().setData([
                                    {title: "node1"}
                                ]);
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "重新加载树",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().reload();
                                /*//此种方式同setData
                                that.getMainRegionRef().getComRef().reload([
                                    {title: "node1"}
                                ]);*/
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "切换选择状态",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().toggleSelect();
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "获取被选择的节点(仅包含父节点)",
                            onclick: function (e) {
                                var selectedNodes = that.getMainRegionRef().getComRef().getSelectedNodes(true);
                                console.info(selectedNodes);
                            },
                        }, {
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "获取被选择的节点",
                            onclick: function (e) {
                                var selectedNodes = that.getMainRegionRef().getComRef().getSelectedNodes(false);
                                console.info(selectedNodes);
                            },
                        }]
                        /*Panel 配置 End*/
                    }
                };
            },
            getModuleTree:function(moduleName,arr){
                var va = window.rtree.tree[moduleName];
                var tree = {title: moduleName};
                if(!arr){
                    arr = [];
                }else{
                    if(_.contains(arr,moduleName)){
                        return false;
                    }
                }
                arr.push(moduleName);
                if(va&&va.deps&&va.deps.length>0){
                    tree.children = [];
                    tree.folder=true;
                    for(var i=0;i<va.deps.length;i++){
                        var newTree = this.getModuleTree(va.deps[i],arr);
                        if(newTree){
                            tree.children.push(newTree);
                        }else{
                            if(!tree.count){
                                tree.count = 0;
                            }
                            tree.count++;
                        }
                    }
                }
                return tree;
            }

        });
        return view;
    });
