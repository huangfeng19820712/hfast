/**
 * @module 最终响应报文[CompositeResponse]
 * @description 最终响应报文，包含正确报文或错误报文
 *
 * @author:
 * @date: 2013-08-28 下午10:08
 */
define(["core/js/Class", "core/js/rpc/ErrorResponse"], function (Class, ErrorResponse) {
    var CompositeResponse = Class.extend({
        successful: false,
        errorResponse: null,
        successResponse: null,

        ctor: function (successResponse, errorResponse) {
            this.successResponse = successResponse;
            this.errorResponse = errorResponse;
            this.successful = errorResponse == null;
        },
        /**
         * 显示操作后的提示信息
         *
         * @return {*}
         */
        getMessage: function () {
            if (this.isSuccessful())
                return this.getSuccessMsg();

            return this.getErrorMsg();
        },
        getSuccessMsg: function () {
            return "操作成功！";
        },
        getErrorMsg: function () {
            var errorResponse = this.getErrorResponse();
            if (errorResponse == null)
                return null;

            return errorResponse.getErrorMessage();
        },
        isSuccessful: function () {
            return this.successful;
        },
        getErrorResponse: function () {
            return this.errorResponse;
        },
        getSuccessResponse: function () {
            return this.successResponse;
        }
    });

    /**
     * 根据错误报文响应结果
     *
     * @param transport
     * @return {CompositeResponse}
     */
    CompositeResponse.createErrorResponse = function (transport) {
        var errorResponse = ErrorResponse.create(transport);

        return new CompositeResponse(null, errorResponse);
    }

    return CompositeResponse;
});