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
                        thead: ["XX", "值", "十位", "个位", "后三"],
                        colModel: [{
                            name: "periodNum",
                            label: "期号",
                            formatter: function (row) {
                                //获取最后三位数
                                if(!row.periodNum){
                                    return null;
                                }else{
                                    return row.periodNum.substr(8,3);
                                }
                            },
                        }, {name: "result", label: "开奖号"},
                            {name: "", label: "十位"},
                            {name: "", label: "个位"},
                            {name: "", label: "后三"},
                        ],
                        $url: "/ssResult/getAll.action",
                        data: [
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                            ["001","2 7 0 0 9","小双","大单","组三"],
                        ],
                        /*oninitialized: function () {
                            //初始化data
                            var that = this;
                            /!*var ajaxClient = ApplicationContext.getAjaxClient();
                             ajaxClient.buildClientRequest(this.$url)
                             .addParams({"resultDate": "20120209"})
                             .post(function (compositeResponse) {
                             var obj = compositeResponse.getSuccessResponse();
                             if (obj) {
                             that.data = obj;
                             that.createTbody();
                             }
                             });*!/
                        },*/


                    }
                }]
        });

        return skyFormEditor;
    });

