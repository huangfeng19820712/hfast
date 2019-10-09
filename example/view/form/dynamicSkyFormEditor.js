/**
 * @author:   * @date: 2015/12/7
 */
define([
        "backbone",
        "core/js/form/SkyFormEditor",
        "core/js/editors/TextEditor",
        "core/js/windows/Window"],
    function (Backbone,SkyFormEditor, TextEditor, Window) {
        var skyFormEditor = SkyFormEditor.extend({
            totalColumnNum: 3,
            test:{text:1},
            focusFirstEditorable:false,
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
                hidden:true,
                value:"asdfdasf",
                name:"text",
                editorType:$Component.TEXTEDITOR,
            },{
                label:"密码",
                name:"password",
                editorType:$Component.TEXTEDITOR,
                textMode:"password"
            }],
            beforeInitializeHandle:function(options, triggerEvent){
                var that = this;
                this.groups=[{fields:["datetime","date"]},
                    {fields:["text","password"]},{
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            itemOptions:[  {
                                text:"添加字段",
                                onclick:function(event){
                                    var editor = this.parent.parent.parent;
                                    editor.getFieldset(2);
                                    console.info(event);
                                    editor.addFields([{
                                        label:"时间",
                                        name:"datetime1",
                                        editorType:$Component.DATETIMEEDITOR,
                                    },{
                                        label:"日期",
                                        name:"date2",
                                        editorType:$Component.DATEEDITOR,
                                    }],1);
                                }
                            },{
                                text: "取值",
                                onclick: function (e) {
                                    var editor = this.parent.parent.parent;
                                    var values = editor.getValue("datetime1");
                                    var allFieldValue = editor.getAllFieldValue();
                                    console.info(allFieldValue);
                                }
                            }

                            ]
                        }
                    }];
            },

        });
        var skyFormEditor2 = new skyFormEditor();
        console.info(skyFormEditor2.test.text);
        skyFormEditor2.test.text =2;
        var skyFormEditor3 = new skyFormEditor();
        console.info(skyFormEditor3.test.text);
        return skyFormEditor;
    });

