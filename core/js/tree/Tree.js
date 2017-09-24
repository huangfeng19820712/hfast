/**
 * 引用了Fancytree插件
 * http://wwwendt.de/tech/fancytree/demo/#welcome.html
 * @author:   * @date: 2016/1/16
 */
define([
    "core/js/controls/Control",
    "fancytree"
], function ( Control) {
    var Tree = Control.extend({
        xtype:$Component.TREE,

        plugin: null,
        model:null,
        data:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        _initElAttr: function () {
            this._super();
            this._initWithPlugIn();
        },
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            this.plugin = this.$el.fancytree({
                source: this.data,
                aria: true, // Enable WAI-ARIA support
                autoScroll: true, // Automatically scroll nodes into visible area
                debugLevel: 0, // 0:quiet, 1:normal, 2:debug
                focusOnSelect: true, // Set focus when node is checked by a mouse click
                quicksearch: true, // Navigate to next node by typing the first letters
            });
        },
        destroy:function(){
            this.$el.fancytree("destroy");
            this._super();
        },
        /**
         * 展开所有节点
         */
        expandAll:function(){
            this.$el.fancytree("getTree").visit(function(node){
                node.setExpanded(true);
            });
        },
        /**
         * 折叠多有的节点
         */
        collapseAll:function(){
            this.$el.fancytree("getTree").visit(function(node){
                node.setExpanded(false);
            });
        },
    });
    return Tree;
});


