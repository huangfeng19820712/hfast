/**
 * @module 应用上下文[ApplicationContext]
 * @description 应用上下文
 *
 * @version 1.0 @Date: 2013-05-29 下午4:50
 */
define(["jquery",
        "underscore",
        "core/js/Class",
        "core/js/utils/Log",
        "core/js/rpc/SimpleAjaxClient",
        "core/js/windows/ModalDialog" ,
        "core/js/ComponentManager",
    $Component.SPINLOADER.src,
    ],  function($, _, Class, Log,AjaxClient,ModalDialog,ComponentManager,SpinLoader){
    var ApplicationContext = Class.extend({
        ajaxClient: null,
        modalDialog:null,
        alertDialog:null,
        regionClass:null,
        /**
         * 全局的加载器
         */
        loader:null,
        /**
         *  标识整个应用工作区的HTML元素，这里仅能存HTML元素，
         *  因为ApplicationContext是全局唯一的，所以需要根据上下文信息再定位到具体的元素，无法在此直接存储区域的值，
         */
        applicationRegionEl: null,
        /**
         *  标识该应用下主工作区的HTML元素
         */
        mainRegionEl: null,
        /**
         * 应用工作区的区域对象
         */
        applicationRegion:null,
        /**
         * 主工作区的区域对象
         */
        mainRegion:null,
        /**
         *  应用路由拦截器
         */
        applicationRouterFilter: null,
        /**
         * 服务器端配置文件的url
         */
        $CONF:"/conf!get.action",
        /**
         * 设置设置当前的application实例
         */
        application:null,

        /**
         * 应用的路由
         */
        applicationRouter:null,
        /**
         * 服务器端的配置
         */
        serviceConf:null,
        /**
         * 保存服务器中相关的session信息
         */
        sessionContext:null,
        /**
         * 保存服务器SessionUser的信息
         */
        sessionUser:null,

        /**
         * 是否验证过，默认是false，在login中验证通过设置此值为true，logout后，设置辞职为false
         * 在应用初始化的时候，也需要设置，不然则需要保存在本地缓存中
         */
        authenticated:false,
        /**
         * 表示是否已经初始化。
         */
        initialized: false,
        /**
         * 当前的路由信息
         */
        currentRoute:null,
        /**
         * 全局组件管理器
         */
        componentManager:null,

        ctor: function($globalContext){

        },
        isInitialized: function(){
            return this.initialized;
        },
        setInitialized: function(initialized){
            if(initialized == null)
                initialized = true;
            this.initialized = initialized;
        },
        /**
         * 判断是否已经登录过
         * @return {boolean}
         */
        isAuthenticated: function(){
            return this.authenticated;
        },
        setAuthenticated:function(auth){
            this.authenticated = auth;
        },
        getSessionUser:function(){
            return this.sessionUser;
        },
        setSessionUser:function(sessionUser){
            this.sessionUser = sessionUser;
        },
        getAjaxClient:function(){
            return this.ajaxClient;
        },
        setAjaxClient:function(ajaxClient){
            this.ajaxClient = ajaxClient;

        },
        setModalDialog:function (modalDialog){
            this.modalDialog = modalDialog;
        },
        getModalDialog:function(){
            return this.modalDialog;
        },
        getApplication:function(){
            return this.application;
        } ,
        setApplication:function(application){
            this.application = application;

        }  ,
        setServiceConf:function(conf){
            this.serviceConf = conf
        }   ,
        getServiceConf:function(){
            if(!this.serviceConf){
                that = this;
                var ajaxClient = this.getAjaxClient();
                ajaxClient.buildClientRequest(this.$CONF)
                    .post(function(compositeResponse){
                        var obj = compositeResponse.getSuccessResponse();
                        if(obj){
                            that.serviceConf = obj;
                        }
                    },false);
            }
            return this.serviceConf;
        },

        setAlertDialog:function (alertDialog){
            this.alertDialog = alertDialog;
        },
        getAlertDialog:function(){
            return this.alertDialog;
        },
        getSessionContext:function(){
            return this.sessionContext;
        },
        setSessionContext:function(sessionContext){
            this.sessionContext = sessionContext;
        },
        getApplicationRouter:function(){
            return this.applicationRouter;
        },
        setApplicationRouter:function (applicationRouter){
            this.applicationRouter = applicationRouter;
        },
        getApplicationRouterFilter: function(){
            return this.applicationRouterFilter;
        },
        setApplicationRouterFilter: function(applicationRouterFilter){
            this.applicationRouterFilter = applicationRouterFilter;
        },
        getApplicationRegion: function(){
            if(!this.applicationRegion&&this.regionClass){
                this.applicationRegion = this.regionClass.buildRegion(this.getApplicationRegionEl());
            }
            return this.applicationRegion;
        },
        getMainRegion: function(){
            if(!this.mainRegion&&this.regionClass){
                this.mainRegion = this.regionClass.buildRegion(this.getMainRegionEl());
            }
            return this.mainRegion;
        },
        /**
         * 设置主区域对象
         * @param mainRegion
         */
        setMainRegion:function(mainRegion){
            this.mainRegion = mainRegion
        },
        /**
         * 创建区域对象
         * @param regionEl
         * @returns {*}
         */
        buildRegion:function(regionEl){
            return this.regionClass.buildRegion(regionEl);
        },
        /**
         *
         * @return {*}
         */
        getApplicationRegionEl: function(){
            return this.get("applicationRegionEl", "#application");
        },
        /**
         * 设置该应用的主工作区
         * @param applicationRegionEl       String|JSON|HTML ELEMENT  可直接指定DOM元素
         */
        setApplicationRegionEl: function(applicationRegionEl){
            this.set("applicationRegionEl", applicationRegionEl);
        },
        /**
         * 获取该应用的主工作区，全局唯一，然后在此工作区内进行视图的切换
         * @return {*}
         */
        getMainRegionEl: function(){
            return this.get("mainRegionEl", "#main");
        },
        /**
         * 设置该应用的主工作区的DOM元素
         * @param mainRegionEl       String|HTML ELEMENT  可直接指定DOM元素
         */
        setMainRegionEl: function(mainRegionEl){
            this.set("mainRegionEl", mainRegionEl);
        },
        setCurrentRoute:function(currentRoute){
            this.currentRoute = currentRoute;
        },
        getCurrentRoute:function(){
            return this.currentRoute;
        },
        /**
         *
         */
        setComponentManager:function(componentManager){
            this.componentManager = componentManager;
        },
        getComponentManager:function(){
            return this.componentManager;
        },
        _getBaseFramework: function(){
            return null;
        },
        /**
         * 避免对Region类的初始化依赖
         */
        setRegionClass:function(regionClass){
            this.regionClass = regionClass;
        },
        setLoader:function(loader){
            this.loader = loader;
        },
        getLoader:function(){
            return this.loader;
        }
    });

    ApplicationContext.getInstance = function() {
        var app = new ApplicationContext();
        app.setAjaxClient(new AjaxClient());
        app.setModalDialog(new ModalDialog());
        app.setComponentManager(new ComponentManager());
        app.setLoader(new SpinLoader());
        return app;
    }

    return ApplicationContext.getInstance();
});
