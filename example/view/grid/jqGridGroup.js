/**
 * @author:   * @date: 2016/1/17
 */
define([
        $Component.SIMPLELAYOUT.src,
        "core/js/controls/Button",
        $Component.TEXTEDITOR.src,],
    function (SimpleLayout, Button,TextEditor) {
        var mydata = [
            {
                id: "1",
                invdate: "2007-10-01",
                name: "test",
                note: "note",
                amount: "200.00",
                tax: "10.00",
                total: "210.00"
            },
            {
                id: "2",
                invdate: "2007-10-02",
                name: "test2",
                note: "note2",
                amount: "300.00",
                tax: "20.00",
                total: "320.00"
            },
            {
                id: "3",
                invdate: "2007-09-01",
                name: "test3",
                note: "note3",
                amount: "400.00",
                tax: "30.00",
                total: "430.00"
            },
            {
                id: "4",
                invdate: "2007-10-04",
                name: "test",
                note: "note",
                amount: "200.00",
                tax: "10.00",
                total: "210.00"
            },
            {
                id: "5",
                invdate: "2007-10-05",
                name: "test2",
                note: "note2",
                amount: "300.00",
                tax: "20.00",
                total: "320.00"
            },
            {
                id: "6",
                invdate: "2007-09-06",
                name: "test3",
                note: "note3",
                amount: "400.00",
                tax: "30.00",
                total: "430.00"
            },
            {
                id: "7",
                invdate: "2007-10-04",
                name: "test",
                note: "note",
                amount: "200.00",
                tax: "10.00",
                total: "210.00"
            },
            {
                id: "8",
                invdate: "2007-10-03",
                name: "test2",
                note: "note2",
                amount: "300.00",
                tax: "20.00",
                total: "320.00"
            },
            {
                id: "9",
                invdate: "2007-09-01",
                name: "test3",
                note: "note3",
                amount: "400.00",
                tax: "30.00",
                total: "430.00"
            }
        ];

        var view = SimpleLayout.extend({
            beforeInitializeHandle:function(){
                this._super();
                this.$bottomReferent =  $(".copyright").eq(0);
                this.item = {
                    comXtype:$Component.JQGRID,
                    comConf:{
                        datatype: "local",
                        data: mydata,
                        colModel: [
                            {label: 'Inv No', name: 'id', width: 75, key: true, hidden: true},
                            {label: 'Date', name: 'invdate', width: 90},
                            {label: 'Client', name: 'name', width: 100},
                            {label: 'Amount', name: 'amount', width: 80, summaryType: "sum"},
                            {
                                label: 'Tax', name: 'tax', width: 80, summaryType: function (value, name, record) {
                                return 10;
                            }
                            },
                            {label: 'Total', name: 'total', width: 80},
                            {
                                label: 'Notes', name: 'note', width: 150, formatterComConf: {
                                comXtype: $Component.TOOLSTRIP,
                                comConf: {
                                    /*Panel的配置项 start*/
                                    textAlign: $TextAlign.RIGHT,
                                    realClass: "btn-group text-right",
                                    itemOptions: [{
                                        text: "确定",
                                        onclick: function () {
                                        }
                                    }, {
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
                            }
                            },

                        ],
                        pageable: true,
                        filterable: false,
                        colMenu: false,
                        grouping: true,
                        rownumbers: false,
                        multiselect: false,
                        groupingView: {
                            groupField: ["name"],
                            groupColumnShow: [false],
                            groupText: ["<div class='groupText' data-value='{0}'></div>"],
                            groupOrder: ["asc"],
                            groupSummary: [true],
                            groupCollapse: false

                        },
                        groupCom: null,
                        ongridComplete: function () {
                            //修改分组中的内容
                            this.groupCom = {};
                            //var grid = getGrid(this);
                            var groupEls = this.$el.find(".groupText");
                            for(var i=0;i<groupEls.length;i++){
                                var groupEl = groupEls[i];
                                //添加组件
                                var groupCom = this.createGroupCom($(groupEl),$(groupEl).data("value"));
                                this.groupCom[i]=groupCom;

                            }

                        },
                        createGroupCom:function($container,value){
                            return  new TextEditor({
                                $container:$container,
                                placeholder:"组长",
                                value:value,
                                buttons:[{
                                    text:"修改",
                                    onclick:function(event){

                                    }
                                },{
                                    text:"添加成员",
                                    onclick:function(event){

                                    }
                                }]
                            });
                        },
                    }
                };
            },
            onshow:function(){
                //this._super();
                //var region = this.getItemRegion();
                //region.show(new clouds());
                //this.resizeLayout();
                //this.resizeLayout();
                this.getItemComponent().resize()
            }
        });
        return view;


        //var view = JqGrid.extend();

        return view;
    });
