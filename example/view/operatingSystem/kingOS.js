/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/operatingSystem/KingOS",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/controls/HelpLink",
        $Component.SWITCHER.src,"core/js/utils/ApplicationUtils"],
    function (KingOS, CommonConstant,Region,Panel,ToolStripItem,HelpLink,Switcher,
              ApplicationUtils) {

        var view = KingOS.extend({
            initUrl:  "/"+ CONFIG.appName+"/menu.json",
            sunOSed:true,
            close:function(){
                requirejs.undef("demo/view/operatingSystem/kingOS");
                this._super();
            }
        });

        return view;
    });

