/**
 * @author:   * @date: 2016/3/24
 */

define([
    "core/js/CommonConstant",
    "core/js/controls/Control",
], function (CommonConstant, Control) {
    var AbstractControlView = Control.extend({
        template:null,
        dataPre:$cons.dataPre,
        data:null,
        mountContent:function(){
            this.$el.html(this._getTemplateContent());   //根据视图模版对界面进行渲染
        },
    });
    return AbstractControlView;
});