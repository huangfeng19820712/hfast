/**
 * @author:   * @date: 2016/2/26
 */
define([
        "core/js/layout/Panel",
        $Component.TOOLSTRIPITEM.src],
    function (Panel,ToolStripItem) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.CHATEDITOR,
                comConf:{
                    defaultValue:"name",
                    itemOptions:[{
                        text: "confirm",
                        mode: ToolStripItem.Mode.LINK,
                        theme:null,
                        onclick: function () {
                            $.window.confirm("测试1", {
                                yesHandle: function () {
                                    alert(">>>");
                                }
                            });
                        }
                    }, {
                        text: "toggle",
                        isToggle: true,
                        theme:null,
                        mode: ToolStripItem.Mode.LINK,
                    }]
                }
            }
            /*Panel 配置 End*/
        });

        return view;
    });