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
            isSeviceLocal:null,
            items: null,
            /*Panel的配置项 start*/
            /*Panel 配置 End*/
            initItems: function () {
                this.items = [];
                this.items.push({
                    comXtype:$Component.PANEL,
                    comConf:this.getPanelConf("编辑器垂直布局",$cons.EditorLayoutMode.VERTICAL)
                });
                var applicationContext = ApplicationUtils.getApplicationContext();
                var localStorage = applicationContext.getLocalStorage();
                var seviceLocal = localStorage.get("isSeviceLocal");
                if(seviceLocal!=undefined){
                    localStorage.set("isSeviceLocal",true);
                }
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
                            fields: [{
                                label: "切换编辑器",
                                name: "switch",
                                editorType: $Component.SWITCHEDITOR,
                                rules: {
                                    required: true
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

