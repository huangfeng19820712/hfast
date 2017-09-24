/**
 * @module Ajax响应对象[AjaxResponse]
 * @description  Ajax响应对象
 *
 * @author:
 * @date: 2013-08-28 下午9:11
 */
define(["core/js/Class",
    "core/js/rpc/CompositeResponse","core/js/windows/Window"], function (Class, CompositeResponse,Window) {
    var AjaxResponse = Class.extend({

        transport: null,
        callback: null,    //回调函数
        data: null,        //经转换后的响应报文数据
        interceptSystemException: null,  //是否要拦截系统异常，如果拦截，那么如果有系统异常时，就不执行回调函数，默认是拦截的 add by 2014.06.12

        ctor: function (transport, callback, data, interceptSystemException) {
            this.transport = transport;
            this.callback = callback;
            this.data = data;
            this.interceptSystemException = interceptSystemException;
        },

        /**
         * 处理响应结果
         */
        handle: function () {
            var compositeResponse = this.toCompositeResponse(this.transport);
            //对系统级的错误结果进行统一拦截 add by 2014.02.22
            if (!this._validateResponse(compositeResponse))
                return compositeResponse;

            if (!this.onbeforecallback(compositeResponse))
                return compositeResponse;

            this.executecallback(compositeResponse);

            return compositeResponse;
        },
        /**
         * 将响应的报文转换成指定格式的数据
         * @param transport {@link XMLHttpRequest}
         * @return {null}
         */
        getData: function (transport) {
            if(transport == null)
                return null;

            if (this.data != null)
                return this.data;

            this.data = transport.responseText;

            return this.data;
        },

        /**
         * 将响应结果转换成CompositeResponse类型的对象
         *
         * @param transport
         */
        toCompositeResponse: function (transport) {
            var errorResponse = this.getErrorResponse(transport);
            var successResponse = null;

            if (errorResponse == null) {
                successResponse = this.getSuccessResponse(transport);
            }

            var result = new CompositeResponse(successResponse, errorResponse);

            return result;
        },
        /**
         * 获取正确的响应报文
         * @param transport
         * @return {*|String}
         */
        getSuccessResponse: function (transport) {
            return transport.responseText;
        },
        /**
         * 获取错误的响应报文
         * @param transport
         * @return {null}
         */
        getErrorResponse: function (transport) {
            return null;
        },
        /**
         * 执行回调函数触发之前的事件
         * @param compositeResponse
         * @return {boolean}
         */
        onbeforecallback: function (compositeResponse) {
            return true;
        },
        /**
         * 执行回调函数
         * @param compositeResponse
         */
        executecallback: function (compositeResponse) {
            var callback = this.callback;
            if (typeof(callback) != "function")
                return;

            callback(compositeResponse);
        },
        /**
         * 校验是否是系统级别的异常
         * @param compositeResponse
         * @returns {boolean}
         * @private
         */
        _validateResponse: function (compositeResponse) {

            if (compositeResponse.isSuccessful())
                return true;
            //$.window.closeProgressTip(null);   //关闭最近的正在处理的提示窗口 add  by mkc 2014.10.20
            var errorResponse = compositeResponse.getErrorResponse();
            /*//系统尚未登陆的异常
            if (errorResponse.isUnLogonException()) {
                try{
                    //存储当前的URL，然后调转到登陆界面
                    var path = Backbone.history.location.hash;
                    SessionContext.setRedirectFrom(path);
                    SessionContext.clear();   //清除会话
                    $.window.closeAll();     //关闭所有的弹出窗口 add by 2014.07.17
                    Backbone.history.navigate('login', { trigger: true });
                }catch(e){
                }finally{
                };
                return false;
            }
            //拒绝访问，权限不足
            if (errorResponse.isAccessDeniedException()) {
                $.window.showErrorMsg("对不起，您的权限不足，无法访问！");
                return false;
            }*/
            //系统异常，并且要统一拦截系统异常
            if (this._isInterceptSystemException() ) {
                var msgArray = ["系统异常，请与管理员联系！错误信息如下：<br>"];
                msgArray.push(errorResponse.getErrorMessage());
                $.window.alert(msgArray);
                return false;
            }
            return true;
        },
        /**
         * 判断是否要统一拦截系统异常，默认是拦截的
         * @return {*}
         * @private
         */
        _isInterceptSystemException: function(){
            //默认是拦截的
            if(this.interceptSystemException == null)
                return true;
            return this.interceptSystemException;
        }
    });

    return AjaxResponse;
});