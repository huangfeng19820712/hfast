/**
 * @author:
 * @date: 15-5-21
 */
define(["core/js/controls/Control",
    "backbone", "text!lib/hyfast-kingadmin/tmpl/topBar.html",
        "core/js/context/ApplicationContext","core/js/utils/ApplicationUtils",],
    function (Control, Backbone, temple,ApplicationContext,ApplicationUtils) {
        var View = Control.extend({
            xtype: $KingCons.xtype.HEADER,
            $LOGOUT:"/AppAuthentication/logout.action",
            ajaxClient:ApplicationContext.getAjaxClient(),
            $container: null,
            menu:null,
            template:temple,
            dataPre:"data",
            onSearch:null,
            events:{
                "click a.logout":"logout",
            },
            search:function(triggerEvent){

            },
            /**
             * 注册按钮的点击事件
             * @param isActive  是否激活，如果为true则注册，若果为false则删除
             * @private
             */
            _registerSearchButtonClickEvent:function(isActive){
                var btnEl = null;
                btnEl.off("click"); //删除元素本身自带的单击事件
                if(isAcive==null){
                    isActive= true;

                }
                if(isActive){
                    btnEl.on("click",function(e){

                    });
                }
            },
            initializeHandle: function (options) {
                this.topViews = options.topViews;
                this.data = {user:ApplicationContext.getSessionUser().user};
            },
            mountContent: function () {
                var content = _.template(temple,{variable: this.dataPre})(this.data);
                this.$el.prepend(content);
            },
            getMenu:function(){
                return this.menu;
            },
            showLogin:function(){
                //显示登录的页面
            },
            logout:function(e){
                e.preventDefault();
                var that = this;
                this.ajaxClient.buildClientRequest(this.$LOGOUT)
                    .post(function(compositeResponse){
                        var obj = compositeResponse.getSuccessResponse();
                        ApplicationContext.setAuthenticated(false);
                        //跳转到首页
                        that.loginLogout();
                        var application = ApplicationContext.getApplication();
                        //还原初始化的菜单
                        application.getMenu().resetMenu();
                        ApplicationUtils.nav("login");
                    });
            },
            /**
             * 显示登录或者显示退出
             * @param authenticated
             */
            loginLogout:function(){
                var authenticated = ApplicationContext.isAuthenticated()
                if(authenticated){
                    $("a.login").hide();
                    $("a.logout").show();
                }else{
                    $("a.login").show();
                    $("a.logout").hide();
                }

            }
        });

        return View;
    });