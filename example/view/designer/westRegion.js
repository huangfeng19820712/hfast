/**
 * @author:   * @date: 2016/12/14
 */
define(['jquery',
    'core/js/layout/Accordion' ,
    "core/js/controls/ToolStrip",
    "core/js/CommonConstant",
], function ($, Accordion,ToolStrip,CommonConstant) {
    var AccordionDemo = Accordion.extend({
        //监听渲染事件
        onrender: function (e) {
            var buttonGroup = new ToolStrip({
                spacing:CommonConstant.Spacing.DEFAULT,
                itemOptions: [{
                    roundedClass:$Rounded.ROUNDED,
                    text: "alter",
                    title:'测试1'
                },{
                    roundedClass:$Rounded.ROUNDED,
                    text: "confirm"
                }, {
                    roundedClass:$Rounded.ROUNDED,
                    text: "可切换的按钮",
                }]
            });
            this.getRegionByIndex(1).show(buttonGroup);
            this.$el.find("button").draggable({ scroll: true });
        },
        beforeInitializeHandle: function (e) {
            this._super(e);
            this.accordionItems = [
                {
                    label: "按钮",
                },
                {
                    label: "布局",
                },
                {
                    label: "表单",
                },
                {
                    label: "数据集",
                    height: 40
                }
            ];

        }
    });


    return AccordionDemo;
});
