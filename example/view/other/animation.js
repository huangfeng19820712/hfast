/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem","css!"+APP_NAME+"/view/other/animation.css"],
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
                this.$bottomReferent =  $(".copyright").eq(0);
                this.items =  [
                    {
                        region: BorderLayout.Region.NORTH,    //西
                        padding:0,
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            textAlign:$TextAlign.RIGHT,
                            realClass:"btn-group text-right",
                            spacing :CommonConstant.Spacing.DEFAULT,
                            itemOptions: [{
                                text: "向右移出",
                                onclick: function () {
                                    console.info(">>>>");
                                    var panelObj = that.getCenterRegion().comRef;
                                    var jqObjects = panelObj.$el.children(".hfast-view");

                                    that.relativeToAbsolute(jqObjects);
                                    //jqObjects.addClass("toRightAnimation");
                                    //$.window.alert(panelObj.mainRegion.content);
                                }
                            },{
                                text: "从左移入",
                                onclick: function () {
                                    console.info(">>>>");
                                    var panelObj = that.getCenterRegion().comRef;
                                    var jqObjects = panelObj.$el.children(".hfast-view");

                                    that.absoluteToRelative(jqObjects);
                                    jqObjects.addClass("toLeftAnimation");
                                    //$.window.alert(panelObj.mainRegion.content);
                                }
                            },{
                                text: "向左移动",
                                onclick: function () {
                                    console.info(">>>>");
                                    var panelObj = that.getCenterRegion().comRef;
                                    var jqObjects = panelObj.$el.children(".hfast-view");

                                    that.relativeToAbsolute(jqObjects);
                                    jqObjects.addClass("toLeftAnimation");
                                    //$.window.alert(panelObj.mainRegion.content);
                                }
                            }],
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
            relativeToAbsolute:function(jqObjects){
                //先保存位置信息，因为设置了position属性后，位置信息会改变
                this.positions = [];
                var that = this;
                _.each(jqObjects,function(item,idx,list){
                    var el = $(item);
                    that.positions[idx] = el.offset();
                });
                //$(jqObjects[0]).animate({left:'250px'},"flow");
                //把相对位置改成绝对位置
                _.each(jqObjects,function(item,idx,list){
                    var el = $(item);
                    var position = that.positions[idx];
                    el.css("position", "absolute");
                    el.offset(position);
                    el.animate({left:'+=2000px'},5000);
                    /*el.css("animation-duration", (4+0.2*idx)+"s");
                    el.css("animation-delay", (0.4+0.2*idx)+"s");
                    el.offset(position);*/
                });

            },
            absoluteToRelative:function(jqObjects){
                //先保存位置信息，因为设置了position属性后，位置信息会改变
                this.positions = [];
                var that = this;
                /*_.each(jqObjects,function(item,idx,list){
                    var el = $(item);
                    that.positions[idx] = el.offset();
                });*/
                //把相对位置改成绝对位置
                _.each(jqObjects,function(item,idx,list){
                    var el = $(item);
                    var position = that.positions[idx];
                    el.css("animation-duration", (4+0.2*idx)+"s");
                    el.css("animation-delay", (0.4+0.2*idx)+"s");
                    el.offset(position);
                    el.css("position", "relative");
                });

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
