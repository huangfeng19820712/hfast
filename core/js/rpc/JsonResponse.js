/**
 * @module JSON响应对象[JsonResponse]
 * 把文本转成JSON根式
 * @description JSON响应对象
 *
 * @author:
 * @date: 2013-08-29 上午9:06
 */
define(["core/js/rpc/TextResponse", "core/js/rpc/ErrorResponse"],
    function ( TextResponse, ErrorResponse) {
    var JsonResponse = TextResponse.extend({
        /**
         * 将响应的报文（JSON格式的数据）转换成对象
         * @param transport
         * @return {*}
         */
        getData: function (transport) {
            if (this.data != null)
                return this.data;

            var data = this._super(transport);
            data = $.parseJSON(data);

            this.data = data;

            return data;
        },
    });

    return JsonResponse;
});