/**
 * 引用bootstrap-switch控件
 * 控件地址：
 * http://www.bootcss.com/p/bootstrap-switch/
 * api:
 * https://github.com/Bttstrp/bootstrap-switch
 * 主要功能：
 * 1.获取值
 * 2.销毁
 * 3.事件：切换事件、销毁事件
 * 注意：Switch的状态与值需要联动，要保持一致，如果用事件处理，会有死循环的情况，
 * 需要增加一个标志属性，去解决此问题
 * @author:   * @date: 2016/1/14
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "bootstrap-switch"
], function (CommonConstant, Editor,BootstrapSwitch) {
    var SwitchEditor = Editor.extend({
        xtype:$Component.SWITCHEDITOR,
        disabled:false,
        readOnly:false,
        plugin: null,
        /**
         * 插件的配置信息
         * @property {Object}
         */
        pluginConf:null,
        controlGroupClass:"switch",
        onText: "ON",
        offText: "OFF",
        labelText: "&nbsp;",
        inputClassName:"form-control-switchEditor",
        /**
         * 设置开关的状态，与value的值应该一致
         */
        state:true,
        defaultValue:"1",
        /**
         * 打开时候的value,
         * 注意，不能是boolean值，会变成字符串"true"，与服务器交互都是字符串
         */
        onValue:"1",
        /**
         * 关闭时候的value
         * 注意，不能是boolean值，会变成字符串"true"，与服务器交互都是字符串
         */
        offValue:"0",

        /**
         * value与state是否同步过，如果是则是true
         */
        _valueAndStateSync:false,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            var conf = this.getConf();
            //pluginConf的配置信息可以覆盖conf中的信息
            if(this.pluginConf){
                _.extend(conf,this.pluginConf);
            }
            this.$input.bootstrapSwitch(conf);
            //初始化值
            if(this.value==undefined){
                this.initValue(this.state);
            }

        },
        initValue:function(state){
            if(state){
                this.value = this.onValue;
            }else{
                this.value = this.offValue;
            }
        },

        getConf:function(){
            var that = this;
            if(this.value==0||this.value=="0"){
                this.state = false;
            }else if(this.value==1||this.value=="1") {
                this.state = true;
            }
            var options = {
                onText:this.onText,
                offText: this.offText,
                labelText: this.labelText,
                state: this.state,
                onSwitchChange:function(event){
                    if(!that._valueAndStateSync){
                        that._valueAndStateSync = true;
                        if(that.getState()){
                            //修改值，并不更新状态
                            that.setValue(that.onValue,true,true);
                        }else{
                            that.setValue(that.offValue,true,true);
                        }
                        that._valueAndStateSync = false;
                    }
                    //console.info(that.getState());
                }
            };
            return options;
        },
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.CHECKBOX);
                this.$input.addClass(this.inputClassName);
            }
            this._super();
        },
        clearValue:function(triggerEvent){
            this._setValueAndDisplayValue(this.defaultValue, null, true, triggerEvent);
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
            var state = false;
            if(value==1||value=="1") {
                state = true;
            }
            this._valueAndStateSync = true;
            this.setState(state);
            this._valueAndStateSync = false;
            this._super(value, displayValue, needTranslate, triggerEvent);
        },
        setReadOnly:function(readOnly){
            this.$input.bootstrapSwitch('readonly', readOnly);
        },
        setDisabled:function(disabled){
            //this.$input.attr("disabled",disabled);
            this.$input.bootstrapSwitch('disabled', disabled);
        },

        toggleIndeterminate:function(){
            this.$input.bootstrapSwitch('toggleIndeterminate');
        },

        setOnText:function(value){
            this.$input.bootstrapSwitch('onText',value);
        },

        setOffText:function(value){
            this.$input.bootstrapSwitch('offText',value);
        },
        /**
         * 获取状态
         */
        getState:function(){
            return this.$input.bootstrapSwitch('state');
        },

        /**
         * 设置状态
         * @param value
         */
        setState:function(value){
            this.$input.bootstrapSwitch('state',value);
        },

        setlabelText:function(value){
            this.$input.bootstrapSwitch('labelText',value);
        },
        onchanged:function(){
            if(!this._valueAndStateSync){
                this._valueAndStateSync = true;
                this.setState(this.value);
                this._valueAndStateSync = false;
            }
        },
        /**
         * 切换状态
         */
        toggleState:function(){
            this.$input.bootstrapSwitch('toggleState');
        },
        /**
         * 编辑器重置，重置回默认值的状态
         * @param triggerChangedEvent   是否要触发值变更的事件
         */
        reset: function (triggerChangedEvent) {
            //必须出发changed事件
            this._super(true);
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @param   isNotDestory   是否执行dateEditor特有的销毁内容
         * @override
         */
        destroy: function (isNotDestory) {
            this.$el.bootstrapSwitch('destroy');
            this._super();
        },

    });
    return SwitchEditor;
})

