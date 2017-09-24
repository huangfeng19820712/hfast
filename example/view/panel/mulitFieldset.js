/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/FluidLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem"],
    function (FluidLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              ToolStripItem,
              ViewUtils
    ) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            initialize: function (options,triggerEvent) {
                this.items = [];
                this.items.push({
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        title:"不可收缩",
                        theme:$Theme.BLUE,
                        help:"内容1",
                        brief:"摘要1",
                        collapsible:false,
                        disabled:true,
                        fields:[{
                            label:"文本",
                            name:"text",
                            value:"asdfasf",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                        },{
                            label:"密码",
                            name:"password",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                            value:"asdfasf",
                            textMode:"password"
                        },{
                            label:"时间",
                            name:"datetime",
                            editorType:$Component.DATETIMEEDITOR,
                            className:"col col-6",
                        },{
                            label:"日期",
                            name:"date",
                            editorType:$Component.DATEEDITOR,
                            className:"col col-6",
                        }]
                    }
                },{
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        title:"可收缩",
                        theme:$Theme.BLUE,
                        help:"内容1",
                        brief:"摘要1",
                        fields:[{
                            label:"时间",
                            name:"datetime",
                            editorType:$Component.DATETIMEEDITOR,
                            className:"col col-6",
                        },{
                            label:"日期",
                            name:"date",
                            editorType:$Component.DATEEDITOR,
                            className:"col col-6",
                        },{
                            label:"文本",
                            name:"text",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                        },{
                            label:"密码",
                            name:"password",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                            textMode:"password"
                        },{
                            label:"touchSpin",
                            name:"touchSpin",
                            editorType:$Component.TOUCHSPINEDITOR,
                            className:"col col-6",
                        }]
                    }
                },{
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        title:"不可收缩",
                        theme:$Theme.BLUE,
                        help:"内容1",
                        brief:"摘要1",
                        collapsible:false,
                        fields:[{
                            label:"时间",
                            name:"datetime",
                            editorType:$Component.DATETIMEEDITOR,
                            className:"col col-6",
                        },{
                            label:"日期",
                            name:"date",
                            editorType:$Component.DATEEDITOR,
                            className:"col col-6",
                        },{
                            label:"文本",
                            name:"text",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                        },{
                            label:"密码",
                            name:"password",
                            editorType:$Component.TEXTEDITOR,
                            className:"col col-6",
                            textMode:"password"
                        }]
                    }
                });
                this._super(options,triggerEvent);
            }
        });
        return view;
    });
