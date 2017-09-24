/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel"],
    function (FluidLayout, CommonConstant,Region,Panel) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                this.items = [{
                    comXtype:$Component.PANEL,
                    comRef:new Panel({
                        title:"new初始化",
                        mainRegion:"new初始化"
                    })
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"测试",
                        theme:$Theme.BLUE,
                        help:"内容",
                        brief:"摘要",
                        mainRegion:"aaaa"
                    }
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"测试1",
                        theme:$Theme.BLUE,
                        help:"内容1",
                        brief:"摘要1",
                        mainRegion:"aaaa",
                        footerRegion:{
                            comXtype:$Component.TOOLSTRIP,
                            comConf:{
                                textAlign:$TextAlign.RIGHT,
                                realClass:"btn-group text-right",
                                spacing :CommonConstant.Spacing.DEFAULT,
                                itemOptions: [{

                                    text: "alter",
                                    onclick: function () {
                                        $.window.alert("测试1");
                                    }
                                },{
                                    text: "confirm",
                                    onclick: function () {
                                        $.window.confirm("测试1", {
                                            yesHandle: function () {
                                                alert(">>>");
                                            }
                                        });
                                    }
                                }]
                            }
                        }
                    }
                },{
                    content:'<h4><i class="fa fa-align-justify"></i>One Third</h4>'
                }];

            }
        });

        return view;
    });

