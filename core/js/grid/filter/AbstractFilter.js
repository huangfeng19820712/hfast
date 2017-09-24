/**
 * 过滤器的抽象类
 * @author:   * @date: 2017/3/3
 */

define([
    "core/js/controls/Control",
], function (Control) {

    var AbstractFilter = Control.extend({
        editor:null,
        /**
         * grid插件对象
         *
         */
        grid:null,
        sopt:[ "eq", //等于( = )
            "ne" , //不等于( <> )
            "lt", // 小于( < )
            "le", // 小于等于( <= )
            "gt", // 大于( > )
            "ge", // 大于等于( >= )
        ],
        destroy:function(){
            this.editor.destroy();
        }
    });
    return AbstractFilter;
})