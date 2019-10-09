/**
 * @author:   * @date: 2016/2/29
 */
define([
        $Component.SIMPLELAYOUT.src,
        $Component.TOOLSTRIPITEM.src,
        "core/js/context/ApplicationContext",
        "core/js/model/PageModel",
        $Component.BASEWEBSOCKET.src],
    function ( SimpleLayout,ToolStripItem,ApplicationContext,PageModel,BaseWebSocket) {
        var FORM_MODEL_URL = "/rest/msgchat!page.action";
        var ChatModel = PageModel.extend({
            url:FORM_MODEL_URL,
            /*defaults:{
                id:"1"
            }*/
        });



        var chatList = SimpleLayout.extend({
            $CHAT_URL:"/rest/msgchat!edit.action",
            model:null,
            webSocket:null,
            beforeInitializeHandle:function(){
                this._super();
                this.$bottomReferent =  $(".copyright").eq(0);
                var that = this;
                this.initWebSocket();
                this.item = {
                    comXtype: $Component.PANEL,
                    height:"100%",
                    comConf:{
                        isShowHeader:false,
                        height:"100%",
                        footerRegion:this.getFooterRegionConfig(),
                        mainRegion: {
                            comXtype: $Component.CHATLIST,
                            autoScroll:true,
                            comConf: {
                            },
                            autoScroll:true,
                        }
                    }
                };

                this.ajaxClient = ApplicationContext.getAjaxClient();
                this.model = new ChatModel();
                this.model.setAjaxClient(that.ajaxClient);
                this.model.setFetchSuccessFunction(that.ininChats,this,this.model);
            },

            initWebSocket:function(){
                //注意，需要登录才能访问
                this.webSocket = new BaseWebSocket({
                    url:"chat/1"
                });

            },

            getFooterRegionConfig:function(){
                var that = this;
                return {
                    comXtype:$Component.CHATEDITOR,
                    comConf:{
                        itemOptions:[{
                            text: " 历史消息",
                            mode: ToolStripItem.Mode.LINK,
                            theme:null,
                            onclick: function () {

                            }
                        }, {
                            text: "发送",
                            theme:null,
                            mode: ToolStripItem.Mode.LINK,
                            onclick: function () {
                                //编辑器
                                var textEditor = this.getParent().getParent();
                                //获取输入值
                                var value = textEditor.getValue();
                                if(value==null||value==''){
                                    return ;
                                }
                                //获取Panel
                                var list = that.getChatList();
                                var data = {
                                    id:$.uuid(),
                                    userName:"我",
                                    content:value ,
                                    createTime:new Date()
                                };

                                var itemOption = _.extend(data,{
                                    floatMode:$Component.CHATBOX.floatMode.right,
                                });
                                list.insertItem(itemOption);
                                textEditor.clearValue();
                                //设置滚动条滚动到底部
                                that.listScrollToBottom();
                                that.addChatToService(data);
                            },
                        }]
                    }

                } ;
               /* return
                comXtype:$Component.TEXTEDITOR,
                    comConf:{
                    textMode:"multiline",
                        placeholder:"内容",
                        buttons:[{
                        mode:ToolStripItem.Mode.LADDA,
                        text:"发送",
                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                        onclick:function(event){
                            //编辑器
                            var textEditor = this.getParent();
                            //获取输入值
                            var value = textEditor.getValue();
                            if(value==null||value==''){
                                return ;
                            }
                            //获取Panel
                            var list = that.getChatList();
                            var data = {
                                id:$.uuid(),
                                userName:"我",
                                content:value ,
                                createTime:new Date()
                            };

                            var itemOption = _.extend(data,{
                                floatMode:$Component.CHATBOX.floatMode.right,
                            });
                            list.insertItem(itemOption);
                            textEditor.clearValue();
                            //设置滚动条滚动到底部
                            that.listScrollToBottom();
                            that.addChatToService(data);

                        }
                    }]
                };*/
            },

            /**
             *  渲染后，初始化聊天的内容
             */
            onrender:function(){
                //渲染后，初始化内容
                this.model.fetch({
                    data:{sidx:"createTime",
                        sord:"desc"}

                });
            },
            /**
             *  聊天列表滚动到底部
             */
            listScrollToBottom:function(){
                //设置滚动条滚动到底部
                var panelMainRegion = this.getPanelMainRegion();
                panelMainRegion.$el.mCustomScrollbar("scrollTo","bottom");
            },
            /**
             * 初始化聊天信息
             * @param   data
             */
            ininChats:function(model){
                var records = model.getRecords();
                var list = this.getChatList();
                for(var i in records){
                    var record = records[i];
                    var chat = _.clone(record);
                    //判断是否是自己的聊天信息
                    if(record.userId=='1'){
                        chat.floatMode = $Component.CHATBOX.floatMode.right;
                        chat.userName = '我';
                    }
                    this.addChat(chat);
                }
                this.listScrollToBottom();
            },
            /**
             * 添加聊天信息到ChatList中
             * @param chat
             */
            addChat:function(chat){
                var list = this.getChatList();

                /*var itemOption = chat;
                if(true){
                    data.userName = '我';
                    itemOption = _.extend(data,{
                        floatMode:$Component.CHATBOX.floatMode.right,
                    });
                }*/
                list.insertItem(chat);
            },
            /**
             * 把聊天信息添加到服务器
              * @param data
             */
            addChatToService:function(data){
                var request = this.ajaxClient.buildClientRequest(this.$CHAT_URL);
                request.addParams(data).post(function(compositeResponse){
                    var obj = compositeResponse.getSuccessResponse();
                    if (!obj.successful) {
                        //成功失败，则需要提示发送失败，然后可以重发
                        that.sendFail(obj.errMsg);
                    }
                });
            },
            sendFail:function(id){

            },



            /**
             * 获取panel的主区域内容
             * @returns {Region|null}
             */
            getPanelMainRegion:function(){
                var centerRegion = this.getCenterRegion();
                var panel = centerRegion.getComRef();
                var mainRegionRef = panel.getMainRegionRef();
                return mainRegionRef;
            },
            /**
             * 获取列表对象
             * @returns {ChatList|null}
             */
            getChatList:function(){
                return this.getPanelMainRegion().getComRef();
            }
        });
        return chatList;
    });

