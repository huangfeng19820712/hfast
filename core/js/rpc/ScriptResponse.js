/**
 * @module script响应对象[ScriptResponse]
 * @description script响应对象
 *
 * @author : chenw(chenw@hsit.com.cn)
 * @date: 13-11-4
 */
define(["jquery", "core/js/rpc/AjaxResponse", "core/js/rpc/ErrorResponse"], function ($, AjaxResponse, ErrorResponse) {
    var ScriptResponse = AjaxResponse.extend({
        /**
         *
         * @param transport
         * @return {*}
         * @override
         */
        getSuccessResponse: function (transport) {
            if (transport != null) {
                var status = transport.status
                if (status != 200)
                    return null;
            }
            return this.getData(transport);
        },
        /**
         * 获取错误的响应报文
         * @param transport {@link XMLHttpRequest}
         * @return {null}
         * @override
         */
        getErrorResponse: function (transport) {
            return ErrorResponse.create(transport);
        }
    });

    return ScriptResponse;
});