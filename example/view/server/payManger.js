/**
 * @author:   * @date: 2016/1/17
 */
define([
        "core/js/layout/FluidLayout","core/js/controls/Button" ],
    function ( FluidLayout,Button) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: [{
                comXtype:$Component.JQGRID,
                comConf:{
                    url:"/payManager/get.action",
                    postData: {outorin: 1},
                    colModel: [
                        {
                            name: 'outorin',
                            index: 'outorin',
                            label:"outorin",
                            editable: true,
                            hidden:true,
                            editoptions:{
                                defaultValue: this.sscType
                            },
                        },
                        {
                            name: 'id',
                            index: 'id',
                            label:"id",
                            editable: true,
                            key: true,
                            sorttype: "number",
                            searchoptions: {sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge']}
                        },
                        {
                            name: 'userName',
                            index: 'userName',
                            label:"用户账号",
                            editable: true,
                        },
                        {name: 'amount',
                            label:'金额',
                            index: 'amount',
                            width: 100,
                            editable: true,
                        },
                        {
                            name: 'bankName',
                            index: 'bankName',
                            label:"银行",
                            editable: true,
                        },
                        {
                            name: 'account',
                            index: 'account',
                            label:"银行账号",
                            editable: true,
                        },
                        {
                            name: 'principal',
                            index: 'principal',
                            label:"持卡者",
                            editable: true,
                        },
                        {
                            name: 'createTime',
                            index: 'createTime',
                            label:"创建日期",
                            width: 160,
                            editable: true,
                            sorttype: "datetime",
                            formatter: "date",
                            formatoptions: {
                                srcformat: "ISO8601Long", // http://www.trirand.com/jqgridwiki/doku.php?id=wiki:predefined_formatter
                                newformat: "ISO8601Long"
                            },
                            searchoptions: {
                                dataInit: function (el) {
                                    $(el).datetimepicker({
                                        format: 'yyyy-mm-dd hh:ii:ss',
                                        todayBtn: true
                                    })
                                        .on('changeDate', function () {
                                            $(this).datetimepicker('hide'); // force close the calendar
                                        });
                                }
                            },
                            editoptions:{
                                dataInit: function (el) {
                                    $(el).datetimepicker({
                                        format: 'yyyy-mm-dd hh:ii:ss',
                                        todayBtn: true
                                    })
                                        .on('changeDate', function () {
                                            $(this).datetimepicker('hide'); // force close the calendar
                                        });
                                }
                            },
                        },
                        {
                            name: 'checked',
                            index: 'checked',
                            label:'是否审核通过',
                            align: "right",
                            //editable: true ,
                            //edittype: "select",
                            //editoptions:{value: "0:不通过;1:通过"},
                            ////下拉框时，必须使用，不然，显示的仍然是值，如：0，
                            //formatter:'select'
                        }
                    ],
                    selectRow: function (rowid) {
                        that.$("#" + rowid + "_invdate").datetimepicker({dateFormat: 'yyyy-mm-dd hh:ii:ss'})
                            .on('changeDate', function () {
                                $(this).datetimepicker('hide'); // force close the calendar
                            });
                    },
                    gridComplete: function () {
                        var ids = $(this).jqGrid('getDataIDs');
                        for (var i = 0; i < ids.length; i++) {
                            var cl = ids[i];
                            var bt ='<div class="col-lg-12" id="grid_'+cl+'"></div>';

                            $(this).jqGrid('setRowData', ids[i], {'checked':bt});
                            var button = new Button({
                                text:"审核通过",
                                themeClass:Button.ThemeClass.DEFAULT ,
                                className: Button.ClassName.primary,
                                $container:$(this).find('#grid_'+cl),
                                onclick:function(){
                                    $.window.confirm("测试1",{
                                        yesHandle:function(){
                                            alert(">>>");
                                        }
                                    });
                                }
                            });
                            //$("#"+'grid_'+cl).on("click",function(){alert("!!!!");}) ;
                            //button.render();
                        }
                    }
                }
            }]
        });

        return view;
    });
