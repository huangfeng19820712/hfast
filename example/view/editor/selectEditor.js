/**
 * @author:   * @date: 2016/2/26
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
        var options =[{
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
        }];
        var optionGroup =[{
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
        },{optgroup:{
            label:"test",
            subtext:"another test",
            options:[
                {
                    value:"5",
                    label:"选择五"
                },{
                    value:"6",
                    label:"选择六"
                }
            ]
        }}];
        var view = Panel.extend({
            title: "测试1",
            theme: $Theme.BLUE,
            help: "内容1",
            brief: "摘要1",
            mainRegion: {
                comXtype: $Component.SKYFORMEDITOR,
                comConf: {
                    fields: [{
                        label:"默认的下拉框",
                        editorType:$Component.SELECTEDITOR,
                        noneSelectedText:"默认的下拉框",
                        liveSearchPlaceholder:"默认的下拉框",
                        name:"dd1",
                        searchable:true,
                        value:"1",
                        className:"col col-6",
                        options:options,
                        onchanged: function (event) {
                            console.info(event);
                            var editor = event.target;
                            var formEditor = editor.parent;
                            var editordd2 = formEditor.getEditor("dd2");
                            if(editordd2!=null){
                                editordd2.updateOptions(optionGroup);
                            }

                        }
                    },{
                        label:"能查询的下拉框",
                        editorType:$Component.SELECTEDITOR,
                        name:"dd2",
                        searchable:true,
                        value:"3",
                        className:"col col-6",
                        options:options
                    },{
                        //多选
                        label:"多选下拉框",
                        editorType:$Component.SELECTEDITOR,
                        noneSelectedText:"多选下拉框",
                        liveSearchPlaceholder:"多选下拉框",
                        searchable:true,
                        name:"dd3",
                        multiple:true,
                        className:"col col-6",
                        rules:{required: true},
                        options:options
                    },{
                        //多线，分组
                        label:"能分组的下拉框",
                        editorType:$Component.SELECTEDITOR,
                        noneSelectedText:"能分组的下拉框",
                        liveSearchPlaceholder:"能分组的下拉框",
                        searchable:true,
                        name:"dd4",
                        multiple:true,
                        className:"col col-6",
                        value:["3","5"],
                        options:optionGroup
                    }
                    ]
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