/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/ParallaxLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        $Component.PANEL.src,
        $Component.SIMPLELAYOUT.src],
    function (ParallaxLayout, CommonConstant, Region,Panel,SimpleLayout) {
        var view = SimpleLayout.extend({
            beforeInitializeHandle:function(){
                this._super();
                this.$bottomReferent =  $(".copyright").eq(0);
                this.item = {
                    comXtype: $Component.PARALLAXLAYOUT,
                    height:"100%",
                    comConf:{
                        items: [{
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
                            comSrc:APP_NAME+"/view/chart/echart"
                        },{
                            comSrc:APP_NAME+"/view/panel/mulitFieldset"
                        },{
                            comSrc:APP_NAME+"/view/layout/mosaic"
                        }]
                    }
                };
                /*this.item = {
                    comRef:null
                };*/
            }
        });

        /*var view = ParallaxLayout.extend({
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
                    comSrc:APP_NAME+"/view/layout/fluidLayout"
                },{
                    comSrc:APP_NAME+"/view/panel/mulitFieldset"
                }];
            }
        });*/


        return view;
    });
