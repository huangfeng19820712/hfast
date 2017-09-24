/**
 * @module 编辑器[Editor]
 * @description 提供所有编辑器的抽象基类
 *
 * @date: 2013-08-12 下午1:59
 */
define(["jquery",
        "underscore",
        "core/js/CommonConstant",
        "core/js/controls/Control",
    ], function ($, _, CommonConstant, Control) {

    var Editor = Control.extend({
        /**
         * @default 24
         */
        height: null,

        /**
         * 编辑器的默认值
         */
        defaultValue: null,

        /**
         * 编辑器的默认值对应的显示值
         */
        defaultDisplayValue: null,

        /**
         * 获取编辑器的值，该值是与服务端通讯用的。
         * 请使用 {@link setValue} 方法设置该字段的值。
         * @private
         */
        value: null,

        /**
         * 获取编辑器的显示值，默认显示值与{@link value}值是一致的。
         * 请使用 {@link setDisplayValue} 方法设置该字段的值。
         * @private
         */
        displayValue: null,

        /**
         * 获取编辑器是否只读。
         * 请使用 {@link setReadOnly} 方法设置该字段的值。
         * 请参考 {@link isReadOnly} 和 {@link setReadOnly} 方法。
         *
         * @default false
         */
        readOnly: false,

        /**
         * 禁用状态，为输入框设置 disabled 属性可以禁止其与用户有任何交互（焦点、输入等）。被禁用的输入框颜色更浅，并且还添加了 not-allowed 鼠标状态。
         * 并且不能复制
         */
        disabled:false,
        /**
         * @ignore
         */
        $input: null,

        /**
         * 标签
         */
        label:null,
        /**
         * 显示的标签的对象
         */
        $label:null,
        /**
         * 是否显示标签
         */
        isShowLabel:true,
        controlGroupEl:null,
        /**
         * 组对象，包含input与lable的dom
         */
        $controlGroup:null,

        /**
         * {@link $input} 的表单元素name
         */
        name: null,

        /**
         * 获取一个字符串，表示 {@link $input} 的输入类型。
         * <p>
         * 该字段可选的值包括：
         * <ul>
         *      <li><b>text</b></li>
         *      <li><b>email</b></li>
         *      <li><b>url</b></li>
         *      <li><b>tel</b></li>
         *      <li><b>search</b></li>
         *      <li><b>password</b></li>
         *      <li><b>date</b></li>
         * </ul>
         * </p>
         *
         * @default string
         */
        inputType: "text",
        /**
         * 同校验对象Validator中的rules参数，不同的编辑器有可以不同
         */
        rules:null,

        /**
         * 文本框为空时，默认显示的提示信息。 请使用 {@link setPlaceholder} 方法设置该字段的值。
         */
        placeholder: null,

        /**
         * 是否允许回车键导航：即按回车键跳到下个编辑器
         */
        enterKeyNavigatable: true,

        /**
         * 是否允许Tab键导航：即按tab键跳到下个编辑器
         */
        tabKeyNavigatable: true,

        /**
         * 输入框聚焦事件
         */
        onfocus: null,

        /**
         * 输入框失焦事件
         */
        onblur: null,

        /**
         * 声明事件，当编辑器的值发生变化后将触发该事件。通常调用 {@link setValue} 方法（其中 triggerEvent 参数必须为 true），后会触发该事件。
         */
        onchanged: null,

        /**
         * 声明事件，当编辑器的值重置为默认值后将触发该事件。通常调用 {@link reset} 方法，后会触发该事件。
         */
        onreset: null,

        /**
         * kendo UI 组件对象
         */
        kendoEditor: null,

        mountContent: function () {
            this._bindKeyboardNavigation();    //绑定键盘导航事件
            this._init$Input();                //初始化文本框
            this._initWithPlugIn();             //初始化kendo组件对象
            this._init$InputValidator();       //初始化文本框的验证器信息

            this._initDefaultValue();          //初始化默认值
            this.setReadOnly(this.readOnly); //设置只读属性
            this.setDisabled(this.disabled); //设置禁止属性
            this.togglePlaceholder(true);     //显示提示信息
        },
        /**
         * 绑定键盘导航事件
         * @private
         */
        _bindKeyboardNavigation: function(){
            //是否允许按回车键或者TAB键导航
            if(this.enterKeyNavigatable === false && this.tabKeyNavigatable === false)
                return;
            var that = this;
            this.$el.keydown(function(event){
                that._triggerEnterOrTabKeyNavigation(event);   //触发键盘导航：空格键、回车键
            });
        },
        _initDefaultValue: function(){
            if(this.defaultValue == null)
                this.defaultValue = this.value;
            if(this.defaultDisplayValue == null)
                this.defaultDisplayValue = this.displayValue;

            var needCalculateDisplayValue = this.defaultDisplayValue == null;
            this._setValueAndDisplayValue(this.defaultValue, this.defaultDisplayValue, needCalculateDisplayValue, null);
        },
        /**
         * 初始化其他插件
         * @private
         */
        _initWithPlugIn: function () {
        },
        /**
         * 初始化输入框
         */
        _init$Input: function () {
            this._init$InputAttrs();  //初始化输入框的属性值

            if(this.isShowLabel){
                this._init$Label();
                this.$el.append(this.$label);   //添加输入框
            }
            this.init$controlGroup();
        },

        init$controlGroup:function(){
            this.$controlGroup = $(this.controlGroupEl||this.eTag);
            this.$controlGroup.append(this.$input);   //添加输入框
            this.$el.append(this.$controlGroup);
            if(this.size){
                this.$controlGroup.addClass(this.size);
            }
        },

        /**
         * 初始化标签
         * @private
         */
        _init$Label:function(){
            if (this.$label == null&&this.label){
                this.$label = this.get$('<label class="label"/>');
                this.$label.append(this.label);
                if(this.required){
                    this.$label.append('<span class="color-red">*</span>');
                }

            }
        },
        /**
         * 设置label
         * @param label
         */
        setLabel:function(label){
            this.$label.text(label);
        },

        /**
         * 初始化输入框的属性值
         */
        _init$InputAttrs: function(){
            this.set$InputAttr("name", this.name);
            //this.$input.css("width", this.width);
            //this.$input.css("height", this.height);

            var that = this;

            this.$input.on("focus", function () {
                //如果编辑器不可编辑，就不进行任何处理 add by 2014.03.17
                if(that.isReadOnly())
                    return;

                //需要重新设置光标的位置，否则在ie上单击文本框会出现无法聚焦的问题 add by 2014.08.22
                var cursorPos = $.getCursorPosition(this);
                $.setCursorPosition(this, cursorPos);

                that.togglePlaceholder(false);
                that.trigger("focus");   //触发失焦事件
            });
            this.$input.on("blur", function () {
                //如果编辑器不可编辑，就不进行任何处理 add by 2014.03.17
                if(that.isReadOnly())
                    return;
                that.confirmInputResult();   //对输入的结果进行确认，并且触发相关的事件
            });

            //针对于非密码的输入框，才显示提示信息 add by 2015.02.02
            if(this.$input.length > 0 && this.$input.get(0).type != "password"){
                this.$input.on("mouseover", function () {
                    this.title = this.value;  //鼠标移上去，显示tip信息
                });
            }
        },
        /**
         * 失焦后，对输入的结果进行确认，并且触发相关的事件
         */
        confirmInputResult: function(){
            var displayValue = this.$input.val();
            //如果显示值为提示信息，那么就将显示值置为空
            if(displayValue == this.placeholder)
                displayValue = "";
            var that = this;
            this.displayValue = displayValue;
            this.doDisplayValueToValue(function(value){
                that.setValueAndDisplayValue(value, displayValue, true);
                that.togglePlaceholder(true);
                that.trigger("blur");   //触发失焦事件
            });
        },
        _init$InputValidator: function () {
            if (this.$input == null)
                return;

            //针对不支持HTML5的浏览器，可以获取该值来使其支持
            this.setInputType(this.inputType);

        },
        /**
         * 设置是否允许按回车键进行导航
         * @param enterKeyNavigatable
         */
        setEnterKeyNavigatable: function(enterKeyNavigatable){
            this.enterKeyNavigatable = enterKeyNavigatable;
        },
        /**
         * 设置是否允许按TAB键进行导航
         * @param tabKeyNavigatable
         */
        setTabKeyNavigatable: function(tabKeyNavigatable){
            this.tabKeyNavigatable = tabKeyNavigatable;
        },
        get$Input: function () {
            return this.$input;
        },
        getName: function () {
            return this.name;
        },
        setName: function (name) {
            this.name = name;
        },
        setInputType: function (inputType) {
            this.inputType = inputType;
            this.set$InputAttr("data-type", inputType);
        },

        set$InputAttr: function (key, value) {
            if (this.$input == null)
                return;
            var isBoolean = typeof(value) == "boolean";
            //如果值为空，就把该属性移除
            if ((!isBoolean && (value == null || value == "")) || (isBoolean && !value)) {
                this.$input.removeAttr(key);
                return;
            }

            this.$input.attr(key, value);
        },
        setEnabled: function (enabled) {
            this._super(enabled);

            this._refreshState();

            if (this.kendoEditor)
                this.kendoEditor.enable(enabled);
        },
        /**
         * 获取一个 Boolean 值，当 {@link enabled} 字段为 false 或 {@link readOnly} 字段为 true 时，返回 true；否则返回 false。
         * @return {boolean}
         */
        isReadOnly: function () {
            return !this.enabled || this.readOnly;
        },
        isDisabled:function(){
            return this.disabled;
        },
        /**
         * 设置 {@link readOnly} 字段的值。
         * @param readOnly
         */
        setReadOnly: function (readOnly) {
            if (readOnly == null)
                readOnly = true;

            this.readOnly = readOnly;
            this._refreshState();

            if (this.kendoEditor){
                this.kendoEditor.enable(!readOnly);
            }
        },
        setDisabled:function(disabled){
            if (disabled == null)
                disabled = true;
            this.disabled = disabled;
            this._refreshState();
        },
        /**
         * 设置显示值{@link displayValue}和隐藏值{@link value}
         * @param value
         * @param displayValue
         * @param triggerEvent
         */
        setValueAndDisplayValue: function(value, displayValue, triggerEvent){
            this._setValueAndDisplayValue(value, displayValue, false, triggerEvent);
        },
        /**
         * 设置 {@link value} 字段的值。
         *
         * @param value 指定编辑器的值。
         * @param [triggerEvent=false] 指定是否要触发 {@link onchanged} 事件。
         */
        setValue: function (value, triggerEvent) {
            this._setValueAndDisplayValue(value, null, true, triggerEvent);
        },
        /**
         * 设置隐藏值{@link value}和显示值{@link displayValue}
         * @param value            隐藏值
         * @param displayValue     显示值
         * @param needTranslate    是否根据隐藏值来翻译显示值（当显示值为空，隐藏值不为空时）
         * @param triggerEvent     是否要触发值变更的事件
         * @private
         */
        _setValueAndDisplayValue: function(value, displayValue, needTranslate, triggerEvent){
            if (triggerEvent == null)
                triggerEvent = false;
            //如果要求触发事件，但是前后值是一样的，就不触发
            var oldValue = this.value
            if (triggerEvent && (oldValue == value || ((oldValue == null || oldValue == "") && (value == null || value == "")))) {
                triggerEvent = false;
            }

            //TODO:对值进行转换、验证、处理
            if (value == null)
                value = "";

            //如果值为空，那么就直接显示提示信息，并且不需要进行翻译 add by 2014.05.22
            //此处使用三个等号，是因为如果value为0时，会返回true add by 2014.06.10
            if(value === ""){
                this.togglePlaceholder(true);   //显示提示信息
                displayValue = this.placeholder;
                needTranslate = false;
            }else{
                if(this.$input)
                    this.$input.removeClass("h-color-muted");   //移除提示的样式
            }

            this.value = value;

            var that = this;
            var translateCallback = function(displayValue){
                that.setDisplayValue(displayValue);  //设置显示值

                //触发值变更的事件
                if (triggerEvent)
                    that.trigger("changed");
            }

            //翻译隐藏值到显示值，并且设置显示值
            if(needTranslate){
                this.doValueToDisplayValue(translateCallback);
                return;
            }

            translateCallback(displayValue);
        },
        getValue: function () {
            return this.value;
        },
        setDisplayValue: function (displayValue) {
            this.displayValue = displayValue == null ? "" : displayValue;

            //设置输入框的显示值
            if (this.kendoEditor)
                this.kendoEditor.value(displayValue);
            else {
                if (this.$input != null) {
                    this.$input.val(displayValue);
                }
            }
        },
        getDisplayValue: function () {
            return this.displayValue;
        },
        /**
         * 根据显示值来获取隐藏值，并且执行翻译后的回调函数
         * @param translateCallback  翻译后的回调函数，主要是针对异步请求时处理的
         */
        doDisplayValueToValue: function(translateCallback){
            var value = this.displayValue;   //默认情况下，显示值与隐藏值是一致的
            translateCallback(value);
        },
        /**
         * 根据隐藏值来获取显示值，并且执行翻译后的回调函数
         * @param translateCallback  翻译后的回调函数，主要是针对异步请求时处理的
         */
        doValueToDisplayValue: function(translateCallback){
            var displayValue = this.value;   //默认情况下，显示值与隐藏值是一致的
            translateCallback(displayValue);
        },
        setDefaultValue: function(defaultValue, triggerInitValue){
            this.defaultValue = defaultValue;
            if(triggerInitValue == null || triggerInitValue)
                this.setValue(defaultValue);
        },
        setDefaultDisplayValue: function(defaultDisplayValue, triggerInitDisplayValue){
            this.defaultDisplayValue = defaultDisplayValue;
            if(triggerInitDisplayValue == null || triggerInitDisplayValue)
                this.setDisplayValue(defaultDisplayValue);
        },
        getDefaultValue: function(){
            return this.defaultValue;
        },
        getDefaultDisplayValue: function(){
            return this.defaultDisplayValue;
        },
        /**
         * 判断编辑器当前值与默认值是否有变化
         * @return {boolean}
         */
        hasChanged: function(){
            var defaultValue = this.getDefaultValue(),
                value = this.getValue();

            //如果两者值为空，就直接返回false
            if((defaultValue == null || defaultValue == "") && (value == null || value == ""))
                return false;

            return defaultValue != value;
        },
        /**
         * 来回切换提示信息
         * @param isShow
         */
        togglePlaceholder: function (isShow) {
            if (this.$input == null || this.value || this.value === 0 || this.placeholder == null)
                return;

            if (isShow) {
                this.setPlaceholder(this.placeholder);
            } else {
                this.setDisplayValue("");
                this.$input.removeClass("h-color-muted");   //移除提示的样式
            }
        },
        /**
         * 设置 {@link placeholder} 字段的值。
         */
        setPlaceholder: function (placeholder) {
            if (this.$input == null || placeholder == null)
                return;

            this.placeholder = placeholder;
            if (this.value == null || this.value == "") {
                //this.setDisplayValue(placeholder);
                this.$input.attr("placeholder",this.placeholder);
                this.$input.addClass("h-color-muted");    //添加提示的样式
            }
        },
        /**
         * 让编辑器获得焦点。
         */
        focus: function () {
            if (!this.isEditable() || !this.$input)
                return;

            var that = this;
            window.setTimeout(function () {
                if(that.$input)
                    that.$input.focus();
            });
        },
        /**
         * 判断该编辑器是否可编辑
         * @return {boolean|*|boolean}
         */
        isEditable: function(){
            return this.$input != null && this.isVisible() && !this.isReadOnly();
        },
        /**
         * 让编辑器获得焦点，并全选文本框中的值。
         */
        select: function () {
            if (!this.isEditable() || !this.$input)
                return;

            var that = this;
            window.setTimeout(function () {
                if(!that.$input)
                    return;
                var input = that.$input.get(0);
                if (input != null && input.select != null)
                    input.select();
            });
        },
        /**
         * 让编辑器失去焦点。
         */
        blur: function () {
            if (this.$input == null)
                return;

            try {
                this.$input.get(0).blur();
            } catch (e) {
            }
        },
        /**
         * @ignore
         */
        _refreshState: function () {
            if (this.$input != null) {
                if (this.isReadOnly()){
                    this.$input.attr("readOnly", true);
                } else {
                    this.$input.removeAttr("readOnly");
                }

                if(this.isDisabled()){
                    this.$input.attr("disabled", true);
                    this.$input.addClass("comp-disabled");
                } else{
                    this.$input.removeAttr("disabled");
                    this.$input.removeClass("comp-disabled");
                }
            }

//            this.$el.toggleClass("h-disabled", this.isReadOnly());
        },
        /**
         * 支持键盘操作：触发回车(Enter)键或者Tab键导航操作：即按回车键或者Tab键触发Tab键的操作
         * add by 2014.07.15
         * @param event
         * @private
         */
        _triggerEnterOrTabKeyNavigation: function(event){
            var KeyCode = CommonConstant.KeyCode;
            var code = event.keyCode;
            //支持回车键触发Tab键的操作
            if(this.enterKeyNavigatable !== false && (code == KeyCode.ENTER || code == KeyCode.NUMPAD_ENTER)){
                this.tabNext();  //执行类似于tab键的操作，将光标聚焦到下个编辑器或者选择按钮
                return;
            }
            //支持Tab键的操作
            if(this.tabKeyNavigatable !== false && code == KeyCode.TAB){
                this.tabNext();  //执行类似于tab键的操作，将光标聚焦到下个编辑器或者选择按钮
            }
        },
        /**
         * 支持键盘操作：Tab键对应的操作
         * 允许子类覆盖
         * add by 2014.07.15
         */
        tabNext: function(){
            var nextEditor = this.getTabNextComponent();
            if(!nextEditor)
                return;
            nextEditor.focus();   //聚焦到下个编辑器
        },
        /**
         * 支持键盘操作：Tab键对应的操作，获取下个组件
         * 在表单编辑器（FormEditor）中指定
         * add by 2014.07.15
         */
        getTabNextComponent: function(){},
        /**
         * 编辑器重置，重置回默认值的状态
         * @param triggerChangedEvent   是否要触发值变更的事件
         */
        reset: function (triggerChangedEvent) {
            var needCalculateDisplayValue = this.defaultDisplayValue == null;
            this._setValueAndDisplayValue(this.defaultValue, this.defaultDisplayValue, needCalculateDisplayValue, triggerChangedEvent);
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            //移除所有绑定到input中的事件
            this.$input = null;
            this.$controlGroup = null;   //销毁组件容器对象  add by 2014.10.27
            this.destroyKendoEditor();
            this.kendoEditor = null;
            delete this.kendoEditor;

            this._super();
        },
        destroyKendoEditor: function(){
            var kendoEditor = this.kendoEditor;
            if (!kendoEditor)
                return;
            kendoEditor.destroy();   //避免内存泄露
        }
    });

    return Editor;
});