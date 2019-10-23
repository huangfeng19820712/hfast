/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-4-21
 * Time: 下午11:42
 * To change this template use File | Settings | File Templates.
 */
define([
    "core/js/SinglePageApplication",
    "lib/hyfast-unify/header",
    CONFIG.currentModuleName+"/view/designer/CodeDesigner",
    "lib/hyfast-unify/breadcrumbs",
    "web/view/login",
    "lib/hyfast-unify/footer",
    "back-to-top","core/js/interval/Interval",
    "bootstrap",
    "jquery.migrate",
    "smoothScroll","backbone.super"
], function ( SinglePageApplication,Header,
              CodeDesigner,Breadcrumbs, Login, Footer,
             Scrolltotop,Interval) {
    var app = SinglePageApplication.extend({
        header: null,
        breadcrumbs: null,
        footer: null,
        main: null,
        $INIT: "/"+ CONFIG.appName+"/menu.json",
        interval:null,
        intervalMemberInfo:null,
        run: function () {
            this._super();
            //加载路由器，并启动Backbone路由监听
            var applicationContext = this.getApplicationContext();
            var ajaxClient = applicationContext.getAjaxClient();
            var defaultMenuDates, menuDates ;
            var that = this;
            ajaxClient.buildClientRequest(this.$INIT)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        applicationContext.serviceConf = obj.globalConf;
                        defaultMenuDates = obj.menus;
                        menuDates = obj.menus;
                        applicationContext.setAuthenticated(obj.authenticated);
                        applicationContext.setSessionUser(obj);
                        that.render(defaultMenuDates,menuDates);
                    }
                }, true);

            //启动路由
        },
        render:function(defaultMenuDates,menuDates){
            var applicationContext = this.getApplicationContext();
            var el = $("#application");
            /*var menus = this.getMenus(menuDates);
            this.header = new NavigationBar({
                $container:el,
                items:[{
                    comXtype:$Component.NAVIGATION,
                    comConf:{
                        data:menus
                    }
                }]
            });*/
            this.header = new Header({el: el,defaultMenuDates:defaultMenuDates, menuDates: menuDates});
            //添加面包屑的div
            el.append("<div id='breadcrumbs'></div>");
            this.breadcrumbs = new Breadcrumbs({el: el.find("#breadcrumbs")});
            el.append("<div id='main'></div>");
            //this.main = new Login({el: el.find("#main")});

            this.footer = new Footer({el: $("body")});
            //需要现有footer，borderlayout需要估算footer对象的高
            this.main = new CodeDesigner({
                $container: el.find("#main"),
                $bottomReferent: $(".copyright").eq(0),
                jsPath:"/demo/index.js"
            });
            this.main.trigger("show");
            this.mainRegionEl = "#"+this.main.getCenterRegion().id;
            applicationContext.setMainRegionEl(this.mainRegionEl);
            Scrolltotop.init();
            this.setApplicationContext();
            this.interval =new Interval()
            this.interval.run();
            //如果登录成功，则执行登录成功后的业务
            if(applicationContext.isAuthenticated()){
                this.loginSuc();
            }
        },
        loginSuc:function(){
            //登录成功后，框架需要做的业务
            //更新header的相关信息
            this.header.loginSuc();
        },
        setApplicationContext: function () {
            var applicationContext = this.getApplicationContext();
            applicationContext.setApplication(this);

        },
        getHeader: function () {
            return this.header;
        },
        getFooter: function () {
            return this.footer;
        },
        getBreadcrumbs: function () {
            return this.breadcrumbs;
        },
        getMenu: function () {
            return this.getHeader().getMenu();
        },
        getMain:function(){
            return this.main;
        }
    });

    return app;
});