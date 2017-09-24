/**
 * @module 表单视图[FormView]
 * @description 表单视图
 *
 * @date: 2013-10-19 下午2:38
 */
define(["core/js/base/BizBaseView",
        "backbone", "core/js/windows/messageBox",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils", "lib/md5", "validate","core/js/utils/JqueryUtils"],
    function (BizBaseView, Backbone, temple, MessageBox, ApplicationContext, ApplicationUtils, MessageDigest) {

    var FormView = BizBaseView.extend({
        /**
         * [可选]是否显示面板标题
         * @default false
         */
        titlebar: false,

        /**
         * [可选]工具栏的配置信息
         */
        toolbar: null,

        /**
         * [可选]该视图是否只读
         * @default false
         */
        readOnly: false,

        /**
         * 事件：表单验证后的事件
         */
        onvalidate: null,

        /**
         * 事件：表单提交前触发的事件
         */
        onbeforesubmit: null,

        /**
         * 事件：表单提交后的事件
         */
        onsubmit: null,

        /**
         * 表单编辑器对象
         */
        _formEditor: null,

        /**
         * 工具栏对象
         */
        _toolBarObject: null,

        /**
         * 存储当前请求的URL片段，不带#：Backbone.history.fragment
         */
        _requestUrlFragment: null,

        /**
         * 表单实体内容是否自适应容器的高度，add by 2014.09.23
         */
        _isFit: true,

        /**
         * 获取表单控件
         * @return {null}
         */
        getFormEditor: function () {
            return this._formEditor;
        },
        /**
         * 取得工具栏对象
         * @return {null}
         */
        getToolBarObject: function () {
            return this._toolBarObject;
        },
        /**
         * 获取表单验证器
         * @return {*|null}
         */
        getValidator: function () {
            return this._formEditor.getValidator();
        },
        /**
         * 标识该视图是一个表单视图
         * add by 2014.04.21
         * @return {boolean}
         */
        isFormView: function () {
            return true;
        },
        /**
         * 针对在操作中注册提交事件的，为了防止事件的重复注册，需要先将已经在操作中注册的提交事件移除，再注册
         * add by 2014.06.23
         * @param submitHandle
         */
        registerSubmitEvent: function (submitHandle) {
            var formEditor = this.getFormEditor();
            if (this._submitHandle) {
                formEditor.off("submit", this._submitHandle); //先注销提交绑定的事件，否则按钮单击几次，就会导致该事件执行几次 add by 2014.06.20
            }
            if (submitHandle) {
                formEditor.on("submit", submitHandle);
                this._submitHandle = submitHandle;    //这里需要额外的变量进行存储，因为在IE下认为这是两个函数
            }
        },
        /**
         * 刷新当前表单界面
         * add by 2014.09.09
         */
        refresh: function () {
            var requestUrlFragment = this._requestUrlFragment;
            if (!requestUrlFragment)
                return;

            ApplicationUtils.loadUrl("#" + requestUrlFragment);  //重新加载页面
        },

        /*------------ private methods ---------------------*/

        initialize: function (options, triggerEvent) {
            options = options || {};
            //标识表单内容是否自动充满其容器，不出现滚动条
            if (_.has(options, "isFit") && options["isFit"] !== null) {
                this._isFit = options["isFit"];
            }

            this._requestUrlFragment = Backbone.history.fragment;

            this._initPanelProps(options);                   //初始化面板的属性

            this._super(null, false);

            //向表单区域注册事件，当区域调整时，自动触发表单布局调整
            var that = this,
                formEditorRegion = this.getFormEditorRegion();
            formEditorRegion.on("resize", function () {
                that.getFormEditor().trigger("resize");  //需要同时触发表单的布局
            });
            formEditorRegion.on("show", function () {
                var formEditor = that.getFormEditor();
                formEditor.trigger("show");  //需要同时触发表单的显示事件
            });

            //组件初始化完成，触发事件
            if (triggerEvent == null || triggerEvent)
                this.trigger("initialized");
        },
        /**
         * 取得表单编辑器区域
         * @return {*}
         */
        getFormEditorRegion: function () {
            return this.getRegion("form-view-editor");
        },
        /**
         * 取得工具栏区域
         * @return {*}
         */
        getToolbarRegion: function () {
            return this.getRegion("form-view-toolbar");
        },
        /**
         * 视图销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        close: function () {
            this._super();

            this._formEditor = null;     //formEditor的销毁统一交给布局区域的销毁进行
            this._toolBarObject = null; //toolBarObject的销毁统一交给布局区域的销毁进行
        },
        _initPanelProps: function (options) {
            var formEditorConfig = this._getFormEditorConfig(options);
            this.set(options);   //必须在获取编辑器配置信息之后，因为其会对options中的信息做一些处理

            this._initFormEditor(formEditorConfig);   //初始化FormEditor组件
            this._initToolbar();                      //初始化工具栏组件

            //初始化工具栏
            if (this.toolbar) {
                var isTop = this._isToolBarTop(),
                    toolbarRegionConfig = this._getToolbarRegionConfig();
                if (isTop)
                    this.tbar = toolbarRegionConfig;
                else
                    this.bbar = toolbarRegionConfig;
            }
            var formEditor = this._formEditor;
            var autoScroll = !this._isFit || !formEditor.hasGroup();
            //初始化表单主体
            this.items = {
                flex: 1,
                id: "form-view-editor",
                autoScroll: autoScroll,  //如果不存在分组，就允许出现滚动条 add by 2014.10.10
                comRef: formEditor
            }

            this.layout = Panel.Layout.FIT;  //始终是fit布局，外部对layout的指定就是表单内部的 add by 2014.09.12
        },
        /**
         * 初始化工具栏：按钮和查询条件
         * @private
         */
        _initToolbar: function () {
            var toolbar = this.toolbar;
            if ($.isPlainObject(toolbar)) {
                toolbar.parent = this;    //设置该工具栏归属的视图

                if (this._isToolBarTop()) {
                    this.toolbar.className = "h-col h-pull-left";
                } else {
                    this.toolbar.position = ToolBar.Position.BOTTOM;
                }
                this._toolBarObject = new ToolBar(toolbar);
            }
        },
        _isToolBarTop: function () {
            if (this.toolbar)
                return this.toolbar["position"] == "top";
            return false;
        },
        /**
         * 初始化表单控件
         * @param config
         * @private
         */
        _initFormEditor: function (config) {
            this._formEditor = new FormEditor(config);
        },
        _getFormEditorConfig: function (options) {
            options = options || {};
            var that = this;
            var result = {
                fields: options["fields"],
                groups: options["groups"],
                ajaxClient: options["ajaxClient"],
                methodName: options["methodName"],
                methodVersion: options["methodVersion"],
                scene: options["scene"],
                cols: options["cols"],
                labelAlign: options["labelAlign"],
                template: options["template"],
                data: options["data"],
                validateOnBlur: options["validateOnBlur"],
                showErrorType: options["showErrorType"],
                errorContainer: options["errorContainer"],
                parseParameters: options["parseParameters"],
                spacing: this.spacing,      //保证表单中的间隔与布局的间隔是一致的 add by 2014.02.19
                isFit: this._isFit
            };

            this._deleteOptions(result, options);

            //不能放置在上面，否则会被this._deleteOptions删除掉，因此对于不想被删除的，需要额外定义
            result["onvalidate"] = function (e) {
                return that.trigger("validate", e);
            }
            result["onbeforesubmit"] = function (e) {
                return that.trigger("beforesubmit", e);
            }
            result["onsubmit"] = function (e) {
                return that.trigger("submit", e);
            }

            result["parent"] = this;    //建立表单控件与表单视图的关联

            return result;
        },
        _deleteOptions: function (result, options) {
            if (result == null || options == null)
                return;
            for (var key in result) {
                if (options[key])
                    delete options[key];
            }
        },
        _getToolbarRegionConfig: function () {
            var isTop = this._isToolBarTop(),
                result = {
                    height: 36,
                    id: "form-view-toolbar",
                    className: "h-box-item h-toolbar",
                    comRef: this._toolBarObject
                };
            if (!isTop) {
                result["className"] = "h-box-item h-toolbar h-toolbar-footer";
            }
            return result;
        }
    });

    FormView.ToolBar = {
        SAVE: {
            id: "save",
            text: "保存",
            template: CommonConstant.Template.Button.FORM,
            className: " h-btn-primary ",
            enterKeyNavigatable: true,          //支持键盘回车操作：按回车键即触发按钮的单击操作
            onclick: function () {
                var progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                var formView = this.getParent().getParent();
                var formEditor = formView.getFormEditor();
                formEditor.submit({
                    progressDialogId: progressDialogId
                });   //提交表单
            }
        },
        SAVE_WITH_ICON: {
            id: "save",
            text: "保存",
            className: " ",
            iconSkin: ToolBar.IconSkin.SAVE,
            template: CommonConstant.Template.Button.TOOLBAR,
            onclick: function () {
                var progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                var formView = this.getParent().getParent();
                var formEditor = formView.getFormEditor();
                formEditor.submit({
                    progressDialogId: progressDialogId
                });   //提交表单
            }
        },
        SAVE_AND_CONTINUE: {
            id: "save_and_continue",
            text: "保存并新增",
            template: CommonConstant.Template.Button.FORM,
            enterKeyNavigatable: true,          //支持键盘回车操作：按回车键即触发按钮的单击操作
            onclick: function () {
                var progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                var formView = this.getParent().getParent();
                var formEditor = formView.getFormEditor();

                //注册保存成功后，刷新界面
                var submitHandle = function (compositeResponse) {
                    formView.refresh();
                };
                formView.registerSubmitEvent(submitHandle);  //注册提交事件

                formEditor.submit({
                    progressDialogId: progressDialogId
                });   //提交表单
            }
        },
        SAVE_AND_CLOSE: {
            id: "save_and_close",
            text: "保存",
            className: " h-btn-primary ",
            template: CommonConstant.Template.Button.FORM,
            enterKeyNavigatable: true,          //支持键盘回车操作：按回车键即触发按钮的单击操作
            onclick: function () {
                var progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                var formView = this.getParent().getParent();
                var formEditor = formView.getFormEditor();
                //注册保存成功后，刷新界面
                var submitHandle = function (compositeResponse) {
                    if (compositeResponse.isSuccessful()) {
                        $.window.close();
                    }
                };
                formView.registerSubmitEvent(submitHandle);  //注册提交事件

                formEditor.submit({
                    progressDialogId: progressDialogId
                });   //提交表单
            }
        },
        SAVE_AND_CLOSE_WITH_ICON: {
            id: "save_and_close",
            text: "保存",
            iconSkin: ToolBar.IconSkin.SAVE,
            template: CommonConstant.Template.Button.TOOLBAR,
            onclick: function () {
                var progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                var formView = this.getParent().getParent();
                var formEditor = formView.getFormEditor();
                var submitHandle = function (compositeResponse) {
                    if (compositeResponse.isSuccessful()) {
                        $.window.close();
                    }
                };
                formView.registerSubmitEvent(submitHandle);  //注册提交事件

                formEditor.submit({
                    progressDialogId: progressDialogId
                });   //提交表单
            }
        },
        CANCEL: {
            id: "cancel",
            text: "取 消",
            template: CommonConstant.Template.Button.FORM,
            enterKeyNavigatable: true,          //支持键盘回车操作：按回车键即触发按钮的单击操作
            onclick: function () {
                $.window.close();
            }
        },
        CANCEL_WITH_ICON: {
            id: "cancel",
            text: "取 消",
            iconSkin: ToolBar.IconSkin.CLOSE,
            template: CommonConstant.Template.Button.TOOLBAR,
            onclick: function () {
                $.window.close();
            }
        }
    }

    /**
     * 获取表单提供的默认按钮
     * add by 2014.06.30
     * @param id
     * @param options {Object}允许对默认按钮配置进行调整的参数
     * @return {*}
     */
    FormView.getDefaultButton = function (id, options) {
        var toolbar = FormView.ToolBar;
        var result = toolbar[id];
        if (!result)
            return null;
        if (_.isObject(options)) {
            result = _.extend({}, result, options);
        }
        return result;
    }
    /**
     * 默认按钮的ID
     * add by 2014.06.30
     *
     */
    FormView.DEFAULT_BUTTON = {
        SAVE: "SAVE",
        SAVE_WITH_ICON: "SAVE_WITH_ICON",
        SAVE_AND_CONTINUE: "SAVE_AND_CONTINUE",
        SAVE_AND_CLOSE: "SAVE_AND_CLOSE",
        SAVE_AND_CLOSE_WITH_ICON: "SAVE_AND_CLOSE_WITH_ICON",
        CANCEL: "CANCEL",
        CANCEL_WITH_ICON: "CANCEL_WITH_ICON"
    }
    FormView.IconSkin = ToolBar.IconSkin;
    FormView.Type = FormEditor.Type;
    FormView.Scene = FormEditor.Scene;
    FormView.FormUtils = FormEditor.FormUtils;
    FormView.Spacing = Panel.Spacing;

    return FormView;
});