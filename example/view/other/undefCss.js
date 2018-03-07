/**
 * @date: 14-2-24
 */
define([
    "core/js/base/BaseViewModel",
    "core/js/utils/ApplicationUtils",
    "css!/core/resources/styles/apricot.css"
], function (BaseViewModel,ApplicationUtils) {
    var DemoText = BaseViewModel.extend({
        mountContent:function(){
        },
        close:function(){
            ApplicationUtils.undefCss("css!/core/resources/styles/apricot.css");
            requirejs.undef("demo/view/other/undefCss");
        }
    });

    return DemoText;
});
