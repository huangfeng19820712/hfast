/**
 * @author:   * @date: 2015/12/7
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/editors/TextEditor",
        "core/js/windows/Window"],
    function (Backbone,Panel, TextEditor, Window) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.TEXTEDITOR,
                comConf:{
                    defaultValue:"name",
                    textMode:"password"
                }
            }
            /*Panel 配置 End*/
        });
        return view;
    });
