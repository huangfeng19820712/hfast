/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        $Component.SELECTEDTREEMODEL.src,
        "core/js/context/ApplicationContext",
        "core/js/windows/messageBox"],
    function (Panel, ToolStripItem, CommonConstant, SelectedTreeModel, ApplicationContext, MessageBox) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title: "菜单树",
            help: "内容",
            brief: "右键进行操作",
            model: null,
            roleId: null,
            /**
             *  每次冲服务器端获取的数据，都保存到此对象中
             */
            _treeData: null,
            submitLabel: "保存",
            cancelLabel: "取消",
            /*Panel 配置 End*/
            beforeInitializeHandle: function (options, triggerEvent) {
                this._super();
                var that = this;
                this.mainRegion = {
                    comXtype: $Component.TREE,
                    comConf: {
                        data: this.getTreeData(this.roleId),
                        pluginConf: {
                            //注意 extensions会覆盖Tree中的extensions属性，tree中默认有filter，所以这边也要加上filter
                            extensions: ["childcounter", "contextMenu"],
                            activate: $.proxy(that.unitActive, that),
                            childcounter: {
                                deep: true,
                                hideZeros: true,
                                hideExpanded: false
                            }
                        },
                    }
                };
                var that = this;
                this.topToolbarRegion = {
                    comXtype: $Component.TEXTEDITOR,
                    comConf: {
                        placeholder: "查询",
                        buttons: [{
                            iconSkin: CommonConstant.Icon.CLOSE,
                            //themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function (event) {
                                var tree = that.getMainRegionRef().getComRef();
                                this.getParent().clearValue();
                                tree.clearFilter();
                            }
                        }, {
                            iconSkin: "fa-search",
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function (event) {
                                var tree = that.getMainRegionRef().getComRef();
                                var value = this.getParent().getValue();
                                tree.filterNodes(value);
                            }
                        }]
                    }
                };

                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                    textAlign: $TextAlign.RIGHT,
                    comConf: {
                        /*Panel的配置项 start*/

                        spacing: CommonConstant.Spacing.DEFAULT,
                        itemOptions: [{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: this.submitLabel,
                            onclick: $.proxy(this.saveRoleMenu, this)
                        }, {
                            themeClass: ToolStripItem.ThemeClass.CANCEL,
                            text: this.cancelLabel,
                            onclick: $.proxy(this.onCancel, this)
                        }]
                        /*Panel 配置 End*/
                    }
                };
            },
            /**
             * 修改roleId，同时修改整个form表单的数据
             * @param roleId
             */
            setRoleId: function (roleId) {
                this.roleId = roleId;
                var tree = this.getTreeRef();
                var treeData = this.getTreeData(roleId);
                tree.reload(treeData);
            },

            getTreeRef: function () {
                return this.getMainRegionRef().getComRef();
            },

            /**
             * 获取树节点的数据
             * @param roleId
             */
            getTreeData: function (roleId) {
                var ajaxClient = ApplicationContext.getAjaxClient();
                this.model = new SelectedTreeModel({
                    nameSpace: "role",
                    async: false,
                    titleAttr: "name",
                    parentIdAttr: "pid",
                    ajaxClient: ajaxClient,
                })
                /*unitModel.setAsync(false)
                 unitModel.setTitleAttr("unitName")*/
                //treeModel.setParentIdAttr("pid");
                //treeModel.getAll();
                this.model.getData({
                    methodName: "getMenuByRole",
                    postParam: {
                        roleId: roleId
                    }
                });
                this._treeData = this.model.getTree();
                return this._treeData;
            },
            cancel: function () {
                this.getTreeRef().reload();
            },
            saveRoleMenu: function () {
                var result = this.model.saveSelectedIds(
                    {
                        roleId:this.roleId
                    },
                    this.getSelectedNodeId(),
                    "saveRoleMenu");
                if (!result) {
                    MessageBox.info("没有变更的内容！");
                }else{
                    MessageBox.info("操作成功！");
                }
            },
            getSelectedNodeId: function () {
                var treeRef = this.getTreeRef();
                var selectedNodes = treeRef.getSelectedNodes(false);
                var selectedNodeIds = [];
                for (var i in selectedNodes) {
                    selectedNodeIds.push(selectedNodes[i].data.id);
                }
                return selectedNodeIds;
            },

            /**
             * unit节点被激活时的事件，需要子类覆盖
             * @param event
             * @param data
             */
            unitActive: function (event, data) {
            },
        });
        return view;
    });
