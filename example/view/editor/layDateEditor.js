/**
 * @author:   * @date: 2015/12/7
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/layout/Panel",
        "core/js/windows/Window"],
    function (FluidLayout,Panel, Window) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                this.items = [{
                    comXtype:$Component.PANEL,
                    comRef:new Panel({
                        title:"日期格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.LAYDATEEDITOR,
                            comConf:{
                                label:"时间",
                                mode:$cons.LayDateMode.date,
                                placeholder:"日期格式",
                                onchangeDate:function(value){
                                    console.info(">>>"+value);
                                }
                            }
                        }
                    })
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"时间格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.LAYDATEEDITOR,
                            comConf:{
                                disabled:true,
                                //value:"2017-01-02 23:15:12",
                                mode:$cons.LayDateMode.datetime,
                            }
                        },
                        footerRegion: {
                            comXtype: $Component.TOOLSTRIP,
                            textAlign: $TextAlign.RIGHT,
                            comConf: {
                                /*Panel的配置项 start*/
                                itemOptions: [{
                                    text: "使用",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setDisabled(false);
                                    }
                                }]
                                /*Panel 配置 End*/
                            }
                        }
                    }
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"年格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.LAYDATEEDITOR,
                            comConf:{
                                placeholder:"年格式",
                                mode:$cons.LayDateMode.year,
                            }
                        }
                    }
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"月格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.LAYDATEEDITOR,
                            comConf:{
                                disabled:false,
                                mode:$cons.LayDateMode.month,
                            }
                        }
                    }
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"时间格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.LAYDATEEDITOR,
                            comConf:{
                                disabled:false,
                                mode:$cons.LayDateMode.time,
                            }
                        }
                    }
                }];

            }
        });

        return view;
    });
