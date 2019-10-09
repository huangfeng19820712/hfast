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
                                //value:"2017-08-15",
                                /*pluginConf:{
                                    done: function(value, date, endDate){
                                        if(date.year === 2017 && date.month === 8 && date.date === 15){ //点击2017年8月15日，弹出提示语
                                            ins1.hint('中国人民抗日战争胜利72周年');
                                        }
                                        console.info(">done>>"+value+">>"+date);
                                    },
                                    change: function(value, date, endDate){
                                        //ins1.hint(value); //在控件上弹出value值
                                        console.info(">change>>"+value);
                                    },
                                }*/
                            }
                        } ,
                        footerRegion: {
                            comXtype: $Component.TOOLSTRIP,
                            textAlign: $TextAlign.RIGHT,
                            comConf: {
                                /*Panel的配置项 start*/
                                itemOptions: [{
                                    text: "取值",
                                    onclick: function () {
                                        console.info(this.parent.parent.getMainRegionRef().getComRef().getValue());
                                    }
                                }]
                                /*Panel 配置 End*/
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
