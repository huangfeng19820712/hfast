/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/controls/HelpLink",
        $Component.SWITCHER.src,"core/js/utils/ApplicationUtils"],
    function (FluidLayout, CommonConstant,Region,Panel,ToolStripItem,HelpLink,Switcher,
              ApplicationUtils) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                var theme = "";
                this.items = [ {
                    comRef:new HelpLink({
                        //$container:this.$el,
                        mainContent:"<span>span</span>",
                    })
                },{
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
                    comXtype: $Component.ACCORDION,
                    comConf: {
                        accordionItems:[{
                            label: "one",
                            height: 40
                        },{
                            label: "two",
                            height: 40
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
                },{
                    comXtype:$Component.LAYDATEEDITOR,
                    comConf:{
                        label:"时间",
                        mode:$cons.LayDateMode.date,
                        placeholder:"日期格式",
                        onchangeDate:function(value){
                            console.info(">>>"+value);
                        }
                    }
                }
                ];
            },
            onrender:function(){
                var that = this;
                var switcher = new Switcher({
                    $container:this.$el,
                    spinTop:70,
                    onthemeSelect:function(event){
                        var childrenComponent = ApplicationUtils.getChildrenComponent(that);
                        //var jqEvent = event.jqEvent;
                        var theme = $(event.jqEvent.target).data("skin");
                        _.each(childrenComponent,function(item,idx,list){
                            if(item&&item.toggleTheme){
                                //button不处理
                                if(!item.$el.is('button')){
                                    item.toggleTheme(theme);
                                }
                            }else{
                                console.info(">>");
                            }
                        });
                    }
                });
                /*//设置到合适的高度
                switcher.$el.find(".del-style-switcher").css({
                    top:70,
                });*/
            }
        });

        return view;
    });

