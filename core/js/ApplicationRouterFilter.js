/**
 * @module 应用路由的拦截器[ApplicationRouterFilter]
 * @description 应用路由的拦截器
 * @author:
 * @date:
 */
define([ "core/js/Class","core/js/context/ApplicationContext",
    "core/js/FrameworkConfAccessor"], function (Class,ApplicationContext,FrameworkConfAccessor) {
    var ApplicationRouterFilter = Class.extend({
        /**
         * 是否需要进行验证
         */
        requireAuthentication: true,

        frameworkView: null,

        /**
         * 在该数组中指定不需要登录验证的URL。如果请求的URL需要先登录，而用户尚未登录，则直接重定向到登录页面
         */
        escapedAuth: ['#login', "#download"],

        /**
         * 当用户已登录后，在路由列表中没有找到可去的路由，就直接跳转到首页，例如登录、注册、修改密码等
         */
        preventAccessWhenAuth: ['#login'],

        /**
         * 当用户已登录后，在页面跳转的时候，忽略预先加载框架页
         */
        escapedLayoutWhenAuth: ['', '#', '#index'],

        /**
         * 添加忽略验证的URL，URL必须以#开头，多个值用逗号分隔
         * @param escapedUrlStr  {String}多个值用逗号分隔
         * @return {*|Array}
         */
        addEscapedAuthUrl: function (escapedUrlStr) {
            var result = this.escapedAuth || [];
            if (escapedUrlStr == null || escapedUrlStr === "")
                return result;
            var escapedUrlArray = escapedUrlStr.split(","),
                escapedUrl;
            for (var i = 0, count = escapedUrlArray.length; i < count; i++) {
                escapedUrl = $.trim(escapedUrlArray[i]);
                if (escapedUrl === "")
                    continue;
                result.push(escapedUrl);
            }

            return result;
        },
        /**
         * 拦截路由，进行路由执行之前的处理，进行统一的登录验证，如果尚未登录，就跳转到登录界面进行登录
         * @param route
         * @param params
         * @return {*}
         */
        before: function (route, params) {
            //如果此时匹配到动态的模块路由，就直接返回，不做任何处理 add by 2014.04.29 避免重复执行两次
            if(route == ":moduleName/*restOfTheSubRoute")
                return true;

            var path = Backbone.history.location.hash,
                needAuth = !_.contains(this.escapedAuth, path);
            if(needAuth){
                //从会话中获取当前用户是否已经登录过了，然后再根据当前请求的URL，来判断该URL是否需要先登录才能使用
                var isAuth = this._checkAuthentication(params),
                    cancelAccess = _.contains(this.preventAccessWhenAuth, path);
                if(!isAuth){
                    //如果用户访问的路由是需要先登录的，但是当前尚未登录，就直接跳转到登录界面，并且将将要跳转的路径存储到当前会话中，以便登录成功后进行跳转
                    if(path != "#logout")
                        //TOdo
                        //SessionContext.setRedirectFrom(path);
                    Backbone.history.navigate('login', { trigger: true });
                    return false;
                }
                if(cancelAccess){
                    //当前用户已登录过了，又不知道要去哪，就直接重定向到首页
                    Backbone.history.navigate('', { trigger: true });
                    return false;
                }
            }

            var isLoadLayout = !_.contains(this.escapedLayoutWhenAuth, path);
            //如果由index.html页发起的请求，已经登录过了，并且是需要加载框架页，那么就先加载框架页，不指定首页的内容
            if (!this._isExistedLayout() && isAuth && isLoadLayout && this._isIndex(Backbone.history.location)) {
                /*var ApplicationContext = SessionContext.getApplicationContext();
                ApplicationContext.getApplicationRegion().show(this.getFrameworkView(),{
                    //待框架页加载完成后，触发显示主区域的内容；避免框架页加载时间过长，最终导致主区域无法显示 add by 2014.04.29
                    oninitialized: function(){
                        this.on("show", function(){
                            ApplicationContext.getMainRegion().show(path);
                        });
                    },
                    requireHome: false
                });  //参数中不指定home，就仅显示框架页
                return false;*/
            }

            return true;
        },
        /**
         * 拦截路由，进行路由执行成功后的处理
         */
        after: function (route, params) {
            //设置当前的路由路径
            ApplicationContext.setCurrentRoute(params[0]);
            return true;
        },
        getFrameworkView: function () {
            return this.frameworkView || "foundation_layout/js/index";
        },
        setFrameworkView: function (frameworkView) {
            this.frameworkView = frameworkView;
        },
        /**
         * 设置是否需要进行权限验证
         * @param requireAuthentication
         */
        setRequireAuthentication: function (requireAuthentication) {
            this.requireAuthentication = requireAuthentication;
        },
        isRequireAuthentication: function () {
            return this.requireAuthentication == null || this.requireAuthentication;
        },
        _checkAuthentication: function (params) {
            if (!this.isRequireAuthentication())
                return true;
            var isAuthenticated = ApplicationContext.isAuthenticated(),
                //Todo 设置token
                authenticatedToken = {}//SessionContext.getToken();

            //注意：下面对已验证分几种情况区分，是为了防止通过令牌方式登录时，如果验证过的令牌与请求令牌不一致时，那么就需要通过请求的令牌重新进行验证，避免使用上一次的会话信息add by 2014.07.01
            //正常登录方式（通过用户名和密码）：如果已经验证通过了，并且不存在令牌，即说明不是通过令牌登陆的，那么就直接返回登陆成功
            if(isAuthenticated && !authenticatedToken)
                return true;


            var requestToken = this._getTokenFromRequestParam(params);
            //令牌登录方式：如果已经验证通过了，并且请求令牌与验证过令牌是一致的，或者不传请求令牌，那么就认为是通过外部集成的方式登录
            if(isAuthenticated && (!requestToken || authenticatedToken == requestToken))
                return true;
            //如果尚未登陆，且请求令牌为空，那么就说明验证失败
            if(!isAuthenticated && !requestToken)
                return false;

            return this._checkAuthenticationByToken(requestToken);
        },
        /**
         * 根据令牌进行验证(用于与外部系统集成时，外部系统调用本系统页面时)
         * add by 2014.06.26
         * @param token
         * @private
         */
        _checkAuthenticationByToken: function(token){
            UserUtil.loginFromIntegratedSystemByToken(token);  //通过令牌进行登录
            return SessionContext.isAuthenticated();
        },
        /**
         * 从请求参数中获取令牌
         * @param params
         * @return {*}
         * @private
         */
        _getTokenFromRequestParam: function(params){
            var result = null;
            if(params == null)
                return result;
            if(_.isArray(params)){
                var paramCount = params.length;
                if(paramCount == 0)
                    return result;
                params = params[paramCount-1];  //数组中最后一个值就是参数对象
            }
            if(!_.isObject(params))
                return result;
            //var ApplicationContext = SessionContext.getApplicationContext();
            var tokenName = null;//ApplicationContext.getIntegratedTokenName();
            if(!tokenName)
                return false;
            result = params[tokenName];
            return result;
        },
        /**
         * 判断是否存在框架页
         * @return {boolean}
         */
        _isExistedLayout: function () {
            return document.getElementById("main") != null;
        },
        _isIndex: function (location) {
            if (location == null)
                return false;
            var pathName = location.pathname;
            if (pathName == null)
                return false;
            var webContextPath = FrameworkConfAccessor.getAppName();
            pathName = pathName.replace(webContextPath, "");
            return pathName === "" || pathName == "/" || pathName.indexOf("/index.html") != -1;
        },
        ctor: function (options) {
            this.set(options);
        }
    });
    return ApplicationRouterFilter;
});