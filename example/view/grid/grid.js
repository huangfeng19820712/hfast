/**
 * @author:   * @date: 2016/1/17
 */
define([
        "backbone",
        "core/js/grid/BootstrapGrid",
        "core/js/windows/Window", "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils",
        "core/js/model/PageModel"],
    function (Backbone, BootstrapGrid, Window,
              ApplicationContext, ApplicationUtils,PageModel) {
        var view = BootstrapGrid.extend({
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
            $url: "/ssResult/getAll.action",
            data:null,
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

            },


        });

        return view;
    });
