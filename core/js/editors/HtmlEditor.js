/**
 * @module 富文本编辑器[HtmlEditor]
 * @description 富文本编辑器,用于编辑富本文信息
 * @author:
 * @date: 14-10-15 上午9:17
 */
define(["core/js/editors/Editor",
    "ueditor"
], function ( Editor) {
    var HtmlEditor = Editor.extend({
        xtype:$Component.HTMLEDITOR,
        /**
         * [可选]{String}工具栏类型：basic,full,custom
         * @default basic
         */
        toolbarType: "basic",
        /**
         * [可选]{Array}工具栏配置信息，当toolbarType为custom有效
         */
        toolbarConfig: null,
        /**
         * [可选]{Int}编辑器高度
         * @default 300
         */
        height: 300,
        /**
         * [可选]{Int}编辑器宽度
         * @default 800
         */
        width: null,
        _ueditorId: null,
        _ueditor: null,
        _init$Input: function () {
            if (!this.$input) {
                this.id = $.uuid();
                this._ueditorId = this.id + "-ueditor";
                this.$input = $('<script id="' + this._ueditorId + '" type="text/plain"></script>');
                var that = this;
                setTimeout(function () {     //延迟初始化，否则ie下快速连续刷新页面会导致页面错乱 add by chenwy 14-11-11
                    that._initUEditor();
                    that.setValue(that.value); //初始化编辑器的值
                })
            }
            this._super();
        },
        _initUEditor: function () {
            var toolbarType = this.toolbarType || "basic";
            var toolbarConfig = ['source', '|', 'undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', 'removeformat', '|', 'forecolor', 'backcolor', '|', 'selectall', 'cleardoc', '|', 'fontfamily', 'fontsize'];

            if (toolbarType == "full") {
                toolbarConfig = [
                    'fullscreen', 'source', '|', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                    'pagebreak', 'template', '|',
                    'horizontal', 'date', 'time', 'spechars', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                    'searchreplace', 'help'
                ];
            }
            var initWidth = this.width || "100%";
            var initHeight = this.height || 300;
            //如果是自定义的工具栏
            if (toolbarType == "custom") {
                toolbarConfig = this.toolbarConfig || toolbarConfig;
            }

            var uEditorConfig = {
//                ,imageUrl:URL+"jsp/imageUp.jsp"             //图片上传提交地址
//                ,imagePath:URL + "jsp/"                     //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置
//                ,imageFieldName:"upfile"                   //图片数据的key,若此处修改，需要在后台对应文件修改对应参数

                //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
                initialFrameWidth: initWidth,
                initialFrameHeight: initHeight,
                toolbars: [toolbarConfig]
            };
            this._ueditor = UE.getEditor(this._ueditorId, uEditorConfig);

            var that = this;

            var fullscreenChangeFunc = function (method, isFullState) {
                if (isFullState) {   //动态调整主工作区的层级，全屏时编辑器会被遮住
                    $("#main").css("z-index", "10000");
                } else {
                    $("#main").css("z-index", "1");
                }
            }
            this._ueditor.removeListener('fullscreenchanged', fullscreenChangeFunc);
            this._ueditor.addListener('fullscreenchanged', fullscreenChangeFunc);

            var destroyHandler = function () {
                try {
                    that.destroy();
                } catch (ex) {
                }
            };
            $(window).off("unload", destroyHandler);
            $(window).on("unload", destroyHandler);

            this.trigger("initialized");   //触发初始化完成后的事件

        },
        /**
         * 销毁编辑器
         */
        destroy: function () {
            if (this._ueditor != null) {
                if (this.isHtmlEditorReady()) {
                    var that = this;
                    setTimeout(function () {    //延迟销销毁，由于ueditor本身有一些元素也是延迟加载，销毁时要等元素加载完，否则会报错 add by chenwy 14-11-11
                        that._ueditor.destroy();
                        that._ueditor = null;
                    }, 500);
                }
            }
            this._super();
        },
        /**
         * 获取编辑器的值
         */
        getValue: function () {
            if (!this.isHtmlEditorReady())
                return "";
            return this._ueditor.getContent();
        },
        /**
         * 设置编辑器的值
         * @param value{String} 值
         */
        setValue: function (value) {
            if (!value)
                return;

            var that = this;
            if (this.isHtmlEditorReady()) {
                this.setContent(value);
            } else {
                setTimeout(function () {
                    that.setValue(value);
                });
            }
        },
        /**
         * 设置编辑器的内容
         * @param content {String} 内容
         * @param isAppendTo {Boolean} 是否为追加方式
         */
        setContent: function (content, isAppendTo) {
            this._ueditor.setContent(content, isAppendTo);
        },
        /**
         * 获得编辑器的纯文本内容
         * @returns {String}
         */
        getContentTxt: function () {
            return this._ueditor.getContentTxt();
        },
        /**
         * 获得编辑器的带格式的纯文本内容
         * @returns {String}
         */
        getPlainTxt: function () {
            return this._ueditor.getPlainTxt();
        },
        /**
         * 判断编辑器是否有内容
         * @returns {Boolean}
         */
        hasContent: function () {
            return this._ueditor.hasContents();
        },
        /**
         * 设置编辑器可用状态 true:可用，false：不可用
         * @param enabled{Boolean} 是否可用状态
         */
        setEnabled: function (enabled) {
            var that = this;
            this._super(enabled);
            if (this.isHtmlEditorReady()) {
                if (enabled) {
                    this._ueditor.setEnabled();
                } else {
                    this._ueditor.setDisabled('fullscreen');
                }
            } else {
                setTimeout(function () {
                    that.setEnabled(enabled);
                });
            }
        },
        /**
         * 编辑器获得焦点
         */
        focus: function () {
            if (!this.isEditable())
                return;
            this._ueditor.focus();

        },
        /**
         * 编辑器失去焦点
         */
        blur: function () {
            this._ueditor.blur();
        },
        /**
         * 插入HTML
         * @param html{String} html内容
         */
        insertHtml: function (html) {
            this._ueditor.execCommand('insertHtml', html);
        },
        /**
         * 设置编辑器的高度
         * @param height{Int} 高度
         */
        setHeight: function (height) {
            if (!height || parseFloat(height) == 0)
                return;

            this.height = height;
            if (this.isHtmlEditorReady()) {
                this._ueditor.setHeight(height);
            }
        },
        /**
         * 判断编辑器是否初始化完成
         * @returns {Boolean}
         */
        isHtmlEditorReady: function () {
            return this._ueditor && this._ueditor.iframe != null;
        },
        /**
         * 隐藏编辑器
         */
        hide: function () {
            this._ueditor.setHide();
        },
        /**
         * 显示编辑器
         */
        show: function () {
            this._ueditor.setShow();
        },
        /**
         * 是否将编辑器设置为只读
         * @param readOnly{Boolean} 是否只读
         */
        setReadOnly: function (readOnly) {
            if (readOnly == null)
                readOnly = true;

            this.readOnly = readOnly;

            this.setEnabled(!readOnly);
        },
        /**
         * 判断编辑器是否可编辑
         * @returns {Boolean}
         */
        isEditable: function () {
            return this._ueditor != null && this.isVisible() && !this.isReadOnly();
        },
        /**
         *  判断编辑器是否有焦点
         * @returns {Boolean}
         */
        isFocus: function () {
            return this._ueditor.isFocus();
        },
    });
    return HtmlEditor;
});