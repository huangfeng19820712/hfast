/**
 * @module Ajax请求引擎[AjaxEngine]
 * @description Ajax请求引擎。
 * 该引擎是基于jquery.ajax()进行封装的，对请求的响应进行拦截，统一验证响应的后，再交由客户的callback处理。
 *
 * 该引擎只允许客户端程序通过Ajax请求的onComplete事件执行自己的callback。
 *
 * @author
 * @version 1.0 @Date: 2013-04-28 下午14:47
 */
define(["jquery",
    "core/js/Class",
    "core/js/rpc/AjaxResponse",
    "core/js/rpc/JsonResponse",
    "core/js/rpc/ScriptResponse"
], function ($, Class, AjaxResponse, JsonResponse, ScriptResponse) {
    var ResponseFormat = {
        JSON: "json",
        JSONP: "jsonp",
        XML: "xml",
        HTML: "html",
        SCRIPT: "script"
    };

    var AjaxEngine = Class.extend({
        ajaxResponse: null,    //原值(JsonResponse), modified by chenw at 2013.12.27

        /**
         * 初始化构造函数
         * @param {Object} url 请求的URL
         * @param {Object} options 可选的参数配置
         * <pre>
         *    type：       [String]  (默认: "GET")请求方式("POST" 或 "GET")，默认为 "GET"。
         *                            注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
         *  timeout：    [Number]  设置请求超时时间（毫秒）。此设置将覆盖全局设置。
         *  async：      [Boolean] (默认: true) 默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
         *                       注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
         *  cache：      [Boolean] (默认: true) jQuery 1.2 新功能，设置为 false 将不会从浏览器缓存中加载请求信息。
         *  contentType：[String]  (默认: "application/x-www-form-urlencoded") 发送信息至服务器时内容编码类型。默认值适合大多数应用场合。
         *  data：       [Object,String] 发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。
         *                               查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。
         *                               如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:[bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。
         *  dataType：        [String]  预期服务器返回的数据类型。
         *                       如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息返回 responseXML 或 responseText，并作为回调函数参数传递，可用值:
         *                         "xml": 返回 XML 文档，可用 jQuery 处理。
         *                         "html": 返回纯文本 HTML 信息；包含 script 元素。
         *                         "script": 返回纯文本 JavaScript 代码。不会自动缓存结果。
         *                         "json": 返回 JSON 数据 。
         *                         "jsonp": JSONP 格式。使用 JSONP 形式调用函数时，如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名，以执行回调函数。
         *  complete：        [function] 回调函数
         * </pre>
         */
        ctor: function (url, options, ajaxResponse) {

            //对ajax请求选项进行加工处理
            options = $.extend({url: url}, (options || {}));
            options = this._setOptions(options);

            this._setAjaxResponse(ajaxResponse);

            $.ajax(options);  //调用JQuery
        },
        _setAjaxResponse: function (ajaxResponse) {
            if (ajaxResponse) {
                this.ajaxResponse = ajaxResponse;
            } else {
                /******增加多种ajax报文的支持 (added by chenw at 2013.12.27)  *************/
                switch (this._responseFormat) {
                    case ResponseFormat.JSON :
                    case ResponseFormat.JSONP :
                        this.ajaxResponse = JsonResponse;
                        break;
                    case ResponseFormat.SCRIPT :
                        this.ajaxResponse = ScriptResponse;
                        break;
                    case ResponseFormat.XML :
                    case ResponseFormat.HTML :
                        this.ajaxResponse = AjaxResponse;
                        break;
                    default :
                        this.ajaxResponse = JsonResponse;
                        break;
                }
                /******增加多种ajax报文的支持end *************/
            }

//            ajaxResponse = ajaxResponse || JsonResponse;    //modified by chenw at 2013.12.27
//            this.ajaxResponse = ajaxResponse;        //modified by chenw at 2013.12.27
        },
        /**
         * 对Ajax请求的参数选项进行处理（只允许客户端程序通过Ajax请求的onComplete事件执行自己的callback）
         *
         * @param {Object} options
         */
        _setOptions: function (options) {

            //只允许设置complete方法，屏蔽其它事件响应
            options["beforeSend"] = null;
            options["success"] = null;
            options["error"] = null;

            this._interceptSystemException = options["interceptSystemException"]; //是否需要统一拦截系统异常，默认是进行拦截 add by 2014.06.12
            this._complete = options["complete"] || function () {
            };  //先记录下客户设置的回调
            //设置complete选项的值，调用拦截器处理响应
            var that = this;
            options["complete"] = function () {
                that._interceptResponse.apply(that, arguments);
            }
            if (options["dataType"] === ResponseFormat.JSONP) {
                options["success"] = function (data) {
                    that._jsonpResultData = data;
                }
            }
            this._responseFormat = options["dataType"] || ResponseFormat.JSON;

            return options;
        },
        /**
         * 拦截服务端响应的报文
         *
         * @param {Object} transport
         * @param {Object} textStatus
         */
        _interceptResponse: function (transport, textStatus) {
            var ajaxResponse = new this.ajaxResponse(transport, this._complete, this._jsonpResultData, this._interceptSystemException);
            ajaxResponse.handle();
        }
    });

    /**
     *
     * @param url
     * @param data
     * @param callback
     * @param ajaxResponse
     * @param async
     * @param dataType
     * @param cache
     * @param contentType
     * @param timeout
     * @return {AjaxEngine}
     */
    AjaxEngine.post = function (url, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout) {
        return AjaxEngine.method("post", url, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout);
    }

    /**
     *
     * @param url
     * @param data
     * @param callback
     * @param ajaxResponse
     * @param async
     * @param dataType
     * @param cache
     * @param contentType
     * @param timeout
     * @return {AjaxEngine}
     */
    AjaxEngine.get = function (url, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout) {
        return AjaxEngine.method("get", url, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout);
    }

    /**
     *
     * @param method
     * @param url
     * @param data
     * @param callback
     * @param ajaxResponse
     * @param async
     * @param dataType
     * @param cache
     * @param contentType
     * @param timeout
     * @param interceptSystemException  是否要统一拦截系统异常，如果统一拦截，就不触发回调 add by 2014.06.12
     * @return {AjaxEngine}
     */
    AjaxEngine.method = function (method, url, data, callback, ajaxResponse, async, dataType, cache, contentType, timeout, interceptSystemException) {
        if (typeof url == "object") {
            var opts = url;
            url = opts["url"];
            data = opts["data"];
            callback = opts["complete"];
            ajaxResponse = opts["ajaxResponse"];
            async = opts["async"];
            dataType = opts["dataType"];
            cache = opts["cache"];
            contentType = opts["contentType"];
            timeout = opts["timeout"];
            interceptSystemException = opts["interceptSystemException"];
        }

        var options = {
            type: method,
            data: data,
            complete: callback,
            async: async,
            dataType: dataType,
            cache: cache,
            contentType: contentType,
            timeout: timeout,
            interceptSystemException: interceptSystemException
        };

        return new AjaxEngine(url, options, ajaxResponse);
    }

    return AjaxEngine;
});
