/**
 * 提示框，弹出框
 * @author:   * @date: 2016/3/24
 */
define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "core/js/controls/AbstractControlView"
], function ($, _, CommonConstant, AbstractControlView) {
    var TooltipLabel = AbstractControlView.extend({
        xtype:$Component.TOOLTIPLABEL,
        align: $cons.tooltip.Align.LEFT,
        template:$Template.Tooltip.DEFAULT,
        text:null,
        opacity:0,
        position:"relative",
        /**
         * 是否有边框，默认是有的
         */
        noborder:false,
        initialize: function (options,triggerEvent) {
            this.data = {
                align:this.align,
                text:this.text
            };
            this._super(options,true);
        },
        onrender:function(){
            //this.$(".tooltip").css("opacity",this.opacity);
            if(this.noborder){
                this.$(".tooltipLabel").addClass("noborder");
            }

        }
    });
    return TooltipLabel;
});
