/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/TabLayout",
        "core/js/CommonConstant", "core/js/view/Region",],
    function (TabLayout, CommonConstant, Region) {
        var mydata = [
            { id: "1", invdate: "2007-10-01", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
            { id: "2", invdate: "2007-10-02", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
            { id: "3", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" },
            { id: "4", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
            { id: "5", invdate: "2007-10-05", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
            { id: "6", invdate: "2007-09-06", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" },
            { id: "7", invdate: "2007-10-04", name: "test", note: "note", amount: "200.00", tax: "10.00", total: "210.00" },
            { id: "8", invdate: "2007-10-03", name: "test2", note: "note2", amount: "300.00", tax: "20.00", total: "320.00" },
            { id: "9", invdate: "2007-09-01", name: "test3", note: "note3", amount: "400.00", tax: "30.00", total: "430.00" }
        ];

        var view = TabLayout.extend({
            onshowTab:function(event){
                var tabId = $(event.target).parent().data("tabId");
                console.info("before>"+tabId);

            },
            onshownTab:function(event){
                var tabId = $(event.target).parent().data("tabId");
                console.info("after>"+tabId);
            },
            tabs: [{
                label:"字段集组件",
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
            },{
                label:"字符串",
                content:"字符串"
            },{
                label:"表格1",
                content:{
                    comXtype:$Component.JQGRID,
                    comConf:{
                        datatype: "local",
                        data: mydata,
                        colModel: [
                            { label: 'Inv No', name: 'id', width: 75, key:true },
                            { label: 'Date', name: 'invdate', width: 90 },
                            { label: 'Client', name: 'name', width: 100 },
                            { label: 'Amount', name: 'amount', width: 80 },
                            { label: 'Tax', name: 'tax', width: 80 },
                            { label: 'Total', name: 'total', width: 80 },
                            { label: 'Notes', name: 'note', width: 150 }
                        ],
                        pageable:false,
                        filterable:false,
                    }
                }
            },{
                label:"表格2",
                content:{
                    comXtype:$Component.JQGRID,
                    comConf:{
                        datatype: "local",
                        data: mydata,
                        colModel: [
                            { label: 'Inv No', name: 'id', width: 75, key:true },
                            { label: 'Date', name: 'invdate', width: 90 },
                            { label: 'Client', name: 'name', width: 100 },
                            { label: 'Amount', name: 'amount', width: 80 },
                            { label: 'Tax', name: 'tax', width: 80 },
                            { label: 'Total', name: 'total', width: 80 },
                            { label: 'Notes', name: 'note', width: 150 }
                        ],
                        pageable:false,
                        filterable:false,
                    }
                }
            }]
        });


        return view;
    });
