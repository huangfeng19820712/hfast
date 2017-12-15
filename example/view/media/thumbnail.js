/**
 * @author:   * @date: 2017/9/27
 */

define(["core/js/controls/Control",
    "core/js/utils/ViewUtils",
    "core/js/CommonConstant",
    "text!"+APP_NAME+"/resources/tmpl/thumbnail.html",
    "jquery.cubeportfolio"], function (Control, ViewUtils, CommonConstant,Template) {
    var portfolio = Control.extend({
        className:"container-fluid",
        mountContent:function(){
            for(var i=0;i<4;i++){
                var item = this.createItem();
                this.$el.append(item);
            }
        },
        createItem:function(){
            return $(Template);
        },
    });
    return portfolio;
})
