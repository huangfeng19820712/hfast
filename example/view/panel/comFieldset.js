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
                    oninitialized: function () {
                        //初始化data
                        var that = this;
                        /*var ajaxClient = ApplicationContext.getAjaxClient();
                         ajaxClient.buildClientRequest(this.$url)
                         .addParams({"resultDate": "20120209"})
                         .post(function (compositeResponse) {
                         var obj = compositeResponse.getSuccessResponse();
                         if (obj) {
                         that.data = obj;
                         that.createTbody();
                         }
                         });*/
                    },


                }
            }
        });
        return view;
    });
