/**
 * @author:   * @date: 2016/2/29
 */
define([
        $Component.SIMPLELAYOUT.src,
        $Component.TOOLSTRIPITEM.src,
        $Component.PANEL.src,
        "core/js/context/ApplicationContext",
        "core/js/model/PageModel",
        "core/js/utils/Utils"],
    function (SimpleLayout, ToolStripItem, Panel, ApplicationContext, PageModel) {
        var FORM_MODEL_URL = "/rest/msgchat!page.action";
        var ChatModel = PageModel.extend({
            url: FORM_MODEL_URL,
            /*defaults:{
             id:"1"
             }*/
        });

        var chatHistoryPanel = Panel.extend({
            $CHAT_URL: "/rest/msgchat!edit.action",
            model: null,
            isShowHeader: false,
            //height: "100%",
            mainRegion: {
                comXtype: $Component.CHATLIST,
                autoScroll: true,
                comConf: {},
                autoScroll: true,
            },
            isShowFooter:true,
            isShowTopToolbarRegion:true,
            beforeInitializeHandle: function () {
                if(this.isShowTopToolbarRegion){
                    this.topToolbarRegion = this.topToolbarOption();
                }
                if(this.isShowFooter){
                    this.footerRegion = this.getFooterRegionConfig();
                }
                this.ajaxClient = ApplicationContext.getAjaxClient();
                this.model = new ChatModel();
                this.model.setAjaxClient(this.ajaxClient);
                this.model.setFetchSuccessFunction(this.ininChats, this, this.model);
            },
            topToolbarOption: function () {
                var that = this;
                return {
                    comXtype: $Component.NAVFORMEDITOR,
                    textAlign: $TextAlign.RIGHT,
                    comConf: {
                        fields: [
                            {
                                isShowLabel: false,
                                placeholder: "关键字",
                                name: "content",
                                editorType: $Component.TEXTEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }, {
                                isShowLabel: false,
                                placeholder: "开发时间",
                                name: "createTimeStart",
                                editorType: $Component.LAYDATEEDITOR,
                                //className:"col col-md-6 ",
                            }, {
                                isShowLabel: false,
                                placeholder: "结束时间",
                                name: "createTimeEnd",
                                editorType: $Component.LAYDATEEDITOR,
                                //className:"col col-6",
                            }
                        ],
                        toolStripConf: {
                            itemOptions: [{
                                //roundedClass:$Rounded.ROUNDED,
                                iconSkin: "fa-search",
                                text: "查询",
                                title: '查询',
                                themeClass: ToolStripItem.ThemeClass.PRIMARY,
                                onclick: function () {
                                    var allFieldValue = this.getParent().getParent().getAllFieldValue();
                                    /*console.info(allFieldValue)
                                     $.window.alert("值在console中");*/
                                    var defaultParam = that.getDefaultParam();
                                    defaultParam.data.filters = JSON.stringify(that.convert2Filters(allFieldValue));
                                    that.model.fetch(defaultParam);
                                }
                            }]
                        }
                    }
                };
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
            },

            /**
             *  渲染后，初始化聊天的内容
             */
            onrender: function () {
                //渲染后，初始化内容
                this.model.fetch(this.getDefaultParam());
            },

            convert2Filters: function (allFieldValue) {
                var rules = [];
                if($.isNotBank(allFieldValue.content)){
                    rules.push({
                        "field": "content",
                        "op": "contains",
                        "data": allFieldValue.content
                    });
                }
                //大于开始的时间
                if($.isNotBank(allFieldValue.createTimeStart)){
                    rules.push({
                        "field": "createTime",
                        "op": "gte",
                        "data": allFieldValue.createTimeStart
                    });
                }
                //小于结束时间
                if($.isNotBank(allFieldValue.createTimeEnd)){
                    rules.push({
                        "field": "createTime",
                        "op": "lte",
                        "data": allFieldValue.createTimeEnd
                    });
                }
                return   {"groupOp": "AND",
                    "rules": rules};

            },

            /**
             * 默认请求参数
             * @returns {{data: {sidx: string, sord: string}}}
             */
            getDefaultParam: function () {
                return {
                    data: {
                        sidx: "createTime",
                        sord: "asc"
                    }
                };
            },

            /**
             *  聊天列表滚动到底部
             */
            listScrollToBottom: function () {
                //设置滚动条滚动到底部
                var panelMainRegion = this.getPanelMainRegion();
                panelMainRegion.$el.mCustomScrollbar("scrollTo", "bottom");
            },
            /**
             * 初始化聊天信息
             * @param   data
             */
            ininChats: function (model) {
                var records = model.getRecords();
                var list = this.getChatList();
                //先清空list的内容
                list.clear();
                for (var i in records) {
                    var record = records[i];
                    var chat = _.clone(record);
                    //判断是否是自己的聊天信息
                    if (record.userId == '1') {
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
            addChat: function (chat) {
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
            addChatToService: function (data) {
                var request = this.ajaxClient.buildClientRequest(this.$CHAT_URL);
                request.addParams(data).post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (!obj.successful) {
                        //成功失败，则需要提示发送失败，然后可以重发
                        that.sendFail(obj.errMsg);
                    }
                });
            },
            sendFail: function (id) {

            },
            /**
             * 获取panel的主区域内容
             * @returns {Region|null}
             */
            getPanelMainRegion: function () {
                var mainRegionRef = this.getMainRegionRef();
                return mainRegionRef;
            },
            /**
             * 获取列表对象
             * @returns {ChatList|null}
             */
            getChatList: function () {
                return this.getPanelMainRegion().getComRef();
            }

        });

        return chatHistoryPanel;
    });

