/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/FluidLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem"],
    function (FluidLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              ToolStripItem,
              ViewUtils
    ) {
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
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            initItems: function () {
                this._super();
                this.items.push({
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        mainRegion:{
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
                    }
                },{
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        mainRegion:{
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
                    }
                },{
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        mainRegion:{
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
                    }
                });
            },
            onrender:function(){
                //解决多个fieldset中的jqgrid中宽度有溢出的情况
                var jqgrid = this.$(".jqgrid");
                _.each(jqgrid,function(item,idx,list){
                    var control = $(item).data("control");
                    control.resize();
                });
            }



        });
        return view;
    });
