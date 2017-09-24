/**
 * @author:   * @date: 15-8-29
 */

define(["core/js/rpc/AjaxRequest",
    "core/js/rpc/AjaxClient",
    "core/js/rpc/SimpleConstant",
    "core/js/rpc/SimpleRequest"
], function (AjaxRequest, AjaxClient,SimpleConstant,SimpleRequest) {
    var SimpleClient = AjaxClient.extend({
        /**
         * 获取框架的国际化信息。
         *
         * @default zh-CN
         */
        locale: SimpleConstant.Locale.ZH_CN,

        /**
         * 报文格式
         * @default json
         */
        messageFormat: SimpleConstant.MessageFormat.JSON,

        ctor: function (serverUrl, appKey, appSecret, messageFormat, locale) {
            this._super(serverUrl);
            this.setMessageFormat(messageFormat);
            this.setLocale(locale);
        },
        buildClientRequest: function (methodName) {
            var result = new SimpleRequest(this, methodName);
            return result;
        },
        buildJsonResponse: function (transport, callback, responseData) {
            return new RopJsonResponse(transport, callback, responseData);
        },
        getLocale: function () {
            return this.locale;
        },
        setLocale: function (locale) {
            if(locale){
                this.locale = locale;
            }

        },
        getMessageFormat: function () {
            return this.messageFormat;
        },
        setMessageFormat:function(messageFormat){

            if(messageFormat){

                this.messageFormat = messageFormat
            }
        }

    });

    return SimpleClient;
});