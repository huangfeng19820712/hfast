/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/TabLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        $Component.DROPDOWNMENU.src,
        $Component.MENU.src],
    function (TabLayout, CommonConstant, Region,DropDownMenu,Menu) {
        var view = TabLayout.extend({
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
                this.tabs.push ({
                    label:"字段集组件",
                    closeable:true,
                    content:{
                        comXtype: $Component.FIELDSET,
                        comConf: {
                            fields: [{
                                label: "时间",
                                name: "datetime",
                                editorType: $Component.DATETIMEEDITOR,
                                rules: {
                                    required: true,
                                },
                            },{
                                label: "文本",
                                name: "text",
                                editorType: $Component.TEXTEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            },{
                                label: "日期",
                                name: "date",
                                editorType: $Component.DATEEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }]
                        }
                    }
                });
                for(var i =0;i<50;i++){
                    this.tabs.push({
                        closeable:i%2==0?true:false,
                        label:"字符串"+i,
                        content:"字符串"+i
                    });
                }

            }
        });


        return view;
    });
