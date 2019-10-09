/**
 * @author:   * @date: 2015/9/20
 */
define([
    "core/js/ApplicationRouterFilter" ,
    "core/js/utils/ApplicationUtils",
    CONFIG.currentModuleName+"/view/designer/CodePanel"
], function (ApplicationRouterFilter,ApplicationUtils,CodePanel) {
    var filter = ApplicationRouterFilter.extend({
        preventAccessWhenAuth: ['#simpleForm'],
        after:function(route, params){
            this._super(route, params);
            //处理面包屑
            var application = ApplicationUtils.getApplicationContext().getApplication();
            var breadcrumbs = application.getBreadcrumbs();
            if(breadcrumbs){
                breadcrumbs.setBreadcrumbsByCode(Backbone.history.fragment);
            }

            var main = application.getMain();

            if(main&&main.getWestRegion){
                var basePath = CONFIG.currentModuleName+"/view/";
                main.getWestRegion().show(new CodePanel({jsPath:basePath+Backbone.history.fragment}));
            }

            return true;
        }
    });
    return filter;
});