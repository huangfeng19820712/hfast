/**
 * @author:   * @date: 2016/2/26
 */
define([
    "core/js/editors/Editor",
    $Component.TOOLSTRIP.src,

], function (Editor,ToolStrip,ToolStripItem) {
    var ChatEditor = Editor.extend({
        xtype: $Component.CHATEDITOR,
        toolStrip:null,
        isShowLabel:false,
        /**
         * toolStrip中的itemOptions属性
         */
        itemOptions:null,
        _init$Input: function () {
            //添加按钮栏
            this.toolStrip = new ToolStrip({
                $container:this.$el,
                parent:this,
                className: "btn-group",
                itemOptions:this.itemOptions
            });
            this.$el.addClass("text-right");
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.TEXTAREA);
            }
            this._super();
        },

    });

    return ChatEditor;
})
