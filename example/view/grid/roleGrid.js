/**
 * @author:   * @date: 2016/1/17
 */
define([
        "backbone",
        "core/js/layout/FluidLayout",
        "core/js/model/PageModel" ],
    function (Backbone, FluidLayout,PageModel) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: [{
                comXtype:$Component.FIELDSET,
                comConf:{
                    /*Panel的配置项 start*/
                    title:"查询条件",
                    mainRegion:{
                        comXtype:$Component.DATEEDITOR,
                        comConf:{
                            width: 300,
                            required:true,
                            isShowLabel:false,
                            readOnly:true,
                            disabled:false,
                            float:$cons.float.RIGHT,
                            "label": "test", //指定显示的提示文字。
                            onchangeDate:function(){
                                alert("变更！");
                            },

                        }
                    }
                    /*Panel 配置 End*/
                }
            },{
                comXtype:$Component.BOOTSTRAPGRID,
                comConf:{
                    thead: ["test1", "test2", "test3", "test4", "test5"],
                    colModel: [{
                        name: "periodNum",
                        label: "no.",
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
                    oninitialized: function () {
                        //初始化data
                        var that = this;
                        var data = [];
                        for(var i=0;i<100;i++){
                            data.push([i,i+'000','asdf','asdf','asdf']);
                        }
                        this.model = new PageModel({
                            syncable:false,
                            records:data
                        });

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
            }]
        });

        return view;
    });
