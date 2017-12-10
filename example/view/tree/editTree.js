/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/windows/messageBox",
        "core/js/utils/ApplicationUtils"],
    function (Panel,ToolStripItem,CommonConstant,MessageBox,ApplicationUtils) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            /*Panel 配置 End*/
            beforeInitializeHandle:function(options, triggerEvent){
                this._super();
                var menuTree = this.getMenuTree();
                this.mainRegion={
                    comXtype:$Component.TREE,
                        comConf:{
                        data:menuTree,
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
                            text: "修改节点名称",
                            onclick: function (e) {
                                var node = that.getMainRegionRef().getComRef().getActiveNode();
                                node.setTitle("修改成功！");
                            },
                        },{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "获取00节点信息",
                            onclick: function (e) {
                                var node = that.getMainRegionRef().getComRef().getNodeByKey("00");
                                MessageBox.info(node.title);
                            },
                        },{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "添加子节点",
                            onclick: function (e) {
                                var node = that.getMainRegionRef().getComRef().getActiveNode();
                                if( !node ) {
                                    MessageBox.info("请选择要添加的父节点.");
                                    return;
                                }
                                node.editCreateNode("child", "Node title");
                            },
                        },{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "添加相邻节点",
                            onclick: function (e) {
                                var node = that.getMainRegionRef().getComRef().getActiveNode();
                                if( !node ) {
                                    MessageBox.info("请选择要添加的父节点.");
                                    return;
                                }
                                node.editCreateNode("after", {
                                    title: "Node title",
                                    folder: true
                                });
                            },
                        },{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "删除节点",
                            onclick: function (e) {
                                var node = that.getMainRegionRef().getComRef().getActiveNode();
                                if( !node ) {
                                    MessageBox.info("请选择要添加的父节点.");
                                    return;
                                }
                                node.remove()
                            },
                        },{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: "删除00节点",
                            onclick: function (e) {
                                that.getMainRegionRef().getComRef().removeByKey("00");
                            },
                        }]
                        /*Panel 配置 End*/
                    }
                };
            },
            getMenuTree:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                var application = applicationContext.getApplication();
                var menuObj = application.getMenu();
                var menuDates = menuObj.getMenuDates();
                var menus = menuObj.getMenus(menuDates);
                var clone = _.clone(menus);
                var treeData = [];
                if(clone){
                    var that = this;
                    _.each(clone,function(item,i,list){
                        var node = that.getTreeNode(item);
                        treeData.push(node);
                    });
                }
                return treeData;
            },
            /**
             * 创建树的节点
             * @param menu
             * @returns {{}}
             */
            getTreeNode:function(menu){
                var node = {};
                node.key = menu.id;
                node.title = menu.name;

                if(menu.subMenu){
                    node.children = [];
                    node.folder = true;
                    var that = this;
                    _.each(menu.subMenu,function(item,i,list){
                        var childNode = that.getTreeNode(item);
                        node.children.push(childNode);
                    });
                }
                return node;
            },
        });
        return view;
    });
