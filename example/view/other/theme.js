/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/controls/HelpLink",],
    function (FluidLayout, CommonConstant,Region,Panel,ToolStripItem,HelpLink) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                var theme = "";
                this.items = [{
                    comXtype:$Component.PANEL,
                    //className:"utils-inline-block",
                    comRef:new Panel({
                        title:theme,

                        mainRegion:"new初始化"
                    })
                },{
                    comXtype:$Component.TABLAYOUT,
                    //className:"utils-inline-block",
                    comConf:{
                        tabs:[{
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
                                        }]
                                    }
                                }
                            }
                        ]
                    }
                }, {
                    comXtype: $Component.PAGINATION,
                    //className:"utils-inline-block",
                    comConf: {
                        totalPage: 2
                    }
                }, {
                    comRef:new HelpLink({
                        $container:this.$el,
                        mainContent:"<span>span</span>",
                    })
                }, {
                    comXtype: $Component.NAVIGATION,
                    comConf: {
                        data:[{
                            label:"操作",
                            subMenu:[{
                                label:"添加",
                                subMenu:[{
                                    label:"添加1",
                                },{
                                    label:"添加2",
                                },{
                                    label:"添加3",
                                }]
                            },{
                                label:"删除",
                            },{
                                label:"修改",
                            },]
                        },{
                            label:"按钮类"
                        }]
                    }
                }, {
                    comXtype: $Component.TOOLSTRIP,
                    comConf: {
                        className: "btn-group",
                        itemOptions: [{
                            text: "alter",
                            mode: ToolStripItem.Mode.LINK,
                            theme:null,
                            iconSkin: "fa-eye",
                            onclick: function () {
                                $.window.alert("测试1");
                            }
                        }, {
                            text: "confirm",
                            mode: ToolStripItem.Mode.LINK,
                            iconSkin: "fa-chevron-up",
                            theme:null,
                            onclick: function () {
                                $.window.confirm("测试1", {
                                    yesHandle: function () {
                                        alert(">>>");
                                    }
                                });
                            }
                        }, {
                            text: "toggle",
                            isToggle: true,
                            theme:null,
                            iconSkin: "fa-times",
                            mode: ToolStripItem.Mode.LINK,
                        }]
                    }
                }
                ];

            }
        });

        return view;
    });

