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
                                comConf: {
                                    playerMode: $cons.playerMode.FLV,
                                    url: ""
                                }
                            }
                        }
                    }];
            },
        });

        return view;
    });