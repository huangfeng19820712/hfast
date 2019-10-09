/**
 * @author:   * @date: 2015/12/29
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        $Component.THEMEEDITOR.src,
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/layout/DropDownContainer","core/js/view/Region","core/js/layout/Panel"],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ThemeEditor,
              CommonConstant,
              HelpLink,
              Utils,DropDownContainer,Region,Panel) {

        var view = ThemeEditor.extend({
            text:"test"
        });
        return view;
    });

