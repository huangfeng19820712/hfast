/**
 * 列表对象
 * @author:   * @date: 2016/2/29
 */
define([
    "core/js/list/List",
    "core/js/box/ChatBox",
        "text!core/resources/tmpl/ContactBox.html"
], function (List,ChatBox,Template) {
    var ContactList = List.extend({
        xtype:$Component.CONTACTLIST,
        /**
         * {Array} 数据，具体对象如下：
         * name："[String]<昵称>"
         * icon："[String]<图片路径>"
         */
        data:null,
        /**
         * {Array}数组，保存ChatBox对象，
         */
        _chats:[],

        createItem:function(item){
            var chatBox = new ChatBox({
                template:Template,
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
    return ContactList;
});
