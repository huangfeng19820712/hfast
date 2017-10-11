/**
 * @module 视图基类[BaseView]
 * @description 所有视图的基类，继承于Backbone的View
 *
 * @author
 * @version 1.0 @Date: 2013-05-31 上午11:29
 */
define(["core/js/controls/Control",
        "core/js/utils/ApplicationUtils"],
    function (Control,ApplicationUtils) {
    var BaseViewModel = Control.extend({
        ajaxClient:null,
        initializeHandle:function(){
            var applicationContext = ApplicationUtils.getApplicationContext();
            this.ajaxClient = applicationContext.getAjaxClient();
        },
        post:function(fuc){

        },
        get:function(fuc){

        },
        getAjaxClient:function(){
            if(!this.ajaxClient){
                var applicationContext = ApplicationUtils.getApplicationContext();
                this.ajaxClient = applicationContext.getAjaxClient();
            }
            return this.ajaxClient
        }
    });

    return BaseViewModel;
});