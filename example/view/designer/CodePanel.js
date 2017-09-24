/**
 * @author:   * @date: 2017/1/9
 */

define([
        "core/js/layout/Panel",
        "core/js/utils/ApplicationUtils",
        "core/js/rpc/TextResponse",
    ],
    function (Panel,ApplicationUtils,TextResponse
    ) {
        var CodePanel = Panel.extend({
            /*Panel的配置项 start*/
            beforeInitializeHandle:function(){
                this._super();
                var panel = this;
                this.title = this.jsPath;
                this.mainRegion={
                    comXtype:$Component.CODEEDITOR,
                        comConf:{
                        onrender:function(event){
                            var applicationContext = ApplicationUtils.getApplicationContext();
                            var ajaxClient = applicationContext.getAjaxClient();
                            var that =this;
                            ajaxClient.buildClientRequest("/public/js2Json.action?jsPath=/"+panel.jsPath+".js").get(function (compositeResponse) {
                                var obj = compositeResponse.getSuccessResponse();
                                if (obj) {
                                    that.setValue(obj);
                                }
                            },false, TextResponse);
                        },
                    }
                };
                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                        comConf: {
                        /*Panel的配置项 start*/
                        textAlign: $TextAlign.RIGHT,
                            items: [{
                            text: "确定",
                            onclick: function (e) {

                            }
                        }]
                        /*Panel 配置 End*/
                    }
                };
            },
            close: function () {
                var codeEditor =  this.getMainRegionRef().getComRef();
                if(codeEditor){
                    codeEditor.setValue("");
                }
                this._super();
            }
            /*Panel 配置 End*/
        });
        return CodePanel;
    });
