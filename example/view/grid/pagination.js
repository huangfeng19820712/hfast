/**
 * @author:   * @date: 2016/3/30
 */
define([
        "backbone",
        "core/js/layout/FluidLayout"],
    function (Backbone, FluidLayout) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: [{
                comXtype:$Component.PAGINATION,
                comConf:{
                    totalPage:10
                }
            }]
        });
        return view;
    });
