/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/operatingSystem/ApricotOS",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/controls/HelpLink",
        $Component.SWITCHER.src,"core/js/utils/ApplicationUtils"],
    function (ApricotOS, CommonConstant,Region,Panel,ToolStripItem,HelpLink,Switcher,
              ApplicationUtils) {

        var view = ApricotOS.extend({
            initUrl:  "/"+ CONFIG.appName+"/menu.json",
            sunOSed:true,
            mainRegionId:"sb-site-main"
        });

        return view;
    });

