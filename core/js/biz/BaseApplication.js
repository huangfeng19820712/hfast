/**
 * @author:   * @date: 2015/9/22
 */

define([
    "core/js/SinglePageApplication",
    "core/js/utils/ApplicationUtils"
], function (SinglePageApplication, ApplicationUtils) {

    var app = SinglePageApplication.extend({
        header: null,
        breadcrumbs: null,
        footer: null,
        main: null,
        $INIT: "/App/init.action",
        run: function () {
            this._super();
            //加载路由器，并启动Backbone路由监听
            var applicationContext = ApplicationUtils.getApplicationContext();
            var ajaxClient = applicationContext.getAjaxClient();
            var defaultMenuDates, menuDates;
            var that =this;
            ajaxClient.buildClientRequest(this.$INIT)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        applicationContext.setServiceConf(obj.globalConf);
                        applicationContext.setAuthenticated(obj.authenticated);
                        applicationContext.setSessionUser(obj);
                        if(obj.authenticated){
                            that.initData(obj);
                        }
                    }
                }, false);
            var el = $("#application");
            this.setApplicationContext();
        },
        setApplicationContext: function () {
            var applicationContext = ApplicationUtils.getApplicationContext();
            applicationContext.setApplication(this);

        },
        setHeader:function(header){
            this.header = header;
        },
        getHeader: function () {
            return this.header;
        },
        setFooter:function(footer){
            this.footer = footer;

        },
        getFooter: function () {
            return this.footer;
        },
        setBreadcrumbs:function(breadcrumbs){
            this.breadcrumbs = breadcrumbs;
        },
        getBreadcrumbs: function () {
            return this.breadcrumbs;
        },

        getMenu: function () {
            return this.menu;

        },
        setMenu:function(menu){
            this.menu = menu;
        }
    });

    return app;
});