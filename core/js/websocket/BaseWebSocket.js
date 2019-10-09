/**
 * @module 基础的WebSocket类

 *
 * @author:
 * @date: 2013-08-14 上午9:29
 */
define(["core/js/Observable","core/js/windows/messageBox",
    "core/js/websocket/WebSocketResponse"], function (Observable,
                                                MessageBox,WebSocketResponse) {
    /**
     * @class
     * @extends {Observable}
     */
    var BaseWebSocket = Observable.extend({
        webSocket:null,
        protocol:null,
        url:null,
        // 用心跳机制防止 Server 端超时。也可以让客户端及时发现掉线。
        heartbeat_interval: null,
        missed_heartbeats :0,
        //登录成功后标题
        loginTile:null,
        heartbeat_ping_msg : "--heartbeat-ping--",
        heartbeat_pong_msg : "--heartbeat-pong--",
        logoutMes:"logout",
        //单位是毫秒
        frequency:5000,

        onlogout:null,
        /**
         * 接收到消息的事件，
         * @event   websocket的事件对象
         * @message 发送的消息
         */
        onmessage:null,

        ctor: function (options) {
            this.set(options);
            this.protocol = this.getProtocol();
            //this.websocket = new WebSocket("ws://localhost:18080/websocket/user000");
            var realUrl = this.protocol+"//"+document.location.host +"/"+this.url;
            this.websocket = new WebSocket(realUrl);
            var that = this;

            this.websocket.onopen = function (event) {
                console.log("websocket opened.");
                //document.getElementById("username").readOnly = true;

                //that.websocket.send(that.getUserName()+"entered the room.");
                that.websocket.send(that.loginTile);

                // heartbeat
                if (that.heartbeat_interval === null) {
                    that.missed_heartbeats = 0;
                    that.heartbeat_interval = setInterval(function () {
                        try {
                            that.missed_heartbeats++;
                            if (that.missed_heartbeats > 5) {
                                throw new Error("Too many missed heartbeats.");
                            }
                            that.websocket.send(that.heartbeat_ping_msg);
                        } catch (e) {
                            console.warn("Closing connection. Reason: " + e.message);
                            that.closeWebSocket();
                        }
                    }, that.frequency);// send ping every 5 seconds.
                }
            };
            this.websocket.onmessage = function(event){
                //接收消息，主要接收两种消息，一种聊天消息，一种心跳消息
                //心跳消息
                if (event.data === that.heartbeat_pong_msg) {
                    console.log("pong");
                    that.missed_heartbeats = 0;
                    return;
                }else if(event.data == that.logoutMes){
                    console.log('websocket server ready to close. ' +"info:"+that.logoutMes);
                }
                //聊天消息
                that.trigger("message",event);
            };

            this.websocket.onerror = function (event) {
                console.log("error: " + event);
            };
            this.websocket.onclose = function (event) {
                console.log('websocket closed by server. ' + event.code + ":" + event.reason);
                that.trigger("logout",event);
                that.closeWebSocket();
            };
        },
        /**
         * 设置消息的交互对象，后端直接调用前段的方法
         * @param obj
         */
        setMessageOptionObject:function(obj){
            this.on("message",  $.proxy(this.receiveMessage, obj));
        },
        /**·
         * 接受消息的方法
         * @param event
         */
        receiveMessage:function(event){
            var messageEvent = event.messageEvent;
            //解析消息，包含异常,返回的格式：CompositeResponse

            var response = new WebSocketResponse(messageEvent.data);
            if (response.isSuccessful()) {
                if(response.commandable&&response.method&& _.isFunction(this[response.method])){
                    //MessageBox.success(compositeResponse.getSuccessMsg());
                    var result = response.getResult();
                    this[response.method](result);
                }
            } else {
                var msg = response.errMsg;
                if(msg!=null&&msg!=''){
                    $.window.showMessage(msg, {
                        handle: function () {
                        }
                    });
                }

            }
        },

        /**
         * 获取协议，ws或者是wss
         * @returns {*}
         */
        getProtocol:function(){
            //获取当前页面是否是https
            var protocol = document.location.protocol;
            if("https:"==protocol){
                return "wss:";
            }
            return "ws:";
        },

        /**
         * 发送消息
          * @param message
         */
        sendMessage:function(message){
            this.websocket.send(message);
        },

        closeWebSocket:function(){
            if (this.websocket !== null) {
                this.websocket.close();
                this.websocket = null;
            }
            if (this.heartbeat_interval !== null) {
                clearInterval(this.heartbeat_interval);
                this.heartbeat_interval = null;
            }
        }

    });

    return BaseWebSocket;
});