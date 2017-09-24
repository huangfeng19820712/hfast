/**
 * @author:   * @date: 2016/3/20
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/layout/FluidLayout", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/view/Region"],
    function (BaseView, Backbone, FluidLayout, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,Region) {
        var view = FluidLayout.extend({
            oninitialized:function(){
                this.items = [];
                var that = this;
                this.items.push({
                    columnSize: $Column.COL_MD_4,
                    comXtype:$Component.ITEM,
                    comConf:{
                    }
                });
            },
        });
        return view;
    });

