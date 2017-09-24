/**
 * @date: 14-2-24
 */
define(['jquery',
    'core/js/layout/VBoxLayout'
], function ($, VBoxLayout) {
    var VBoxLayoutDemo = VBoxLayout.extend({
        items: [
            {
                id: "one",
                height: 40
            },
            {
                id: "two",
                height: 40
            },
            {
                id: "three",
                flex: 1             //自动填充剩余空间
            },
            {
                id: "four",
                height: 40
            }
        ],
        //监听渲染事件
        onrender: function (e) {
            this.getRegion("one").show("demo/view/layout/labelView", {text: "one"});
            this.getRegion("two").show("demo/view/layout/labelView", {text: "two"});
            this.getRegion("three").show("demo/view/layout/labelView", {text: "three(扣除已经指定了height，剩余的空间按指定的flex进行分配)", fontSize: "20px"});
            this.getRegion("four").show("demo/view/layout/labelView", {text: "four"});
        },
        onshow: function () {
            //设置背景颜色，为了演示效果
            //$("#one").css("background", "#123");
            //$("#two").css("background", "#321");
            //$("#three").css("background", "#231");
            //$("#four").css("background", "#132");
        }
    });
    return VBoxLayoutDemo;
});

