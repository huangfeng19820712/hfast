/**
 * @module  文本标签[Label]
 * @description 提供一个文本标签的类。
 *
 * @example
 * 以下是一个 {@link controls.Label} 文本标签控件的使用示例。
 * <code language="JavaScript">
 * var label = new Label({
 *     text: "姓名",
 *     textAlign: "center",
 *     verticalAlign: "middle",
 *     onclick: function(e)
 *     {
 * 	       alert(this.text);
 *     }
 * });
 * </code>
 *
 * @date: 2013-10-30 下午7:01
 */
define(["jquery",
    "underscore",
    "core/js/controls/Control"
], function ($, _, Control) {
    var Label = Control.extend({
        xtype:$Component.LABEL,
        eTag: "<span />",

        /**
         * 获取标签显示的文本。请使用 {@link setText} 方法设置文本的值。
         */
        text: null,

        /**
         * 获取标签的文本的左右对齐方式。如“left”，表示靠右对齐。请使用 {@link setTextAlign} 方法设置该字段的值。
         * <p>
         * 该字段的可选值包括:
         * <ul>
         * <li>left</li>
         * <li>right</li>
         * <li>center</li>
         * </ul>
         * </p>
         */
        textAlign: "left",

        /**
         * 获取标签的文本的上下对齐方式。如“middle”，表示居中对齐。请使用 {@link setVerticalAlign} 方法设置该字段的值。
         *
         * @default middle
         */
        verticalAlign: "middle",

        /**
         * @default 100%
         */
        width: "auto",

        /**
         * @default 21
         */
        height: 21,

        /**
         * 获取控件字体大小，可以是数字（如 12）、字符串（如“12px”）。请使用 {@link setFontSize} 方法设置该字段的值。
         *
         * @default 12px
         */
        fontSize: "12px",

        autoWrap: false,
        /**
         * 当点击 Label 并且 {@link mx.controls.Control.enabled} 字段值为 true 时触发该事件。
         */
        onclick: null,


        /**
         * 设置标签的显示文本。
         * @param text 一个字符串文本，表示标签显示的文本。
         */
        setText: function (text) {
            this.text = text;
            this.$el.text(text);
        },
        /**
         * 设置 {@link textAlign} 字段的值。
         * @param textAlign 一个文本，表示标签文本的左右对齐方式。
         */
        setTextAlign: function (textAlign) {
            if (textAlign == null || textAlign == "")
                return;

            this.textAlign = textAlign;
            this.$el.css("text-align", textAlign);
        },
        /**
         * 设置 {@link verticalAlign} 字段的值。
         * @param verticalAlign 一个文本，表示标签文本的上下对齐方式。
         */
        setVerticalAlign: function (verticalAlign) {
            if (verticalAlign == null || verticalAlign == "")
                return;

            this.verticalAlign = verticalAlign;
            this.$el.css("vertical-align", verticalAlign);
        },
        /**
         * 设置 {@link fontSize} 字段的值。
         * @param fontSize 控件字体大小，可以是数字（如 12）、字符串（如“12px”）。
         */
        setFontSize: function (fontSize) {
            if (fontSize == null || fontSize == "")
                return;

            this.fontSize = fontSize;
            this.$el.css("font-size", fontSize);
        },
        /**
         * 设置 {@link height} 字段的值。
         * @param height
         */
        setHeight: function (height) {
            this._super(height);

            if (typeof height == "number") {
                this.$el.css("line-height", height + "px");
            } else {
                this.$el.css("line-height", height);
            }
        },
        initialize: function (options,triggerEvent) {
            this.themeClass = this.themeClass||Label.ThemeClass.DEFAULT;
            this.roundedClass = $cons.rounded.ROUNDED;
            this._super(options,triggerEvent);
        },
        mountContent:function(){
            this.setText(this.text);
            this.setTextAlign(this.textAlign);
            this.setVerticalAlign(this.verticalAlign);
            this.setFontSize(this.fontSize);

            this.$el.on("click", function (e) {
                e.preventDefault();
                var that = $(this).data("control");
                that.trigger("click");    //触发单击操作
            });
        }
    });

    Label.ThemeClass={
        "DEFAULT":"label-default",
        "PRIMARY":"label-primary",
        "INFO":"label-info",
        "SUCCESS":"label-success",
        "WARNING":"label-warning",
        "DANGER":"label-danger"
    };

    return Label;
});
