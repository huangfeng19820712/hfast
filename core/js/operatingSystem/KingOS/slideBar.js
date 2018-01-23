/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-5-11
 * Time: 下午4:27
 * To change this template use File | Settings | File Templates.
 */
define(["core/js/base/BaseView","text!lib/hyfast-kingadmin/tmpl/slideBar.html","backbone"],function (BaseView,temple,Backbone) {
    var content = temple;
    var View = BaseView.extend({
        xtype:$KingCons.xtype.SLIDEBAR,
        $container:null,
        /**
         * 放在顶部的视图
         */
        topViews:[],
        /**
         * 放在底部的视图
         */
        bottomViews:[],
        initialize: function (options) {
            this.topViews = options.topViews;
        },
        render:function(){
            this.$el.prepend(content);
            this.$container = this.$el.find('.left-sidebar');
            var that = this;
            _.each(this.topViews,function(item){
                if(item){
                    item.setElement(that.$container);
                    item.render();
                }
            });
        },
    });

    return View;
});