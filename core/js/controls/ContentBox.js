/**
 * @module  内容盒子[ContentBox]
 * @description 提供一个文本标签的类。
 *
 * @example
 * 以下是一个 {@link controls.ContentBox} 文本标签控件的使用示例。
 * <code language="JavaScript">

 * </code>
 *
 * @date: 2013-10-30 下午7:01
 */
define([
    "core/js/controls/Control"
], function (Control) {
    var ContentBox = Control.extend({
        xtype:$Component.LABEL,

        autoWrap: false,

        initialize: function (options,triggerEvent) {
            this._super(options,triggerEvent);
        },
        mountContent:function(){

        }
    });

    return ContentBox;
});
