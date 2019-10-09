/**
 * 引用bootstrap的date控件
 * 控件地址：
 * http://eternicode.github.io/bootstrap-datepicker/?markup=input&format=yyyy-mm-dd&weekStart=1&startDate=2016-01-08&endDate=&startView=0&minViewMode=0&maxViewMode=0&todayBtn=true&clearBtn=false&language=zh-CN&orientation=top+auto&multidate=&multidateSeparator=&daysOfWeekDisabled=0&daysOfWeekDisabled=6&todayHighlight=on&keyboardNavigation=on&forceParse=on&beforeShowMonth=on&datesDisabled=on&toggleActive=on&defaultViewDate=on#sandbox
 * 注意：bootstrap与jquery-ui都有datepicker，所以需要修改jquery-ui的输出方法改成$.fn.uidatepicker
 *
 * @author:   * @date: 2016/1/14
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "bootstrap-datepicker.locale"
], function (CommonConstant, Editor, Button) {

    var DateEditor = Editor.extend({
        xtype:$Component.DATEEDITOR,
        /**
         * 选择完后，自动关闭窗口
         */
        autoclose:true,
        /**
         * 可以选择的开始日期
         */
        startDate:null,
        /**
         * 可以选择结束日期
         */
        endDate:null,

        /**
         * 值的变更事件
         */
        onchangeDate:null,
        onchangeYear:null,
        onchangeMonth:null,
        onclearDate:null,
        onhide:null,
        $picker:null,
        disabled:false,
        plugin:"datepicker",
        mode:null,
        format:null,
        getOption:function(){
            var options = {
                language: $global.BaseFramework.locale,
                todayBtn: true,
                clearBtn: true,
                autoclose: this.autoclose,
                todayHighlight: true,
                defaultViewDate:"day",

            };
            if(this.format){
                options.format = this.format;
            }
            return options;
        },
        _init$Input:function(){
            //初始化input对象
            if(!this.$input){
                var option = {};
                option[$cons.DateEditorMode.COMPONENT] = function(){
                    this.$input =  $($Template.Input.DEFAULT);
                };
                option[$cons.DateEditorMode.INPUT] = function(){
                    this.$input =  $($Template.Input.SIMPLE);
                };
                this.modeExcute(option);
            }
            this._super();
            this.$controlGroup.addClass("input-group date");
            this.$controlGroup.attr("id",this.id+"-input-group");

            var option = {};
            option[$cons.DateEditorMode.COMPONENT] = function(){
                this.$picker = this.$controlGroup;
            };
            option[$cons.DateEditorMode.INPUT] = function(){
                this.$picker = this.$input;
                this.$controlGroup.width("100%");
            };
            this.modeExcute(option);
        },
        /**
         * 根据mode来执行
         * @param option    {$cons.DateEditorMode.COMPONENT}
         */
        modeExcute:function(option){
            var mode = this.mode || $cons.DateEditorMode.COMPONENT;
            switch(mode){
                case $cons.DateEditorMode.COMPONENT:
                    if(_.isFunction(option[$cons.DateEditorMode.COMPONENT])){
                        option[$cons.DateEditorMode.COMPONENT].call(this);
                    }
                    break;
                case $cons.DateEditorMode.INPUT:
                    if(_.isFunction(option[$cons.DateEditorMode.INPUT])){
                        option[$cons.DateEditorMode.INPUT].call(this);
                    }
                    break;
                case $cons.DateEditorMode.INLINE:
                    if(_.isFunction(option[$cons.DateEditorMode.INLINE])){
                        option[$cons.DateEditorMode.INLINE].call(this);
                    }
                    break;
                case $cons.DateEditorMode.RANGE:
                    if(_.isFunction(option[$cons.DateEditorMode.RANGE])){
                        option[$cons.DateEditorMode.RANGE].call(this);
                    }
                    break;
            }
        },

        _initWithPlugIn:function(){
            if(this.disabled){
                return ;
            }
            //this.$controlGroup[this.plugin]==this.$controlGroup.datepicker
            this.$picker = this.$controlGroup[this.plugin].call(this.$picker,this.getOption());
            this._initEvents();
        },
        _initEvents:function(){
            var that = this;
            _.each(["changeDate","changeYear","changeMonth","clearDate"],function(item,index,list){
                that._initEvent(item);
            });
        },
        _initEvent:function(eventType){
            var etype = "on" + eventType;
            var eventObject = this[etype];
            var that = this;
            this.$picker.on(eventType, function(e){
                var value = that.$picker[that.plugin].call(that.$picker, "getFormattedDate");
                that.setValue(value,true);
                if(eventObject!=null){
                    that.trigger(eventType,e);
                }
            });

        },

        setReadOnly:function(readOnly){
            this.$input.parent().find("input").attr("readonly",readOnly);
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @param   isNotDestory   是否执行dateEditor特有的销毁内容
         * @override
         */
        destroy: function (isNotDestory) {
            //移除所有绑定到input中的事件
            if(!isNotDestory&&_.isFunction(this.$controlGroup[this.plugin])){
                this.$controlGroup[this.plugin].call(this.$picker,"destroy");
            }
            this._super();
        },

    });
    return DateEditor;
})

