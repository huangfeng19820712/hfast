/**
 * @author:   * @date: 15-8-31
 */

define(["core/js/rpc/AjaxRequest",
    "core/js/rpc/SimpleConstant"
], function (AjaxRequest, SimpleConstant) {

    var SimpleRequest = AjaxRequest.extend({

        ctor: function (simpleClient, methodName) {
            this._super(simpleClient, methodName, null);
            this.url = methodName;
        },
        get: function (callback,async, ajaxResponse, dataType) {
            return this.method("get", callback, ajaxResponse, async, dataType);
        },
        post: function (callback, async, ajaxResponse, dataType) {
            return this.method("post", callback, ajaxResponse, async, dataType);
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
                url: this.url,
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
    return SimpleRequest;
});
