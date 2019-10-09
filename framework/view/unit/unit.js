/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/utils/PathUtils",
        "core/js/controls/ToolStripItem"],
    function (BorderLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              PathUtils,
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
                var eq = $(".copyright").eq(0);
                if(eq.length>0){
                    this.$bottomReferent =  eq;
                }
                this.items =  [
                    {
                        region: BorderLayout.Region.WEST,    //西
                        padding:0,
                    },
                    {
                        region: BorderLayout.Region.CENTER,  //中间区域
                        padding:0,
                        showOverflowOnHover:false,//鼠标移过显示被隐藏的，只在禁用滚动条时用。
                    }
                ];
            },
            //监听渲染事件
            mountContent: function () {
                this._super();
                var that = this;
                //获取中心区域
                this.getWestRegion().show(PathUtils.getCurrentExecutionScriptDirectory()+"/unitTree", {
                    height:"100%",
                    onshow: function (e) {
                        that.resizeRegion(BorderLayout.Region.WEST);
                    },
                    unitActive:function(event, data){
                        var centerRegion = that.getCenterRegion();
                        var unitTab = centerRegion.getComRef();
                        var unitForm = unitTab.getUnitFormRef();
                        var unitObject = data.node.data;
                        if(unitObject.id!=null){
                            unitForm.setUnitId(unitObject.id);
                        }else{
                            var parentNode = data.node.parent;
                            unitForm.setNodeTitle(data.node,parentNode);
                        }
                    }
                });
                // 获取左边（西）区域
                this.getCenterRegion().show(PathUtils.getCurrentExecutionScriptDirectory()+"/unitTab",{
                    height:"100%",
                    onrender: function (e) {
                        if (this._super) {
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.CENTER);
                    }
                });
            }
        });
        return view;
    });
