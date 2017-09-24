/**
 * @date: 14-2-24
 */
define(['jquery',
    'core/js/layout/BorderLayout'
], function ($, BorderLayout) {


    var BorderLayoutDemo = BorderLayout.extend({
        oninitialized:function(){
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
                    region: BorderLayout.Region.CENTER  //中间区域
                }
            ];
        },
        //监听渲染事件
        onshow: function (e) {

            //获取中心区域
            this.getCenterRegion().show("demo/view/layout/labelView", {text: "中心区域(必须指定)", fontSize: "20px"});

            // 获取顶部（北）区域
            this.getTopRegion().show("demo/view/layout/labelView", {text: "顶部（北）区域"});
            // 获取底部（南）区域
            this.getBottomRegion().show("demo/view/layout/labelView", {text: "底部（南）区域"});
            // 获取左边（西）区域
            this.getLeftRegion().show("demo/view/layout/labelView", {text: "左边（西）区域"});
            // 获取右边（东）区域
            this.getRightRegion().show("demo/view/layout/labelView", {text: "右边（东）区域"});

            this._super(e);
            //this.hideRegions()
        }
    });
    return BorderLayoutDemo;
});
