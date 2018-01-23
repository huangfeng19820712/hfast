/**
 * @module 下拉选择框的编辑器
 * @description 下拉选择框的编辑器，集成的组件为：http://silviomoreto.github.io/bootstrap-select/
 * @date:
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor","bootstrap-select"
], function (CommonConstant, Editor) {
    var SelectEditor = Editor.extend({
        xtype: $Component.SELECTEDITOR,
        name:null,
        display:null,
        url:null,
        source:null,
        plugin:null,
        /**
         * @property    {boolean}是否能查询，默认是false
         */
        searchable:false,
        /**
         * @property    {Number}最大可以选择的项目
         */
        maxOptions:null,
        /**
         * @property    {String} 如果是json对象，则是对应对象的Id对应的属性
         */
        optionId: null,
        /**
         * @property    {String} 如果是json对象，则是对应对象要显示的内容的属性
         */
        optionLabel: null,
        /**
         * @property    {boolean} 多选，还是单选，默认是单选
         */
        multiple:false,

        maxOptions:1,
        /**
         * @property    {boolean} 是否显示被选择的够，默认是true
         */
        showTickable:true,
        /**
         * @property    {Array} 选择项的数组
         * @example
         * <code>
         *     [{
         *         value: "[可选]<选择项的值，如果没有则去label的值>",
         *         label: "[可选]<选择项的显示出来的值>",
         *         disabled: "[可选]<是否可以选择>",
         *     },{optgroup: "[可选，选项分组]"{
         *             disabled: "[可选]<是否可以选择>",
         *             label:"[可选]<是否可以选择>",
         *             options:[value: "[可选]<选择项的值，如果没有则去label的值>",[{
         *             label: "[必填]<选择项的显示出来的值>",
         *             disabled: "[可选]<是否可以选择>",
         *         },...]},...]
         * </code>
         */
        options:null,

        /**
         * 没有的时候，显示的内容
         */
        noneSelectedText:null,

        /**
         * 搜索框没有内容时的，显示的内容
         */
        liveSearchPlaceholder:null,

        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.SELECT);
            }
            this._super();
        },
        /**
         * 初始化输入控件的属性
         * @private
         */
        _init$InputAttrs:function(){
            this._super();
            if(this.showTickable){
                this.$input.addClass("show-tick");
            }
            if(this.options){
                this._initOptions(this.$input,this.options);
            }
            if(this.multiple){
                this.$input.attr("multiple","true");
                this.maxOptions = null;
            }else{
                this.$input.attr("multiple","true");
                this.maxOptions =1;
            }
            if(this.placeholder){
                this.$input.attr("title",this.placeholder);
            }
            //this.$input.attr("data-hide-disabled",true);
        },
        /**
         * 初始化选择项
         * @param options
         * @private
         */
        _initOptions:function(el,options) {
            var that= this;
            _.each(options, function (value,key) {
                if(value.optgroup){
                    //含有子组件
                    var optGroupEl = $("<optgroup/>");
                    if(value.optgroup.label){
                        optGroupEl.attr("label",value.optgroup.label);
                    }
                    if(value.optgroup.subtext){
                        optGroupEl.data("subtext",value.optgroup.subtext);
                    }
                    if(value.optgroup.options){
                        that._initOptions(optGroupEl,value.optgroup.options);
                    }
                    el.append(optGroupEl);
                }else{
                    var initOption = that._initOption(value);
                    el.append(initOption);
                }

            });
        }
        ,
        /**
         * 初始化选择项
         * @private
         */
        _initOption:function(option){
            var el = $("<option/>");
            if(_.has(option,"disabled")){
                el.attr("disabled",option.disabled);
            }
            if(_.has(option,"value")){
                el.val(option.value);
            }
            if(_.has(option,"label")){
                el.text(option.label);
            }
            return el;
        },
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            var $input = this.$input;
            //需要显示到页面后，设置选择项
            var optionEl = this.$input.find("option");
            _.each(optionEl,function(value,key){
                $(value).attr("selected", false);
            });
            this.plugin = $input.selectpicker({
                liveSearch:this.searchable,
                noneSelectedText:this.noneSelectedText||"--请选择--",
                liveSearchPlaceholder:this.liveSearchPlaceholder||"--请输入--",
                maxOptions: this.maxOptions});
            var that = this;
            //添加事件，把选择器的事件
            $input.on("changed.bs.select",function(e){
                that.setValue($(e.target).val());
            })
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
            var result = value;
            if(_.isArray(value)&&value.length==1){
                result = result[0];
            }

            this._super(result, result, needTranslate, triggerEvent);
            //设置控件的值
            this.$input.selectpicker('val', value);
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this.plugin.selectpicker('destroy');
            this.plugin = null;
            this._super();
        },

        /**
         * 获取选中的对象
         * @returns {*}
         */
        getValueObject:function(){
            return this.plugin.typeahead("getActive");
        },
    });

    return SelectEditor;
})