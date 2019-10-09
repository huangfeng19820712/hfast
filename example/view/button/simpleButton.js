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


        var view = ToolStripItem.extend({
            text:"test",
            onshow:function(){
                console.info(">>>");
            }
        });
        return view;
    });

