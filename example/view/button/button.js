/**
 * @author:   * @date: 2015/12/29
 */
define(["core/js/base/BaseView",
        "core/js/utils/PathUtils",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/layout/DropDownContainer","core/js/view/Region","core/js/layout/Panel"],
    function (BaseView, PathUtils,
              Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,DropDownContainer,Region,Panel) {

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
            mountContent: function () {
                this.createButtons($Rounded,["roundedClass"]);
                this.createButtons(ToolStripItem.ThemeClass,["themeClass"]);

                this.createButtonGroups();

                var buttonGroup = new ToolStrip({
                    $container: this.$el,
                    itemOptions: [{
                        roundedClass:$Rounded.ROUNDED,
                        text: "alter",
                        title:'测试1',
                        onclick: function () {
                            $.window.alert("测试1");
                            console.info(PathUtils.parseCurrentExecutionScript());
                            console.info(PathUtils.getCurrentExecutionScriptModuleName());
                            console.info(PathUtils.getCurrentExecutionScriptDirectory());
                            console.info(PathUtils.getCurrentExecutionScriptFileName());

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
                        text: "可切换的按钮",
                        isToggle: true,
                    }]
                });
                var commands = _.values(ToolStripItem.DefaultCommand);
                var defaultCommandGroup = new ToolStrip({
                    $container: this.$el,
                    itemOptions: commands
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
                this.getCheckBoxBG();

            },
            createButtonGroups:function(){
                for(var item in ToolStrip.size){
                    this.createButtonGroup(ToolStrip.size[item]);
                }
            },
            createButtonGroup:function(size){
                var buttonGroup = new ToolStrip({
                    $container: this.$el,
                    size:size,
                    itemOptions: [{
                        text: "left",
                    },{
                        text: "middel",
                    }, {
                        text: "right",
                    }]
                });
            },

            /**
             * 创建按钮组
             */
            createButtons:function(objs,props){
                var roundedItems = [];
                for(var item in objs){
                    var union = _.union(props,["text"]);
                    var obj = $.createObject(union, objs[item]);
                    roundedItems.push(obj);
                }
                var roundedButtons = new ToolStrip({
                    $container: this.$el,
                    itemOptions:roundedItems,
                });
            }
        });
        //view.$el.append(buttonGroup);

        return view;
    });

