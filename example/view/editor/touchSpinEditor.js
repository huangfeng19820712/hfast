/**
 * @author:   * @date: 2016/2/26
 */
define([
        "core/js/layout/Panel",
        "core/js/layout/FluidLayout",
        "core/js/editors/TouchSpinEditor"],
    function (Panel,FluidLayout, TouchSpinEditor) {
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
                            comXtype:$Component.TOUCHSPINEDITOR,
                            comConf:{
                                decimals:2,
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
                            comXtype:$Component.TOUCHSPINEDITOR,
                            comConf:{
                                decimals:2,
                                displayButtons:true,
                            }
                        }
                    }
                }];

            }
        });
        return view;
    });