/**
 * @author:   * @date: 2015/12/30
 */
define(["core/js/controls/Control",
    "core/js/utils/ViewUtils",
    "core/js/CommonConstant",
    "echarts"], function (Control, ViewUtils, CommonConstant,echarts) {
    var Echart = Control.extend({
        xtype:$Component.ECHART,
        $plugin:null,
        /**
         * echarts插件的配置信息
         */
        conf:null,
        mountContent:function(){
            this.$plugin = echarts.init(this.$el[0]);
            if(this.conf){
                // 使用刚指定的配置项和数据显示图表。
                this.$plugin.setOption(this.conf);
            }
        },
        /**
         * 调用echarts插件的setOtpion函数
         * @param option
         */
        setOption:function(option){
            this.$plugin.setOption(option);
        },
        destroy:function(){
            this.$plugin.dispose();
            this._super();
        }
    });
    return Echart;
})
