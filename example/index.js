/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-4-21
 * Time: 下午11:42
 * To change this template use File | Settings | File Templates.
 */
define([
        "core/js/SinglePageApplication",
        $Component.NAVIGATIONBAR.src,
        //必须先加载BaseView对象，不然后续BaseView的子类会显示不出来
        "core/js/base/BaseView"
    ], function ( SinglePageApplication,
                  NavigationBar) {
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
            //var applicationContext = this.getApplicationContext();
            var el = $("#application");
            var menus = this.getMenus(menuDates);
            this.header = new NavigationBar({
                $container:el,
                items:[{
                    comXtype:$Component.NAVIGATION,
                    comConf:{
                        data:menus
                    }
                }]
            });
            el.append("<div id='main'></div>");
            this.setApplicationContext();
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
        /**
         *
         * @param menuDates
         * @returns {Array}
         * <code>
         * [{
             *      code:"<必选>[唯一编码，单应用中的路由使用]"，
             *      id:"<必选>[唯一编码]"，
             *      name:"<必选>[显示的名称]"，
             *      order:"<可选>[排序使用]"，
             *      subMenu:"<可选>[子菜单]"，
             *      type:"<必选>[菜单的类型]"，
             *      url:"<可选>[菜单路径]"，
             *      visiable:"<可选>[是否要显示]"
             * },...]
         * </code>
         */
        getMenus: function (menuDates) {
            //过滤掉不可见的菜单
            menuDates = _.where(menuDates,{visible:'1'});

            var menus = {};
            var noDealIds = new Array();
            _.each(menuDates, function (menuDate, key, list) {
                menus[menuDate.id] = menuDate;
                menus[menuDate.id].subMenu = null;
                //设置label的值
                menus[menuDate.id].label = menus[menuDate.id].name;
                if (menuDate.pid != null) {
                    var menu = menus[menuDate.pid];
                    if (menu != null) {
                        if(menu.subMenu==null){

                            menu.subMenu = new Array();
                        }
                        menu.subMenu.push(menus[menuDate.id]);
                    } else {
                        noDealIds.push(menuDate.id);
                    }
                }
            });
            /**
             * 处理之前未处理的菜单数据
             */
            for (var i = 0; i < noDealIds.length; i++) {
                var id = noDealIds[i];
                var pid = menus[id].pid;
                if($.isNotBank(pid)&&menus[pid]){
                    //pid非空
                    if (!menus[pid].subMenu) {
                        menus[pid].subMenu = new Array();
                    }
                    menus[pid].subMenu.push(menus[id]);
                }
            }
            /**
             * 获取，pid为空的菜单
             */
            var doneMenus = new Array();
            for (var i in menus) {
                if (!menus[i].pid) {
                    doneMenus.push(menus[i]);
                }
            }
            return doneMenus;
        },
    });

    return app;
});