/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        $Component.SKYFORMEDITOR.src,
        APP_NAME+"/view/form/validateForm"],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,Skyformeditor,validateForm) {

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
                var that = this;
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
                    },{
                        text: "内容弹窗",
                        onclick: function () {
                            var editor = new Skyformeditor(that.windowBody());
                            editor.render();
                            var buttons = [{
                                text: "保存",
                                onclick: function(){
                                    var modalDialog = $.window.getActive();
                                    modalDialog.hide();
                                },
                                themeClass:Button.ThemeClass.rounded ,
                                className: Button.ClassName.primary,
                                autofocus: true
                            }];

                            $.window.showMessage(editor.$el, {
                                title:"有内容的弹窗",
                                buttons: buttons,
                            });
                        }
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
            },

            windowBody:function(){
                var editor = {
                    defaultCollapsible:false,
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
                };
                return editor;
            }
        });
        //view.$el.append(buttonGroup);

        return view;
    });

