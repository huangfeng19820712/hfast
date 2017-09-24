/**
 * @module Ajax客户端[AjaxClient]
 * @description Ajax客户端
 *
 * @author:
 * @date: 2013-08-29 下午1:48
 */
define(["jquery",
    "core/js/Class",
    "core/js/rpc/AjaxRequest",
    "core/js/rpc/JsonResponse",
    "jquery.fileDownload"], function ($, Class, AjaxRequest, JsonResponse) {
    var AjaxClient = Class.extend({
        /**
         * 服务地址
         */
        serverUrl: null,

        ctor: function (serverUrl) {
            this.serverUrl = serverUrl;
        },
        buildClientRequest: function (methodName, methodVersion, ignoreNull) {
            return new AjaxRequest(this, methodName, methodVersion, ignoreNull);
        },
        buildJsonResponse: function (transport, callback, responseData) {
            return new JsonResponse(transport, callback, responseData);
        },
        getServerUrl: function () {
            return this.serverUrl;
        },
        setServerUrl: function (serverUrl) {
            this.serverUrl = serverUrl;
        },



        /**
         * 导出文件
         *
         * @param methodName
         * @param methodVersion
         * @param attachParams
         */
        exportFile: function (methodName, methodVersion, attachParams) {
            if (typeof methodName == "object") {
                attachParams = methodName;
                methodName = attachParams["methodName"];
                methodVersion = attachParams["methodVersion"];
                $.fileDownload(methodName, {
                    prepareCallback:attachParams["prepareCallback"],
                    successCallback:attachParams["successCallback"],
                    failCallback:attachParams["failCallback"]
                    //preparingMessageHtml: "We are preparing your report, please wait...",
                    //failMessageHtml: "There was a problem generating your report, please try again."
                });
            }else{
                $.fileDownload(methodName);
            }
        },
        get: function (methodName, methodVersion, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException, ignoreNull) {
            return this.method("get", methodName, methodVersion, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException, ignoreNull);
        },
        post: function (methodName, methodVersion, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException, ignoreNull) {
            return this.method("post", methodName, methodVersion, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException, ignoreNull);
        },
        method: function (ajaxMethod, methodName, methodVersion, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException, ignoreNull) {
            if (typeof methodName == "object") {
                var opts = methodName;
                methodName = opts["methodName"];
                methodVersion = opts["methodVersion"];
                ignoreNull = opts["ignoreNull"];
                data = opts["data"];
                dataType = opts["dataType"];              //add by cw 2013.12.25
                callback = opts;
            }

            var options = this._getOptions(callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException);

            return this.buildClientRequest(methodName, methodVersion, ignoreNull)
                .addParams(data)
                .method(ajaxMethod, options);
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
        },

    });

    return AjaxClient;
});