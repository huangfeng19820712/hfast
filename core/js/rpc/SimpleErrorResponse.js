/**
 * @module Rop Json错误响应处理[RopErrorResponse]
 * @description Rop json格式的错误报文处理
 *
 * @author:
 * @date: 2013-09-11 下午8:19
 */
define(["core/js/rpc/ErrorResponse", "underscore"], function (ErrorResponse, _) {
    var RopErrorResponse = ErrorResponse.extend({
        getMessage: function () {
            return this.toString();
        },
        getErrorMessage: function(){
            //如果是业务逻辑异常，则直接返回子错误信息（仅针对ROP框架）
            if (this.isBusinessLogicContraintException()) {
                return this.getSubErrorMessage();
            }

            return this._super();
        },
        /**
         * 判断是否系统异常
         * @return {boolean}
         */
        isSystemException: function () {
            var errors = RopErrorResponse.Error;
            var unSystemExceptionArray = [];
            for (var key in errors) {
                unSystemExceptionArray = unSystemExceptionArray.concat(errors[key]);
            }
            var code = parseInt(this.code);

            //除列表中以外的异常都认为是系统异常
            return _.indexOf(unSystemExceptionArray, code) == -1;
        },
        /**
         * 判断是否未登录
         * @return {boolean}
         */
        isUnLogonException: function () {
            return this.isSomeTypeException(RopErrorResponse.Error.LOGON_TIMEOUT);
        },
        /**
         * 判断是否拒绝访问
         * @return {boolean}
         */
        isAccessDeniedException: function () {
            return this.isSomeTypeException(RopErrorResponse.Error.ACCESS_DENY);
        },

        /**
         * 判断是否违反了业务逻辑约束（如用户名不能重复等）
         * @return {boolean}
         */
        isBusinessLogicContraintException: function () {
            return this.isSomeTypeException(RopErrorResponse.Error.BUSINESS_LOGIC_CONTRAINT);
        },
        /**
         * 判断是否违反了业务参数约束（如必填项等）
         * @return {*}
         */
        isBusinessParameterContraintException: function () {
            return this.isSomeTypeException(RopErrorResponse.Error.BUSINESS_PARAMETER_CONTRAINT);
        }
    });

    RopErrorResponse.Error = {
        LOGON_TIMEOUT: [20, 21],     //缺少sessionId或者无效的sessionId参数
        ACCESS_DENY: [2, 3],         //开发者权限不足
        BUSINESS_LOGIC_CONTRAINT: [9],           //业务逻辑异常
        BUSINESS_PARAMETER_CONTRAINT: [32, 33]  //业务参数异常
    }

    return RopErrorResponse;
});