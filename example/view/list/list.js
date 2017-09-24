/**
 * @author:   * @date: 2016/2/29
 */
define([
        "backbone",
        "core/js/layout/Panel"],
    function (Backbone, Panel) {
        var panel = Panel.extend({
            mainRegion: {
                comXtype: $Component.LIST,
                comConf: {
                    data: [{content: "aaa", badge: "12"},
                        {content: "bbb", badge: "22"}, {content: "aaa", badge: "12"},
                        {content: "bbb", badge: "22"}, {content: "aaa", badge: "12"},
                        {content: "bbb", badge: "22"}, {content: "aaa", badge: "12"},
                        {content: "bbb", badge: "22"},],

                },
                autoScroll:true,
                //height:"240px",
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                comConf: {
                    /*Panel的配置项 start*/
                    textAlign: $TextAlign.RIGHT,
                    realClass: "btn-group text-right",
                    itemOptions: [{
                        text: "修改",
                        onclick: function (e) {
                            var panel = this.getParent($Component.PANEL);
                            var list = panel.getMainRegionRef().getComRef();
                            list.updateItem({
                                content: "ccc",
                                badge: "1"
                            }, 1);
                        }
                    }, {
                        text: "插入",
                        onclick: function (e) {
                            var panel = this.getParent($Component.PANEL);
                            var list = panel.getMainRegionRef().getComRef();
                            list.insertItem({
                                content: "ddd",
                                badge: "2"
                            });
                        }
                    }]
                    /*Panel 配置 End*/
                }
            }
        });
        return panel;
    });

