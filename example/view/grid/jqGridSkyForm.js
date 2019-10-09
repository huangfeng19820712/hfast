/**
 * @author:   * @date: 2016/1/17
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/controls/Button",
        "core/js/CommonConstant",
    $Component.TOOLSTRIPITEM.src],
    function ( FluidLayout,Button,CommonConstant,ToolStripItem) {
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

        function formatToolStrip(cellValue, options, cellObject){
            var helpButton = new Button({
                $container:$("body"),
                mainContent:"aaaaaaaaaa",
            });
            return  helpButton.$el;

        }

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: [{
                comXtype:$Component.JQGRID,
                comConf:{
                    datatype: "local",
                    data: mydata,
                    colMenu:false,
                    formModel: $cons.JqGrid.formModel.skyForm,
                    postData:{"gridPlugin" : "jqGrid"},
                    colModel: [
                        { label: 'Inv No', name: 'id', width: 75,editable:true, key:true },
                        { label: 'Date', name: 'invdate',editable:true, width: 90 ,editrules : {required : true}},
                        { label: 'Client', name: 'name', editable:true,width: 100 },
                        { label: 'Amount', name: 'amount',editable:true, width: 80 },
                        { label: 'Tax', name: 'tax',editable:true, width: 80 },
                        { label: 'Total', name: 'total',editable:true, width: 80 },
                        { label: '说明', name: 'remark',
                            formatterComConf:function(rowData){
                                if(rowData.id>5){
                                    return {
                                        comXtype:$Component.TOOLSTRIP,
                                        comConf:{
                                            /*Panel的配置项 start*/
                                            textAlign:$TextAlign.RIGHT,
                                            realClass:"btn-group text-right",
                                            spacing :CommonConstant.Spacing.DEFAULT,
                                            itemOptions: [{
                                                themeClass:ToolStripItem.ThemeClass.PRIMARY,
                                                text:"确定",
                                                onclick: function () {
                                                    var items = $utils.getApplicationUtils().getComponentByXtype($Component.JQGRID);
                                                    var gridid = this.getParent().$el.parent().data("gridid");
                                                    var rowid = this.getParent().$el.parent().data("rowid");
                                                    var grid = $utils.getApplicationUtils().getComponentById(gridid);
                                                    var rowData = grid.getRowData(rowid);
                                                    console.info(rowData);
                                                }
                                            }]
                                            /*Panel 配置 End*/
                                        }
                                    };
                                }else{
                                    return {
                                        comXtype:$Component.TOOLSTRIP,
                                        comConf:{
                                            /*Panel的配置项 start*/
                                            textAlign:$TextAlign.RIGHT,
                                            realClass:"btn-group text-right",
                                            spacing :CommonConstant.Spacing.DEFAULT,
                                            itemOptions: [{
                                                themeClass:ToolStripItem.ThemeClass.PRIMARY,
                                                text:"确定",
                                                onclick: function () {
                                                    var items = $utils.getApplicationUtils().getComponentByXtype($Component.JQGRID);
                                                    var gridid = this.getParent().$el.parent().data("gridid");
                                                    var rowid = this.getParent().$el.parent().data("rowid");
                                                    var grid = $utils.getApplicationUtils().getComponentById(gridid);
                                                    var rowData = grid.getRowData(rowid);
                                                    console.info(rowData);
                                                }
                                            },{
                                                themeClass:ToolStripItem.ThemeClass.CANCEL,
                                                text: "取消",
                                                onclick: function () {
                                                    $.window.confirm("测试1", {
                                                        yesHandle: function () {
                                                            alert(">>>");
                                                        }
                                                    });
                                                }
                                            }]
                                            /*Panel 配置 End*/
                                        }
                                    };
                                }
                            }},
                        { label: 'Notes',
                            name: 'note',
                            editable:false,
                            formatterComConf:{
                                comXtype:$Component.TOOLSTRIP,
                                comConf:{
                                    /*Panel的配置项 start*/
                                    textAlign:$TextAlign.RIGHT,
                                    realClass:"btn-group text-right",
                                    spacing :CommonConstant.Spacing.DEFAULT,
                                    itemOptions: [{
                                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                                        text:"确定",
                                        onclick: function () {
                                            var items = $utils.getApplicationUtils().getComponentByXtype($Component.JQGRID);
                                            var gridid = this.getParent().$el.parent().data("gridid");
                                            var rowid = this.getParent().$el.parent().data("rowid");
                                            var grid = $utils.getApplicationUtils().getComponentById(gridid);
                                            var rowData = grid.getRowData(rowid);
                                            console.info(rowData);
                                        }
                                    },{
                                        themeClass:ToolStripItem.ThemeClass.CANCEL,
                                        text: "取消",
                                        onclick: function () {
                                            $.window.confirm("测试1", {
                                                yesHandle: function () {
                                                    alert(">>>");
                                                }
                                            });
                                        }
                                    }]
                                    /*Panel 配置 End*/
                                }
                            },
                            width: 150,
                        }
                    ],
                    //设置列数
                    formColumnSize :3,
                }
            }],

        });

        return view;
    });
