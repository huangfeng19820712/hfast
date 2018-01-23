/**
 * @author:   * @date: 2017/1/30
 */
define(["core/js/layout/Container",
    "core/js/context/ApplicationContext",
    "lib/hyfast-unify/header",
    "lib/hyfast-unify/breadcrumbs",
    "lib/hyfast-unify/footer",
    "back-to-top",
    "bootstrap",
    "jquery.migrate",
    "smoothScroll",
    "backbone.super"
], function (Container,
             ApplicationContext,
             Header,
             Breadcrumbs,
             Footer, Scrolltotop) {
    var OWFrame = Container.extend({
        defaultMenuDates:null,
        menuDates:null,
        initUrl:null,
        initialize: function (options, triggerEvent) {
            this._super(options,false);
            var ajaxClient = applicationContext.getAjaxClient();
            var that = this;
            ajaxClient.buildClientRequest(this.initUrl)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        applicationContext.serviceConf = obj.globalConf;
                        that.defaultMenuDates = obj.menus;
                        that.menuDates = obj.menus;
                        applicationContext.setAuthenticated(obj.authenticated);
                        applicationContext.setSessionUser(obj);

                    }
                }, false);
            this.afterInitializeHandle(options, triggerEvent);
        },
        mountContent:function(triggerEvent){
            //var el = this.$("#application");
            this.header = new Header({el: this.el,defaultMenuDates:this.defaultMenuDates, menuDates:this.menuDates});
            //添加面包屑的div
            el.append("<div id='breadcrumbs'></div>");
            this.breadcrumbs = new Breadcrumbs({el: this.el.find("#breadcrumbs")});
            el.append("<div id='main'></div>");
            //this.main = new Login({el: el.find("#main")});
            //this.footer = new Footer({el: $("body")});
            //Scrolltotop.init();
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
        }
    });
    return OWFrame;
});
