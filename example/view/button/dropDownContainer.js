/**
 * @author:   * @date: 2015/12/29
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/layout/DropDownContainer","core/js/view/Region","core/js/layout/Panel"],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,DropDownContainer,Region,Panel) {

        var view = BaseView.extend({
            onrender: function () {
                var items = [];
                for(var i=0;i<=9;i++){
                    items.push({
                        roundedClass:$Rounded.ROUNDED,
                        text:i.toString(),
                    })
                }

                var dropDownContainer = new DropDownContainer({
                    $container: this.$el,
                    text: "number",
                    dropDownWidth:135,
                    item:{
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            spacing: CommonConstant.Spacing.DEFAULT,
                            className: "btn-group",
                            itemOptions: items
                        }
                    }
                });
            },
        });
        return view;
    });


