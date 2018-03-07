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
        /**
         * 插件的配置信息
         * @property {Object}
         */
        pluginConf:null,
        model:null,
        /**
         * 可以查看FancytreeNode的相关信息
         * @property {Array}    节点数组
         * @example
         * <code>
         *     [{
         *          title: "[必填]<节点的名称>",
         *          key:"[选填]<节点的id>"，
         *          parent:"[选填]<父节点信息>",
         *          data:[选填]<业务数据信息>
         *          children:[选填]<子节点>[{
         *              title:[必填]<节点的名称>
         *              key:[选填]<节点的id>
         *              parent:[选填]<父节点信息>
         *              data:[选填]<业务数据信息>
         *              children:[选填]<子节点>
         *          },...]
         *     }...]
         */
        data:null,
        /**
         * @property    {Boolean} 是否有checkbox
         * @default     true
         */
        checkbox:true,
        /**
         * @property    {Boolean} 是否能过滤
         * @default     true
         */
        filterable:true,
        /**
         * @property    {Boolean} 是否能编辑
         * @default     true
         */
        editable:true,
        /**
         * @property    {Object} 编辑的配置信息
         */
        editConf:null,

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
            var conf = this.getConf();
            //pluginConf的配置信息可以覆盖conf中的信息
            if(this.pluginConf){
                conf = _.extend(conf,this.pluginConf);
            }
            this.plugin = this.$el.fancytree(conf);
        },
        /**
         * 获取树的配置信息
         */
        getConf: function () {
            var conf = {
                extensions: [],
                checkbox: this.checkbox,
                selectMode: 3,
                source: this.data,
                aria: true, // Enable WAI-ARIA support
                autoScroll: true, // Automatically scroll nodes into visible area
                debugLevel: 0, // 0:quiet, 1:normal, 2:debug
                focusOnSelect: true, // Set focus when node is checked by a mouse click
                quicksearch: true, // Navigate to next node by typing the first letters
                init:this.initTree,//初始化时调用
            };
            if(this.filterable){
                conf.extensions.push("filter");
                conf.filter ={
                    autoApply: true,   // Re-apply last filter if lazy data is loaded
                    autoExpand: false, // Expand all branches that contain matches while filtered
                    counter: true,     // Show a badge with number of matching child nodes near parent icons
                    fuzzy: false,      // Match single characters in order, e.g. 'fb' will match 'FooBar'
                    hideExpandedCounter: true,  // Hide counter badge if parent is expanded
                    hideExpanders: false,       // Hide expanders if all child nodes are hidden by filter
                    highlight: true,   // Highlight matches by wrapping inside <mark> tags
                    leavesOnly: false, // Match end nodes only
                    nodata: true,      // Display a 'no data' status node if result is empty
                    mode: "dimm"       // Grayout unmatched nodes (pass "hide" to remove unmatched node instead)
                };
            }
            if(this.editable){
                conf.extensions.push("edit");
                conf.edit = this.editConf||{
                    triggerStart: ["f2", "dblclick", "shift+click", "mac+enter"],
                        beforeEdit: function(event, data){
                        // Return false to prevent edit mode
                    },
                    edit: function(event, data){
                        // Editor was opened (available as data.input)
                    },
                    beforeClose: function(event, data){
                        // Return false to prevent cancel/save (data.input is available)
                        console.log(event.type, event, data);
                        if( data.originalEvent.type === "mousedown" ) {
                            // We could prevent the mouse click from generating a blur event
                            // (which would then again close the editor) and return `false` to keep
                            // the editor open:
//                  data.originalEvent.preventDefault();
//                  return false;
                            // Or go on with closing the editor, but discard any changes:
//                  data.save = false;
                        }
                    },
                    save: function(event, data){
                        // Save data.input.val() or return false to keep editor open
                        console.log("save...", this, data);
                        // Simulate to start a slow ajax request...
                        setTimeout(function(){
                            $(data.node.span).removeClass("pending");
                            // Let's pretend the server returned a slightly modified
                            // title:
                            data.node.setTitle(data.node.title + "!");
                        }, 2000);
                        // We return true, so ext-edit will set the current user input
                        // as title
                        return true;
                    },
                    close: function(event, data){
                        // Editor was removed
                        if( data.save ) {
                            // Since we started an async request, mark the node as preliminary
                            $(data.node.span).addClass("pending");
                        }
                    }
                };
            }
            return conf;
        },

        /**
         * 设置树插件的配置参数
         * @param prop
         * @param value
         */
        setOption:function(prop,value){
            this.plugin.fancytree("option", prop,value);
        },
        /**
         * 设置data，设置此data能刷新整个树
         */
        setData:function(data){
            this.data = data;
            this.setOption("source",data);
            //this.plugin.fancytree("option", "source",data);
        },
        /**
         * 获取树插件的对象
         */
        getTreePlugin:function(){
            return  this.plugin.fancytree("getTree");
        },
        /**
         * 重新加载树
         * @param data  从新接在的树节点信息
         */
        reload:function(data){
            this.getTreePlugin().reload(data)
        },
        /**
         * 切换被选择的树节点
         */
        toggleSelect:function(){
            var node = this.getActiveNode();
            node.setSelected( !node.isSelected() );
        },
        /**
         * 三态下只返回
         * @param stopOnParents only return the topmost selected node (useful with selectMode 3)
         * @return {Array}  返回节点的数组
         */
        getSelectedNodes:function(stopOnParents){
            var treePlugin = this.getTreePlugin();
            /*this.plugin.fancytree("getSelectedNodes");
            getSelectedNodes*/
            return treePlugin.getSelectedNodes(stopOnParents);
        },
        /**
         * 销毁
         */
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

        /**
         * 设置节点的名称
         * @param node
         * @param value
         */
        setTile:function(node,value){
            node.setTitle(value);
        },
        /**
         * 清空过滤条件
         */
        clearFilter:function(){
            this.getTreePlugin().clearFilter();
        },
        /**
         * 过滤节点
         * @param value
         */
        filterNodes:function(value){
            this.getTreePlugin().filterNodes(value);
        },
        /**
         * 获取选择的节点
         * @returns {*|{deps}}
         */
        getActiveNode:function(){
            return this.plugin.fancytree("getActiveNode");
        },
        /**
         * 获取节点
         * @param key  节点的id
         * @param searchRoot  获取开始查询的节点
         */
        getNodeByKey:function(key, searchRoot){
            return this.getTreePlugin().getNodeByKey(key, searchRoot);
        },
        /**
         * 获取根节点
         * @returns {*|FancytreeNode}
         */
        getRootNode:function(){
            return this.getTreePlugin().getRootNode();
        },
        /**
         * 根据key删除节点
         * @param node
         */
        removeByKey:function(key){
            var node = this.getNodeByKey(key);
            node.remove();
        }
    });
    return Tree;
});


