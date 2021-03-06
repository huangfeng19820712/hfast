/**
 * @author:   * @date: 2016/2/26
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/windows/Window",
        "core/js/utils/ApplicationUtils",
        "core/js/rpc/TextResponse"],
    function (Backbone,Panel, Window,ApplicationUtils,TextResponse) {
        var dateEditorTest = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.VIEWEDITOR,
                comConf:{
                    label:"名称",
                    layoutMode:$cons.EditorLayoutMode.HORIZONTAL,
                    defaultValue:"name"
                }
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                comConf: {
                    /*Panel的配置项 start*/
                    textAlign: $TextAlign.RIGHT,
                    itemOptions: [{
                        text: "确定",
                        onclick: function (e) {


                            /*ajaxClient.buildClientRequest("/core/js/utils/ApplicationUtils.js")
                                .get(function (compositeResponse) {
                                    var obj = compositeResponse.getSuccessResponse();
                                    if (obj) {
                                        var codeEditor =  that.getParent().getParent().getMainRegionRef().comRef;
                                        //codeEditor.setValue(obj);
                                    }
                                },false, TextResponse);*/
                        }
                    }]
                    /*Panel 配置 End*/
                }
            },

            close: function () {
                var codeEditor =  this.getMainRegionRef().getComRef();
                codeEditor.setValue("");
                this._super();
            }
            /*Panel 配置 End*/
        });

        return dateEditorTest;
    });