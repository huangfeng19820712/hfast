/**
 * @author:   * @date: 2015/12/31
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/controls/Icon",
        "core/js/utils/ViewUtils"],
    function (FluidLayout, CommonConstant, Region, Icon, ViewUtils) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems: function (options) {
                this.items = [
                    {
                        comXtype: $Component.PANEL,
                        comConf: {
                            title: "播放器",
                            theme: $Theme.BLUE,
                            help: "播放器",
                            iconSkin: ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion: {
                                comXtype: $Component.PLAYER,
                                height: "600px",
                                width: "400px",
                                comConf: {
                                    playerMode: $cons.playerMode.FLV,
                                    url: "http://10683.liveplay.myqcloud.com/live/10683_475805.flv"
                                }
                            }
                        }
                    },{
                        comXtype: $Component.PANEL,
                        comConf: {
                            title: "播放器",
                            theme: $Theme.BLUE,
                            help: "播放器",
                            iconSkin: ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion: {
                                comXtype: $Component.PLAYER,
                                height: "600px",
                                width: "400px",
                                comConf: {
                                    playerMode: $cons.playerMode.RTMP,
                                    url: "rtmp://rtmp.new-live.net/yuemei/14426_2bccf18f64d5eed07236"
                                }
                            }
                        }
                    },{
                        comXtype: $Component.PANEL,
                        comConf: {
                            title: "播放器",
                            theme: $Theme.BLUE,
                            help: "播放器",
                            iconSkin: ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion: {
                                comXtype: $Component.PLAYER,
                                height: "600px",
                                width: "400px",
                                comConf: {
                                    playerMode: $cons.playerMode.FLV,
                                    url: "http://imgoss.hkz2.com/public/attachment/201709/215874/1505017975433.png"
                                }
                            }
                        }
                    }];
            },
        });

        return view;
    });