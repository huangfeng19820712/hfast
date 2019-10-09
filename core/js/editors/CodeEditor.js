/**
 * @author:   * @date: 2016/2/26
 * 代码编辑器使用codemirror插件
 * http://codemirror.net/doc/manual.html#vimapi
 */
define([
    "core/js/editors/Editor",
    "core/js/CommonConstant",
    "core/js/editors/CodeEditorFormatting"
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
         * 设置代码的模式
         */
        mode: $cons.CodeEditorMode.javascript,
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
                //value: "function myScript(){return 100;}\n",
                mode:that.mode,
                //mode:"javascript",
                //mode:"application/json",
                lineNumbers: true,
                //设置主题
                //theme:"eclipse",
                //快捷键
                extraKeys:{
                    "F7":$.proxy(that.format,that)
                        /*function autoFormat(editor) {
                        var totalLines = editor.lineCount();
                        editor.autoFormatRange({line:0, ch:0}, {line:totalLines});
                    }//代码格式化*/
                },
            });
            //this.setValue("function myScript(){return 100;}\n");
        },
        /**
         * 代码格式化
         */
        format:function(){
            var totalLines = this.plugin.lineCount();
            this.plugin.autoFormatRange({line:0, ch:0}, {line:totalLines});
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
