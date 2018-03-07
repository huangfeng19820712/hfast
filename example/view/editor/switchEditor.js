/**
 * @author:   * @date: 2015/12/7
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/layout/Panel",
        "core/js/windows/Window",
        "core/js/controls/ToolStripItem",
        "core/js/utils/ApplicationUtils",
        "core/js/CommonConstant",],
    function (FluidLayout,Panel, Window,ToolStripItem,ApplicationUtils,CommonConstant) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_6,
            items: null,
            initItems:function(){
                this.items = [{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"时间格式",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.SWITCHEDITOR,
                            comConf:{
                                //disabled:true,
                            }
                        },
                        footerRegion: {
                            comXtype: $Component.TOOLSTRIP,
                            textAlign: $TextAlign.RIGHT,
                            comConf: {
                                /*Panel的配置项 start*/
                                itemOptions: [{
                                    text: "不可使用",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setDisabled(true);
                                    }
                                },{
                                    text: "使用",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setDisabled(false);
                                    }
                                },{
                                    text: "只读",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setReadOnly(true);
                                    }
                                },{
                                    text: "可编辑",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setReadOnly(false);
                                    }
                                },{
                                    text: "取值",
                                    onclick: function () {
                                        console.info("值："+this.parent.parent.getMainRegionRef().getComRef().getValue());
                                    }
                                },{
                                    text: "toggleIndeterminate",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().toggleIndeterminate()
                                    }
                                },{
                                    text: "onText",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setOnText("是");
                                    }
                                },{
                                    text: "offText",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setOffText("否");
                                    }
                                },{
                                    text: "setlabelText",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().setlabelText("否/是");
                                    }
                                },{
                                    text: "切换状态",
                                    onclick: function () {
                                        this.parent.parent.getMainRegionRef().getComRef().toggleState();
                                    }
                                },]
                                /*Panel 配置 End*/
                            }
                        }
                    }
                },{
                    comXtype:$Component.PANEL,
                    comRef:new Panel({
                        title:"开关编辑器",
                        mainRegion:{
                            comXtype: $Component.SKYFORMEDITOR,
                            comConf: {
                                totalColumnNum:3,
                                fields: [{
                                    label: "开关编辑器",
                                    name: "switch",
                                    editorType: $Component.SWITCHEDITOR,
                                    onText:"是",
                                    offText:"否",
                                    rules: {
                                        required: true,
                                        maxlength: 20,
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
                                        //var panelRegion = ApplicationUtils.getMainRegion();
                                        var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                        skyFormEditor.validate();
                                    }
                                },{
                                    text: "取值",
                                    onclick: function (e) {
                                        var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                        var values = skyFormEditor.getValue("switch");
                                        console.info(values);
                                    }
                                },{
                                    text: "重置",
                                    onclick: function (e) {
                                        var skyFormEditor = this.parent.parent.getMainRegionRef().getComRef();
                                        //需要出发事件
                                        skyFormEditor.reset();
                                    }
                                }]
                                /*Panel 配置 End*/
                            }
                        },
                    })
                }];

            }
        });

        return view;
    });
