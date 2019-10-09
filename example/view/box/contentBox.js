/**
 * @date: 14-2-24
 */
define([
    'core/js/controls/ContentBox',
    "core/js/base/BaseView",
    "text!"+APP_NAME+"/resources/tmpl/contentBox.html",
], function (ContenBox,BaseView,Template) {
    var DemoText = BaseView.extend({
        template:Template,
        /*mountContent:function(){
            new ContenBox({
                $container:this.$el,
                //themeClass:Label.ThemeClass.DEFAULT,
                text:"默认标签",
            });
        }*/
    });

    return DemoText;
});
