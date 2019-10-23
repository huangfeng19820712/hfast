/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/windows/Window",
        "core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem"],
    function (FluidLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              Panel,
              ToolStripItem,
              ViewUtils
    ) {
        var items = [];
        /*for(var item in $Theme){
            var theme = $Theme[item];
            items.push({
                xtype:$Component.PANEL,
                comConf:{
                    /!*Panel的配置项 start*!/
                    theme:theme,
                    title:"主题-"+theme,
                    help:"内容",
                    brief:"摘要",
                    mainRegion:theme,
                    /!*Panel 配置 End*!/
                }
            });
        }*/

        items.push({
            comXtype:$Component.PANEL,
            comConf:{
                title:"测试1",
                height:300,
                theme:$Theme.BLUE,
                help:"内容1",
                brief:"摘要1",
                mainRegion:"aaaa",
                footerRegion:{
                    comXtype:$Component.TOOLSTRIP,
                    textAlign:$TextAlign.RIGHT,
                    comConf:{
                        /*Panel的配置项 start*/
                        spacing :CommonConstant.Spacing.DEFAULT,
                        itemOptions: [{
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            text:"确定",
                            onclick: function () {
                                $.window.alert("测试1");
                            }
                        },{
                            themeClass:ToolStripItem.ThemeClass.CANCEL,
                            text: "取消",
                            onclick: function () {
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
                topToolbarRegion:{
                    comXtype:$Component.TOOLSTRIP,
                    textAlign:$TextAlign.RIGHT,
                    comConf:{
                        /*Panel的配置项 start*/
                        spacing :CommonConstant.Spacing.DEFAULT,
                        itemOptions: [{
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            text:"确定",
                            onclick: function () {
                                $.window.alert("测试1");
                            }
                        },{
                            themeClass:ToolStripItem.ThemeClass.CANCEL,
                            text: "取消",
                            onclick: function () {
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
            }
        });
        items.push({
            comXtype:$Component.PANEL,
            comConf: {
                title: "测试1",
                height: 300,
                theme: $Theme.BLUE,
                help: "内容1",
                brief: "摘要1",
                mainRegion: "aaaa",
                isShowHeaderRightRegion:false
            }
        });
        items.push({
            comXtype:$Component.PANEL,
            comConf: {
                isShowHeader:false,
                height: 300,
                theme: $Theme.BLUE,
                help: "内容1",
                brief: "摘要1",
                mainRegion: "aaaa",
                isShowHeaderRightRegion:false
            }
        });
        items.push({
            comXtype:$Component.PANEL,
            comConf: {
                height: 300,
                theme: $Theme.BLUE,
                help: "内容1",
                brief: "摘要1",
                mainRegion: "aaaa",
                headerRightRegion:{
                    comXtype:$Component.TOOLSTRIP,
                    comConf:{
                        /*Panel的配置项 start*/
                        // spacing :CommonConstant.Spacing.DEFAULT,
                        itemOptions: [{
                            // themeClass:ToolStripItem.ThemeClass.SUCCESS,
                            text:"确定",
                            onclick: function () {
                                $.window.alert("测试1");
                            }
                        },{
                            // themeClass:ToolStripItem.ThemeClass.INFO,
                            text: "取消",
                            onclick: function () {
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
            }
        });


        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items:items
        });
        return view;
    });

