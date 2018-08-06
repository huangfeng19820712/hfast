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
            oninitialized:function(){
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [
                    {
                        region: BorderLayout.Region.WEST,    //西

                    },
                    {
                        region: BorderLayout.Region.CENTER,  //中间区域
                        showOverflowOnHover:true
                    }
                ];
            },
            //监听渲染事件
            onrender: function (e) {
                // 获取左边（西）区域
                var that = this;
                this.getWestRegion().show("demo/view/layout/accordion/accordionDemo",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.WEST);
                    }
                });

                //获取中心区域
                this.getCenterRegion().show("demo/view/layout/panelView");
            },
        });
        return view;
    });
