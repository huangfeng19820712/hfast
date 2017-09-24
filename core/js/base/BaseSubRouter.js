/**
 * @module 子路由的基类[BaseSubRouter]
 * @description 子路由的基类
 * @example #foo/abc?me.fname=Joe&me.lname=Hudson -> myRoute('abc', {'me': {'fname': 'Joe', 'lname': 'Hudson'}} )
 * #foo/abc?animals=cat|dog -> myRoute( 'abc', ['cat', 'dog'] )
 * #foo/abc?animals=|cat -> myRoute( 'abc', ['cat'] )
 *
 * @author:
 * @date: 2013-09-16 下午4:50
 */
define(["core/js/utils/ApplicationUtils",
    "backbone.subroute"
], function (ApplicationUtil) {
    var BaseSubRouter = Backbone.SubRoute.extend({
        /**
         * 动态加载页面
         * @param viewUrl  基于requirejs指定的基础路径的View的URL
         * @param options  构建视图的参数
         * @param region   显示的区域
         */
        show: function (viewUrl, options, region) {
            //界面的显示最终都会跟区域有关，如果外部设置了当前URL关联的区域，那么就使用该区域，但用完后立即清除
            region = region || ApplicationUtil.getUrlRelatedRegion();
            this.getMainRegion(region).show(viewUrl, options);
            ApplicationUtil.clearUrlRelatedRegion();
        },
        showException: function (message) {
            this.getMainRegion().showException(message);
        },
        getTargetRegion: function () {
            var region = ApplicationUtil.getUrlRelatedRegion();
            ApplicationUtil.clearUrlRelatedRegion();
            return this.getMainRegion(region);
        },
        getMainRegion: function (mainRegion) {
            return ApplicationUtil.getMainRegion(mainRegion);
        },
        getApplicationRegion: function (applicationRegion) {
            return ApplicationUtil.getApplicationRegion(applicationRegion);
        },
        refresh: function () {
            var _tmp = Backbone.history.fragment;
            this.navigate(_tmp + (new Date).getTime());
            this.navigate(_tmp, { trigger: true });
        },
        getApplicationContext: function () {
            return ApplicationUtil.getApplicationContext();
        },
        getApplicationUtil: function () {
            return ApplicationUtil;
        },
        getApplicationRouterFilter: function () {
            return this.getApplicationContext().getApplicationRouterFilter();
        },
        /**
         * 拦截路由，进行路由执行之前的处理，进行统一的登录验证，如果尚未登录，就跳转到登录界面进行登录
         * @param route
         * @param params
         */
        before: function (route, params) {
            return this.getApplicationContext().getApplicationRouterFilter().before(route, params);
        },
        /**
         * 拦截路由，进行路由执行成功后的处理
         * @param route
         * @param params
         */
        after: function (route, params) {
            return this.getApplicationContext().getApplicationRouterFilter().after(route, params);
        },
        faultAction: function (actions) {
            this.showException("无效的请求[" + actions + "]");
        }
    });

    return BaseSubRouter;
});