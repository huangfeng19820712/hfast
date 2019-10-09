/**
 * @module  内容盒子[ContentBox]
 * @description 提供一个文本标签的类。
 *
 * @example
 * 以下是一个 {@link controls.ContentBox} 文本标签控件的使用示例。
 * <code language="JavaScript">

 * </code>
 *
 * @date: 2013-10-30 下午7:01
 */
define([
    "core/js/controls/AbstractControlView",
    "text!core/resources/tmpl/ChatBox.html"
], function (AbstractControlView,Template) {
    var ChatBox = AbstractControlView.extend({
        xtype:$Component.CHATBOX,
        template:Template,
        floatMode:null,
        className:"content-boxes-v3 block-grid-v1 rounded",
        /**
         * 具体的数据，Object对象
         * name: 名称
         * content：内容
         * sendTime：发送时间
         */
        data:null,
        initClass:function(){
            this._super();
            if($Component.CHATBOX.floatMode.right === this.floatMode){
                this.$el.addClass($Component.CHATBOX.floatMode.right);
            }
            //添加id
            var id = this.data.id;
            this.$el.data("id",id);
        }
    });
    return ChatBox;
});
