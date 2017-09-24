/**
 * designer/codeDesigner?jsPath=demo/view/button/toolStrip
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "demo/view/designer/CodePanel"
    ],
    function (BorderLayout,CodePanel
    ) {
        var codeDesigner = BorderLayout.extend({
            jsPath:null,
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

                if(this.jsPath){
                    //获取中心区域
                    this.getCenterRegion().show(this.jsPath);
                    var that = this;
                    // 获取左边（西）区域
                    this.getWestRegion().show(new CodePanel({jsPath:this.jsPath}));
                }

                //this.hideRegions()
            },
            close:function(){
                this.items = null;

                this._super();
            }
        });
        return codeDesigner;
    });
