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
        /*var Test = _.extend({
            test:function(){
                console.info("22222");
            }
        },{
            test:function(){
                this._super();
                console.info(">>>");
            }
        });

        Test.test();*/

        var view = BorderLayout.extend({
            /**
             * 设置底部的参考对象，以便设置容器的高度
             */
            //$bottomReferent:$(".push-sticky-footer").eq(0),
            initItems:function(){
                var that = this;
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [{
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
                //Region全部渲染完后，再显示此内容
                // 获取左边（西）区域
                /*this.getCenterRegion().show(APP_NAME+"/view/layout/accordion/accordionDemo",{
                    onshow:function(e){
                        if(this._super){
                            this._super(e);
                        }
                        that.resizeRegion(BorderLayout.Region.CENTER);
                    }
                });*/

                // 获取顶部（北）区域
                this.getCenterRegion().show(APP_NAME+"/view/navigation/navigationBar",{
                    onshow:function(e){
                        that.resizeRegion(BorderLayout.Region.CENTER);
                        //设置菜单能选择
                        var dropdownEl = this.$el.find(".navbar");
                        dropdownEl.on("mouseover",function(){
                            that.plugin.allowOverflow(this);
                        });
                    }
                });
            },/*
            onshow:function(){
                this.resizeAll();
            }*/
        });
        return view;
    });
