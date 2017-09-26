/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/FluidLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem","core/js/layout/Fieldset"],
    function (FluidLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              ToolStripItem,
              Fieldset
    ) {
        var items = [];
        items.push({
            comXtype:$Component.FIELDSET,
            comConf:{
                title:"测试1",
                theme:$Theme.BLUE,
                help:"内容1",
                brief:"摘要1",
                fields:[{
                    label:"时间",
                    name:"datetime",
                    editorType:$Component.DATETIMEEDITOR,
                    className:"col col-6",
                },{
                    label:"日期",
                    name:"date",
                    editorType:$Component.DATEEDITOR,
                    className:"col col-6",
                },{
                    label:"文本",
                    name:"text",
                    editorType:$Component.TEXTEDITOR,
                    className:"col col-6",
                },{
                    label:"password",
                    name:"text",
                    editorType:$Component.TEXTEDITOR,
                    className:"col col-6",
                    textMode:"password"
                }]
            }
        });


        var view = Fieldset.extend({
            title:"测试1",
            theme:$Theme.BLUE,
            help:"内容1",
            brief:"摘要1",
            mainRegion:{
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
            }
        });
        return view;
    });
