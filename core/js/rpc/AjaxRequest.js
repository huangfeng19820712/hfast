/**
 * @module Ajax请求对象[AjaxRequest]
 * @description Ajax请求对象
 *
 * @author:
 * @date: 2013-08-29 下午1:55
 */
define(["jquery", "core/js/Class", "core/js/rpc/AjaxEngine"], function ($, Class, AjaxEngine) {
    var AjaxRequest = Class.extend({
        ajaxClient: null,
        paramMap: null,

        ctor: function (ajaxClient, methodName, methodVersion) {
            this.ajaxClient = ajaxClient;
            this.clearParam();

            this.setAction(methodName, methodVersion);  //设置请求的操作
        },
        addParams: function (params) {
            if (params == null)
                return this;

            for (var key in params) {
                this.addParam(key, params[key]);
            }

            return this;
        },
        addParam: function (paramName, paramValue) {
            if (paramName == null || paramName == "") {
                alert("[AjaxRequest.addParam] 参数名不能为空");
                return this;
            }

            if (paramValue == null)
                paramValue = "";

            this.paramMap[paramName] = paramValue;

            return this;
        },
        getParamValue: function(paramName){
            if (paramName == null || paramName == "")
                return null;
            return this.paramMap[paramName];
        },
        setAction: function (methodName, methodVersion) {
            this.addParam("action", methodName);
            this.addParam("v", methodVersion);

            return this;
        },
        clearParam: function () {
            this.paramMap = {};

            return this;
        },
        /**
         * 请求的所有参数
         * @return {*}
         */
        getParameterMap: function () {
            return this.paramMap;
        },
        /**
         * 获取ajax请求的URL
         * add by 2014.03.25
         * @return {String}
         */
        getUrl: function(){
            var result = [],
                params = this.getParameterMap();
            result.push(this.ajaxClient.getServerUrl());
            if(params != null){
                result.push("?");
                result.push($.param(params));
            }

            return result.join("");
        },
        get: function (callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException) {
            this.method("get", callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException);

            return this;
        },
        post: function (callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException) {
            this.method("post", callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException);

            return this;
        },
        method: function (ajaxMethod, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException) {
            var options = this._getOptions(callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException);
            AjaxEngine.method(ajaxMethod, options);

            return this;
        },
        _getOptions: function (callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException) {
            if (typeof callback == "object") {
                var opts = callback;
                callback = opts["complete"];
                ajaxResponse = opts["ajaxResponse"];
                async = opts["async"];
                dataType = opts["dataType"];
                cache = opts["cache"];
                contentType = opts["contentType"];
                timeout = opts["timeout"];
                interceptSystemException = opts["interceptSystemException"];
            }

            var result = {
                url: this.ajaxClient.getServerUrl(),
                data: this.getParameterMap(),
                complete: callback,
                ajaxResponse: ajaxResponse,
                async: async,
                dataType: dataType,
                cache: cache,
                contentType: contentType,
                timeout: timeout,
                interceptSystemException: interceptSystemException
            }

            return result;
        }
    });

    return AjaxRequest;
});