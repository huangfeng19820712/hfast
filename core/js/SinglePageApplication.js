/**
 * @module 应用初始化[SinglePageApplication]
 * @description 应用初始化
 * 注意：require|underscore|backbone这些属于全局性的，是系统必须依赖的，在系统入口处统一引入，后续的代码中即便有依赖也不需要额外再引入，保证唯一性及较好的系统性能
 *
 * @author:
 * @date: 2014-04-30 下午1:03
 */
define([
    "backbone",
    "core/js/Application",
    "core/js/utils/ApplicationUtils",
    "core/js/FrameworkConfAccessor",
    "core/js/CommonConstant",
    "backbone.routefilter",
    "core/js/windows/Window",
    "css!core/resources/styles/core.css",
    "css!core/resources/styles/theme.css"
], function (Backbone, Application, ApplicationUtils, FrameworkConfAccessor,CommonConstant) {
    $.expr.cacheLength = 0;   //设置jquery中选择器的缓存数为0，默认jquery是缓存数50，如果不设置为0，那么就会缓存已经销毁的对象，从而导致内存飙升 add by 2014.11.10

    //在此可以进行应用的初始化操作
    var SinglePageApplication = Application.extend({
        /**
         * [可选]{String}应用系统的整个应用的工作区对应的元素
         * @default #application
         */
        applicationRegionEl: null,
        /**
         * [可选]{String}应用系统的整个应用的工作区中住区域对应的元素
         * @default #main
         */
        mainRegionEl: null,
        /**
         * [可选]{boolean}是否演出启动路由，如果设置成true，则不马上执行启动路由，如果设置false需要手动设置路由
         */
        lazyRouter:false,

        /**
         * 启动应用
         */
        run: function () {
            this._super();

            //加载路由器与路由过滤器，并启动Backbone路由监听
            var applicationRouterUrl = FrameworkConfAccessor.getApplicationRouterFilterUrl()||"core/js/ApplicationRouterFilter";
            var that = this;

            require([FrameworkConfAccessor.getApplicationRouterUrl(),applicationRouterUrl], function (ApplicationRouter,ApplicationRouterFilter) {
                var applicationContext = ApplicationUtils.getApplicationContext();
                //必须要先加载此模块，因为后面会使用在此模块
                applicationContext.setApplicationRouterFilter(that._getApplicationRouterFilter());  //设置应用的路由过滤器
                that.initApplicationRouter(ApplicationRouter);
                that.afterInitApplicationRouter();
            });
        },
        /**
         * 设置应用的路由
         * @param ApplicationRouter
         * @param ApplicationRouterFilter
         */
        initApplicationRouter:function(ApplicationRouter){
            var applicationContext = ApplicationUtils.getApplicationContext();
            var applicationRouter = new ApplicationRouter();
            applicationContext.setApplicationRouter(new ApplicationRouter());   //设置全局路由  add by 2014.11.06
            if(!this.lazyRouter){
                applicationRouter.start();
            }
        },
        /**
         * 初始化应用路由后调用的方法
         */
        afterInitApplicationRouter:function(){

        },
        /**
         * 把服务端中的菜单信息添加到router，以便校验路径的有效性
         * 1.登陆后，需要把菜单添加到路由器中
         * 2.如果已经登陆，则刷新页面时就需要把菜单的内容添加到路由器中
         */
        addMenuToRouter:function(){
            //设置菜单到路由ApplicationRouter
            var applicationContext = ApplicationUtils.getApplicationContext();
            var applicationRouter = applicationContext.getApplicationRouter();
            var menu = this.getMenu();
            var menuDates = menu.menuDates;
            var validAction = [];
            for (var i in menuDates) {
                var menuDate = menuDates[i];
                if (menuDate.url != null) {
                    validAction.push(menuDate.url);
                }
            }
            applicationRouter.setServerValidAction(validAction);
        },

        initialize: function () {
            this._initApplicationContext();   //初始化应用上下文信息
            this._bindDocumentEvent();        //绑定文档级的全局事件 add by 2014.09.09
            this._initApplicationSpacing();   //初始化应用的间距 add by 2014.09.17

            this._super();
        },
        applicationDidFinishLaunching: function () {
            return true;
        },
        /**
         * 初始化应用的间距
         * @private
         */
        _initApplicationSpacing: function () {
            var spacing = FrameworkConfAccessor.getProjectSpacing();
            if (!(spacing === null || spacing === "")) {
                CommonConstant.Spacing.DEFAULT = spacing;  //这里直接改变常量的值
            }
        },
        /**
         * 初始化应用上下文信息
         * @private
         */
        _initApplicationContext: function () {
            var ApplicationContext = this.getApplicationContext();
            //如果应用上下文已经初始化完成，就不再进行初始化
            if (ApplicationContext.isInitialized())
                return;
            //ApplicationContext.setApplicationName(FrameworkConfAccessor.getAppName());         //设置该应用的名称

            ApplicationContext.setApplicationRegionEl(this._getApplicationRegionEl()); //设置系统整个应用的工作区，全局唯一
            ApplicationContext.setMainRegionEl(this._getMainRegionEl());               //设置应用的主工作区
            ApplicationContext.setIFramePageMode(FrameworkConfAccessor.isIFramePageMode());  //页面的渲染模式是否基于iframe

            //this._registerRopClient(ApplicationContext);  //注册Rop客户端

            ApplicationContext.setInitialized(true);    //标识应用上下文已经初始化完成
        },
        _registerRopClient: function (ApplicationContext) {
            var ropClient = ApplicationContext.getRopClient();
            if (ropClient != null)
                return;

            var serverUrl = FrameworkConfAccessor.getRopServerUrl() || ApplicationContext.WEB_CONTEXT_PATH + "/router";
            var appKey = FrameworkConfAccessor.getRopAppKey();
            var appSecret = FrameworkConfAccessor.getRopAppSecret();

            ropClient = new RopClient(serverUrl, appKey, appSecret);

            ApplicationContext.setRopClient(ropClient);
        },
        /**
         * 绑定文档级的全局事件，屏蔽一些按键功能
         * @private
         */
        _bindDocumentEvent: function () {
            $(document).keydown(function (event) {
                var ev = document.all ? window.event : arguments[0] ? arguments[0]: event;
                //屏蔽ALT+方向键前进或后退网页
                if ((ev.altKey) && ((ev.keyCode == 37) || (ev.keyCode == 39))) {
                    if (event && event.preventDefault)
                        event.preventDefault();
                }
                //F5：event.keyCode==116；  Ctrl+R：event.ctrlKey && event.keyCode==82
                //屏蔽退格删除键
                if (event.keyCode == 8) {
                    var el = event.target || event.srcElement; //获取事件源
                    var elType = el.type || el.getAttribute('type'); //获取事件源类型
                    //获取作为判断条件的事件类型
                    var isReadOnly = el.readOnly;
                    var isDisabled = el.disabled;

                    //针对于只读的可输入编辑器和不可输入的编辑器，屏蔽退格删除键
                    if ((isReadOnly || isDisabled) && (elType == "password" || elType == "text" || elType == "textarea")
                        || (elType != "password" && elType != "text" && elType != "textarea")) {
                        //屏蔽退格删除键
                        if (event && event.preventDefault)
                            event.preventDefault();
                    }
                }
            });
        },
        _getApplicationRouterFilter: function () {
            var applicationRouterFilterConfig = FrameworkConfAccessor.getApplicationRouterFilterConf();
            var result = null;
            if(applicationRouterFilterConfig){
                result = SinglePageApplication.createApplicationRouterFilter(applicationRouterFilterConfig);
            }

            if(!result){

                var applicationRouterFilter = FrameworkConfAccessor.getApplicationRouterFilterUrl();
                if(applicationRouterFilter){
                    var RouterFilter = require(applicationRouterFilter);
                    result = new RouterFilter();
                } else{
                    //Todo 需要添加默认的路由过滤器
                    result = new ApplicationRouterFilter();
                }
            }
            return result;
        },
        _getApplicationRegionEl: function () {
            return this.applicationRegionEl || "#application";
        },
        _getMainRegionEl: function () {
            return this.mainRegionEl || "#main";
        },
        /**
         * 登陆成功后，需要处理的业务
         */
        loginSuc: function () {

        },
        /**
         * 服务端退出后，需要处理的前端业务
         */
        logoutSuc:function(){

        }
    });

    /**
     * 创建应用路由过滤器
     * @param options
     */
    SinglePageApplication.createApplicationRouterFilter = function (options) {
        var applicationRouterFilter = FrameworkConfAccessor.getApplicationRouterFilterUrl();
        var result = null;
        if(applicationRouterFilter){
            var RouterFilter = require(applicationRouterFilter);

            result = new RouterFilter(options);
        } else{

            result = new ApplicationRouterFilter(options);
        }
        return result;
    }

    return SinglePageApplication;
});