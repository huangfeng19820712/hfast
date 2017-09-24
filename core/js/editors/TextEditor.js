/**
 * @module 文本编辑器[TextEditor]
 * @description 提供一个允许用户输入文本的文本框的类。
 *
 * @example 以下是一个文本编辑器如何初始化的示例。
 * <code language="JavaScript">
 * var textEditor = new TextEditor(
 * {
 *     "width" : "300px",
 *     "hint" : "test" //指定显示的提示文字。
 * });
 * </code>
 *
 * @example 以下是一个密码输入框如何初始化的示例。
 * <code language="JavaScript">
 * var textEditor = new TextEditor(
 * {
 *     "textMode" : "password"
 * });
 * </code>
 *
 * @date: 2013-08-14 下午2:59
 */
define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "core/js/controls/Button",
    "core/js/editors/AutoCompleteEditor"
], function ($, _, CommonConstant, Editor, Button, AutoComplete) {

    var TextEditor = Editor.extend({
        xtype:$Component.TEXTEDITOR,
        /**
         * 高度由样式指定
         */
        height: null,

        /**
         * 获取文本框的类型。 请使用 {@link setTextMode} 方法设置该字段的值。
         * <p>
         * 该字段可选的值包括：
         * <ul>
         * <li><b>normal</b></li>
         * <li><b>password</b></li>
         * <li><b>multiline</b></li>
         * </ul>
         * </p>
         *
         * @default normal
         */
        textMode: null,

        /**
         * {boolean}是否显示选择按钮
         * add by 2014.10.11
         */
        displaySelectButton: false,

        /**
         * {function}单击选择按钮时，将执行该方法
         * add by 2014.10.11
         */
        clickSelectButton: null,

        /**
         * 针对于密码{@link textMode}为password类型该参数才有效；用于表单提交时，密码是否以加密的方式提交给服务端
         * add by 2014.09.03
         */
        requireEncryption: true,

        /**
         * 是否支持自动完成功能，其值有true|false|Object，如果为Object，格式如下：
         * @example
         * <code>
         *     {
         *          //以下三种数据源的方式，必须指定一种
         *          dataSource: "[可选]<本地数据源，针对客户端诱导，需要指定该值，支持数组或者函数>",
         *          indexConfig: "[可选]<基于全文索引的远程数据源>，相关的配置参数如下：indexCode: "[必填]<全文索引代码>，props: "[可选]<过滤表达式,格式为：param:value;param:value;>，fields: "[可选]<默认返回id及title属性，可通过该参数显式控制返回的属性。>，sorts: "[可选]<排序列的列表，格式为：prop1[:sortType];prop1[:sortType]，键为排序列的列代码，值为ASC和DESC，如是是ASC则可以省略。>"
         *          //远程数据源
         *          ajaxClient: "[可选]<Ajax请求的客户端，默认为RopClient>",
         *          ajaxMethod: "[可选]<Ajax请求的方式，默认为post>",
         *          methodName: "[必填]<Ajax请求的方法名>",
         *          methodVersion: "[可选]<请求的方法名版本，默认为1.0>",
         *          parameters: "[可选]<请求的参数>",
         *          parseParameters: "[可选]<function, 对请求参数进行解析处理>"
         *
         *          indexFields: "[可选]<仅针对本地数据源有效，索引的字段名，多个值用逗号分隔，默认为值和标题>"
         *          dataValueField: "[可选]<值对应的字段名，默认为code>",
         *          dataTextField: "[可选]<值对应的字段名，默认为title>",
         *          template: "[可选]<下拉框可选项显示的模版，默认为CommonConstant.Template.DropDownItem.NORMAL>",
         *          width: "[可选]<下拉框的最小宽度，默认与文本框同宽>",
         *          height: "[可选]<下拉框的最大高度，默认为240px>",
         *          maxResult: "[可选]<下拉框显示的最大记录数，默认为10>",
         *          minLength: "[可选]<当输入的字符串长度达到minLength时，激活Autocomplete，默认为1>"
         *          delay: "[可选]<延迟多少毫秒激活Autocomplete，默认为200毫秒>"
         *     }
         * </code>
         */
        autoComplete: false,

        _autoCompleteObject: null,

        /**
         * 当有按钮时，输入框是否只读，默认是只读的
         * @default true
         */
        inputReadOnly: null,

        /**
         * 在该文本框边上添加按钮(配置信息)
         */
        buttons: null,
        /**
         * 在该文本框边上添加按钮(按钮对象，内部用)
         */
        _buttons: null,

        /**
         * 放置Button的容器
         */
        _$btnContainer: null,

        /**
         * 获取和设置一个 Number 值，表示文本框可输入的字符长度。请使用{@link setMaxLength} 方法设置该字段的值。
         */
        maxLength: null,

        /**
         * 设置自动补齐配置，使该文本框支持自动补齐
         * @param autoComplete
         */
        setAutoComplete: function(autoComplete){
            this.autoComplete = autoComplete;
            this._initAutoComplete();
        },
        /**
         * 判断传递到服务端的值是否需要加密
         * add by 2014.09.03
         * @return {boolean}
         */
        isRequireEncryption: function(){
            return this.requireEncryption;
        },
        /**
         * 判断该文本框是否是密码
         * @return {boolean}
         */
        isPassword: function () {
            return this.textMode == "password";
        },
        /**
         * 设置 {@link readOnly} 字段的值。
         * @param readOnly
         */
        setReadOnly: function (readOnly) {
            this._super(readOnly);
            this._setButtonReadOnly(readOnly);  //将按钮也设置成只读
        },
        setDisabled: function (disabled) {
            this._super(disabled);
            this._setButtonReadOnly(disabled);  //将按钮也设置成只读
        },
        /**
         * 该方法仅用于聚焦选择操作的按钮，主要是用于键盘操作（回车或者tab键），便于与其它编辑器统一
         * add by 2014.07.14
         */
        focusSelectButton: function () {
            var selectBtn = this.getSelectButton();
            if(!selectBtn)
                return;

            selectBtn.focus();
        },
        /**
         * 判断是否有选择操作的按钮
         * add by 2014.07.14
         * @return {boolean}
         */
        hasSelectButton: function(){
            return this.getSelectButton() != null;
        },
        /**
         * 获取选择操作的按钮
         * @return {null}
         */
        getSelectButton: function(){
            return this.getButton("select");
        },
        /**
         * 判断是否有清除操作的按钮
         * add by 2014.09.24
         * @return {boolean}
         */
        hasClearButton: function(){
            return this.getClearButton() != null;
        },
        /**
         * 获取清除操作的按钮
         * add by 2014.09.24
         * @return {null}
         */
        getClearButton: function(){
            return this.getButton("clear");
        },
        /**
         * 清除所有的按钮
         */
        clearButtons: function () {
            var buttons = this._buttons;
            if (buttons == null || buttons.length == 0)
                return;

            var button = null;
            for (var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                button.$el.remove();
                button = null;
            }

            this._toggleContainerClass();
            this._$btnContainer.remove();
            this._$btnContainer = null;

            this._buttons = null;
        },
        /**
         * 添加按钮
         * @param buttons
         * @return {*}
         */
        addButtons: function (buttons) {
            if (buttons == null)
                return null;
            if (!$.isArray(buttons)) {
                return this._addButton(buttons);
            }

            var result = [];
            var button = null;
            for (var i = 0; i < buttons.length; i++) {
                button = this._addButton(buttons[i]);
                if (button == null)
                    continue;
                result.push(button);
            }
            return result;
        },
        /**
         * 隐藏按钮
         * @param btnIds  多个值用逗号分隔
         */
        hideButtons: function(btnIds){
            this._setButtonsVisible(btnIds, false);
        },
        /**
         * 显示按钮
         * @param btnIds 多个值用逗号分隔
         */
        displayButtons: function(btnIds){
            this._setButtonsVisible(btnIds, true);
        },
        _setButtonsVisible: function(btnIds, isVisible){
            if (btnIds == null || btnIds == "")
                return;
            var btnIdArray = btnIds.split(","),
                btn;
            for(var i= 0, count= btnIdArray.length; i<count; i++){
                btn = this.getButton(btnIdArray[i]);
                if(btn == null)
                    continue;
                btn.setVisible(isVisible);
            }
        },
        /**
         * 获取按钮
         * @param btnId
         * @return {null}
         */
        getButton: function (btnId) {
            if (btnId == null || btnId == "")
                return null;
            var buttons = this._buttons;
            if (buttons == null || buttons.length == 0)
                return null;

            var button = null;
            for (var i = 0; i < buttons.length; i++) {
                button = buttons[i];
                if (button.getId() == btnId)
                    return button;
            }

            return null;
        },
        /**
         * 判断是否包含按钮
         * @return {boolean}
         */
        hasButton: function () {
            return this._buttons != null && this._buttons.length > 0;
        },
        /**
         * 判断除了清除按钮外，是否还有其它按钮
         */
        hasOtherButtonExceptClear: function(){
            return this.getOtherButtonCountExceptClear() > 0;
        },
        getOtherButtonCountExceptClear: function(){
            var buttons = this._buttons;
            var result = buttons ? buttons.length : 0;
            if(result == 0)
                return;
            if(this.hasClearButton())
                result--;
            return result;
        },
        /**
         * 判断输入框是否只读
         * @return {*|Boolean|Boolean}
         */
        isInputReadOnly: function () {
            //有按钮也有可能是可编辑的
            //return this._getInputReadOnly() || this.readOnly;

            return this.readOnly;
        },
        /**
         * 编辑器聚焦：如果编辑器的输入框允许输入，那么就聚焦到输入框，否则就聚焦到选择按钮上
         * add by 2014.07.15
         * @override
         */
        focus: function(){
            //如果编辑器是不可编辑的，就直接返回
            if(!this.isEditable())
                return;
            this._resetKeyBoardFlag();   //重置键盘操作的标识
            //如果输入框不是只读的，那么默认聚焦的方法是聚焦到输入框
            if(!this.isInputReadOnly()){
                this.select();
                return;
            }
            this.focusSelectButton();  //如果输入框是只读的，那么就聚焦到选择按钮上
        },
//        /**
//         * 支持键盘操作：Tab键对应的操作
//         * 允许子类覆盖
//         * add by 2014.07.15
//         * @override
//         */
//        tabNext: function(){
//            //聚焦选择按钮
//            var isFocusSelectBtn = this.hasSelectButton() && this.__isFocusInput;
//            if(isFocusSelectBtn){
//                this.__isFocusInput = false;
//                this.focusSelectButton();
//                return;
//            }
//            this._super();
//        },
        /*------------ private methods ---------------------*/
        mountContent:function(){
            this.setTextMode(this.textMode||$cons.textEditoMode.NORMAL);  //预先设置文本模式，初始化$input的值
            this._super();

            this.setMaxLength(this.maxLength);

            this._initButtons();   //初始化按钮

            this._initAutoComplete();  //初始化自动补齐控件

            this._initSearchTip();   //追对于有诱导功能，没有其它按钮的文本框，添加搜索提示的信息，标识该输入框可进行诱导 add by 2014.09.24

            this._initInputReadOnly();
            this._initInputWidth();

            this.setReadOnly(this.readOnly);  //设置只读属性
            this.setDisabled(this.disabled); //设置禁止属性
            this.on("focus", function(){
                this._resetKeyBoardFlag(); //支持键盘操作：重置键盘操作的标识
            });

            this._attach$InputClick();   //追加输入框的单击事件：如果输入框只读，那么单击就执行单击选择按钮操作 add by 2014.10.11

        },

        /**
         * 追加输入框的单击事件：如果输入框只读，那么单击就执行单击选择按钮操作
         * 注意：选择按钮的ID为select
         * add by 2014.10.11
         * @private
         */
        _attach$InputClick: function(){
            if(this.isInputReadOnly()){
                var selectBtn = this.getSelectButton();
                //如果不存在选择按钮，就不触发该操作
                if(!selectBtn)
                    return;
                this.$input.on("click", function(e){
                    selectBtn.click();   //单击选择按钮
                    e.preventDefault();
                    return false;
                });
            }
        },
        /**
         * 失焦后，对输入的结果进行确认，并且触发相关的事件
         * @override
         */
        confirmInputResult: function(){
            //如果输入框是只读的，是不需要再对输入的结果进行确认
            if(this.isInputReadOnly())
                return;
            this._super();
        },
        /**
         * 设置显示值和隐藏值
         * @param value
         * @param displayValue
         * @param needTranslate
         * @param triggerEvent
         * @private
         * @override
         */
        _setValueAndDisplayValue: function(value, displayValue, needTranslate, triggerEvent){
            this._super(value, displayValue, needTranslate, triggerEvent);
            this._toggleClearButton("clear");   //控制是否显示清空按钮
            //如果存在诱导，并且值为空，那么就需要清空诱导中已选中的数据项
            if(!value && this._autoCompleteObject){
                this._autoCompleteObject.setSelectedDataItems(null);
            }
        },
        /**
         * 初始化自动补齐的参数
         * @private
         */
        _initAutoComplete: function(){
            var options = this.autoComplete,
                that = this;
            if (typeof options == "function") {
                var autoCompleteConfig = $.proxy(options, this);  //绑定函数执行的上下文
                options = autoCompleteConfig();
            }
            if(!options)
                return;

            this.$input.off("blur");  //先移除输入框默认失焦的事件，交由AutoComplete来处理

            //如果没有选择按钮，就认为是单纯的文本框，那么就肯定是单选的
            if(!this.hasSelectButton())
                options["multiple"] = false;   //如果单纯是文本框，那么肯定是单选的
            options["element"] = this.$input.get(0);

            //数据项变更时，就触发onchanged事件
            options["onchanged"] = function(e){

                var value = e["value"],
                    displayValue = e["displayValue"],
                    selectedDataItems = e["selectedDataItems"],
                    dataItem;
                if(selectedDataItems != null && selectedDataItems.length > 0)
                    dataItem = selectedDataItems[0];

                //如果前后值是一致的，就不执行后续操作
                var oldValue = that.getValue();
                if(oldValue == value || ((oldValue == null || oldValue == "") && (value == null || value == ""))){
                    //判断文本框中的显示值与编辑器的显示值是否一致，如果不一致，就使用编辑器的显示值来更新文本框的值 add by 2014.10.11
                    var $input = that.$input,
                        inputValue = $input.val(),
                        placeholder = this.placeholder;
                    if(!displayValue && placeholder){
                        displayValue = placeholder;
                        $input.addClass("h-color-muted");
                    }
                    if(displayValue != inputValue){
                        $input.val(displayValue);
                    }
                    return;
                }

                that.setValueAndDisplayValue(value, displayValue, false);   //设置文本框的显示值和隐藏值，并且触发值变更的事件
                that.trigger("changed", {
                    value: value,
                    displayValue: displayValue,
                    dataItem: dataItem
                });
            }

            //如果已经存在诱导，就先销毁 add by 2014.09.23
            if(this._autoCompleteObject){
                this._autoCompleteObject.destroy();
                this._autoCompleteObject = null;
            }

            this._autoCompleteObject = new AutoComplete(options);
        },
        /**
         * 追对于有诱导功能，没有其它按钮的文本框，添加搜索提示的信息，标识该输入框可进行诱导 add by 2014.09.24
         * @private
         */
        _initSearchTip: function(){
            //如果没有诱导功能的输入框就都不需要该提示
            if(!this.autoComplete)
                return;
            //如果文本框右边有添加按钮的，并且这个按钮不是清空按钮，也统一不显示该提示
            if(this.hasOtherButtonExceptClear())
                return;
            this._appendSearchTip();
        },
        _initButtons: function () {
            if(!this.buttons && this.displaySelectButton){
                this.buttons = [
                    {
                        id: "clear",
                        onclick: function () {
                            var editor = this.getParent(),
                                value = "",
                                displayValue = "";

                            editor.setValueAndDisplayValue(value, displayValue, false);   //设置文本框的显示值和隐藏值，并且触发值变更的事件
                            editor.trigger("changed", {
                                value: value,
                                displayValue: displayValue,
                                dataItem: null
                            });
                        }
                    },
                    {
                        id: "select",
                        iconSkin: "h-icon-more",
                        spaceKeyNavigatable: true,     //支持空格键导航
                        onclick: function (e) {
                            var editor = this.getParent();
                            var clickSelectButton = editor.clickSelectButton;
                            if(!_.isFunction(clickSelectButton)){
                                alert("请指定该编辑器[" + this.name + "]选择按钮的单击函数[clickSelectButton]");
                                return;
                            }
                            clickSelectButton(editor.getValue());  //执行该函数
                        }
                    }
                ]
            }

            this.addButtons(this.buttons);

            this._toggleContainerClass();
        },
        _initInputReadOnly: function(){
            //针对有按钮的情况，才需要控制输入框是否可编辑
            if(!this.hasButton())
                return;
            if(this.autoComplete)
                this.inputReadOnly = false;
            if (this.hasButton() && this.inputReadOnly == null)
                this.inputReadOnly = true;


            this.$input.toggleClass("h-cursor-pointer", this.inputReadOnly);
            this.$input.toggleClass("h-form-control-normal", this.inputReadOnly);
        },
        /**
         * 如果指定了文本编辑器的宽度为像素，那么文本框的宽度需要扣除按钮的宽度，否则在线编辑显示的时候会有问题
         * add by 2014.10.17
         * @private
         */
        _initInputWidth: function(){
            //针对有按钮的情况，才需要控制输入框的宽度
            if(!this.hasButton())
                return;
            var width = this.width;
            //如果按百分比的就不计算
            if(!width || (_.isString(width) && width.indexOf("%") > -1))
                return;
            this.$input.css("width", "100%");
        },
        /**
         * 根据是否有值切换清空按钮是否可用
         * @param clearButtonId
         * @private
         */
        _toggleClearButton: function(clearButtonId){
            var value = this.value,
                visible = value != null && value != "" && !this.isReadOnly(),
                clearBtn = this.getButton(clearButtonId);
            if(clearBtn == null)
                return;
            this._setButtonsVisible(clearButtonId, visible);
            if(visible){
                this.$input.css("padding-right", "24px");
            }else{
                this.$input.css("padding-right", "0px");
            }
        },
        /**
         * @deprecated  有按钮也有可能是可编辑的
         * 如果有按钮，则是只读
         * @returns {*}
         * @private
         */
        _getInputReadOnly: function () {
            if (this._buttons == null || this._buttons.length == 0)
                return this.readOnly;

            if (this.inputReadOnly == null)
                this.inputReadOnly = true;

            return this.inputReadOnly;
        },
        _setButtonReadOnly: function (readOnly) {
            var buttons = this._buttons;
            if (buttons == null || buttons.length == 0)
                return;

            if (readOnly == null)
                readOnly = true;

            for (var i = 0; i < buttons.length; i++) {
                buttons[i].setEnabled(!readOnly);
            }
            this._toggleClearButton("clear");   //控制是否显示清空按钮
        },
        _addButton: function (button) {
            var result = null;

            if (button instanceof Button)
                result = button;
            else {
                if ($.isPlainObject(button)) {
                    var buttonConfig = _.extend(button,{$container:this.$el});
                    result = new Button(buttonConfig);
                }
            }

            if (result == null)
                return result;

            result.setParent(this);
            result["getEl"] = function (selector) {
                return this.getParent().$(selector);
            }

            if (this._buttons == null)
                this._buttons = [];

            this._appendButton(result);

            this._buttons.push(result);

            this._toggleContainerClass();

            return result;
        },
        _appendButton: function(button){
            //如果是清除按钮，就将该按钮添加至输入框之前
            if(this._isClearButton(button)){
                this.$input.before(button.$el);
                this.$input.css("padding-right", "24px");
                return;
            }

            if (this._$btnContainer == null) {
                this._$btnContainer = $('<span class="input-group-btn" />');
                this.$el.append(this._$btnContainer);   //追加按钮
            }

            this._$btnContainer.append(button.$el);   //追加按钮
        },
        _isClearButton: function(button){
            var btnId = button ? button.getId() : null;
            return btnId == "clear";
        },
        _toggleContainerClass: function () {
            if (this.hasButton()) {
                this.$el.addClass("input-group");
            } else {
                this.$el.removeClass("input-group");
            }
        },
        /**
         * 为文本框添加搜索提示标识
         * add by 2014.09.24
         * @private
         */
        _appendSearchTip: function(){
            var $searchTip = $('<span class="h-icon h-icon-search"></span>');
            this.$controlGroup.prepend($searchTip);   //追加按钮
            this.$input.css("padding-left", "24px");  //需要留出图标的位置
        },
        /**
         *
         * @private
         * @override
         */
        //_refreshState: function () {
        //    if (this.$input != null) {
        //        if (this.isInputReadOnly())
        //            this.$input.attr("readOnly", true);
        //        else
        //            this.$input.removeAttr("readOnly");
        //    }
        //},
        /**
         * 设置 {@link textMode} 字段的值。
         */
        setTextMode: function (textMode) {
            this.textMode = textMode;

            if (this.$input != null) {
                this.$input.unbind();
                this.$input.remove();
                this.$input = null;
            }

            switch (this.textMode.toLowerCase()) {
                case "multiline":
                    this.textMode = "multiline";
                    this.$input = $("<textarea class='form-control'></textarea>");
                    if (this.height == null) {
                        // 多行文本框默认高度为75。
                        this.height = 75;
                    }
                    break;
                case "password":
                    this.textMode = "password";
                    this.$input = $("<input type='password' class='form-control' />");
                    this.setInputType("password");
                    break;
                default:
                    this.textMode = "normal";
                    this.$input = $("<input type='text' class='form-control' />");
            }
        },
        setInputReadOnly: function(inputReadOnly){
            this.inputReadOnly = inputReadOnly;
        },
        setMaxLength: function (maxLength) {
            if (typeof(maxLength) != "number")
                return;

            this.maxLength = maxLength;

            if ("normal" == this.textMode || "password" == this.textMode) {
                this.$input.attr("maxLength", this.maxLength);
                return;
            }

            if ("multiline" == this.textMode) {
                var me = this;
                this.$input.on("keydown", function () {
                    if (me.$input.get(0).value.length >= me.maxLength) {
                        var value = me.$input.get(0).value.substring(0, me.maxLength);
                        me.$input.get(0).value = value;
                    }
                });
                this.$input.on("keyup", function () {
                    if (me.$input.get(0).value.length >= me.maxLength) {
                        var value = me.$input.get(0).value.substring(0, me.maxLength);
                        me.$input.get(0).value = value;
                    }
                });
            }
        },
        /**
         * 支持键盘操作：重置键盘操作的标识
         * add by 2014.07.15
         * @private
         */
        _resetKeyBoardFlag: function(){
            this.__isFocusInput = true;   //标识当前光标是否聚焦在输入框上
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this._autoCompleteObject = null;
            this._$btnContainer = null;       //销毁按钮容器对象  add by 2014.10.27
            this.$controlGroup = null;   //销毁组件容器对象  add by 2014.10.27
            this._buttons = null;   //销毁按钮

            if(this._autoCompleteObject){
                this._autoCompleteObject.destroy();
                this._autoCompleteObject = null;
                delete this._autoCompleteObject;
            }

            this._super();
        }
    });
    TextEditor.Button = Button;
    TextEditor.AutoCompleteTemplate = AutoComplete.Template;

    return TextEditor;
});