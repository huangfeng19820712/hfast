/**
 * 列表对象
 * @author:   * @date: 2016/2/29
 */
define([
    "core/js/list/List",
    "core/js/box/ChatBox",
], function (List,ChatBox) {
    var ChatList = List.extend({
        xtype:$Component.CHATLIST,
        /**
         * {Array} 数据，具体对象如下：
         * name："[String]<名字>"
         * content："[String]<内容>"
         * sendTime；"[String]<发送时间>"
         * floatMode：[String]<ChatBox中的floatMode>
         *
         */
        data:null,
        /**
         * {Array}数组，保存ChatBox对象，
         */
        _chats:[],

        createItem:function(item){
            var chatBox = new ChatBox({
                floatMode:item.floatMode,
                $container:this.$el,
                data: item
            });
            this._chats[item.id] = chatBox;
        },

        /**
         * 根据id获取ChatBox对象
         * @param id
         */
        getChatBoxById:function(id){
            return this._chats[id];
        },

    });
    return ChatList;
});
