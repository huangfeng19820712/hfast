/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/controls/Button", $Component.WINDOW.src,
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        $Component.SKYFORMEDITOR.src,
        APP_NAME+"/view/form/validateForm","core/js/windows/messageBox",],
    function (BaseView, Backbone, Button, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,Skyformeditor,validateForm,MessageBox) {
        var view = BaseView.extend({
            initialize: function (options, triggerEvent) {
                this._super(options, false);
            },
            onrender: function () {
                var that = this;
                var buttonGroup = new ToolStrip({
                    $container: this.$el,
                    itemOptions: [{
                        text: "弹窗表单",
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
                                width:800
                            });
                        }
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

