/**
 * @author:   * @date: 2015/12/29
 */
define(["core/js/Controls/Control",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/layout/DropDownContainer",
        "core/js/view/Region","core/js/layout/Panel",
        $Component.SWITCHER.src,"core/js/utils/ApplicationUtils"],
    function (Control,  Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,DropDownContainer,Region,Panel,
              Switcher,
              ApplicationUtils) {

        var view = Control.extend({
            mountContent: function () {
                var helpButton = new HelpLink({
                    $container:this.$el,
                    mainContent:"aaaaaaaaaa",
                });
            },
            onrender:function(){
                var that = this;
                var switcher = new Switcher({
                    $container:this.$el,
                    spinTop:70,
                    onthemeSelect:function(event){
                        var childrenComponent = ApplicationUtils.getChildrenComponent(that);
                        //var jqEvent = event.jqEvent;
                        var theme = $(event.jqEvent.target).data("skin");
                        _.each(childrenComponent,function(item,idx,list){
                            item.toggleTheme(theme);
                        });
                    }
                });
                /*//设置到合适的高度
                 switcher.$el.find(".del-style-switcher").css({
                 top:70,
                 });*/
            }
        });
        //view.$el.append(buttonGroup);

        return view;
    });

