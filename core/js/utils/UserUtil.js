/**
 * @module 用户工具类[UserUtil]
 * @description 针对用户的工具类：目前主要是提供用户的登录、退出
 * @author:
 * @date:
 */
define(["underscore", "core/js/context/SessionContext", "core/js/utils/Log"], function (_, SessionContext, Log) {
    var UserUtil = {
        /**
         * 通过令牌进行登录
         * @param token
         */
        loginFromIntegratedSystemByToken: function(token){
            if(!token)
                return;

            //如果已经初始化了，就不需要再初始化
            var isInitialized = SessionContext.getToken() == token;
            if(isInitialized)
                return;

            this._initSessionContextByToken(token);   //根据令牌来初始化会话上下文
            this._initApplicationStatus();         //初始化应用的状态
        },
        /**
         * 登录
         * @param credentials  登录时需要的认证信息
         * @param callbackFunction  登录后的回调函数，如果指定了就认为是异步
         * @return {null}     返回Ajax响应结果
         */
        login: function (credentials, callbackFunction) {
            return this._login(credentials, true, callbackFunction);
        },
        /**
         * 模型的登录：与普通登陆的区别在于是否需要独立根据sessionID来获取用户信息
         * @param credentials       登录时需要的认证信息
         * @param callbackFunction  登录后的回调函数，如果指定了就认为是异步
         * @return {*}
         */
        loginFromModel: function(credentials, callbackFunction){
            return this._login(credentials, false, callbackFunction);
        },
        /**
         * 退出：清空缓存
         * @return {null}  返回Ajax响应结果
         */
        logout: function () {
            var ropClient = this.getApplicationContext().getRopClient();
            var request = ropClient.buildClientRequest("user.logout", "1.0");
            var result = null;
            request.post(function (compositeResponse) {
                result = compositeResponse;
            }, null, false);

            if (result.isSuccessful()) {
                SessionContext.clear();  //清除会话

                document.cookie = "sessionId=; path=/";  //退出就清空cookie中的会话
            }

            return result;
        },
        getSessionContext: function () {
            return SessionContext;
        },
        getApplicationContext: function () {
            return SessionContext.getApplicationContext();
        },
        /**
         * 刷新会话上下文信息：当前用户信息及当前用户归属的组织信息
         * add by 2014.04.15
         */
        refreshSessionInfo: function(){
            var sessionId = SessionContext.getSessionId();
            if(sessionId == null || sessionId == "")
                return;
            var session = this._getUserSessionInfo(sessionId);
            SessionContext.set(session);
        },
        _login: function(credentials, isGetUserInfoAlone, callbackFunction){
            var ropClient = this.getApplicationContext().getRopClient();
            var request = ropClient.buildClientRequest("user.logon", "1.0");
            var isAsync = _.isFunction(callbackFunction);  //判断是否是异步请求
            var that = this;
            var result = null;
            request.addParams(credentials).addIgnoreSignParam("password")
                .post(function (compositeResponse) {
                    result = compositeResponse;

                    //如果是异步，就执行回调函数
                    if(isAsync){
                        that._loginHandle(result, isGetUserInfoAlone);  //登录后的处理：初始化会话信息
                        callbackFunction(result);
                        that._redirectUrl(result);
                    }

                }, null, isAsync);
            //如果是异步，就交由回调处理，这里直接返回
            if(isAsync)
                return result;

            this._loginHandle(result, isGetUserInfoAlone);  //登录后的处理：初始化会话信息
            this._redirectUrl(result);     //页面跳转
            return result;
        },
        _loginHandle: function(compositeResponse, isGetUserInfoAlone){
            //登陆失败，直接返回
            if (!compositeResponse.isSuccessful())
                return;

            var customMap = compositeResponse.getSuccessResponse() || {};
            this._initSessionContext(customMap, isGetUserInfoAlone);   //初始化会话上下文信息
            this._initApplicationStatus();         //初始化应用的状态
        },
        /**
         * 根据令牌对会话上下文进行初始化
         * add by 2014.06.26
         * @private
         */
        _initSessionContextByToken: function(token){
            SessionContext.reset();    //重置会话上下文
            var sessionId = this._getSessionIdByToken(token);
            if(!sessionId)
                return;
            var customMap = {
                sessionId: sessionId
            }
            this._initSessionContext(customMap, true);
            SessionContext.setToken(token);    //设置令牌
        },
        /**
         * 登陆成功后，初始化会话上下文信息
         * @param customMap
         * @param isGetUserInfoAlone  是否需要独立根据会话ID从服务端获取用户相关信息
         * @private
         */
        _initSessionContext: function (customMap, isGetUserInfoAlone) {
            var sessionId = customMap["sessionId"],
                session = {};

            if(isGetUserInfoAlone){
                session = this._getUserSessionInfo(sessionId) || {};
            }else{
                var user = customMap["user"];
                session[SessionContext.USER_KEY] = user;
            }

            session[SessionContext.AUTHENTICATED_KEY] = true;

            if (sessionId)
                session[SessionContext.SESSION_ID_KEY] = sessionId;
            SessionContext.set(session);

            /*
             存储会话ID到cookie中，这里指定path，使cookie在整个网站下可用，可以将cookieDir指定为根目录，但注意：
             上面所说都指的是在同一个目录中的访问，可是要想在不同虚拟目录中访问则要另外想办法来解决这个问题。
             但是path不能解决在不同域中访问cookie的问题。在默认情况下，只有和设置cookie的网页在同一个Web服务器的网页才能访问该网页创建的cookie。
             但可以通过domain参数来实现对其的控制，其语法格式如下：
             document.cookie="name=value; domain=cookieDomain";
             */
            document.cookie = "sessionId=" + sessionId + "; path=/";
        },
        /**
         * 获取当前用户相关的会话信息
         * @return {null}
         * @private
         */
        _getUserSessionInfo: function (sessionId) {
            var ropClient = this.getApplicationContext().getRopClient(),
                result = null;
            ropClient.post({
                methodName: "session.get",
                methodVersion: "1.0",
                data: {_sessionId:sessionId},
                async: false,                              //同步加载,
                complete: function (compositeResponse) {
                    if (!compositeResponse.isSuccessful()) {
                        Log.error("获取当前用户相关的会话信息[session.get]出错：" + compositeResponse.getMessage());
                        return;
                    }

                    result = compositeResponse.getSuccessResponse();
                }
            });
            return result;
        },
        /**
         * 根据令牌获取会话ID
         * add by 2014.06.26
         * @param token
         * @return {null}
         * @private
         */
        _getSessionIdByToken: function(token){
            if(!token)
                return null;
            var ropClient = this.getApplicationContext().getRopClient(),
                result = null;
            ropClient.post({
                methodName: "session.id.get",
                methodVersion: "1.0",
                data: {token:token},
                async: false,                              //同步加载,
                complete: function (compositeResponse) {
                    if (!compositeResponse.isSuccessful()) {
                        Log.error("根据令牌获取当前用户相关的会话ID[session.id.get]出错：" + compositeResponse.getMessage());
                        return;
                    }

                    result = compositeResponse.getSuccessResponse();
                }
            });
            return result;
        },
        /**
         * 初始化应用的状态
         * @private
         */
        _initApplicationStatus: function () {
            var ropClient = this.getApplicationContext().getRopClient();

            //设置sessionId到ropClient中
            ropClient.setSessionId(SessionContext.getSessionId());
        },
        /**
         * 页面跳转
         */
        _redirectUrl: function(compositeResponse){
            //登陆失败，直接返回
            if (!compositeResponse.isSuccessful())
                return;
            //跳转到会话失效前的URL
            var path = SessionContext.get(SessionContext.REDIRECT_FROM_KEY);
            if (path) {
                SessionContext.remove(SessionContext.REDIRECT_FROM_KEY);  //用过后，就直接将该值删除
            }
            path = path || "";
            Backbone.history.navigate(path, { trigger: true });
        }
    };

    return UserUtil;
});
