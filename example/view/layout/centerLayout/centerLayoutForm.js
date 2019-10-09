/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/CenterLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel"],
    function (CenterLayout, CommonConstant,Region,Panel) {
        var view = CenterLayout.extend({
            beforeInitializeHandle:function(){
                this.item = {
                    comXtype:$Component.FORMPANEL,
                        comConf:{
                        test:{text:1},
                        fields:[{
                            label:"时间",
                            name:"datetime",
                            editorType:$Component.DATETIMEEDITOR,
                        },{
                            label:"日期",
                            name:"date",
                            editorType:$Component.DATEEDITOR,
                        },{
                            label:"文本",
                            name:"text",
                            editorType:$Component.TEXTEDITOR,
                        },{
                            label:"密码",
                            name:"password",
                            editorType:$Component.TEXTEDITOR,
                            textMode:"password"
                        },]
                    }
                }
            }

        });

        return view;
    });

