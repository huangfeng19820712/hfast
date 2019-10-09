/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem"],
    function (BorderLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              ToolStripItem,
              ViewUtils
    ) {
        var view = BorderLayout.extend({
            /**
             * 设置底部的参考对象，以便设置容器的高度
             */
            //$bottomReferent:$(".push-sticky-footer").eq(0),
            initItems:function(){
                var that = this;
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [
                    {
                        region: BorderLayout.Region.NORTH,  //北
                        closable:false,
                        slidable:false,
                        spacing_open:0,
                        padding:0,/*
                        onresize:function(){
                            console.info(BorderLayout.Region.NORTH+">>>");
                        },
                        border:0,
                        comXtype:$Component.THEMEEDITOR,
                        comConf:{
                            value:"blue"
                        },
                        onshow:function(){
                            if(this._super){
                                this._super(e);
                            }
                            that.resizeRegion(BorderLayout.Region.NORTH);
                            this.$el.on("mouseover",".themeeditor",function(){
                                that.plugin.allowOverflow(this);
                            });
                        }*/
                    },
                    {
                        region: BorderLayout.Region.SOUTH,   //南
                        slidable :false,
                        resizable:false,
                    },
                    {
                        region: BorderLayout.Region.WEST,    //西

                    },
                    {
                        region: BorderLayout.Region.EAST,    //东
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            textAlign:$TextAlign.RIGHT,
                            realClass:"btn-group text-right",
                            spacing :CommonConstant.Spacing.DEFAULT,
                            itemOptions: [{
                                text: "获取中间区域对象",
                                onclick: function () {
                                    console.info(">>>>");
                                    var panelObj = that.getCenterRegion().comRef;
                                    $.window.alert(panelObj.mainRegion.content);
                                }
                            }]
                        }
                    },
                    {
                        region: BorderLayout.Region.CENTER,  //中间区域
                        padding:0,
                        showOverflowOnHover:true
                    }
                ];
            },
            //监听渲染事件
            mountContent: function () {
                this._super();
                var that = this;
                //获取中心区域
                //this.getCenterRegion().show(APP_NAME+"/view/layout/panelView");
                // 获取顶部（北）区域
                this.getNorthRegion().show(APP_NAME+"/view/editor/biz/themeEditor",{
                    onshow:function(e){
                        that.resizeRegion(BorderLayout.Region.NORTH);
                        //设置菜单能选择
                        //var dropdownEl = this.$el.find(".controltheme");
                        this.$el.on("mouseover",".themeeditor",function(){
                            that.plugin.allowOverflow(this);
                        });
                        /*dropdownEl.on("mouseover",function(){
                         that.plugin.allowOverflow(this);
                         });*/
                    }
                });

            }
        });
        return view;
    });
