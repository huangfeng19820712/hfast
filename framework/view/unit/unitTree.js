/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        $Component.TREEMODEL.src,
        "core/js/context/ApplicationContext"],
    function (Panel,ToolStripItem,CommonConstant,TreeModel,ApplicationContext) {
        var UNIT_MODEL_URL = "/unit/getAll.action";
        var UnitModel = TreeModel.extend({
            url:UNIT_MODEL_URL,
            nameSpace:"unit",
        });
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"组织树",
            help:"内容",
            brief:"右键进行操作",
            /**
             * 添加节点时间
             */
            onaddnode:null,
            /**
             * 删除节点时间
             */
            ondeletenode:null,
            /*Panel 配置 End*/
            beforeInitializeHandle:function(options, triggerEvent){
                this._super();
                var ajaxClient = ApplicationContext.getAjaxClient();
                var that = this;
                var unitModel = new UnitModel();
                unitModel.setAjaxClient(ajaxClient);
                unitModel.setAsync(false)
                unitModel.setTitleAttr("unitName")
                unitModel.fetch();
                var treeData = unitModel.getTree();
                this.mainRegion={
                    comXtype:$Component.TREE,
                    comConf:{
                        data:treeData,
                        pluginConf:{
                            //注意 extensions会覆盖Tree中的extensions属性，tree中默认有filter，所以这边也要加上filter
                            extensions: ["childcounter","contextMenu"],
                            activate:$.proxy(that.unitActive,that),
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
                                        //unitModel.set
                                        if(node.data&&node.data.id){
                                            unitModel.delete(node.data.id);
                                        }
                                        //删除节点
                                        node.remove();
                                    }else if("addChild"==action){
                                        node.editCreateNode("child", "");
                                        that.trigger("addnode");
                                    }else if("addBrother"==action){
                                        node.editCreateNode("after", {
                                            title: "",
                                        });
                                        that.trigger("addnode");
                                    }

                                }
                            }
                            /*renderNode:function(event,data){
                                var node = data.node;
                                //$(node.span).find(">.fancytree-title").addClass("label rounded label-success");
                                that.createNodeLabel($(node.span),node.title);
                            },*/
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
            registerEvent:function(){
                this._super();

            },


            /**
             * unit节点被激活时的事件，需要子类覆盖
             * @param event
             * @param data
             */
            unitActive:function(event, data){
            },
        });
        return view;
    });
