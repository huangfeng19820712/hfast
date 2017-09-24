/**
 * @author:   * @date: 15-8-17
 */

define(["core/js/base/BaseView",
        "backbone", "lib/hyfast-unify/menu",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils",
        "text!lib/hyfast-unify/tmpl/header.html",
        "core/js/editors/AutoCompleteEditor",
        "jquery.counterup"],
    function (BaseView, Backbone, Menu,
              ApplicationContext,
              ApplicationUtils,
              temple, AutoCompleteEditor) {

        var content = temple;
        var View = BaseView.extend({
            menu: null,
            $LOGOUT: "/AppAuthentication!logout.action",
            ajaxClient: ApplicationContext.getAjaxClient(),
            intervalName: "memberData",
            events: {
                "click a.login": "showLogin",
                "click a.logout": "logout",
                "click button.seachMenu": "seachMenu"
            },
            searchInput: null,
            initialize: function (options) {
                this.render();
                var menuEl = $(".navbar-nav");
                this.menu = new Menu({
                    el: menuEl,
                    defaultMenuDates: options.defaultMenuDates,
                    menuDates: options.menuDates
                });
                this.loginLogout();
                this.initSearchInput();
            },
            render: function (container, triggerEvent) {
                this.$el.append(content);
            },
            /**
             * 初始化查询菜单输入框
             */
            initSearchInput: function () {
                var data = this.menu.menuDates;
                this.searchInput = new AutoCompleteEditor({
                    $container: this.$(".search-group"),
                    amountModel: $cons.mount.Model.prepend,
                    source: data,
                    placeholder: '查询菜单',
                    itemId:"id",
                    itemLabel:"name"
                });
                this.handleSearch();
                this.handleSearchV1();
                this.handleSearchV2();
            },
            getMenu: function () {
                return this.menu;
            },
            /**
             * 修改用户的金额
             * @param money
             */
            updateMoney: function (money) {
                var money = "您的账号金额：<span style='font-size: 25px' class='badge badge-blue rounded-2x'>￥<span class='counter'>" + money + "</span></span>";
                this.$("#userMoney").html(money);
                this.$(".counter").counterUp({
                    delay: 10,
                    time: 1000
                });
            },
            clearMoney: function () {
                this.$("#userMoney").empty();
            },
            showLogin: function () {
                //显示登录的页面
            },
            logout: function (e) {
                e.preventDefault();
                var that = this;
                this.ajaxClient.buildClientRequest(this.$LOGOUT)
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        ApplicationContext.setAuthenticated(false);
                        //跳转到首页
                        that.loginLogout();
                        //还原初始化的菜单
                        that.menu.resetMenu();
                        //停止定时器
                        that.stopInterValue();
                        //清楚金额
                        that.clearMoney();
                        ApplicationUtils.nav("login");
                    });
            },
            /**
             * 显示登录或者显示退出
             * @param authenticated
             */
            loginLogout: function () {
                var authenticated = ApplicationContext.isAuthenticated()
                if (authenticated) {
                    $("a.login").hide();
                    $("a.logout").show();
                } else {
                    $("a.login").show();
                    $("a.logout").hide();
                }

            },
            loginSuc: function () {
                var sessionUser = ApplicationUtils.getApplicationContext().getSessionUser();
                if (sessionUser.userData && sessionUser.userData.money) {
                    this.updateMoney(sessionUser.userData.money);
                }
                this.interval();
            },
            interval: function () {
                var application = ApplicationUtils.getApplicationContext().getApplication();
                if (application.intervalMemberInfo) {
                    application.intervalMemberInfo.addCallBack({
                        id: this.intervalName,
                        fun: this.intervalHandle,
                        context: this
                    });
                }
            },
            intervalHandle: function (memberData) {
                if (memberData && memberData.money) {
                    this.updateMoney(memberData.money);
                }
            },
            stopInterValue: function () {
                var application = ApplicationUtils.getApplicationContext().getApplication();
                if(application.intervalMemberInfo){
                    application.intervalMemberInfo.removeCallBack(this.intervalName);
                }
            },
            onclose: function () {
                this.stopInterValue();
            },
            /**
             * 跳转到菜单
             * @param event
             */
            seachMenu: function (event) {
                var value = this.searchInput.getValue();
                var valueObject = this.searchInput.getValueObject();
                var url = valueObject.url;
                if(url){
                    ApplicationUtils.nav(url);
                    this.$(".search-btn").click();
                }
            },
            //Search Box (Header)
            handleSearch: function () {
                jQuery('.search').click(function () {
                    if (jQuery('.search-btn').hasClass('fa-search')) {
                        jQuery('.search-open').fadeIn(500);
                        jQuery('.search-btn').removeClass('fa-search');
                        jQuery('.search-btn').addClass('fa-times');
                    } else {
                        jQuery('.search-open').fadeOut(500);
                        jQuery('.search-btn').addClass('fa-search');
                        jQuery('.search-btn').removeClass('fa-times');
                    }
                });
            },
            //Search Box v1 (Header v5)
            handleSearchV1: function () {
                jQuery('.header-v5 .search-button').click(function () {
                    jQuery('.header-v5 .search-open').slideDown();
                });

                jQuery('.header-v5 .search-close').click(function () {
                    jQuery('.header-v5 .search-open').slideUp();
                });

                jQuery(window).scroll(function () {
                    if (jQuery(this).scrollTop() > 1) jQuery('.header-v5 .search-open').fadeOut('fast');
                });
            },
            // Search Box v2 (Header v8)
            handleSearchV2: function () {
                $(".blog-topbar .search-btn").on("click", function () {
                    if (jQuery(".topbar-search-block").hasClass("topbar-search-visible")) {
                        jQuery(".topbar-search-block").slideUp();
                        jQuery(".topbar-search-block").removeClass("topbar-search-visible");
                    } else {
                        jQuery(".topbar-search-block").slideDown();
                        jQuery(".topbar-search-block").addClass("topbar-search-visible");
                    }
                });
                $(".blog-topbar .search-close").on("click", function () {
                    jQuery(".topbar-search-block").slideUp();
                    jQuery(".topbar-search-block").removeClass("topbar-search-visible");
                });
                jQuery(window).scroll(function () {
                    jQuery(".topbar-search-block").slideUp();
                    jQuery(".topbar-search-block").removeClass("topbar-search-visible");
                });
            }

        });
        return View;
    });