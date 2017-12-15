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
            },],
            groups:[{fields:["datetime","date"],},
                {fields:["text","password"]},{
                    comXtype:$Component.BOOTSTRAPGRID,
                    comConf:{
                        thead: ["test1", "test2", "test3", "test4", "test5"],
                        colModel: [{
                            name: "periodNum",
                            label: "test1",
                            formatter: function (row) {
                                //获取最后三位数
                                if(!row.periodNum){
                                    return null;
                                }else{
                                    return row.periodNum.substr(8,3);
                                }
                            },
                        }, {name: "result", label: "test2"},
                            {name: "", label: "test3"},
                            {name: "", label: "test4"},
                            {name: "", label: "test5"},
                        ],
                        $url: "/ssResult/getAll.action",
                        data: [
                            ["001","test2","test3","test4","test51"],
                            ["001","test2","test3","test4","test5"],
                            ["001","test2","test3","test4","test5test5"],
                            ["001","test2","test3","test4test4","test5"],
                            ["001","test2","test3","test4","test5"],
                            ["001","test2","test3","test4","test5"],
                            ["001","test2","test3","test4","test5"],
                        ],



                    }
                }]
        });
        var skyFormEditor2 = new skyFormEditor();
        console.info(skyFormEditor2.test.text);
        skyFormEditor2.test.text =2;
        var skyFormEditor3 = new skyFormEditor();
        console.info(skyFormEditor3.test.text);
        return skyFormEditor;
    });

