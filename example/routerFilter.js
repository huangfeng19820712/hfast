/**
 * @author:   * @date: 2015/9/20
 */
define(["jquery",
    "core/js/ApplicationRouterFilter" ,"core/js/utils/ApplicationUtils",
], function ($, ApplicationRouterFilter,ApplicationUtils) {
    var filter = ApplicationRouterFilter.extend({
        after:function(route, params){
            this._super(route, params);
            //处理面包屑
            var application = ApplicationUtils.getApplicationContext().getApplication();
            /*var breadcrumbs = application.getBreadcrumbs();
            breadcrumbs.setBreadcrumbsByCode(Backbone.history.fragment);*/
            return true;
        }
    });
    return filter;
});