/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink"],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink) {

        var view = BaseView.extend({
            /**
             * 多选的bg
             */
            getCheckBoxBG: function () {
                var buttonGroup = new ToolStrip({
                    $container: this.$el,
                    spacing: CommonConstant.Spacing.DEFAULT,
                });
                for (var i = 0; i < 10; i++) {
                    buttonGroup.appendItem({
                        text: i.toString(),
                        isToggle: true,
                        themeClass: ToolStripItem.ThemeClass.CHECKBOX,
                        roundedClass:$Rounded.ROUNDED
                    });

                }
                return buttonGroup;
            },
            initialize: function (options, triggerEvent) {
                this._super(options, false);
            },
            onrender: function () {
                var buttonGroup = new ToolStrip({
                    $container: this.$el,

                    itemOptions: [{
                        roundedClass:$Rounded.ROUNDED,
                        text: "alter",
                        onclick: function () {
                            $.window.alert("测试1");
                        }
                    },{
                        text: "confirm",
                        onclick: function () {
                            $.window.confirm("测试1", {
                                yesHandle: function () {
                                    alert(">>>");
                                }
                            });
                        }
                    }, {
                        text: "toggle",
                        isToggle: true,
                    }]
                });
                var helpButton = new HelpLink({
                        $container:this.$el,
                        mainContent:"aaaaaaaaaa",
                    });
                var toolScrip = new ToolStrip({
                    $container: this.$el,
                    className: "btn-group",
                    itemOptions: [{
                        text: "alter",
                        mode: ToolStripItem.Mode.LINK,
                        theme:null,
                        iconSkin: "fa-eye",
                        onclick: function () {
                            $.window.alert("测试1");
                        }
                    }, {
                        text: "confirm",
                        mode: ToolStripItem.Mode.LINK,
                        iconSkin: "fa-chevron-up",
                        theme:null,
                        onclick: function () {
                            $.window.confirm("测试1", {
                                yesHandle: function () {
                                    alert(">>>");
                                }
                            });
                        }
                    }, {
                        text: "toggle",
                        isToggle: true,
                        theme:null,
                        iconSkin: "fa-times",
                        mode: ToolStripItem.Mode.LINK,
                    }]
                });

            }
        });
        //view.$el.append(buttonGroup);

        return view;
    });

