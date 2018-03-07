/**
 * @author:   * @date: 2016/2/26
 */
define([
    "core/js/editors/Editor",
], function (Editor) {
    var ViewEditor = Editor.extend({
        xtype: $Component.VIEWEDITOR,
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.VIEW);
            }
            this._super();
        },
        setDisplayValue:function(displayValue){
            this.$input.text(displayValue);
        }

    });

    return ViewEditor;
})
