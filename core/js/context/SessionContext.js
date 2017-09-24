/**
 * @module 会话上下文[Session]
 * @description 会话上下文，其中包含了应用上下文的信息，主要是包含些业务信息
 *
 * @author
 * @version 1.0 @Date: 2013-05-30 上午9:20
 */
define(["jquery", "core/js/Class","core/js/context/ApplicationContext", "core/js/utils/ApplicationUtils"], function($, Class,ApplicationContext, ApplicationUtils){
    var SessionContext = Class.extend({
        user:null,
        sessionId:null,
        sessionUser:null,
        getApplicationContext: function(){
            return ApplicationUtils.getApplicationContext();
        },
        getSessionUser:function(){
            return this.sessionUser;
        },
        setSessionUser:function(sessionUser){
            this.sessionUser = sessionUser;
        }
    });

    //返回单例
    SessionContext.getInstance = function() {
        var result = ApplicationUtils.getApplicationContext().getSessionContext();
        if(result == null){
            result = new SessionContext();
            ApplicationUtils.getApplicationContext().setSessionContext(result);
        }

        return result;
    }

    return SessionContext.getInstance();
});
