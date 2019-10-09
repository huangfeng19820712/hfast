/**
 * @author:   * @date: 2016/2/20
 */
define([$Component.TABLAYOUT.src,
        "core/js/CommonConstant",
        $Component.REGION.src,
        $Component.DROPDOWNMENU.src,
        "core/js/utils/PathUtils",
        $Component.MENU.src],
    function (TabLayout, CommonConstant, Region, DropDownMenu,PathUtils, Menu) {
        var view = TabLayout.extend({
            lazyRendered: true,
            roleId: null,
            roleDate:null,
            /**
             * roleform的提交事件
             */
            onsubmitroleform:null,
            //tabs:,
            beforeInitializeHandle: function (options, triggerEvent) {
                this._super();
                this.navable = true;
                this.rightToolStripOption = [
                    {
                        toolStripItemType: DropDownMenu,
                        layout: DropDownMenu.layout.right,
                        menus: [{
                            label: "定位当前选项卡",
                            onclick: $.proxy(this.goActiveTab, this)
                        }, Menu.SEPARATOR, {
                            label: "关闭当前选项卡",
                            onclick: $.proxy(this.removeActiveTab, this)
                        }, {
                            label: "关闭其他选项卡",
                            onclick: $.proxy(this.removeUnActiveTab, this)
                        }]
                    }
                ];
                /*this.tabs = [];
                var that = this;
                this.tabs.push();
                this.tabs.push();*/
                this.tabs = this.getTabConf();
            },
            getTabConf:function(){
                var that = this;
                return [{
                    label: "角色详细",
                    closeable: false,
                    content: {
                        comXtype: {
                            //需要刷新布局
                            src: PathUtils.getCurrentExecutionScriptDirectory()+"/roleForm",
                        },
                        height: "100%",
                        comConf: {
                            height: "100%",
                            roleId:this.roleId,
                            roleDate:this.roleDate,
                            onsubmit:function(ajaxResponse){
                                that.trigger("submitroleform",ajaxResponse,this.getAllFieldValue());
                            }
                        }
                    }
                },{
                    label: "用户信息",
                    closeable: false,
                    content: {
                        comXtype: {
                            src: PathUtils.getCurrentExecutionScriptModuleName()+"/view/user/user",
                        },
                        height: "100%",
                        comConf: {
                            roleId:this.roleId,
                            height: "100%",
                            url: "/user/getMemberByRole.action",
                        },
                    }
                },{
                    label: "菜单信息",
                    closeable: false,
                    content: {
                        comXtype: {
                            src: PathUtils.getCurrentExecutionScriptDirectory()+"/roleMenuTree",
                        },
                        height: "100%",
                        comConf: {
                            roleId:this.roleId,
                            height: "100%",
                            //url: "/user/getMemberByRole.action",
                        },
                    }
                }
                ];
            },
            /**
             * 设置角色id
             * @param roleId
             */
            //需要根据不同的tab设置roleId
            setRoleId: function (roleId,data) {
                this.roleId = roleId;
                this.roleData = data;
                //先设置激活状态下的页面
                var activeTabId = this.getActiveTabId();
                this.setTabContentRoleId(activeTabId);
                // var deactiveTabIds = this.getDeactiveTabIds();
            },
            setTabContentRoleId: function (tabId) {
                var contentRef = this.getContentRefByTabId(tabId);
                if (contentRef) {
                    if (contentRef.getComRef()) {
                        if (contentRef.getComRef().setRoleId) {
                            contentRef.getComRef().setRoleId(this.roleId,this.roleData);

                        }
                    } else {
                        //还没有初始化组件
                        //修改初始化的数据
                        var items = this.getItems();
                        var itemConfig = _.where(items, {id: this.getContentId(tabId)});
                        itemConfig[0].comConf.postData = {roleId:this.roleId};
                    }
                }
            },
            onresizeCenter:function(){
                var activeTabId = this.getActiveTabId();
                this.resizeTab(activeTabId);
            },
            resizeTab:function(tabId){
                var contentRef = this.getContentRefByTabId(tabId);
                if (contentRef) {
                    if (contentRef.getComRef()) {
                        contentRef.getComRef().resizeLayout();
                    }
                }
            },
            /**
             *
             * @param event
             */
            onshowTab: function (event) {
                var tabId = $(event.target).parent().data("tabId");
                this.setTabContentRoleId(tabId, this.roleId);
            }
        });


        return view;
    });
