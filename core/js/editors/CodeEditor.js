/**
 * @author:   * @date: 2016/2/26
 * 代码编辑器使用codemirror插件
 * http://codemirror.net/doc/manual.html#vimapi
 */
define([
    "core/js/editors/Editor",
    "core/js/CommonConstant",
    "lib/codemirror/5.22.0/lib/codemirror",
    "css!lib/codemirror/5.22.0/lib/codemirror.css",
    "lib/codemirror/5.22.0/mode/htmlmixed/htmlmixed"
], function (Editor,CommonConstant,CodeMirror) {
    var CodeEditor = Editor.extend({
        xtype: $Component.CODEEDITOR,
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.TEXTAREA);
            }
            this._super();
        },
        /**
         * 初始化组件
         * @private
         */
        mountContent: function () {
            this._super();
            var that = this;
            //设置placeholder
            this.setPlaceholder(this.placeholder);
            this.plugin = CodeMirror.fromTextArea(this.$input[0],{
                value: "function myScript(){return 100;}\n",
                mode:  "javascript",
                lineNumbers: true,
            });
            this.setValue("function myScript(){return 100;}\n");
        },
        setValue: function (value, triggerEvent) {
            this._super(value, triggerEvent);
            if(this.plugin){
                this.plugin.setValue(value);
            }
        },
        destroy: function () {
            this.plugin = null;
            this._super();
        }
    });

    return CodeEditor;
})
