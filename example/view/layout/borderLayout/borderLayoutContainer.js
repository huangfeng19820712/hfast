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
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [
                    {
                        region: BorderLayout.Region.NORTH,  //北
                        closable:false,
                        resizable:false,
                        slidable:false,

                    },
                    {
                        region: BorderLayout.Region.SOUTH,   //南
                        slidable :false,
                    },
                    {
                        region: BorderLayout.Region.WEST,    //西

                    },
                    {
                        region: BorderLayout.Region.EAST,    //东
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
                this.getCenterRegion().show("demo/view/layout/panelView");
                // 获取顶部（北）区域
                var that = this;
                this.getNorthRegion().show("demo/view/layout/labelView",
                    {text: "顶部（北）区域",
                        onshow:function(e){
                            if(this._super){

                                this._super(e);
                            }
                            that.resizeRegion(BorderLayout.Region.NORTH);
                        }});

                // 获取底部（南）区域
                this.getSouthRegion().show("demo/view/layout/labelView", {
                    text: "底部（南）区域",
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.SOUTH);
                    }});
                // 获取左边（西）区域
                this.getWestRegion().show("demo/view/layout/accordion/accordionDemo",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.WEST);
                    }
                });
                // 获取右边（东）区域
                this.getEastRegion().show("demo/view/layout/labelView", {text: "右边（东）区域"});

                //this.hideRegions()
            },
            onshow:function(e){
                this._super();
                //this.plugin.allowOverflow(BorderLayout.Region.CENTER);
            }
        });
        return view;
    });
