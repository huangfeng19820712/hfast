/**
 * @date: 14-2-24
 */
define([
    'core/js/controls/Label',
    "core/js/base/BaseViewModel",
], function (Label,BaseViewModel) {
    var DemoText = BaseViewModel.extend({
        mountContent:function(){
            new Label({
                $container:this.$el,
                //themeClass:Label.ThemeClass.DEFAULT,
                text:"默认标签",
            });
            new Label({
                $container:this.$el,
                themeClass:Label.ThemeClass.PRIMARY,
                text:"主要标签",
            });
            new Label({
                $container:this.$el,
                themeClass:Label.ThemeClass.INFO,
                text:"信息标签",
                closeable:true,
                onclose:function(event){
                    this.destroy();
                }
            });
            new Label({
                $container:this.$el,
                themeClass:Label.ThemeClass.SUCCESS,
                text:"成功标签",
            });
            new Label({
                $container:this.$el,
                themeClass:Label.ThemeClass.WARNING,
                text:"警告标签",
            });
            new Label({
                $container:this.$el,
                themeClass:Label.ThemeClass.DANGER,
                text:"危险标签",
            });
        }
    });

    return DemoText;
});
