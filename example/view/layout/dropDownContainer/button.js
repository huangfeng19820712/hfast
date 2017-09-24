/**
 * @author:   * @date: 2015/12/29
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/layout/DropDownContainer","core/js/view/Region","core/js/layout/Panel"],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,DropDownContainer,Region,Panel) {

        var view = BaseView.extend({
            mountContent: function () {
                var dropDownContainer = new DropDownContainer({
                    $container: this.$el,
                    text: "left",
                    item:{
                        comXtype:$Component.PANEL,
                        comConf:{
                            title:"测试1",
                            theme:$Theme.BLUE,
                            help:"内容1",
                            brief:"摘要1",
                            mainRegion:"aaaa",
                            footerRegion:{
                                comXtype:$Component.TOOLSTRIP,
                                comConf:{
                                    /*Panel的配置项 start*/
                                    textAlign:$TextAlign.RIGHT,
                                    realClass:"btn-group text-right",
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
                    }
                });
            },

        });
        //view.$el.append(buttonGroup);

        return view;
    });

