/**
 * 引用laydata控件
 * 控件地址：
 * http://www.layui.com/laydate/
 * api:
 * http://www.layui.com/doc/modules/laydate.html
 * @author:   * @date: 2016/1/14
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "laydate"
], function (CommonConstant, Editor,laydate) {
    var LayDateEditor = Editor.extend({
        xtype:$Component.LAYDATEEDITOR,
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
         * 控件的类型：
         *
         */
        type:null,
        /**
         * 值的变更事件
         */
        onchangeDate:null,
        onchangeYear:null,
        onchangeMonth:null,
        onclearDate:null,
        onhide:null,
        disabled:false,
        readOnly:false,
        plugin: null,
        /**
         * 插件的配置信息
         * @property {Object}
         */
        pluginConf:null,
        mode:$cons.LayDateMode.date,
        format:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            if(this.disabled||this.readOnly){
                return ;
            }
            var conf = this.getConf();
            //pluginConf的配置信息可以覆盖conf中的信息
            if(this.pluginConf){
                _.extend(conf,this.pluginConf);
            }
            this.plugin = laydate.render(conf);
        },
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.SIMPLE);
            }
            this._super();
        },
        getConf:function(){
            var options = {
                //elem:'#'+this.getId()+" input",
                elem:this.$input[0],
                theme:this.getTheme(),
                type: this.mode.type,
                //format: this.mode.format,
            };
            if(this.format){
                options.format = this.format;
            }
            return options;
        },
        setReadOnly:function(readOnly){
            this.$input.parent().find("input").attr("readonly",readOnly);
            this.readOnly = readOnly;
            //this.$input.prop('disabled', readOnly);
            if(!this.readOnly&&!this.plugin){
                this._initWithPlugIn();
            }
        },
        setDisabled:function(disabled){
            this.$input.prop('disabled', disabled);
            this.disabled = disabled;
            if(!this.disabled&&!this.plugin){
                this._initWithPlugIn();
            }
        },
        /**
         * 设置主题，则需要修改插件的配置
         */
        toggleTheme:function(theme){
            var old = this.theme;
            this._super(theme);
            /*lay(this.$input[0]).off("focus");
            this._initWithPlugIn();*/
            this.destroy();
            this.render();
        },
    });
    return LayDateEditor;
})

