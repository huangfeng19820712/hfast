/**
 * @author:   * @date: 2015/9/23
 */

define(["core/js/base/BaseView","text!lib/hyfast-kingadmin/tmpl/slideBar.html","backbone"],function (BaseView,temple,Backbone) {
    var content = temple;
    var View = BaseView.extend({
        xtype:$KingCons.xtype.TABLE,
        $container:null,
        initialize: function (options) {
            this.topViews = options.topViews;

        },
        render:function(){

        },
    });

    return View;
});