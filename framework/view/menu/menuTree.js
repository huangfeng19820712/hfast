/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        $Component.TREEMODEL.src,
        "core/js/context/ApplicationContext"],
    function (Panel,ToolStripItem,CommonConstant,TreeModel,ApplicationContext) {

        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"菜单树",
            help:"内容",
            brief:"右键进行操作",
            oneditSave:null,
            /*Panel 配置 End*/
            beforeInitializeHandle:function(options, triggerEvent){
                this._super();
                var ajaxClient = ApplicationContext.getAjaxClient();
                var that = this;
                var treeModel = new TreeModel({
                    nameSpace:"menu",
                    async:false,
                    titleAttr:"name",
                    parentIdAttr:"pid",
                    ajaxClient:ajaxClient,
                })
                treeModel.getAll();
                var treeData = treeModel.getTree();
                this.mainRegion={
                    comXtype:$Component.TREE,
                    comConf:{
                        data:treeData,
                        pluginConf:{
                            //注意 extensions会覆盖Tree中的extensions属性，tree中默认有filter，所以这边也要加上filter
                            extensions: ["childcounter","contextMenu"],
                            activate:$.proxy(that.menuActive,that),
                            childcounter: {
                                deep: true,
                                hideZeros: true,
                                hideExpanded: false
                            },
                            contextMenu: {
                                menu: {
                                    "addChild": {"name": "新增子节点", "icon": "add"},
                                    "addBrother": {"name": "新增兄弟节点", "icon": "add"},
                                    "delete": {"name": "删除", "icon": "delete"},
                                },
                                actions: function (node, action, options) {
                                    if("delete"==action){
                                        if(node.data&&node.data.id){
                                            treeModel.delete(node.data.id);
                                        }
                                        //删除节点
                                        node.remove();
                                    }else if("addChild"==action){
                                        node.editCreateNode("child", "");
                                    }else if("addBrother"==action){
                                        node.editCreateNode("after", {
                                            title: "",
                                        });
                                    }

                                }
                            }
                            /*renderNode:function(event,data){
                                var node = data.node;
                                //$(node.span).find(">.fancytree-title").addClass("label rounded label-success");
                                that.createNodeLabel($(node.span),node.title);
                            },*/
                        },
                        oneditClose:function(event,data){
                            //console.info(data.node.title+">>>");
                            var tree = that.getMainRegionRef().getComRef();
                            //data.nodes.data.name = data.node.title;
                            tree.activateByKey(data.node.key);

                        },
                    }
                };
                var that = this;
                this.topToolbarRegion = {
                    comXtype:$Component.TEXTEDITOR,
                    comConf:{
                        placeholder:"查询",
                        buttons:[{
                            iconSkin:CommonConstant.Icon.CLOSE,
                            //themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var tree = that.getMainRegionRef().getComRef();
                                this.getParent().clearValue();
                                tree.clearFilter();
                            }
                        },{
                            iconSkin:"fa-search",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var tree = that.getMainRegionRef().getComRef();
                                var value = this.getParent().getValue();
                                tree.filterNodes( value);
                            }
                        }]
                    }
                };
            },
            /**
             * menu节点被激活时的事件，需要子类覆盖
             * @param event
             * @param data
             */
            menuActive:function(event, data){
            }
        });
        return view;
    });
