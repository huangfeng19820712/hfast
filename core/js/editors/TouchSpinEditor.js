/**
 * @author:   * @date: 2016/2/26
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "bootstrap.touchspin"
], function ( CommonConstant, Editor) {
    var TouchSpinEditor = Editor.extend({
        xtype: $Component.TOUCHSPINEDITOR,
        type: "component",
        decimals: null,
        step: 1,//增量或减量
        stepinterval: null,
        size: null,
        prefix:null,
        postfix:null,
        /**
         * 是否不显示up于down的按钮
         */
        displayButtons: false,

        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.SIMPLE);
            }
            this._super();
            this.$controlGroup.addClass("input-group touchSpin");
            this.$controlGroup.attr("id", this.id + "-input-group");
        },
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            var conf = {
                maxboostedstep: 10000000,
                prefix: this.prefix||'',
                postfix:this.postfix ||''
            };
            if (this.min) {
                conf.min = this.min || this.rules.min;
            }
            if (this.max) {
                conf.max = this.max || this.rules.max;
            }
            if (this.decimals) {
                conf.decimals = this.decimals;
            }
            this.$input.TouchSpin(conf);
            if (this.displayButtons) {
                this.$el.find(".bootstrap-touchspin-down").parent().css("display","none");
                this.$el.find(".bootstrap-touchspin-up").parent().css("display","none");
                this.$controlGroup.width("100%");
            }
        },
    });
    TouchSpinEditor.size = {
        /**
         *
         */
        lg: "input-group-lg",
        sm: "input-group-sm",
    };
    return TouchSpinEditor;
})
