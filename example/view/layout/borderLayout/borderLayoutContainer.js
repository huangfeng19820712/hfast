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
                        padding:0,
                        border:0
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
                        showOverflowOnHover:true
                    }
                ];
            },
            //监听渲染事件
            mountContent: function () {
                this._super();

                //获取中心区域
                this.getCenterRegion().show(APP_NAME+"/view/layout/panelView");
                // 获取 底部（南）区域
                var that = this;
                this.getSouthRegion().show(APP_NAME+"/view/layout/labelView",
                    {text: "底部（南）区域",
                        onshow:function(e){
                            if(this._super){

                                this._super(e);
                            }
                            that.resizeRegion(BorderLayout.Region.SOUTH);
                        }});

                // 获取顶部（北）区域
                this.getNorthRegion().show(APP_NAME+"/view/navigation/navigationBar",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.NORTH);
                        //设置菜单能选择
                        var dropdownEl = this.$el.find(".navbar");
                        dropdownEl.on("mouseover",function(){
                         that.plugin.allowOverflow(this);
                         });
                    }
                });



                // 获取左边（西）区域
                this.getWestRegion().show(APP_NAME+"/view/layout/accordion/accordionDemo",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.WEST);
                    }
                });
                // 获取右边（东）区域
                //this.getEastRegion().show(APP_NAME+"/view/layout/labelView", {text: "右边（东）区域"});

                //this.hideRegions()
            },
            onshow:function(e){
                this._super();
            }
        });
        return view;
    });
