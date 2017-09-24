/**
 * @author:   * @date: 2015/12/7
 */
define([
        "core/js/layout/Panel",
        "core/js/layout/FluidLayout",
        "core/js/editors/TextEditor",
        "core/js/windows/Window"],
    function (Panel,FluidLayout, TextEditor, Window) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                this.items = [{
                    comXtype:$Component.PANEL,
                    comRef:new Panel({
                        title:"有按钮的",
                        help:"有按钮的",
                        brief:"有按钮的",
                        mainRegion:{
                            comXtype:$Component.DATETIMEEDITOR,
                            comConf:{
                                readOnly:true,
                                disabled:false,
                                value:"2017-01-02 15:12",
                            }
                        }
                    })
                },{
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"表单-",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.DATETIMEEDITOR,
                            comConf:{
                                readOnly:true,
                                disabled:false,
                                value:"2017-01-02 15:12",
                                mode:$cons.DateEditorMode.INPUT,
                            }
                        }
                    }
                }];

            }
        });

        return view;
    });
