/**
 * @module 按钮[Button]
 * @description 一个提供按钮控件的类。
 * * @example
 * 以下是一个创建 {@link controls.Button} 的示例。 该示例将说明如何创建一个
 *          {@link controls.Button}，以及如何订购事件。
 * <code language="JavaScript">
 * var button = new Button({
 *     text: "按钮名称"
 * });
 *
 * button.on("click", function()
 * {
 *     alert("点击事件");
 * });
 * </code>
 *
 * @date: 2013-10-30 上午9:03
 */
define(["core/js/controls/ToolStripItem", "core/js/CommonConstant"], function (ToolStripItem,CommonConstant) {

    var Button = ToolStripItem.extend({
        theme:$Theme.DEFAULT,
    });

    //Button.Template = ToolStripItem.Template;

    Button.ThemeClass = ToolStripItem.ThemeClass;

    Button.ClassName = ToolStripItem.ClassName;

    /**
     * 系统默认提供的按钮图片
     * @type {{ADD: string, EDIT: string, DELETE: string, VIEW: string, COPY: string, PRINT: string, DOWNLOAD: string, IMPORT: string, EXPORT: string, REFRESH: string, RELEASE: string}}
     */
    Button.IconSkin = ToolStripItem.IconSkin;

    /**
     * 系统默认提供的按钮
     * @type {{save: {text: string, className: string}, add: {text: string, iconSkin: string}, update: {text: string, iconSkin: string}, delete: {text: string, iconSkin: string}, view: {text: string, iconSkin: string}, copy: {text: string, iconSkin: string}, print: {text: string, iconSkin: string}, download: {text: string, iconSkin: string}, import: {text: string, iconSkin: string}, export: {text: string, iconSkin: string}, refresh: {text: string, iconSkin: string}, release: {text: string, iconSkin: string}}}
     */
    Button.DefaultCommand = _.extend( ToolStripItem.DefaultCommand, {
        "OK": {
            text: "确定"
        }
    });



    return Button;
});