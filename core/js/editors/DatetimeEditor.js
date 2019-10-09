/**
 * @author:   * @date: 2016/1/18
 */

define([
    "core/js/CommonConstant",
    "core/js/editors/DateEditor",
    "bootstrap-datetimepicker.locale"
], function ( CommonConstant, DateEditor, Button) {
    var DatetimeEditor = DateEditor.extend({
        xtype:$Component.DATETIMEEDITOR,
        plugin:"datetimepicker",
        getOption:function(){
            var options = this._super();

            var option = {};
            option[$cons.DateEditorMode.COMPONENT] = function(){
                _.extend(options,{
                    pickerPosition:'bottom-left',
                });
            };
            this.modeExcute(option);
            return options;
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            //移除所有绑定到input中的事件
            if(_.isFunction(this.$controlGroup[this.plugin])){
                this.$controlGroup[this.plugin].call(this.$controlGroup,"remove");
            }
            this._super(true);
        },
    });
    return DatetimeEditor;
});