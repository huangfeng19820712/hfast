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
                comXtype:$Component.CODEEDITOR,
                comConf:{
                    mode:$cons.CodeEditorMode.javascript,
                    onrender:function(event){
                        var applicationContext = ApplicationUtils.getApplicationContext();
                        var ajaxClient = applicationContext.getAjaxClient();
                        var that =this;
                        ajaxClient.buildClientRequest("/public/js2Json.action?jsPath=/demo/view/editor/codeEditor.js").get(function (compositeResponse) {
                            var obj = compositeResponse.getSuccessResponse();
                            if (obj) {
                                that.setValue(obj);
                            }
                        },false, TextResponse);
                    },
                }
            },

            beforeInitializeHandle:function(){
                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                        comConf: {
                        /*Panel的配置项 start*/
                        textAlign: $TextAlign.RIGHT,
                            itemOptions: [{
                            text: "json",
                            onclick: $.proxy(this.jsonCode,this)/*function (e) {
                             console.info(">>");
                             /!*ajaxClient.buildClientRequest("/core/js/utils/ApplicationUtils.js")
                             .get(function (compositeResponse) {
                             var obj = compositeResponse.getSuccessResponse();
                             if (obj) {
                             var codeEditor =  that.getParent().getParent().getMainRegionRef().comRef;
                             //codeEditor.setValue(obj);
                             }
                             },false, TextResponse);*!/
                             }*/
                        }]
                        /*Panel 配置 End*/
                    }
                };
            },

            getEditor:function(){
                return this.getMainRegionRef().getComRef();
            },

            jsonCode:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                var ajaxClient = applicationContext.getAjaxClient();
                var that =this;
                ajaxClient.buildClientRequest("/demo/view/editor/codeEditor.json").get(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        that.getEditor().setValue(obj);
                        that.getEditor().format();
                    }
                },false, TextResponse);
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