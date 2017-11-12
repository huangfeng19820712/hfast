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
                    totalColumnNum:3,
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
                        label: "多行文本",
                        name: "multiline",
                        editorType: $Component.TEXTEDITOR,
                        rules: {
                            required: true,
                            maxlength: 20,
                            textMode:"multiline"
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
                        rules: {
                            required: true,
                        },
                        textMode:"password"
                    },{
                        label:"checkbox",
                        name:"checkbox",
                        rules: {
                            required: true,
                        },
                        items:[{
                            label:"aa",
                            value:"aa"
                        },{
                            label:"bb",
                            value:"bb"
                        }],
                        editorType:$Component.CHECKBOXEDITOR,
                    },{
                        label:"标签",
                        name:"tag",
                        editorType:$Component.TAGSEDITOR,
                        rules: {
                            required: true,
                        },
                    },{
                        label:"自完成",
                        name:"auto",
                        editorType:$Component.AUTOCOMPLETEEDITOR,
                        rules: {
                            required: true,
                        },
                    },{
                        label:"数字",
                        name:"number",
                        editorType:$Component.TOUCHSPINEDITOR,
                        rules: {
                            required: true,
                        },
                    },{
                        label:"上传文件",
                        name:"fileupload",
                        editorType:$Component.FILEUPLOADEDITOR,
                        rules: {
                            required: true,
                        },
                    },{
                        label:"选择",
                        name:"select",
                        editorType:$Component.SELECTEDITOR,
                        options:[{
                            value:"1",
                            label:"选择一"
                        },{
                            value:"2",
                            label:"选择二",
                            disabled:true
                        },{
                            value:"3",
                            label:"选择三"
                        },{
                            value:"4",
                            label:"选择四"
                        }],
                        rules: {
                            required: true,
                        },
                    }]
                }
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                textAlign: $TextAlign.RIGHT,
                comConf: {
                    /*Panel的配置项 start*/

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

