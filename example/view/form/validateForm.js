/**
 * @author:   * @date: 2015/12/7
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/editors/TextEditor",
        "core/js/windows/Window",
        "core/js/controls/ToolStripItem",
        "core/js/utils/ApplicationUtils"
    ],
    function (FluidLayout, CommonConstant, TextEditor, Window, ToolStripItem,
              ApplicationUtils) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: null,
            /*Panel的配置项 start*/
            /*Panel 配置 End*/
            initItems: function () {
                this.items = [];
                this.items.push({
                        comXtype:$Component.PANEL,
                        comConf:this.getPanelConf("编辑器水平布局",$cons.EditorLayoutMode.HORIZONTAL)
                });
                this.items.push({
                    comXtype:$Component.PANEL,
                    comConf:this.getPanelConf("编辑器垂直布局",$cons.EditorLayoutMode.VERTICAL)
                });
            },
            getPanelConf: function (title, layoutMode) {
                return {
                    title:title,
                    theme: $Theme.BLUE,
                    help: "内容1",
                    brief: "摘要1",
                    mainRegion: {
                        comXtype: $Component.SKYFORMEDITOR,
                        comConf: {
                            totalColumnNum: 3,
                            defaultFieldsetConf: {
                                defaultEditorConf: {
                                    layoutMode: layoutMode
                                }
                            },
                            fields: [/**/{
                                label: "时间",
                                name: "datetime",
                                editorType: $Component.DATETIMEEDITOR,
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "文本",
                                name: "text",
                                editorType: $Component.TEXTEDITOR,
                                value: "文本",
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }, {
                                label: "多行文本",
                                name: "multiline",
                                editorType: $Component.TEXTEDITOR,
                                textMode: "multiline",
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }, {
                                label: "日期",
                                name: "date",
                                editorType: $Component.DATEEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }, {
                                label: "密码",
                                name: "password",
                                editorType: $Component.TEXTEDITOR,
                                rules: {
                                    required: true,
                                },
                                textMode: "password"
                            }, {
                                label: "checkbox",
                                name: "checkbox",
                                rules: {
                                    required: true,
                                },
                                items: [{
                                    label: "aa",
                                    value: "aa"
                                }, {
                                    label: "bb",
                                    value: "bb"
                                }],
                                editorType: $Component.CHECKBOXEDITOR,
                            }, {
                                label: "标签",
                                name: "tag",
                                editorType: $Component.TAGSEDITOR,
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "自完成",
                                name: "auto",
                                editorType: $Component.AUTOCOMPLETEEDITOR,
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "数字",
                                name: "number",
                                editorType: $Component.TOUCHSPINEDITOR,
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "上传文件",
                                name: "fileupload",
                                editorType: $Component.FILEUPLOADEDITOR,
                                layoutMode: $cons.EditorLayoutMode.VERTICAL,
                                uploadUrl: "/common/FilesUpload!upload.action",
                                colspan: 3,
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "选择",
                                name: "select",
                                editorType: $Component.SELECTEDITOR,
                                options: [{
                                    value: "1",
                                    label: "选择一"
                                }, {
                                    value: "2",
                                    label: "选择二",
                                    disabled: true
                                }, {
                                    value: "3",
                                    label: "选择三"
                                }, {
                                    value: "4",
                                    label: "选择四"
                                }],
                                rules: {
                                    required: true,
                                },
                            }, {
                                label: "laydate日期",
                                name: "laydate",
                                editorType: $Component.LAYDATEEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }, {
                                label: "切换编辑器",
                                name: "switch",
                                editorType: $Component.SWITCHEDITOR,
                                rules: {
                                    required: true
                                },
                            }, {
                                editorType:$Component.VIEWEDITOR,
                                label:"view编辑器",
                                defaultValue:"view"
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
                                    var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                    skyFormEditor.validate();
                                }
                            }, {
                                text: "取值",
                                onclick: function (e) {
                                    var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                    var values = skyFormEditor.getValue("laydate");
                                    console.info(values);
                                }
                            }, {
                                text: "重置",
                                onclick: function (e) {
                                    var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                    skyFormEditor.reset();
                                }
                            }, {
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
                    },
                }
            }
        });
        return view;
    });

