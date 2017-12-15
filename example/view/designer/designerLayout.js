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
        var DesignerLayout = BorderLayout.extend({
            /**
             * 设置底部的参考对象，以便设置容器的高度
             */
            //$bottomReferent:$(".push-sticky-footer").eq(0),
            $bottomReferent: $(".copyright").eq(0),
            items: [
                {
                    region: BorderLayout.Region.WEST,    //西
                    size:500,
                },
                {
                    region: BorderLayout.Region.CENTER,  //中间区域
                    showOverflowOnHover:true
                }
            ],
            //监听渲染事件
            onrender: function (e) {

                //获取中心区域
                this.getCenterRegion().show("demo/view/layout/labelView", {text: "中心区域(必须指定)", fontSize: "20px"});
                var that = this;
                // 获取左边（西）区域
                this.getWestRegion().show("demo/view/designer/westRegion",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.WEST);
                    }
                });
            },
            close:function(){
                this.items = null;

                this._super();
            }
        });
        return DesignerLayout;
    });
