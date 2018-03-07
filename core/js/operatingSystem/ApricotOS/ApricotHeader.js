/**
 * @author:
 * @date: 15-5-21
 */
define(["core/js/controls/AbstractControlView",
        "text!core/js/operatingSystem/ApricotOS/tmpl/ApricotHeader.html",
        "core/js/context/ApplicationContext","core/js/utils/ApplicationUtils",
        "core/js/operatingSystem/ApricotOS/js/newsticker/jquery.newsTicker",
        "core/js/operatingSystem/ApricotOS/js/clock/jquery.clock",
        "css!core/js/operatingSystem/ApricotOS/css/maki-icons.css"],
    function (AbstractControlView, Template,ApplicationContext,ApplicationUtils) {
        var View = AbstractControlView.extend({
            xtype: $ApricotCons.xtype.HEADER,
            $LOGOUT:"/AppAuthentication!logout.action",
            ajaxClient:ApplicationContext.getAjaxClient(),
            $container: null,
            menu:null,
            template:Template,
            dataPre:"data",
            onSearch:null,
            events:{
                "click a.logout":"logout",
            },
            bodyBackgroundClass:"bodyBackground4",
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
            },/*
            initializeHandle: function (options) {
                this.topViews = options.topViews;
                this.data = {user:ApplicationContext.getSessionUser().user};
            },*/
            mountContent: function () {
                this._super();
                this.setBackground(this.bodyBackgroundClass);
                var nt_title = $('#nt-title').newsTicker({
                    row_height: 18,
                    max_rows: 1,
                    duration: 5000,
                    pauseOnHover: 0
                });
                $('#digital-clock').clock({
                    offset: '+5',
                    type: 'digital'
                });
                this.setDate(new Date());
                var that = this;
                $(".button-bg").on("click",function(event) {
                    var bgImg = $(event.target).data("bgimg");
                    that.setBackground(bgImg);
                });
            },
            setDate:function(date){
                var monthNames = ["1月", "2月", "3月", "4月", "5月", "6月",
                    "7月", "8月", "9月", "10月", "11月", "12月"
                ];
                var dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]

                var newDate = date;
                newDate.setDate(newDate.getDate() + 1);
                this.$("#dateLabel").html( newDate.getFullYear()+"年"+monthNames[newDate.getMonth()]
                    +newDate.getDate()+"日"+" "+dayNames[newDate.getDay()] );
            },
            setBackground:function(bgImg){
                $("body").removeClass(this.bodyBackgroundClass);
                this.bodyBackgroundClass = bgImg;
                $("body").addClass(this.bodyBackgroundClass);

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