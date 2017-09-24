/**
 * @module
 * @description
 *
 * @author:
 * @date:
 */
define(function () {
    var RopConstant = {

        /**
         * 系统级参数的名称
         */
        SystemParameterNames: {
            METHOD: "_method",          //方法的默认参数名
            FORMAT: "_format",          //格式化默认参数名
            LOCALE: "_locale",          //本地化默认参数名
            SESSION_ID: "_sessionId",  //会话id默认参数名
            APP_KEY: "_appKey",         //应用键的默认参数名
            VERSION: "_v",               //服务版本号的默认参数名
            SIGN: "_sign",                //签名的默认参数名
            IGNORE_NULL: "_ignoreNull"     //是否忽略空值属性，如果忽略空值属性，当属性值为null时，返回报文不出现该属性。1:忽略，0：不忽略，默认是1
        },

        /**
         * 是否忽略空值属性，如果忽略空值属性，当属性值为null时，返回报文不出现该属性。1:忽略，0：不忽略，默认是1
         */
        IgnoreNull: {
            YES: "1",
            NO: "0"
        },

        /**
         * 支持的响应的格式类型
         */
        MessageFormat: {
            JSON: "json",
            XML: "xml",
            STREAM: "stream"    //流的格式：针对图片或者文件流
        },

        Locale: {
            ZH_CN: $global.BaseFramework.locale
        }
    };

    return RopConstant;
});