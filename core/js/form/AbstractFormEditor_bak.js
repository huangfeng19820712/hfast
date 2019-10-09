/**
 * @module 抽象表单编辑器[AbstractFormEditor]
 * @description 表单编辑器的抽象类：该抽象类不涉及到布局、分组，主要是针对于表单项的处理（包含表单项组件、验证、控制）
 * @author:
 * @date: 2014-03-24 上午10:25
 */
define([
    "core_js/CommonConstant",
    "core_js/lib/sha1",
    "core_js/rpc/AjaxClient",
    "core_js/controls/Control",
    "core_js/editors/EditorFactory",
    "core_js/utils/ComponentUtil",
    "core_js/validate/Validator",
    "core_js/utils/CheckUtil",
    "text!core_templates/form/form.html"
], function (CommonConstant, MessageDigest, AjaxClient, Control, ComponentFactory, ComponentUtil, Validator, CheckUtil, FormViewTemplate) {

    var AbstractFormEditor = Control.extend({
        id: "form_editor",

        /**
         * 标签的对齐方式：top、left、right
         */
        labelAlign: "top",
        labelWidth: "100",

        /**
         * 存储需要提交到服务端的隐藏域信息的值，键为字段名，值为隐藏域的值
         */
        _inputHiddenValueMap: null,
        /**
         * 存储界面上可见的组件，键为字段名，值为组件
         */
        _componentMap: null,
        /**
         * 生成组件的配置信息
         */
        _componentConfig: null,

        _templateData: null,

        _validateConfig: null,

        _validator: null,

        /**
         * 当前表单所处的场景：新增、修改、查看
         */
        scene: null,

        /**
         * 获取一个 Boolean 值，表示是否需要在实例化时自动调用 {@link render} 方法。
         *
         * @default true
         */
        autoRender: true,

        /*-------------------表单布局相关---------------*/
        /**
         * 配置表单显示的模版
         */
        template: null,

        /*-------------------表单控件及验证相关---------------*/

        /**
         * 配置表单控件的信息，包括验证信息
         */
        fields: null,

        /**
         * 事件：声明表单验证后的事件
         */
        onvalidate: null,

        validateOnBlur: false,
        showErrorType: null,
        errorContainer: null,

        /*-------------------表单与服务端交互的ajax客户端---------------*/
        ajaxClient: null,
        methodName: null,
        methodVersion: "1.0",
        parseParameters: null,       //{function}对请求参数进行解析处理


        /**
         * 事件：在显示结果前触发的事件
         */
        onbeforeshowresult: null,

        /**
         * 事件：表单验证成功后，提交之前的事件
         */
        onbeforesubmit: null,

        /**
         * 事件：表单提交后的事件
         */
        onsubmit: null,

        /**
         * 事件：表单重置后的事件
         */
        onreset: null,

        /**
         * 滚动到指定的编辑器
         * add by 2014.12.17
         * @param fieldName
         */
        scrollToEditor: function (fieldName) {
            if (this.isComponent(fieldName)) {
                var editor = fieldName;
                fieldName = editor.name;
            }
            var selector = "#" + FormUtils.getFieldGroupName(fieldName);
            ComponentUtil.scrollTopElement(this.$el.parent(), selector);  //将DIV的滚动条滚动到其子元素所在的位置，方便自动定位 add by 2014.12.16
            this._ignoreRemoveErrorTipEvent = true;    //忽略移除错误提示事件，避免聚焦元素时，无法提示错误信息 add by 2014.12.17
        },
        /**
         * 判断指定字段的当前值与其默认值是否有变化
         * add by 2014.05.08
         * @param fieldNames  多个值用逗号分隔
         * @return {boolean}
         */
        hasValueChanged: function (fieldNames) {
            if (fieldNames == null)
                return false;
            var fieldNameArray = fieldNames.split(",");
            var fieldName, component, result = false;
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldName = this._initKey(fieldNameArray[i]);
                if (_.isEmpty(fieldName))
                    continue;

                component = this.getComponent(fieldName);
                if (component == null)
                    continue;

                //如果值发生变更了，就直接返回
                result = component.hasChanged();
                if (result)
                    return result;
            }
            return result;
        },
        /**
         * 获取编辑器的值
         *
         * @param fieldName 字段名
         * @return {*}
         */
        getValue: function (fieldName) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return null;

            if (this.hasHiddenValue(fieldName)) {
                return this._inputHiddenValueMap[fieldName];
            }

            var editor = this.getEditor(fieldName);
            if (editor == null)
                return null;

            return editor.getValue();
        },
        /**
         * 获取编辑器的显示值
         * @param fieldName
         * @return {*}
         */
        getDisplayValue: function (fieldName) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return null;

            var editor = this.getEditor(fieldName);
            if (editor == null)
                return null;

            return editor.getDisplayValue();
        },
        /**
         * 批量设置值
         * @param options
         * @param ignoreNotExistedField {@default false} 是否忽略不存在的字段，默认是不忽略
         * @param triggerEvent     是否要触发值变更的事件
         */
        setValues: function (options, ignoreNotExistedField, triggerEvent) {
            if (!$.isPlainObject(options))
                return;

            for (var key in options) {
                this.setValue(key, options[key], ignoreNotExistedField, triggerEvent);
            }
        },
        /**
         * 设置值，如果存在表单控件，则向表单控件中设置，不存在，则保存到隐藏域中
         * @param fieldName 字段名，区分大小写
         * @param value
         * @param ignoreNotExistedField {@default false} 是否忽略不存在的字段，默认是不忽略
         * @param triggerEvent     是否要触发值变更的事件
         */
        setValue: function (fieldName, value, ignoreNotExistedField, triggerEvent) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return;
            //如果存在表单控件，并且值不一样，则向表单控件中赋值
            var editor = this.getEditor(fieldName);
            if (editor != null) {
                if (editor.getValue() != value)
                    editor.setValue(value, triggerEvent);
                return;
            }

            //如果要求忽略不存在的字段，并且该字段是不存在的，那么就直接返回
            if (ignoreNotExistedField && !this.hasHiddenValue(fieldName))
                return;
            //如果不存在表达控件，则将值存储到隐藏域中
            this._inputHiddenValueMap[fieldName] = value;
        },
        /**
         * 根据指定组件的名称设置组件是否只读
         * @param fieldNames 多个值用逗号分隔
         * @param readOnly   true|false只读开启或关闭
         */
        setReadOnly: function (fieldNames, readOnly) {
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(",");
            var fieldName, component;
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldName = this._initKey(fieldNameArray[i]);
                if (_.isEmpty(fieldName))
                    continue;

                component = this.getComponent(fieldName);
                if (component == null)
                    continue;

                if (component.setReadOnly)
                    component.setReadOnly(readOnly);
                else {
                    if (component.setEnabled)
                        component.setEnabled(!readOnly);
                }
            }
        },
        /**
         * 设置label的值
         * @param fieldName 字段名，区分大小写
         * @param label
         */
        setLabel: function (fieldName, label) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return;
            var labelId = FormUtils.getFieldLabelName(fieldName);
            this.$("#" + labelId).find("label").get(0).childNodes[0].textContent=label;
        },
        /**
         * 根据组件的配置来添加组件
         *
         * @param componentType 编辑器类型{@link ComponentFactory.Type}
         * @param config     组件的配置信息
         * @return {null}
         */
        addComponentByConfig: function (componentType, config) {
            var component = ComponentFactory.create(componentType, config);
            this.addComponent(component);

            //todo：此处中组件的配置信息应该同时包含了验证规则，因此需要往验证规则中添加对象。后续需要完善处理

            return component;
        },
        /**
         * 添加组件
         * @param component
         */
        addComponent: function (component) {
            if (!ComponentFactory.isComponent(component))
                return;

            var fieldName = component.getId();
            if (component.getName)
                fieldName = component.getName();
            fieldName = $.trim(fieldName);

            if (fieldName == "")
                return;

            this._componentMap[fieldName] = component;
        },
        /**
         * 根据字段名获取编辑器
         * @param fieldName
         * @return {*}
         */
        getEditor: function (fieldName) {
            var result = this.getComponent(fieldName);
            if (ComponentFactory.isEditor(result))
                return result;

            return null;
        },
        /**
         * 根据字段名获取组件
         * @param fieldName
         * @return {*}
         */
        getComponent: function (fieldName) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return null;

            return this._componentMap[fieldName];
        },
        getHiddenValue: function (fieldName) {
            var hasHiddenValue = this.hasHiddenValue(fieldName);
            if (!hasHiddenValue)
                return null;

            fieldName = this._initKey(fieldName);
            return this._inputHiddenValueMap[fieldName];
        },
        addHiddenValue: function (options, value) {
            if (!$.isPlainObject(options)) {
                this._addHiddenValue(options, value);
                return;
            }

            for (var key in options) {
                this._addHiddenValue(key, options[key]);
            }
        },
        _addHiddenValue: function (fieldName, value) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return;

            this._inputHiddenValueMap[fieldName] = value;
        },
        /**
         * 根据给定的字段名，判断是否存在该隐藏域
         *
         * @param fieldName 字段名
         * @return {*}
         */
        hasHiddenValue: function (fieldName) {
            fieldName = this._initKey(fieldName);
            if (_.isEmpty(fieldName))
                return false;

            return _.has(this._inputHiddenValueMap, fieldName);
        },
        /**
         * 设置与远程交互的Ajax客户端
         * @param ajaxClient
         */
        setAjaxClient: function (ajaxClient) {
            ajaxClient = ajaxClient || AjaxClient;
            this.ajaxClient = ajaxClient;
        },
        /**
         * 设置远程请求得action
         * @param methodName
         * @param methodVersion
         */
        setAction: function (methodName, methodVersion) {
            this.methodName = methodName;

            if (methodVersion == null || methodVersion == "")
                methodVersion = "1.0";
            this.methodVersion = methodVersion;
        },
        /**
         * 获取表单的参数：包括隐藏域的值和编辑器的值
         * @param needEmptyValue 空值是否也需要包含在结果集中，默认是不需要空值的，但是查询参数中可能需要
         * @return {{}}
         */
        getParameterMap: function (needEmptyValue) {
            var result = {};

            //获取隐藏域的值
            var value = null;
            var hiddenValueMap = this._inputHiddenValueMap;
            if (hiddenValueMap != null) {
                for (var fieldName in hiddenValueMap) {
                    value = hiddenValueMap[fieldName];
                    //如果值为空，那么就不加入到参数
                    if (!needEmptyValue && (value == null || $.trim(value) == ""))
                        continue;

                    result[fieldName] = value;
                }
            }

            //获取表单编辑器控件的值
            var editor = null;
            var fieldName = null;
            var componentNameArray = this.getAllComponentName();
            for (var i = 0; i < componentNameArray.length; i++) {
                fieldName = componentNameArray[i];
                editor = this.getEditor(fieldName);
                if (editor == null)
                    continue;

                value = editor.getValue();
                //如果是密码，并且需要加密，才进行加密处理
                if (editor.isPassword && editor.isPassword() && editor.isRequireEncryption()) {
                    value = MessageDigest.digest(value);
                }

                result[fieldName] = value;
            }

            return result;
        },
        /**
         * 对表单进行验证
         * @return {*}
         */
        validate: function () {
            var valid = this.getValidator().validate();
            if (!valid)
                return valid;

            valid = this.trigger("validate");
            return valid;
        },
        /**
         * 提交表单：对表单进行验证，提交表单，并且显示操作结果
         * @return {boolean}
         */
        submit: function (options) {
            options = options || {};
            var follow = options["follow"],    //用于控制成功提示信息显示的位置
                progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息

            //验证
            var valid = this.validate();
            if (!valid) {
                //关闭模态提示框
                if (progressDialogId)
                    $.window.closeProgressTip(progressDialogId);
                return false;
            }

            this.submitSaveHandle(options);   //提交保存操作，将该操作分开，是为了能够使该方法被独立调用 add by 2014.09.11
        },
        /**
         * 提交保存操作
         * @param options
         */
        submitSaveHandle: function (options) {
            options = options || {};
            var progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息
            if (!progressDialogId) {
                progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                options["progressDialogId"] = progressDialogId;
            }

            //提交之前触发事件
            var valid = this.trigger("beforesubmit");
            if (!valid) {
                //关闭模态提示框
                if (progressDialogId)
                    $.window.closeProgressTip(progressDialogId);
                return false;
            }

            var params = this.getParameterMap(false) || {};

            //在请求之前对参数进行加工处理，例如在此处对其中的参数名进行转换等操作
            if (this.parseParameters) {
                params = this.parseParameters(params);
            }

            //提交表单，此处采用异步的方式，否则会使页面变成假死，因为同步的ajax请求将阻塞所有的处理请求
            var that = this;
            this.ajaxClient.post({
                methodName: this.methodName,
                methodVersion: this.methodVersion,
                data: params,
                complete: function (compositeResponse) {
                    that._submitHandle(compositeResponse, options);   //表单提交成功后的回调处理
                }
            });
        },
        _submitHandle: function (ajaxResponse, options) {
            options = options || {};
            var progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息

            //关闭模态提示框
            if (progressDialogId)
                $.window.closeProgressTip(progressDialogId);

            //在显示结果前触发事件
            var result = this.trigger("beforeshowresult", ajaxResponse);

            if (!result)
                return;

            var that = this;
            var msg = ajaxResponse.getMessage();
            if (ajaxResponse.isSuccessful()) {
                $.window.markUpdated();    //标识表单值已经发生了变更
                msg = (msg == null || msg == "") ? "操作成功" : msg;
                msg = "<strong>" + msg + "</strong>";
                $.window.showSucceedMsg(msg, {
                    handle: function () {
                        that.trigger("submit", ajaxResponse);  //触发提交后的事件
                    }
                });
            } else {
                $.window.showErrorMsg(msg, {
                    handle: function () {
                        that.trigger("submit", ajaxResponse);  //触发提交后的事件
                    }
                });
            }
        },
        /**
         * 重置表单：目前仅对编辑器进行重置(默认是不触发编辑器值变更的事件)，同时触发重置后的事件
         * @param triggerChangedEvent 是否要触发编辑器值变更的事件
         */
        reset: function (triggerChangedEvent) {
            var componentMap = this._componentMap,
                fieldName, editor;
            //重置编辑器的值
            for (fieldName in componentMap) {
                editor = componentMap[fieldName];
                editor.reset(triggerChangedEvent);
            }

            //重置隐藏域的值为默认值 add by 2014.09.18
            var hiddenValueMap = this._inputHiddenValueMap;
            if (hiddenValueMap) {
                var fieldConfig, defaultValue;
                for (fieldName in hiddenValueMap) {
                    fieldConfig = this._getFieldConfigByFieldName(fieldName);
                    if (!fieldConfig)
                        continue;
                    defaultValue = fieldConfig["defaultValue"] || fieldConfig["value"];
                    this._inputHiddenValueMap[fieldName] = defaultValue;
                }
            }

            this.trigger("reset");
        },
        /**
         * 显示字段必填项提示
         * @param fieldNames  多个值用逗号分隔
         */
        showFieldEmphasisHint: function (fieldNames) {
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(",");
            var fieldEmphasisHintEl = null;
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldEmphasisHintEl = this._getFiledEmphasisEl($.trim(fieldNameArray[i]));
                this.setElVisible(fieldEmphasisHintEl, true);
            }
        },
        /**
         * 隐藏字段必填项提示
         * @param fieldNames  多个值用逗号分隔
         */
        hideFieldEmphasisHint: function (fieldNames) {
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(",");
            var fieldEmphasisHintEl = null;
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldEmphasisHintEl = this._getFiledEmphasisEl($.trim(fieldNameArray[i]));
                this.setElVisible(fieldEmphasisHintEl, false);
            }
        },
        /**
         * 设置DOM元素是否可见
         * @param el
         * @param visible
         */
        setElVisible: function (el, visible) {
            if (el == null)
                return;
            var $el = $(el);
            if ($el.length == 0)
                return;

            var display = visible ? "" : "none";
            $el.css({ display: display });
        },
        /**
         * 设置失焦验证的属性（默认是点击保存的时候才验证）
         * @param fieldNames
         */
        setValidateOnBlurProperties: function (fieldNames) {
            var validator = this.getValidator();
            if (validator == null)
                return;

            if (fieldNames == null || fieldNames == "")
                return;

            var propertyArray = this._getValidateProperties(fieldNames);
            for (var i = 0; i < propertyArray.length; i++) {
                propertyArray[i].setValidateOnBlur(true);
            }
        },
        /**
         * 忽略必填的属性验证设置
         * @param fieldNames       字段名，多个值用逗号分隔
         * @param ignoreRequired   是否要忽略指定的属性的必填项验证，默认为忽略验证，可选的值为true|false
         */
        ignoreRequiredProperties: function (fieldNames, ignoreRequired) {
            var validator = this.getValidator();
            if (validator == null)
                return;

            if (fieldNames == null || fieldNames == "")
                return;

            ignoreRequired = ignoreRequired == null ? true : ignoreRequired;

            if (ignoreRequired) {
                this.hideFieldEmphasisHint(fieldNames);
            } else {
                this.showFieldEmphasisHint(fieldNames);
            }

            var propertyArray = this._getValidateProperties(fieldNames);
            for (var i = 0; i < propertyArray.length; i++) {
                propertyArray[i].setRequiredRule(!ignoreRequired);
            }
        },
        /**
         * 忽略表单的验证
         * @param ignoreCheck 是否要忽略指定的属性的验证，默认为忽略验证，可选的值为true|false
         */
        ignoreValidate: function (ignoreCheck) {
            var validator = this.getValidator();
            if (validator == null)
                return;
            ignoreCheck = ignoreCheck == null ? true : ignoreCheck;

            validator.setIgnoreCheck(ignoreCheck);
        },
        /**
         * 根据给定的字段名，忽略验证指定的属性
         * @param fieldNames   字段名，多个值用逗号分隔
         * @param ignoreCheck  是否要忽略指定的属性的验证，默认为忽略验证，可选的值为true|false
         */
        ignoreValidateProperties: function (fieldNames, ignoreCheck) {
            var validator = this.getValidator();
            if (validator == null)
                return;

            if (fieldNames == null || fieldNames == "")
                return;

            ignoreCheck = ignoreCheck == null ? true : ignoreCheck;

            var propertyArray = this._getValidateProperties(fieldNames);
            for (var i = 0; i < propertyArray.length; i++) {
                propertyArray[i].setIgnoreCheck(ignoreCheck);
            }
        },
        /**
         * 获取验证器
         * @return {null}
         */
        getValidator: function () {
            return this._validator;
        },
        /**
         * 渲染表单上的组件
         */
        _renderFormWithComponent: function () {
            var componentMap = this._componentMap,
                fieldName, editor, container;
            for (fieldName in componentMap) {
                editor = componentMap[fieldName];
                //不可见就忽略
                if (!editor.isVisible())
                    continue;
                container = FormUtils.getFieldContainer(fieldName, editor["originRenderTo"]);
                editor.render(container, null);   //将组件显示到指定的容器中
            }
        },
        /**
         * 获取所有组件的名称
         *
         * @return {Array}
         */
        getAllComponentName: function () {
            return _.keys(this._componentMap);
        },
        /**
         * 是否是查看状态
         * @return {boolean}
         */
        isViewScene: function () {
            return AbstractFormEditor.Scene.VIEW == this.scene;
        },
        /**
         * 是否是编辑状态
         * @return {boolean}
         */
        isUpdateScene: function () {
            return AbstractFormEditor.Scene.UPDATE == this.scene;
        },
        /**
         * 是否是新增状态
         * @return {boolean}
         */
        isCreateScene: function () {
            return AbstractFormEditor.Scene.CREATE == this.scene;
        },
        /**
         * 设置表单的状态
         * @param isReadOnly 整个表单是否只读(true|false)
         * @param isUpdate 是否是对表单进行更改操作(true|false)
         */
        setFormScene: function (isReadOnly, isUpdate) {
            isReadOnly = isReadOnly == null ? false : isReadOnly;
            isUpdate = isUpdate == null ? false : isUpdate;

            if (isReadOnly) {
                this.setScene(AbstractFormEditor.Scene.VIEW, true);
            } else {
                if (isUpdate) {
                    this.setScene(AbstractFormEditor.Scene.UPDATE, true);
                } else {
                    this.setScene(AbstractFormEditor.Scene.CREATE, true);
                }
            }
        },
        /**
         * 设置表单状态
         * @param scene
         * @param triggerEvent
         */
        setScene: function (scene, triggerEvent) {
            this.scene = scene;

            triggerEvent = triggerEvent == null ? true : triggerEvent;
            if (triggerEvent) {
                if (scene == AbstractFormEditor.Scene.VIEW) {
                    this._setFormReadOnly();   //设置整个表单为只读
                }
            }
        },
        isLabelTopAlign: function () {
            return this.getLabelAlign() == AbstractFormEditor.LabelAlign.TOP;
        },
        isLabelLeftAlign: function () {
            return this.getLabelAlign() == AbstractFormEditor.LabelAlign.LEFT;
        },
        isLabelRightAlign: function () {
            return this.getLabelAlign() == AbstractFormEditor.LabelAlign.RIGHT;
        },
        getLabelAlign: function () {
            var result = this.labelAlign || AbstractFormEditor.LabelAlign.TOP;
            return result.toLowerCase();
        },

        /*-------------------------------表单初始化操作  ---------------------------------------------------*/

        init: function (triggerEvent) {
            //初始值要先处理，不然会引起引用的问题
            this._reset();

            this._super(false);  //调用父类的初始化方法

            this._initWithFields(this.fields);   //根据fields值来初始化界面

            this._initComponent(this._componentConfig);   //初始化表单控件
            this._initValidator();   //初始化表单验证器

            this.setAjaxClient(this.ajaxClient);   //设置Ajax请求的客户端

            this.setScene(this.scene, true);   //设置表单状态

            var className = this.isLabelTopAlign() ? "" : "h-form-horizontal";   //水平表单的样式
            this.setClassName(className);

            this._focusFirstEditor();   //表单一进入，焦点聚焦在第一个编辑器上

            triggerEvent = triggerEvent == null ? true : triggerEvent;  //默认是触发初始化完成后的事件
            if (triggerEvent)
                this.trigger("initialized");   //触发初始化完成后的事件

            //实例化完成后，自动渲染表单
            if (this.autoRender)
                this.render();   //渲染该表单
        },
        /**
         * 聚焦第一个可编辑的编辑器 add by 2014.06.10
         * @private
         */
        _focusFirstEditor: function () {
            //表单处于只读模式，就不进行任何操作
            if (this.isViewScene())
                return;
            var that = this;
            this.on("show", function () {
                //如果允许出现滚动条，那么就需要注册滚轮事件，保证滚轮滚动时，移除表单的错误提示框 add by 2014.12.16
                this.$el.parent().scroll(function () {
                    //如果忽略该事件，那么就不进行任何处理
                    if (that._ignoreRemoveErrorTipEvent) {
                        that._ignoreRemoveErrorTipEvent = false;     //重置回初始值
                        return;
                    }

                    $.window.removeAllErrorTipOnEl();
                });

                var editor = this._getFirstEditor();
                if (!editor)
                    return;
                window.setTimeout(function () {
                    editor.focus();
                }, 100);
            });
        },
        /**
         * 获取界面上第一个编辑器，用于聚焦
         * add by 2014.07.14
         * @return {*}
         * @private
         */
        _getFirstEditor: function () {
            return this._getNextUsableEditor(null);
        },
        /**
         * 获取Tab键导航的下一个组件
         * @param currentCompName
         */
        getTabNextComponent: function (currentCompName) {
            var result = this._getNextUsableEditor(currentCompName);
            if (result == null) {
                result = this.getToolBarNextComponent();
            }

            return result;
        },
        /**
         * 支持键盘操作：获取工具栏上下一个组件
         * @return {*}
         */
        getToolBarNextComponent: function () {
            var formView = this.getParent(),
                toolbarObject;
            if (!formView)
                return;
            if (formView.getToolBarObject)
                toolbarObject = formView.getToolBarObject();
            if (toolbarObject == null)
                return;
            return toolbarObject.getFirstUsableItem();
        },
        /**
         * 根据当前字段名，获取界面上的下一个可见并且非只读的编辑器（即可用的编辑器）
         * add by 2014.07.14
         * @param currentFieldName
         * @return {*}
         * @private
         */
        _getNextUsableEditor: function (currentFieldName) {
            var nextFieldName = this._getNextFieldName(currentFieldName);
            if (nextFieldName == null)
                return null;
            var editor = this.getEditor(nextFieldName);

            //可见并且非只读
            if (editor != null && editor.isVisible() && !editor.isReadOnly()) {
                return editor;
            }

            return this._getNextUsableEditor(nextFieldName);  //递归调用，直到找到可见的并且非只读的编辑器
        },
        /**
         * 根据当前给定的字段名，获取界面上，下一个组件对应的字段
         * 主要用于按回车或者tab键，光标自动下移
         * add by 2014.07.14
         * @param currentFieldName  如果为空，就返回第一个字段
         * @return {*}
         * @private
         */
        _getNextFieldName: function (currentFieldName) {
            var fields = this.fields;
            if (fields == null || fields.length == 0)
                return null;
            if (!currentFieldName)
                return FormUtils.getFieldName(fields[0]);
            var field, fieldName;
            for (var i = 0, count = fields.length; i < count; i++) {
                field = fields[i];
                fieldName = FormUtils.getFieldName(field);
                if (fieldName == currentFieldName) {
                    if (i == count - 1)
                        return null;
                    field = fields[i + 1];
                    return FormUtils.getFieldName(field);
                }
            }
            return null;
        },
        _initValidator: function () {
            this._validator = new Validator(this._validateConfig);
        },
        /**
         * 表单的渲染包含两部分，首先渲染表单模版，然后将组件显示到指定的容器中
         */
        render: function (container, triggerEvent) {
            this.trigger("rendering");
            this.renderFormTemplate();            //渲染表单模版，由子类实现
            this._renderFormWithComponent();                 //显示动态生成的组件
            this.trigger("render");
        },
        /**
         * 渲染表单模版，由子类实现
         */
        renderFormTemplate: function () {
        },
        /**
         * 验证失败时，错误信息的对齐方式，由子类实现 add by 2014.07.07
         */
        getErrorMsgAlign: function () {
        },
        /**
         * 获取指定字段的模版上下文信息
         * @param fieldNameArray
         * @param isFilterInvisible   是否过滤不可见的属性，用于对某些字段进行隐藏或者显示后，对字段分组进行重新渲染时使用
         */
        getFieldsTemplateData: function (fieldNameArray, isFilterInvisible) {
            var result = [];
            if (fieldNameArray == null || fieldNameArray.length == 0)
                return result;
            var templateDataArray = this._getTemplateData(),
                fieldData, j, count, fieldName, editor;
            for (var i = 0, fieldCount = fieldNameArray.length; i < fieldCount; i++) {
                fieldName = fieldNameArray[i];
                //如果编辑器不存在，或者不可见，就不执行后续操作
                editor = this.getEditor(fieldName);
                //控制是否需要过滤掉不可见组件
                if (isFilterInvisible && (!editor || !editor.isVisible()))
                    continue;
                for (j = 0, count = templateDataArray.length; j < count; j++) {
                    fieldData = templateDataArray[j];
                    if (fieldName == fieldData["field"]) {
                        result.push(fieldData);   //此处获取的是包含该字段的模版数据
                        break;
                    }
                }
            }
            return result;
        },
        /**
         * 获取表单默认的模版
         * @return {*}
         */
        _getTemplate: function () {
            return this.get("template", FormViewTemplate);
        },
        _getTemplateData: function () {
            return this._templateData;
        },
        _reset: function () {
            this._inputHiddenValueMap = {};
            this._componentMap = {};
            this._componentConfig = [];
            this._templateData = null;
            this._validateConfig = {};
            this._validator = null;
        },
        /**
         * 根据fields中的配置信息来初始化该对象上下文
         * [
         *      {
         *          name: "<字段名>",
         *          caption: "<字段标题>",
         *          hidden: true,  //隐藏字段，默认为false；如果为true，就不需要指定editorType
         *          editorType: <编辑器类型，详见FormEditor.Type>,
         *          value: "<编辑器默认值>",
         *          rules: {
         *              required: true      //验证规则
         *          },
         *          messages: {
         *              required: "必填项"      //与验证规则对应的提示信息
         *          }
         *      }
         *  ]
         *
         * @param fields
         */
        _initWithFields: function (fields) {
            if (fields == null || fields.length == 0)
                return;

            var editorConfig = this._componentConfig || [];
            var templateData = this._templateData = this._templateData || [];
            var validateConfig = this._validateConfig = this._validateConfig || {};
            validateConfig["showErrorType"] = validateConfig["showErrorType"] || this.get("showErrorType", Validator.ShowErrorType.LABEL);
            validateConfig["errorContainer"] = validateConfig["errorContainer"] || this.get("errorContainer");
            validateConfig["validateOnBlur"] = validateConfig["validateOnBlur"] || this.get("validateOnBlur", false);
            validateConfig["parent"] = this;
            var validateProps = validateConfig["props"] = validateConfig["props"] || [];

            var fieldResult = null, field, j, count;
            for (var i = 0; i < fields.length; i++) {
                fieldResult = this._processField(fields[i]);
                if (fieldResult == null)
                    continue;
                //针对查询条件而言，如果是范围查询，那么就会有多个字段产生
                if (!$.isArray(fieldResult)) {
                    fieldResult = [fieldResult];
                }

                for (j = 0, count = fieldResult.length; j < count; j++) {
                    field = fieldResult[j];
                    //字段显示信息：模版数据关系到字段组件显示区域的设置、必填项等信息
                    if (field["templateData"])
                        templateData.push(field["templateData"]);

                    //字段提交处理信息：组件和验证规则，关系到表单提交时的处理
                    if (field["field"])
                        editorConfig.push(field["field"]);
                    if (field["validateProp"])
                        validateProps.push(field["validateProp"]);
                }
            }
        },
        /**
         * 对字段的配置信息进行加工处理
         *
         * @param field
         * @return {{validateProp: null, templateData: null, field: null}}
         * @private
         */
        _processField: function (field) {
            var result = {
                validateProp: null,    //验证需要的属性数据
                templateData: null,    //模版需要的数据
                field: null             //字段数据（编辑器的配置信息）
            };

            var editorType = field["editorType"] || ComponentFactory.Type.TEXT_EDITOR,
                isHidden = field["hidden"] || editorType == ComponentFactory.Type.HIDDEN,
                fieldName = FormUtils.getFieldName(field);  //没有指定name，就获取id

            //如果编辑器的类型为EditorFactory.Type.HIDDEN或者字段包含hidden，则认为是隐藏字段
            if (isHidden) {
                var fieldDefaultValue = field["defaultValue"] || field["value"];  //字段默认值
                this.addHiddenValue(fieldName, fieldDefaultValue);
                return result;
            }

            result["validateProp"] = this._getFieldValidation(field);
            result["templateData"] = FormUtils.getFieldTemplateData(field);
            result["field"] = this._getFiledComponentConfig(field);

            return result;
        },
        /**
         * 获取字段的最大长度
         * @param field
         * @return {*}
         * @private
         */
        _getFieldMaxLength: function (field) {
            var rules = field["rules"];
            if (!rules)
                return null;
            var ruleKey, rule;
            for (ruleKey in rules) {
                rule = rules[ruleKey];
                if (ruleKey == "maxlength")
                    return rule;
                if (ruleKey == "lengthrange")
                    return rule["max"];
            }
            return null;
        },
        /**
         * 获取字段对应的验证配置信息
         * @param field
         * @return {*}
         * @private
         */
        _getFieldValidation: function (field) {
            var rules = field["rules"];
            if (!rules)
                return null;
            var messages = field["messages"],
                fieldName = FormUtils.getFieldName(field),
                labelId = FormUtils.getFieldLabelName(fieldName),
                errorContainer = field["errorContainer"] || ("#" + labelId),
                errorMsgAlign = field["errorMsgAlign"];
            //设置错误提示信息的位置 add by 2014.09.10
            if (!errorMsgAlign && this.cols) {
                var colSpan = field["colSpan"]
                //如果字段是跨整行，那么错误提示信息就显示在文本框的下面 add by 2014.09.10
                if (colSpan >= this.cols) {
                    errorMsgAlign = "bottom";
                }
            }
            errorMsgAlign = errorMsgAlign || this.getErrorMsgAlign();

            var editorType = field["editorType"];

            //如果是文件编辑器、HTML编辑器、图片编辑器，那么错误的提示信息以alert方式提供  add by 2014.11.05
            var showErrorType = null;
            if (editorType == ComponentFactory.Type.FILE_EDITOR ||
                editorType == ComponentFactory.Type.HTML_EDITOR ||
                editorType == ComponentFactory.Type.IMAGE_EDITOR) {

                showErrorType = Validator.ShowErrorType.ALERT;
            }

            var that = this;
            var result = {
                el: "[name=" + fieldName + "]",
                fieldName: fieldName,   //额外添加的属性：字段名，在获取值的时候会使用到
                label: field["caption"],
                errorContainer: errorContainer,
                rules: rules,
                messages: messages,
                showErrorType: showErrorType,
                errorMsgAlign: errorMsgAlign,
                validateOnBlur: field["validateOnBlur"],
                ignoreCheck: field["ignoreCheck"],  //忽略该属性的验证
                //覆写验证属性的getValue方法，保证值得准确性
                getValue: function () {
                    var fieldName = this.get("fieldName");
                    return this.getValidator().getParent().getValue(fieldName);
                },
                //覆写验证属性的getEl方法，保证元素在表单上下文中查找
                getEl: function (selector) {
                    return this.getValidator().getParent().$(selector);
                },
                focus: function () {
                    var formEditor = this.getValidator().getParent();
                    var fieldName = this.get("fieldName");
                    var editor = formEditor.getEditor(fieldName);

                    that.scrollToEditor(editor);  //将DIV的滚动条滚动到其子元素所在的位置，方便自动定位 add by 2014.12.16
                    editor.focus();  //数字编辑器比较特殊，所以需要覆盖验证的focus方法
                }
            }

            return result;
        },
        /**
         * 获取字段对应组件的配置信息
         * @param field
         * @return {*}
         */
        _getFiledComponentConfig: function (field) {
            var editorType = field["editorType"] || ComponentFactory.Type.TEXT_EDITOR,
                fieldName = FormUtils.getFieldName(field),
                displayLabel = field["displayLabel"] == null ? true : field["displayLabel"];

            //初始化一些默认值
            if (editorType != ComponentFactory.Type.BUTTON)
                field["width"] = field["width"] || "100%";  //非按钮类控件设置默认值

            //如果不显示标签，那么就将组件的提示信息初始化初始化为标签的名称
            if (!displayLabel && !field["placeholder"])
                field["placeholder"] = field["caption"];

            //暂时存储要渲染到的容器，待表单统一渲染的时候，才显示出来
            field["originRenderTo"] = field["renderTo"];
            field["renderTo"] = null;

            field["editorType"] = editorType;
            field["parent"] = this;   //设置字段的父组件为表单编辑器，建立组件间的关联

            //设置字段的最大长度 add by 2014.06.26
            var maxlength = this._getFieldMaxLength(field);
            if (maxlength)
                field["maxlength"] = maxlength;

            //支持键盘操作，按回车（Enter）键，光标聚焦到下个编辑器 add by 2014.07.15
            var that = this;
            field["getTabNextComponent"] = function () {
                var currentFocusFieldName = FormUtils.getFieldName(this);
                return that.getTabNextComponent(currentFocusFieldName); //获取下一个可用的编辑器
            }

            return field;
        },
        _getFiledEmphasisEl: function (fieldName) {
            if (fieldName == null || fieldName == "")
                return null;
            var hintName = FormUtils.getFieldEmphasisHintName(fieldName);

            return this.$("#" + hintName);
        },
        /**
         * 初始化编辑器
         */
        _initComponent: function (componentConfig) {
            if (componentConfig == null)
                return;

            var component = null;
            for (var i = 0; i < componentConfig.length; i++) {
                component = componentConfig[i];
                this.addComponentByConfig(component["editorType"], component);
            }
        },
        _initKey: function (key) {
            key = key ? $.trim(key) : "";

            return key;
        },
        /**
         * 根据字段名获取字段的配置信息
         * add by 2014.09.18
         * @param fieldName
         * @return {*}
         * @private
         */
        _getFieldConfigByFieldName: function (fieldName) {
            var fields = this.fields;
            if (!fields || fields.length == 0 || !fieldName)
                return null;
            var field, fName;
            for (var i = 0, count = fields.length; i < count; i++) {
                field = fields[i];
                fName = FormUtils.getFieldName(field);
                if (fName == fieldName) {
                    return field;
                }
            }
            return null;
        },
        /**
         * 设置整个表单为只读
         * @private
         */
        _setFormReadOnly: function () {
            var componentNameArray = this.getAllComponentName();
            var componentNameStr = componentNameArray.join(",");

            this.setReadOnly(componentNameStr, true);
        },
        /**
         * 根据字段名获取其相关的验证属性对象
         * @param fieldNames
         * @return {Array}
         * @private
         */
        _getValidateProperties: function (fieldNames) {
            var validator = this.getValidator();
            var fieldNameArray = fieldNames.split(",");
            var fieldName = null;
            var propertyArray = null;
            var result = [];
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldName = fieldNameArray[i];
                if (fieldName == null || $.trim(fieldName) == "")
                    continue;
                fieldName = $.trim(fieldName);

                propertyArray = validator.filterProperty("[name=" + fieldName + "]");
                if (propertyArray == null)
                    continue;
                result = result.concat(propertyArray);
            }
            return result;
        },
        /**
         * 销毁自身的信息，便于基类覆盖
         * add by 2014.10.29
         */
        destroySelf: function () {
            var componentMap = this._componentMap,
                fieldName, editor;
            for (fieldName in componentMap) {
                editor = componentMap[fieldName];
                if (_.isFunction(editor.destroy))
                    editor.destroy();
                editor = null;
            }

            this.template = null;
            this.fields = null;    //销毁字段对象
            this._reset();           //重置内部的成员变量
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this.destroySelf();   //销毁自身的信息

            this._super();
        }
    });

    /**
     * 表单处理的工具类，除了给FormEditor内部使用外，主要是提供给表单的模型解析使用，用于解决嵌套的属性面板中显示字段的问题
     */
    var FormUtils = {
        /**
         * 获取字段分组的内容
         * @param fieldArray
         * @param fieldTemplate
         * @param cols
         * @param labelAlign
         * @return {*}
         */
        getFieldGroupContent: function (fieldArray, fieldTemplate, cols, labelAlign) {
            if (fieldArray == null || fieldArray.length == 0)
                return "";
            var templateDataArray = [],
                field, templateData;
            for (var i = 0, count = fieldArray.length; i < count; i++) {
                field = fieldArray[i];
                templateData = this.getFieldTemplateData(field);
                templateDataArray.push(templateData);
            }

            var fieldTemplateContext = this.getFieldTemplateContext(templateDataArray, cols, labelAlign);
            fieldTemplate = fieldTemplate || FormViewTemplate;

            return _.template(fieldTemplate, fieldTemplateContext);
        },
        /**
         * 获取字段在模版中对应的配置信息
         * @param field
         * @return {{groupId: *, field: *, colSpan: *, labelId: *, emphasisId: *, required: (*|boolean), caption: *}}
         */
        getFieldTemplateData: function (field) {
            var fieldName = this.getFieldName(field),
                labelId = this.getFieldLabelName(fieldName),
                groupId = this.getFieldGroupName(fieldName),
                displayLabel = field["displayLabel"] == null ? true : field["displayLabel"],
                label = displayLabel ? field["caption"] : ""; //默认是显示标签名
            var result = {
                "groupId": groupId,
                "field": fieldName,
                "colSpan": field["colSpan"],        //跨列数
                "displayLabel": displayLabel,  //默认是显示标签
                "labelId": labelId,   //标签的ID
                "range": field["range"],    //标识该字段是一个范围参数
                "controlId": this.getFieldControlName(fieldName),         //针对范围有效：字段控制的名称
                "emphasisId": this.getFieldEmphasisHintName(fieldName),   //标签必填提示的ID
                "required": (field["rules"] || {})["required"] || false,      //是否必填设置
                "caption": label        //标签名
            };
            return result;
        },
        /**
         * 获取模版的上下文信息
         * @param templateData
         * @param cols
         * @param labelAlign
         * @return {{rows: Array, baseCol: number}}
         */
        getFieldTemplateContext: function (templateData, cols, labelAlign) {
            cols = parseInt(cols, 10) || 3;   //共分成几列

            var groups = templateData || {},
                rows = [], row = [],
                index = 0, colSpan = 1, nextColSpan = 0,
                group = null;
            for (var i = 0, count = groups.length; i < count; i++) {
                group = groups[i];
                colSpan = group["colSpan"] || 1;
                //如果超过最大的列数，那么就按最大的列数进行计算
                if (colSpan > cols)
                    colSpan = cols;
                group["colSpan"] = colSpan;
                row.push(group);
                nextColSpan = i == count - 1 ? 0 : (groups[i + 1]["colSpan"] || 1);
                if ((index + colSpan + nextColSpan) > cols || i == count - 1) {
                    rows.push(row);
                    index = 0;
                    row = [];
                } else {
                    index += colSpan;
                    if (index == cols) {
                        rows.push(row);
                        index = 0;
                        row = [];
                    }
                }
            }

            var result = {
                "labelAlign": labelAlign || "",
                "rows": rows,
                "baseCol": 12 / cols
            };

            return result;
        },
        /**
         * 获取字段名，没有指定name，就获取id
         * @param field
         * @return {*}
         */
        getFieldName: function (field) {
            return field["name"] || field["id"];
        },
        /**
         * 根据字段名获取字段标签必填提示的名称
         * @param fieldName
         * @return {*}
         */
        getFieldEmphasisHintName: function (fieldName) {
            return this.joinString(fieldName, "_emphasis");
        },
        /**
         * 根据字段名获取字段标签的名称
         * @param fieldName
         * @return {*}
         */
        getFieldLabelName: function (fieldName) {
            return this.joinString(fieldName, "_label");
        },
        /**
         * 根据字段名获取字段显示的容器
         * @param fieldName
         * @param container   如果指定了容器，那么优先使用该容器
         */
        getFieldContainer: function (fieldName, container) {
            var controlId = this.getFieldControlName(fieldName);
            //此处不直接使用#id，是因为如果id是带有.的字符串（例如orderPanel.id_group）时，那么点后面的就被识别为className  add by 2014.1.7
            return container || ["[id='", controlId, "']"].join("");
        },
        /**
         * 根据字段名获取字段控制的名称
         * @param fieldName
         * @return {*}
         */
        getFieldControlName: function (fieldName) {
            return this.joinString(fieldName, "_control");
        },
        /**
         * 根据字段名获取字段归属的组名
         * @param fieldName
         * @private
         */
        getFieldGroupName: function (fieldName) {
            return this.joinString(fieldName, "_group");
        },
        /**
         * 连接字符串
         * @return {String}
         */
        joinString: function () {
            var argCount = arguments.length;
            var result = [];
            var arg = null;
            for (var i = 0; i < argCount; i++) {
                arg = arguments[i];
                if (arg == null)
                    continue;
                result.push(arg);
            }

            return result.join("");
        }
    };

    AbstractFormEditor.Type = ComponentFactory.Type;

    AbstractFormEditor.ShowErrorType = Validator.ShowErrorType;

    AbstractFormEditor.FormUtils = FormUtils;

    AbstractFormEditor.Scene = CommonConstant.Scene;

    //表单上字段标签的对齐方式
    AbstractFormEditor.LabelAlign = {
        TOP: "top",              //上对齐
        LEFT: "left",           //左对齐
        RIGHT: "right"          //右对齐
    }

    return AbstractFormEditor;
});