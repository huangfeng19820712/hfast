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
                        pluginConf:{
                            renderNode:function(event,data){
                                var node = data.node;
                                //$(node.span).find(">.fancytree-title").addClass("label rounded label-success");
                                that.createNodeLabel($(node.span),node.title);
                            },
                        },
                    }
                };
                var that = this;
                this.topToolbarRegion = {
                    comXtype:$Component.TEXTEDITOR,
                    comConf:{
                        placeholder:"查询",
                        buttons:[{
                            text:"查询",
                            iconSkin:"fa-search",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var tree = that.getMainRegionRef().getComRef();
                                var value = this.getParent().getValue();
                                tree.filterNodes( value);
                            }
                        },{
                            text:"过滤选择的节点",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var treePlugin = that.getMainRegionRef().getComRef().getTreePlugin();
                                var filterFunc = treePlugin.filterBranches;
                                filterFunc.call(treePlugin,function(node){
                                    return node.isActive();
                                });
                            }
                        },,{
                            text:"重置",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var treePlugin = that.getMainRegionRef().getComRef().clearFilter();
                            }
                        },]
                    }
                };
            },
            createNodeLabel:function(node,title){
                var find = node.find(".label-number");
                if(!find||find.length==0){
                    node.append("<span class='label-number label rounded label-success pull-right'>"+title+"</span>");
                }
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
