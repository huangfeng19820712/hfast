/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/ParallaxLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel"],
    function (ParallaxLayout, CommonConstant, Region,Panel) {
        var view = ParallaxLayout.extend({
            initItems:function(){
                this.items = [{
                    comXtype: $Component.FLUIDLAYOUT,
                    comConf: {
                        defaultColumnSize: $Column.COL_MD_4,
                        items:[{
                                comXtype:$Component.PANEL,
                                comRef:new Panel({
                                    className:"speed speed1",
                                    title:"new初始化",
                                    mainRegion:"new初始化"
                                })
                            },{
                                comXtype:$Component.PANEL,
                                comRef:new Panel({
                                    className:"speed speed2",
                                    title:"new初始化",
                                    mainRegion:"new初始化"
                                })
                            },{
                                comXtype:$Component.PANEL,
                                comRef:new Panel({
                                    className:"speed speed3",
                                    title:"new初始化",
                                    mainRegion:"new初始化"
                                })
                            },{
                                comXtype:$Component.PANEL,
                                comRef:new Panel({
                                    className:"speed speed4",
                                    title:"new初始化",
                                    mainRegion:"new初始化"
                                })
                            },{
                                comXtype:$Component.PANEL,
                                comRef:new Panel({
                                    className:"speed speed5",
                                    title:"new初始化",
                                    mainRegion:"new初始化"
                                })
                            },{
                                content:'<h2><i class="fa fa-align-justify"></i>One Third</h2>'
                            }
                        ]
                    }
                },{
                    content:'<h2><i>CLEAN &amp; FRESH</i> <br> <i>FULLY RESPONSIVE</i> <br> <i>DESIGN</i></h2><p><i>Lorem ipsum dolor amet</i> <br> <i>tempor incididunt ut</i> <br> <i>veniam omnis </i></p><div class="da-img"><img class="img-responsive" src="assets/plugins/parallax-slider/img/1.png" alt="">'
                },{
                    content:'<h2><i>RESPONSIVE VIDEO</i> <br> <i>SUPPORT AND</i> <br> <i>MANY MORE</i></h2><p><i>Lorem ipsum dolor amet</i> <br> <i>tempor incididunt ut</i></p><div class="da-img"><iframe src="http://player.vimeo.com/video/47911018" width="530" height="300" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe></div>'
                }];
            },
            onrender:function(){
                var region = this.getRegionByIndex(1);
                var comRef = region.getComRef();
                var el = comRef.$el;
                //comRef.$el.
            }
        });


        return view;
    });
