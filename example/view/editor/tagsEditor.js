/**
 * @author:   * @date: 2016/2/26
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/utils/ApplicationUtils"],
    function (Backbone,Panel,ApplicationUtils) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.TAGSEDITOR,
                comConf:{
                    decimals:2,
                    url:  'data/provinces.json',
                    itemLabel:"value",
                    itemId:"Id",
                    showHintOnFocus:true,
                    placeholder:"省份"
                }
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                comConf: {
                    /*Panel的配置项 start*/
                    textAlign: $TextAlign.RIGHT,
                    items: [{
                        text: "确定",
                        onclick: function (e) {
                            var panelRegion = ApplicationUtils.getMainRegion();
                            var editor = panelRegion.getComRef().getMainRegionRef().getComRef();
                            console.info(editor.getValue());
                            console.info(editor.getValueObjects());
                        }
                    }, {
                        text: "取消",
                        onclick: function (e) {
                            $.window.confirm("测试1", {
                                yesHandle: function () {
                                    alert(">>>");
                                }
                            });
                        }
                    }]
                    /*Panel 配置 End*/
                }
            }
            /*Panel 配置 End*/
        });

        return view;
    });