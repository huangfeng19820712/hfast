/**
 * @author:   * @date: 2016/2/26
 */
define([
        "backbone",
        "core/js/layout/Panel"],
    function (Backbone,Panel) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.TEXTEDITOR,
                comConf:{
                    label:"名称",
                    defaultValue:"name",
                    maxLength:5
                }
            }
            /*Panel 配置 End*/
        });

        return view;
    });