/**
 * @author:   * @date: 2015/12/7
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/editors/HtmlEditor"],
    function (Backbone,Panel, HtmlEditor) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.HTMLEDITOR,
            }
            /*Panel 配置 End*/
        });
        return view;
    });
