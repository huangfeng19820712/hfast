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
            defaultColumnSize: $Column.COL_MD_12,
            initItems: function () {
                this._super();
                this.items.push({
                    comXtype:$Component.FIELDSET,
                    comConf:{
                        title:"不可收缩",
                        theme:$Theme.BLUE,
                        help:"内容1",
                        brief:"摘要1",
                        collapsible:false,
                        disabled:true,
                        totalColumnNum:4,
                        fields:[{
                            label:"文本1",
                            name:"text",
                            value:"asdfasf",
                            editorType:$Component.TEXTEDITOR,
                            //className:"col col-6",
                        },{
                            label:"文本1",
                            name:"text",
                            value:"asdfasf",
                            editorType:$Component.TEXTEDITOR,
                            //className:"col col-6",
                        },{
                            label:"文本1",
                            name:"text",
                            value:"asdfasf",
                            editorType:$Component.TEXTEDITOR,
                            //className:"col col-6",
                        },{
                            label:"文本1",
                            name:"text",
                            value:"asdfasf",
                            editorType:$Component.TEXTEDITOR,
                            //className:"col col-6",
                        },{
                            label:"密码",
                            name:"password",
                            editorType:$Component.TEXTEDITOR,
                            value:"asdfasf",
                            textMode:"password"
                        },{
                            label:"时间",
                            name:"datetime",
                            editorType:$Component.DATETIMEEDITOR,
                            //className:"col col-md-6 ",
                            colspan:2
                        },{
                            label:"日期",
                            name:"date",
                            editorType:$Component.DATEEDITOR,
                            //className:"col col-6",
                            colspan:4
                        },{
                            label:"touchSpin",
                            name:"touchSpin",
                            editorType:$Component.TOUCHSPINEDITOR,
                            colspan:3
                        },{
                            label:"touchSpin",
                            name:"touchSpin",
                            editorType:$Component.TOUCHSPINEDITOR,
                            colspan:1
                        },{
                            label:"SwitchEditor",
                            name:"switchEditor",
                            editorType:$Component.SWITCHEDITOR,
                            colspan:1
                        }]
                    }
                });
            },
            onrender:function(){
                console.info("?>>>>");
            }



        });
        return view;
    });
