/**
 * @author:   * @date: 2016/3/24
 */

define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "core/js/controls/Control",
], function ($, _, CommonConstant, Control) {
    var AbstractControlView = Control.extend({
        template:null,
        dataPre:$cons.dataPre,
        data:null,
        mountContent:function(){
            this.$el.html(this._getTemplateContent());   //根据视图模版对界面进行渲染
        },
        /**
         * 获取解析后的视图模版的内容
         * @return {*}
         * @private
         */
        _getTemplateContent: function () {
            var template = this.getTemplate();
            return this._parseTemplate(template);
        },
        /**
         * 获取视图模版
         * @return {*}
         */
        getTemplate: function () {
            return this.get("template", null);
        },
        /**
         * 解析模版，将模版中的动态内容根据上下文信息进行替换
         */
        _parseTemplate: function (template) {
            var context = this.getTemplateContext();
            if (context == null)
                return template;
            if(this.dataPre){
                return _.template(template,{variable: this.dataPre})( context);
            } else{
                return _.template(template)( context);
            }
        },
        /**
         * 获取模版的上下文信息
         * @return {*}
         */
        getTemplateContext: function () {
            return this.get("data", null);
        },
    });
    return AbstractControlView;
});