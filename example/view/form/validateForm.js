/**
 * @author:   * @date: 2015/12/7
 */
define([
        "backbone",
        "core/js/layout/Panel",
        "core/js/CommonConstant",
        "core/js/editors/TextEditor",
        "core/js/windows/Window",
        "core/js/controls/ToolStripItem",
        "core/js/utils/ApplicationUtils"
    ],
    function (Backbone, Panel, CommonConstant, TextEditor, Window, ToolStripItem,
              ApplicationUtils) {
        var view = Panel.extend({
            title: "测试1",
            theme: $Theme.BLUE,
            help: "内容1",
            brief: "摘要1",
            mainRegion: {
                comXtype: $Component.SKYFORMEDITOR,
                comConf: {
                    fields: [{
                        label: "时间",
                        name: "datetime",
                        editorType: $Component.DATETIMEEDITOR,
                        rules: {
                            required: true,
                        },
                    },{
                        label: "文本",
                        name: "text",
                        editorType: $Component.TEXTEDITOR,
                        rules: {
                            required: true,
                            maxlength: 20,
                        },
                    },{
                        label: "日期",
                        name: "date",
                        editorType: $Component.DATEEDITOR,
                        rules: {
                            required: true,
                            maxlength: 20,
                        },
                    },{
                        label:"密码",
                        name:"password",
                        editorType:$Component.TEXTEDITOR,
                        textMode:"password"
                    }]
                }
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                comConf: {
                    /*Panel的配置项 start*/
                    textAlign: $TextAlign.RIGHT,
                    spacing: CommonConstant.Spacing.DEFAULT,
                    itemOptions: [{
                        themeClass: ToolStripItem.ThemeClass.PRIMARY,
                        text: "确定",
                        onclick: function (e) {
                            var panelRegion = ApplicationUtils.getMainRegion();
                            var skyFormEditor = panelRegion.getComRef().getMainRegionRef().getComRef();
                            skyFormEditor.validate();
                        }
                    }, {
                        themeClass: ToolStripItem.ThemeClass.CANCEL,
                        text: "取消",
                        onclick: function (e) {
                            $.window.confirm("测试1", {
                                yesHandle: function () {
                                    alert(">>>");
                                }
                            });
                        }
                    }]
                    /*Panel 配置 End*/
                }
            }

        });

        return view;
    });

