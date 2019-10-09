/**
 * @module 把相应内容转成文本即可[TextResponse]
 * @description Text响应对象
 *
 * @author:
 * @date: 2013-08-29 上午9:06
 */
define(["core/js/rpc/AjaxResponse", "core/js/rpc/SimpleErrorResponse"], function ( AjaxResponse, SimpleErrorResponse) {
    var TextResponse = AjaxResponse.extend({
        /**
         * 将响应的报文（JSON格式的数据）转换成对象
         * @param transport
         * @return {*}
         */
        getData: function (transport) {
            if (this.data != null)
                return this.data;
            var data = this._super(transport);
            return data;
        },
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
            return SimpleErrorResponse.create(transport);
        }
    });

    return TextResponse;
});