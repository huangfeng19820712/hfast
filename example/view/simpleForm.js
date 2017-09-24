/**
 * @author:   * @date: 2015/12/7
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/editors/TextEditor",
        "core/js/windows/Window"],
    function (Backbone,Panel, TextEditor, Window) {
        /*var textEditor = new TextEditor(
            {
                "width": "300px",
                required:true,
                isShowLabel:false,
                "label": "test" //指定显示的提示文字。
            });*/

        var view = new Panel({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.DATETIMEEDITOR,
                comConf:{
                    "width": "300px",
                    required:true,
                    isShowLabel:false,
                    readOnly:true,
                    disabled:false,
                    "label": "test", //指定显示的提示文字。
                    onchangeDate:function(){

                    },

                }
            }
            /*Panel 配置 End*/
        });

        return view;
    });

