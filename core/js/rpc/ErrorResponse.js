/**
 * @module 错误响应对象[ErrorResponse]
 * @description 错误响应对象
 *
 * @author:
 * @date: 2013-08-28 下午10:27
 */
define(["underscore", "core/js/Class"], function (_, Class) {
    var ErrorResponse = Class.extend({
        code: null,
        message: null,
        solution: null,
        subErrors: null,

        ctor: function (code, message, solution, subErrors) {
            this.code = code;
            this.message = message;
            this.solution = solution;
            this.subErrors = subErrors;
        },

        /**
         * 判断是否系统异常
         * @return {boolean}
         * @override
         */
        isSystemException: function () {
        },
        /**
         * 判断是否未登录
         * @return {boolean}
         * @override
         */
        isUnLogonException: function () {
        },
        /**
         * 判断是否拒绝访问
         * @return {boolean}
         * @override
         */
        isAccessDeniedException: function () {
        },

        /**
         * 判断是否违反了业务参数约束（如必填项等）
         * @return {*}
         */
        isBusinessParameterContraintException: function () {
        },

        /**
         * 判断是否违反了业务逻辑约束
         * @return {boolean}
         */
        isBusinessLogicContraintException: function () {
        },

        /**
         * 业务约束异常：包含两类，一类是业务逻辑异常，一类是业务参数异常（如必填项等）
         * @return {boolean|*}
         */
        isBusinessContraintException: function () {
            return this.isBusinessLogicContraintException() || this.isBusinessParameterContraintException();
        },

        /**
         * 根据给定的错误编码数组，判断是哪类的错误异常
         * @param errorCodeArray  某类异常对应的错误编码数组
         */
        isSomeTypeException: function (errorCodeArray) {
            if (errorCodeArray == null || errorCodeArray.length == 0)
                return false;

            var code = parseInt(this.code);
            return _.indexOf(errorCodeArray, code) != -1;
        },

        getCode: function () {
            return this.code;
        },
        getMessage: function () {
            return this.message;
        },
        getSolution: function () {
            return this.solution;
        },
        getErrorMessage: function(){
            var result = [];
            result.push("[");
            result.push(this.code);
            result.push("] ");
            result.push(this.message);
            result.push(", ");
            result.push(this.solution);

            if (this.subErrors != null && this.subErrors.length > 0) {
                result.push("。\n<br>详细信息如下：");
                result.push(this.getSubErrorMessage());
            }

            return result.join("");
        },
        /**
         * 获取子错误的信息，根据子错误的code来获取对应的信息，如果不指定，就获取所有的子错误信息
         * @param subErrorCodes  子错误的code，多个值都逗号分隔，不指定就加载所有的
         * @param ignoreCode     错误信息中是否要忽略code的信息，默认是忽略的
         * @return {*}
         */
        getSubErrorMessage: function (subErrorCodes, ignoreCode) {
            var subErrors = this.subErrors;
            if (subErrors == null || subErrors.length == 0)
                return "";

            var subErrorCodeArray = (subErrorCodes == null || subErrorCodes == "") ? null : subErrorCodes.split(",");
            var isMore = subErrorCodeArray == null || subErrorCodeArray.length > 1;
            ignoreCode = (ignoreCode == null) ? false : ignoreCode;  //默认是不显示code


            var result = [];
            var subError = null;
            var index = 1;
            for (var i = 0, count = subErrors.length; i < count; i++) {
                subError = subErrors[i];

                if (subErrorCodeArray != null) {
                    //如果仅需要显示对应的code，不存在的话，就不显示
                    if (_.indexOf(subErrorCodeArray, subError["code"]) == -1)
                        continue;
                }

                //返回多条记录时，才要加前缀
                if (isMore) {
                    result.push("\n<br>");
                    result.push(index++);
                    result.push("、");
                }

                if (ignoreCode) {
                    result.push("[");
                    result.push(subError["code"]);
                    result.push("]");
                }

                result.push(subError["message"]);
            }

            return result.join("");
        }
    });

    /**
     * 根据transport创建错误响应的结果信息
     *
     * @param transport  标准 XMLHttpRequest 对象，请参考 JQuery API 文档。
     * @return {null}
     */
    ErrorResponse.create = function (transport) {
        var result = null;
        if (transport == null)
            return result;

        var status = transport.status
        if (status == 200)
            return result;

        if (status == 403) {
            result = new ErrorResponse("403", "禁止访问", "请与管理员联系");
            return result;
        }

        if (status == 404) {
            result = new ErrorResponse("404", "服务器找不到指定的资源", "请与管理员联系");
            return result;
        }

        if (status == 500) {
            result = new ErrorResponse("500", "服务器遇到错误，无法完成请求", "请与管理员联系");
            return result;
        }

        if (status == 503) {
            result = new ErrorResponse("503", "服务器暂时无法使用（由于超载或停机维护）", "请与管理员联系");
            return result;
        }

        //与服务器的连接断了 add by 2014.08.04
        if (status == 0 && transport.statusText == "error") {
            result = new ErrorResponse("0", "服务暂时不可用", "请与管理员联系");
            return result;
        }

        return result;
    }

    return ErrorResponse;
});