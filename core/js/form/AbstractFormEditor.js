/**
 * @module 抽象表单编辑器[AbstractFormEditor]
 * @description 表单编辑器的抽象类：该抽象类不涉及到布局、分组，主要是针对于表单项的处理（包含表单项组件、验证、控制）
 * @author:
 * @date:
 */
define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "lib/sha1",
    "core/js/rpc/AjaxClient",
    "core/js/controls/Control",
    "core/js/controls/ComponentFactory",
    "core/js/form/Validator",
    "core/js/utils/FormUtils",
    "core/js/utils/Utils",
    "core/js/windows/messageBox"
], function ($, _, CommonConstant,
             MessageDigest, AjaxClient,
             Control, ComponentFactory,Validator,
             FormUtils,Utils,MessageBox) {

    var AbstractFormEditor = Control.extend({
        /**
         * 标签的对齐方式：top、left、right
         */
        labelAlign: "top",
        labelWidth: "100",

        /**
         * 存储需要提交到服务端的隐藏域信息的值，键为字段名，值为隐藏域的值
         */
        _inputHiddenValueMap: null,

        _validateConfig: null,

        _validator: null,

        /**
         * 把fields转换成编辑器对象
         */
        _editors: null,

        /**
         * 当前表单所处的场景：新增、修改、查看
         */
        scene: null,

        /**
         * 延迟加载，获取一个 Boolean 值，表示是否需要在实例化时自动调用 {@link render} 方法。
         *
         * @default false   默认情况下实例化后，就显示
         */
        lazy: false,

        /*-------------------表单布局相关---------------*/
        /**
         * 配置表单显示的模版
         */
        template: null,

        /*-------------------表单控件及验证相关---------------*/

        /**
         * {Array}实体表单上的字段信息
         * [{
             *      id:"<输入框的id，不是必需>"
             *      name:"[必填]<字段名称，定义提交到服务端的参数名称>",
             *      realName:"[必须存在，但不是必填]<最后传输到服务器的参数名称,默认同name>",
             *      label:"<字段显示的别名，如果，没有则使用name>",
             *      hidden："<是否是隐藏，true|false ,默认是false>",
             *      value："<值>",
             *      rules:"<校验规则,jquery.validate的关于这个字段的rules属性>{}",
             *      messages："<校验规则,jquery.validate的关于这个字段的messages属性>{",
             *      editorType:"<编辑器类型，默认是文本类型>",
             *      iconSkin:"<小图片的class>",
             *      decimals："<针对number类型的编辑器，保留几位小数>",
             *      step:"<针对number类型的编辑器，增量值>"，
             *      disable："<是否可以编辑，true|false，默认是false>"
             * },...
             * ]
             */
        fields: null,
        validateOnBlur: false,
        showErrorType: null,
        errorContainer: null,
        /**
         * 属性前缀，如:editObj,则提交的属性为editObj.name
         */
        paramPrefix: null,

        /*-------------------表单与服务端交互的ajax客户端---------------*/
        ajaxClient: null,
        methodName: null,
        methodVersion: "1.0",
        parseParameters: null,       //{function}对请求参数进行解析处理
        action:null,    //存储url路径的对象，通过此对象的getUrl获取路径

        /*-----------------------事件------------------------------------*/
        /**
         * 事件：声明表单验证后的事件
         */
        onvalidate: null,
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
         * [可选]该视图是否只读
         * @default false
         */
        readOnly: false,

        /**
         * 禁用状态，为输入框设置 disabled 属性可以禁止其与用户有任何交互（焦点、输入等）。被禁用的输入框颜色更浅，并且还添加了 not-allowed 鼠标状态。
         * 并且不能复制
         */
        disabled:false,

        /**
         * 容器中分的列数，系统会自动分为最多12列,所有次数最好能被12整除，
         * 如果defaultColumnSize为null，则整除totalColumnNum后的栏位大小会设置会修改defaultColumnSize的值
         */
        totalColumnNum:1,
        /**
         * 默认的栏位大小
         */
        defaultColumnSize:null,
        /**
         * 默认的栏位class类
         */
        _defaultColumnClassName:null,
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
            //ComponentUtil.scrollTopElement(this.$el.parent(), selector);  //将DIV的滚动条滚动到其子元素所在的位置，方便自动定位 add by 2014.12.16
            this._ignoreRemoveErrorTipEvent = true;    //忽略移除错误提示事件，避免聚焦元素时，无法提示错误信息 add by 2014.12.17
        },
        /**
         * 判断指定字段的当前值与其默认值是否有变化
         * add by 2014.05.08
         * @param fieldNames  多个值用逗号分隔
         * @return {boolean}
         */
        hasValueChanged: function (fieldNames) {
            return null;
        },
        /**
         * 获取编辑器的值
         * @param fieldName 字段名
         * @return {*}
         */
        getValue: function (fieldName) {
            if(this._editors){
                var editor = this._editors[fieldName];
                if(editor){
                    return editor.getValue();
                }
            }


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
         * 获取表单的参数：包括隐藏域的值和编辑器的值
         * @param   {Boolean}  addParamPrefixed  是否要添加前缀,默认是不添加
         * @param   {String} needEmptyValue 空值是否也需要包含在结果集中，默认是不需要空值的，但是查询参数中可能需要
         * @return {{}}
         */
        getAllFieldValue:function(addParamPrefixed,needEmptyValue){
            var result = {};
            var prefix = "",value=null;
            if(addParamPrefixed&&$.isNotBank(this.paramPrefix)){
                var prefix = this.paramPrefix+".";
            }
            var hiddenValueMap = this._inputHiddenValueMap;
            if (hiddenValueMap != null) {
                for (var fieldName in hiddenValueMap) {
                    value = hiddenValueMap[fieldName];
                    //如果值为空，那么就不加入到参数
                    if (!needEmptyValue && (value == null || $.trim(value) == ""))
                        continue;
                    result[prefix+fieldName] = value;
                }
            }
            //获取编辑器的值
            for(var key in this._editors){
                value = this._editors[key].getValue();
                if (!needEmptyValue && (value == null || $.trim(value) == ""))
                    continue;
                result[prefix+key] = value;
            }
            return result;
        },
        /**
         * 获取编辑器的显示值
         * @param fieldName
         * @return {*}
         */
        getDisplayValue: function (fieldName) {
            return null;
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
         * 清空所有的值，包括隐藏值
         */
        clearValue:function(){
            var that = this;
            _.each(this._inputHiddenValueMap,function(value,key,list){
                that._inputHiddenValueMap[key] = "";
            });
            _.each(this._editors,function(value,key,list){
                that._editors[key].clearValue();
            });
        },
        _initKey: function (key) {
            key = key ? $.trim(key) : "";

            return key;
        },
        /**
         * 根据指定组件的名称设置组件是否只读
         * @param fieldNames 多个值用逗号分隔
         * @param readOnly   true|false只读开启或关闭
         */
        setReadOnly: function (fieldNames, readOnly) {
            var editor = this.getEditor(fieldName);
            editor.setReadOnly(readOnly);
        },
        /**
         * 设置label的值
         * @param fieldName 字段名，区分大小写
         * @param label
         */
        setLabel: function (fieldName, label) {
            var editor = this.getEditor(fieldName);
            editor.setLabel(label);
        },
        /**
         * 根据字段名获取编辑器
         * @param fieldName
         * @return {*}
         */
        getEditor: function (fieldName) {
            if(this._editors&&fieldName){

                return this._editors[fieldName];
            }else{
                return null;
            }
        },
        getEditors:function(){
            return this._editors;
        },
        setEditors:function(editors){
            return this._editors;
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
         * @param {Action} action   Action对象，通过这个类获取url
         * @param methodVersion
         */
        setAction: function (action) {
            this.action = action;
        },

        getAction:function(){
            return this.action;
        },
        /**
         * 根据Action获取url
         * @private
         */
        _getUrl:function(){
            return  this.getAction()?this.getAction().getUrl():null;
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
            /*var follow = options["follow"],    //用于控制成功提示信息显示的位置
                progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息*/

            //验证
            var valid = this.validate();
            if (!valid) {
                /*//关闭模态提示框
                if (progressDialogId)
                    $.window.closeProgressTip(progressDialogId);*/
                return false;
            }

            this.submitSaveHandle(options);   //提交保存操作，将该操作分开，是为了能够使该方法被独立调用 add by chenmk 2014.09.11
        },
        /**
         * 提交保存操作
         * @param options
         */
        submitSaveHandle: function (options) {
            options = options || {};
           /* var progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息
            if (!progressDialogId) {
                progressDialogId = $.window.showProgressTip();   //显示模态窗提示信息
                options["progressDialogId"] = progressDialogId;
            }*/

            //提交之前触发事件
            var valid = this.trigger("beforesubmit");
            if (!valid) {
                /*//关闭模态提示框
                if (progressDialogId)
                    $.window.closeProgressTip(progressDialogId);*/
                return false;
            }

            //添加前缀
            var params = this.getAllFieldValue(true) || {};

            //在请求之前对参数进行加工处理，例如在此处对其中的参数名进行转换等操作
            if (this.parseParameters) {
                params = this.parseParameters(params);
            }

            //提交表单，此处采用异步的方式，否则会使页面变成假死，因为同步的ajax请求将阻塞所有的处理请求
            var that = this;
            this.ajaxClient.buildClientRequest(this._getUrl())
                .addParams(params)
                .post(function (compositeResponse) {
                    that._submitHandle(compositeResponse, options);   //表单提交成功后的回调处理
                });

        },
        _submitHandle: function (ajaxResponse, options) {
            options = options || {};
            /*var progressDialogId = options["progressDialogId"];   //用于关闭模态窗口的提示信息

            //关闭模态提示框
            if (progressDialogId)
                $.window.closeProgressTip(progressDialogId);*/

            //在显示结果前触发事件
            var result = this.trigger("beforeshowresult", ajaxResponse);

            if (!result)
                return;

            var that = this;
            var msg = ajaxResponse.getMessage();
            if (ajaxResponse.isSuccessful()) {
                //$.window.markUpdated();    //标识表单值已经发生了变更
                MessageBox.success(ajaxResponse.getSuccessMsg());
                /*msg = (msg == null || msg == "") ? "操作成功" : msg;
                msg = "<strong>" + msg + "</strong>";
                $.window.showMessage(msg, {
                    handle: function () {
                        that.trigger("submit", ajaxResponse);  //触发提交后的事件
                    }
                });*/
            } else {
                //MessageBox.error("成功！");
                $.window.showMessage(msg, {
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
            var componentMap = this._editors,
                fieldName, editor;
            //重置编辑器的值
            for (fieldName in componentMap) {
                editor = componentMap[fieldName];
                editor.reset(triggerChangedEvent);
            }

            //重置隐藏域的值为默认值 add by chenmk 2014.09.18
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

        },
        /**
         * 隐藏字段必填项提示
         * @param fieldNames  多个值用逗号分隔
         */
        hideFieldEmphasisHint: function (fieldNames) {

        },
        /**
         * 设置DOM元素是否可见
         * @param el
         * @param visible
         */
        setElVisible: function (el, visible) {

        },
        /**
         * 设置失焦验证的属性（默认是点击保存的时候才验证）
         * @param fieldNames
         */
        setValidateOnBlurProperties: function (fieldNames) {

        },
        /**
         * 忽略必填的属性验证设置
         * @param fieldNames       字段名，多个值用逗号分隔
         * @param ignoreRequired   是否要忽略指定的属性的必填项验证，默认为忽略验证，可选的值为true|false
         */
        ignoreRequiredProperties: function (fieldNames, ignoreRequired) {

        },
        /**
         * 忽略表单的验证
         * @param ignoreCheck 是否要忽略指定的属性的验证，默认为忽略验证，可选的值为true|false
         */
        ignoreValidate: function (ignoreCheck) {

        },
        /**
         * 根据给定的字段名，忽略验证指定的属性
         * @param fieldNames   字段名，多个值用逗号分隔
         * @param ignoreCheck  是否要忽略指定的属性的验证，默认为忽略验证，可选的值为true|false
         */
        ignoreValidateProperties: function (fieldNames, ignoreCheck) {

        },
        /**
         * 获取验证器
         * @return {null}
         */
        getValidator: function () {
            return this._validator;
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

        initializeHandle: function (options, triggerEvent) {
            this._super(false);  //调用父类的初始化方法
            //初始值要先处理，不然会引起引用的问题
            this._reset();
            this.setAjaxClient(this.ajaxClient);   //设置Ajax请求的客户端
            // this.afterInitializeHandle(options, triggerEvent);
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

                    //$.window.removeAllErrorTipOnEl();
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
            var fields = this.getWithoutHiddenFields(this.fields);
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
                    if(field){
                        return FormUtils.getFieldName(field);
                    }else{
                        return null;
                    }
                }
            }
            return null;
        },
        _initValidator: function (validateConfig) {
            this._validator = new Validator(validateConfig);
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
        getWithoutHiddenFields:function(fields){
            var newFields = _.filter(fields,function(item){
                //设置readOnly

                if(item&&item.hidden){
                    return false;
                }
                return true;
            });
            return newFields
        },
        /**
         * 处理没有hidden的字段
         * @param fields
         */
        handleWithoutHiddenFields:function(fields){
            var that = this;
            var newFields = this.getWithoutHiddenFields(fields);

            return newFields;
        },

        /**
         * 对fields进行处理，并返回fields的配置
         * 1.先把hidden的field去掉，放到  _inputHiddenValueMap
         * 2.根据readOnly,设置相关编辑器的readOnly
         * @param fields
         */
        handleHiddenFields:function(fields){
            //获取hidden的字段
            var hiddenFields = _.where(fields,{"hidden":true});
            for(var i=0;i<hiddenFields.length;i++){
                var field = hiddenFields[i];
                var value = field["defaultValue"] || field["value"];
                this.addHiddenValue(field["name"], value);
            }
        },
        mountContent: function () {
            this._initWithFields(this.fields);   //根据fields值来初始化界面
            this._initValidator(this._validateConfig);   //初始化表单验证器

            this.setScene(this.scene, true);   //设置表单状态

            /*var className = this.isLabelTopAlign() ? "" : "h-form-horizontal";   //水平表单的样式
             this.setClassName(className);*/

            this._focusFirstEditor();   //表单一进入，焦点聚焦在第一个编辑器上
        },
        /**
         * 表单的渲染包含两部分，首先渲染表单模版，然后将组件显示到指定的容器中
         */
        render: function (container, triggerEvent) {
            this._super(container, triggerEvent);   //执行父类的渲染方法
            return this;
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

        },
        /**
         * 获取表单默认的模版
         * @return {*}
         */
        _getTemplate: function () {

        },
        _reset: function () {
            this._inputHiddenValueMap = {};
            this._validateConfig = {};
            this._validator = null;
        },
        /**
         * 根据fields中的配置信息来初始化该对象上下文
         * [
         *      {
         *          name: "<字段名>",
         *          label: "<字段标题>",
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

            var validateConfig = this._validateConfig = this._validateConfig || {};
           /* validateConfig["showErrorType"] = validateConfig["showErrorType"] ;//|| this.get("showErrorType", Validator.ShowErrorType.LABEL);
            validateConfig["errorContainer"] = validateConfig["errorContainer"] || this.get("errorContainer");
            validateConfig["validateOnBlur"] = validateConfig["validateOnBlur"] || this.get("validateOnBlur", false);*/
            validateConfig["parent"] = this;
            validateConfig.$form = this.$el;
            var validateProps = validateConfig["props"] = validateConfig["props"] || [];

            var fieldResult = null, field, j, count;
            for (var i = 0; i < fields.length; i++) {
                if(fields[i]){
                    if(!this._validateConfig.rules){
                        this._validateConfig.rules = {};
                    }
                    this._validateConfig.rules[fields[i].name] = fields[i].rules;
                }
                /*fieldResult = this._processField(fields[i]);
                if (fieldResult == null) {
                    continue;
                }
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
                    /!*if (field["validateProp"])
                        validateProps.push(field["validateProp"]);*!/
                }*/
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


            return null;
        },
        /**
         * 获取字段的最大长度
         * @param field
         * @return {*}
         * @private
         */
        _getFieldMaxLength: function (field) {

            return null;
        },
        /**
         * 获取字段对应的验证配置信息
         * @param field
         * @return {*}
         * @private
         */
        _getFieldValidation: function (field) {

            return null;
        },
        _getFiledEmphasisEl: function (fieldName) {
            if (fieldName == null || fieldName == "")
                return null;
            var hintName = FormUtils.getFieldEmphasisHintName(fieldName);

            return this.$("#" + hintName);
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
         * 获取所有组件的名称
         *
         * @return {Array}
         */
        getAllComponentName: function () {
            return _.keys(this._editors);
        },
        /**
         * 根据字段名获取其相关的验证属性对象
         * @param fieldNames
         * @return {Array}
         * @private
         */
        _getValidateProperties: function (fieldNames) {

        },
        /**
         * 销毁自身的信息，便于基类覆盖
         * add by 2014.10.29
         */
        destroySelf: function () {
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





    AbstractFormEditor.ShowErrorType = null;//Validator.ShowErrorType;

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