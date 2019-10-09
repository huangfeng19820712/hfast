/**
 *
 * @author:   * @date: 2018/6/13
 */

define([
    "core/js/windows/messageBox"], function ( MessageBox) {
    var ResponseHandle = {
        /**
         * 只处理成功的信息，异常的信息，系统统一处理
         */
        successHandle: function (compositeResponse, func) {

            if(compositeResponse){
                var obj = compositeResponse.getSuccessResponse();
                var msg = compositeResponse.getMessage();
                if (compositeResponse.isSuccessful()) {
                    //当什么都没有返回的时候，也是默认成功
                    if(obj==undefined||obj.successful){
                        if(func){
                            func(compositeResponse);
                        }
                    }else{
                        //请求正常，但是有系统异常
                        $.window.alert(obj.errMsg, {
                            title: $i18n.errorLabel
                        });
                    }
                } else {
                    //请求的操作就异常，网络异常，
                    $.window.alert(msg, {
                        handle: function () {

                        }
                    });
                }
            }else {

            }
        },
        /**
         * 只处理异常的情况，成功的情况统一处理成提示成功消息
         * @param compositeResponse
         * @param func
         */
        failHandle:function(compositeResponse, func){
            var obj = compositeResponse.getSuccessResponse();
            var msg = compositeResponse.getMessage();
            if (compositeResponse.isSuccessful()) {
                if(obj.successful){
                    if(func){
                        func(compositeResponse);
                    }
                }else{
                    //请求正常，但是有系统异常
                    $.window.alert(obj.errMsg, {
                        title: $i18n.errorLabel
                    });
                }
            } else {
                //请求的操作就异常，网络异常，
                $.window.alert(msg, {
                    handle: function () {

                    }
                });
            }
        }

    };
    return ResponseHandle;
})