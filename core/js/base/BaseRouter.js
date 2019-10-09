/**
 * @module 路由器的基类[BaseRouter]
 * @description 路由器的基类：主要是在路由回调函数执行之前和之后注入相应的事件
 * 路径主要是显示可以可视化的js的内容，可视化的js默认都是放在view下面，所以具体的路径有下面几种模式:
 * 1.显示是本模块的页面，直接传入view后面的路径，完整路径是应用+/view/+具体的显示页面；app/view/test.js,
 *   只要传入test
 * 2.显示其他模块的页面，如当前应用是app，要显示demo应用下面view/play.js的页面时，
 *   传入方式是：$demo/view/play
 *
 * @author:
 * @date:
 */
define(["underscore",
        "backbone",
        "core/js/utils/ApplicationUtils",
        "core/js/utils/Utils",
        "core/js/view/Region",
        "core/js/utils/JqueryUtils",
        $route.getCss("animate"),
    ], function (_, Backbone, ApplicationUtils, Utils,Region) {
    var BaseRouter = Backbone.Router.extend({
        //该路由下子路由与模块名的映射：定义模块名（即子路由中请求地址的前缀）与该模块对应子路由的路径映射（该路径是基于requirejs的配置{@link require-config.js}进行设定的）
        subRouteDefinitionMapping: null,

        _allSubRouteDefinitionMapping: null,

        _createdModuleNameArray: null,

        localValidAction:[],
        serverValidAction:null,
        allValidAction:[],
        /**
         * 默认资源的验证是从服务器获取验证信息
         */
        isActiveResAuthMode:true,
        /**
         * 关掉页面的动态效果,主要使用animatecss实现
         */
        closeAnimate:null,
        /**
         * 动态加载页面
         * @param viewUrl  基于requirejs指定的基础路径的View的URL
         * @param options  构建视图的参数
         * @param region   显示的区域
         */
        show: function (viewUrl, options, region) {
            this.getMainRegion(region).show(viewUrl, options);
        },
        getMainRegion: function (mainRegion) {
            return ApplicationUtils.getMainRegion(mainRegion);
        },
        getApplicationRegion: function (applicationRegion) {
            return ApplicationUtils.getApplicationRegion(applicationRegion);
        },
        buildRegion: function (regionConfig, defaultRegionType) {
            return Region.buildRegion(regionConfig, defaultRegionType);
        },
        getApplicationContext: function () {
            return ApplicationUtils.getApplicationContext();
        },
        getApplicationRouterFilter: function () {
            return this.getApplicationContext().getApplicationRouterFilter();
        },
        initialize: function (options) {
            this._createdModuleNameArray = [];   //初始化已经加载完的路由器，避免重复加载 add by 2014.02.22

            //预先加载业务模型客户端解析引擎，主要是预防直接调用模型视图产生器(QFormViewBuilder)，而此时尚未加载qform而导致页面空白的问题
            /*if(FrameworkConfAccessor.isDependOnQForm()){
                this.loadDynamicSubRoute("qform", null);
            }*/
            //初始化allPassAction
            this.allValidAction = this.localValidAction;
        },
        /**
         * 启动路由
         */
        start:function(){
            Backbone.history.start();   //启动Backbone的路由
        },
        /**
         * 加载所有的子路由
         */
        loadAllSubRoute: function () {
            var subRouteDefinitionMapping = this.getSubRouteDefinitionMapping();
            if (!subRouteDefinitionMapping)
                return;
            var moduleNameArray = [],
                subRoutePathArray = [],
                moduleName, subRoutePath;
            for (moduleName in subRouteDefinitionMapping) {
                subRoutePath = subRouteDefinitionMapping[moduleName];
                moduleNameArray.push(moduleName);
                subRoutePathArray.push(subRoutePath);
            }
            this._loadSubRoutes(moduleNameArray, subRoutePathArray);   //加载子路由器
        },
        /**
         * 加载子路由器，如果子路由不存在，会忽略
         * @param moduleNameArray
         * @param subRoutePathArray
         * @private
         */
        _loadSubRoutes: function (moduleNameArray, subRoutePathArray) {
            if (subRoutePathArray == null || subRoutePathArray.length == 0)
                return;
            var that = this;
            require(subRoutePathArray, function () {
                var SubRouteArray = arguments,
                    SubRoute, moduleName;
                for (var i = 0, count = SubRouteArray.length; i < count; i++) {
                    SubRoute = SubRouteArray[i];
                    if (SubRoute == null)
                        continue;
                    moduleName = moduleNameArray[i];
                    //该子路有已经存在，就不再重复创建了。避免重复创建，而使路由加载两次 add by 2014.02.22
                    if (that._isExistedSubRoute(moduleName))
                        continue;
                    try {
                        new SubRoute(moduleName);
                        that._addCreatedSubRoute(moduleName);
                    } catch (e) {
                    }
                }
            }, function (err) {
                //errback
                //error含有出错的模块列表
                var failedId = err.requireModules && err.requireModules[0],
                    failedIndex = _.indexOf(subRoutePathArray, failedId);
                subRoutePathArray = _.without(subRoutePathArray, failedId);
                moduleNameArray = _.without(moduleNameArray, moduleNameArray[failedIndex]);
                that._loadSubRoutes(moduleNameArray, subRoutePathArray);
            });
        },
        /**
         * 动态加载子路由（模块）
         * @param moduleName        模块名（即子路由器中路由的前缀）
         * @param restOfTheSubRoute 子路由器的URL（相对于模块名而言的相对路径）
         */
        loadDynamicSubRoute: function (moduleName, restOfTheSubRoute) {
            var path = this.getSubRouteDefinition(moduleName);  //根据模块名称获取模块的路径
            var that = this;

            //如果当前URL是通过指定区域URL导航过来的，那么先取出来，待子路有加载完成后，再进行导航定位 add by 2014,09.22
            var urlRelatedRegion = ApplicationUtils.getUrlRelatedRegion(),
                url;
            if(urlRelatedRegion){
                url = urlRelatedRegion.url;
            }

            //动态加载该模块，即子路由器
            require([path], function (subRoute) {
                //该子路有已经存在，就不再重复创建了。避免重复创建，而使路由加载两次 add by 2014.02.22
                if (that.isExistedSubRoute(moduleName))
                    return;
                try {
                    new subRoute(moduleName);
                    that._addCreatedSubRoute(moduleName);

                    //如果当前URL是通过指定区域URL导航过来的，那么先取出来，待子路有加载完成后，再进行导航定位 add by 2014,09.22
                    if(url){
                        urlRelatedRegion.navigate(url);
                    }
                } catch (e) {
                    that.getMainRegion().showException("系统异常，请与管理员联系[" + e + "]");
                }
            }, function (err) {
                //errback
                //error含有出错的模块列表
                that.getMainRegion().showException("系统异常，请与管理员联系[ 路由器加载失败：" + err.requireModules[0] + " ]");
            });
        },
        /**
         * 加载url，主要为了解决子路由尚未加载的问题
         * add by 2014.11.06
         * @param url {String}必须以#开头
         */
        loadUrl: function(url){
            var moduleName = this._getModuleNameFromUrl(url);
            var isLoaded = this._isSubRouteLoaded(moduleName);
            if(isLoaded === false){
                var targetRegion = ApplicationUtils.getUrlRelatedRegion() || ApplicationUtils.getMainRegion(null);
                targetRegion.url = url;
                ApplicationUtils.setUrlRelatedRegion(targetRegion);

                this.loadDynamicSubRoute(moduleName);   //动态加载子路由
                return;
            }
            Backbone.history.loadUrl(url);
        },
        /**
         * 根据url来获取模块名
         * @param url
         * @returns {*}
         * @private
         */
        _getModuleNameFromUrl: function(url){
            var moduleNameIndex = url.indexOf("/");
            if(moduleNameIndex == -1)
                return null;
            var moduleName = url.substring(1, moduleNameIndex);  //从1开始是因为url是以#开头的
            return moduleName;
        },
        /**
         * 判断子路由是否已经加载了
         * add by 2014.11.06
         * @param moduleName
         */
        _isSubRouteLoaded: function(moduleName){
            if(!moduleName)
                return null;
            if(this.isExistedSubRoute(moduleName))
                return true;
            var path = this.getSubRouteDefinition(moduleName);  //根据模块名称获取模块的路径
            if(!path)
                return null;
            return false;
        },
        /**
         * 根据模块名通过RequireJS来加载子路由器的定义
         * @param moduleName
         * @return {*}
         */
        getSubRouteDefinition: function (moduleName) {
            var modulePath = this.getSubRouteDefinitionMapping();
            var result = modulePath[moduleName] || moduleName;

            return result;
        },
        /**
         * 子路由 = 依赖的模块路由 + 应用中定义的模块路由
         * @return {*}
         */
        getSubRouteDefinitionMapping: function(){
            if(!this._allSubRouteDefinitionMapping){
                var dependSubRouteMapping = {};//FrameworkConfAccessor.getDependSubRouteDefinitionMapping() || {};
                this._allSubRouteDefinitionMapping = _.extend({}, dependSubRouteMapping, this.subRouteDefinitionMapping);
            }

            return this._allSubRouteDefinitionMapping;
        },
        isExistedSubRoute: function (moduleName) {
            var idx = _.indexOf(this._createdModuleNameArray, moduleName);
            return idx != -1;
        },
        _addCreatedSubRoute: function (moduleName) {
            this._createdModuleNameArray.push(moduleName);
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
        /**
         * 兼容直接明确定位到路由到此函数，与通过faultAction中进入此函数
         * 1.明确定位格式：[action,array[paramObject]]
         * 2.通过faultAction格式：[action,paramObject]
         */
        doAction: function () {
            var obj = $.getRouteObject.apply(this, arguments);
            if($.isNotBank(obj.route)){
                //this.outAanimate();
                var showRegion = null;
                if(obj.param&&obj.param.showRegion){
                    showRegion = obj.param.showRegion;
                }
                var that = this;
                if(this.closeAnimate&&this.getMainChildren().length>0){
                    this.getMainChildren().animateCss(this.closeAnimate,function(){
                        that.showContent(obj.route,obj.param,showRegion);
                    });
                }else{
                    that.showContent(obj.route,obj.param,showRegion);
                }

            }
        },
        /**
         * 显示内容
         * @param routeUrl  {String}    显示的url路径
         * @param param     {Object}    传给路径的参数
         */
        showContent:function(routeUrl,param,showRegion){
            //路径有两种模式，需要处理
            var url = null;
            if(routeUrl.startsWith("$")){
                //完整模式
                url = routeUrl.replace("$","");
            }else{
                //缺省模式
                url = CONFIG.currentModuleName+"/view/" + routeUrl;
            }


            this.getMainRegion(showRegion).show(url, param);
        },
        /**
         * 获取组区域的子节点
         */
        getMainChildren:function(){
            var $el = this.getMainRegion().$el;
            if(!$el){
                $el = $(this.getMainRegion().el);
            }
            if($el){
                return $el.children();
            }
        },
        /**
         * 从新加载
         */
        refresh:function(){
            Backbone.history.loadUrl();
        },
        /**
         * 设置服务器的有效的action，并修改全部的有效actin
         * @param serverValidAction
         */
        setServerValidAction:function(serverValidAction){
            this.serverValidAction = serverValidAction;
            this.allValidAction = _.union(this.allValidAction,this.serverValidAction);
        },
        /**
         * 获取有效的资源路径
         * @returns {Array}
         */
        getAllValidAction:function(){
            return this.allValidAction;
        },
        getPost: function (id) {
            alert(id);
        },
        defaultRoute: function (actions) {
            alert(actions);
        },
        downloadFile: function (path) {
            alert(path); // user/images/hey.gif
        },
        loadView: function (route, action) {
            alert(route + "_" + action); // dashboard_graph
        },
        faultAction: function (actions) {
            var route = null;
            if (arguments.length > 0) {
                route = arguments[arguments.length - 1][0];
            }
            if(this.isActiveResAuthMode){
                if (_.contains(this.getAllValidAction(), route)) {
                    this.doAction.apply(this, arguments[arguments.length - 1]);
                } else {
                    this.getMainRegion().showException("您没有访问此路径[" + route + "]的权限!");
                }
            }else{
                this.doAction.apply(this, arguments[arguments.length - 1]);
            }
        }
    });
    return BaseRouter;
});