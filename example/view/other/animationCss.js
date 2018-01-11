/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        $route.getCss("animate")],
    function (BorderLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              ToolStripItem,
              ViewUtils
    ) {
        var view = BorderLayout.extend({
            positions:null,
            /**
             * 设置底部的参考对象，以便设置容器的高度
             */
            //$bottomReferent:$(".push-sticky-footer").eq(0),
            initItems:function(){
                var that = this;
                var animates = ["bounce","flash","pulse","rubberBand",
                    "shake","headShake","swing","tada",
                    "wobble","jello","bounceIn","bounceInDown",
                    "bounceInLeft","bounceInRight","bounceInUp","bounceOut",
                    "bounceOutDown","bounceOutLeft","bounceOutRight","bounceOutUp",
                    "fadeIn","fadeInDown","fadeInDownBig","fadeInLeft",
                    "fadeInLeftBig","fadeInRight","fadeInRightBig","fadeInUp",
                    "fadeInUpBig","fadeOut","fadeOutDown","fadeOutDownBig",
                    "fadeOutLeft","fadeOutLeftBig","fadeOutRight","fadeOutRightBig",
                    "fadeOutUp","fadeOutUpBig","flipInX","flipInY",
                    "flipOutX","flipOutY","lightSpeedIn","lightSpeedOut",
                    "rotateIn","rotateInDownLeft","rotateInDownRight","rotateInUpLeft",
                    "rotateInUpRight","rotateOut","rotateOutDownLeft","rotateOutDownRight",
                    "rotateOutUpLeft","rotateOutUpRight","hinge","jackInTheBox",
                    "rollIn","rollOut","zoomIn","zoomInDown",
                    "zoomInLeft","zoomInRight","zoomInUp","zoomOut",
                    "zoomOutDown","zoomOutLeft","zoomOutRight","zoomOutUp",
                    "slideInDown","slideInLeft","slideInRight","slideInUp",
                    "slideOutDown","slideOutLeft","slideOutRight","slideOutUp"
                ];

                var btns = [];
                _.each(animates,function(item,idx,list){
                    btns.push({
                        text:item,
                        onclick: function () {
                            console.info(">>>>");
                            var panelObj = that.getCenterRegion().comRef;
                            var jqObjects = panelObj.$el.children(".hfast-view");
                            panelObj.$el.addClass('animated '+item);
                            panelObj.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                                function(event){
                                    $(event.target).removeClass('animated '+item);

                                });
                        }
                    });

                });
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [
                    {
                        region: BorderLayout.Region.NORTH,    //西
                        padding:0,
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            textAlign:$TextAlign.RIGHT,
                            //realClass:"btn-group text-right",
                            spacing :CommonConstant.Spacing.DEFAULT,
                            itemOptions: btns,
                            //height:"100%",
                            onshow: function (e) {
                                if (this._super) {
                                    this._super(e);
                                }
                                that.resizeRegion(BorderLayout.Region.NORTH);
                            }
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
                //获取top区域
                //this.getNorthRegion().show();
                // 获取中心区域
                this.getCenterRegion().show(APP_NAME+"/view/layout/fluidLayout");
            }
        });
        return view;
    });
