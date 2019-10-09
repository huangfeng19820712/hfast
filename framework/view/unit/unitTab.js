/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/TabLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/utils/PathUtils",
        $Component.DROPDOWNMENU.src,
        $Component.MENU.src],
    function (TabLayout, CommonConstant, Region,PathUtils,DropDownMenu,Menu) {
        var view = TabLayout.extend({
            lazyRendered:true,
            beforeInitializeHandle:function(options, triggerEvent){
                this._super();
                this.navable = true;
                this.rightToolStripOption =[
                    {
                        toolStripItemType:DropDownMenu,
                        layout:DropDownMenu.layout.right,
                        menus:[{
                            label:"定位当前选项卡",
                            onclick: $.proxy(this.goActiveTab,this)
                        },Menu.SEPARATOR,{
                            label:"关闭当前选项卡",
                            onclick:$.proxy(this.removeActiveTab,this)
                        },{
                            label:"关闭其他选项卡",
                            onclick:$.proxy(this.removeUnActiveTab,this)
                        }]
                    }
                ];
                this.tabs = [];
                var that = this;
                this.tabs.push ({
                    label:"组织详细",
                    closeable:false,
                    content:{
                        comXtype: {
                            src:PathUtils.getCurrentExecutionScriptDirectory()+"/unitForm",
                        },
                        height:"100%",
                        comConf:{
                            height:"100%",
                        },
                    }
                });
                this.tabs.push ({
                    label:"用户信息",
                    closeable:false,
                    content:{
                        comXtype: {
                            src:PathUtils.getCurrentExecutionScriptModuleName()+"/view/user/user",
                        },
                        height:"100%",
                        comConf:{
                            height:"100%",
                        },
                    }
                });
            },
            getUserInfoRef:function(){
                return this.getComponentByIndex("2");
            },
            getUnitFormRef:function(){
                return this.getComponentByIndex("1");
            }
        });


        return view;
    });
