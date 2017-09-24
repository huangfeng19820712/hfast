/**
 * @author:   * @date: 2015/12/7
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/layout/Panel",
        "core/js/editors/TextEditor",
        "core/js/windows/Window"],
    function (FluidLayout,Panel, TextEditor, Window) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems:function(){
                this.items = [{
                    comXtype:$Component.PANEL,
                    comRef:new Panel({
                        title:"表单-",
                        help:"内容",
                        brief:"摘要",
                        mainRegion:{
                            comXtype:$Component.DATEEDITOR,
                            comConf:{
                                label:"时间",
                                readOnly:true,
                                disabled:false,
                                onchangeDate:function(value){
                                    console.info(">>>"+value);
                                }
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
                            comXtype:$Component.DATEEDITOR,
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
