/**
 * @module websocket接口的消息（默认是json格式）
 * @description  websocket接口的消息对象
 * 处理的json格式：
 * {
 *      successful：<Boolean> true表示成功消息，false表示失败消息
 *      result：<String> 消息内容
 *      errorCode：<String> 异常编码
 *      errMsg：<String> 异常消息
 * }
 * @author:

 */
define(["core/js/Class",
    "core/js/windows/Window"], function (Class,Window) {
    var WebSocketResponse = Class.extend({
        message: null,
        data: null,        //经转换后的响应报文数据
        successful:null,
        result:null,
        errorCode:null,
        errMsg:null,
        commandable:null,
        nameSpace:null,
        method:null,
        ctor: function (message) {
            this.message = message;
            this.data = $.parseJSON(message);
            this.successful = this.data.successful;
            this.result = this.data.result;
            this.errorCode = this.data.errorCode;
            this.errMsg = this.data.errMsg;
            this.commandable = this.data.commandable;
            this.nameSpace = this.data.nameSpace;
            this.method = this.data.method;
        },
        isSuccessful:function(){
            return this.successful;
        },
        getResult:function(){
            return this.result;
        }

    });

    return WebSocketResponse;
});