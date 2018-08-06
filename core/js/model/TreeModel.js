/**
 * @author:   * @date: 2016/4/7
 */
define([
    "core/js/rpc/Action",
    "core/js/model/BaseModel"
], function (Action,BaseModel) {
    /**
     * @class
     * @extends {BaseModel}
     */
    var TreeModel =  BaseModel.extend({
        xtype:$Component.TREEMODEL,
        METHODNAME_GETALL:"getAll",
        initialize:function(options){
            this._super(options);
            this.initAttributes({
                /**
                 *记录的集合,{Array.<Object>}
                 */
                records:null,
                /**
                 * record中映射到tree对象parentId属性的属性名称,默认是"parentId"
                 */
                parentIdAttr:"parentId",
                /**
                 * record中映射到tree对象title属性的属性名称,默认是"title"
                 */
                titleAttr:"title",
               });
        },
        /**
         * 获取所有数据
         */
        getAll:function(methodName){
            var action = new Action({
                nameSpace:this.nameSpace,
                methodName:methodName||this.METHODNAME_GETALL
            });
            this.fetch({
                url:action.getUrl()
            });
            return this;
        },
        /**
         * 返回的内容转换成模型中的属性，return 是模型本身
         * @param {Model}  model    模型对象
         * @param {Object} result   返回的结果
         * @param {Object} options  请求的参数
         * @return {Model} 模型本身
         */
        responeToModel:function(model,result,options){
            var newVar = model.set({records: model.parse(result, options)}, options);
            return newVar;
        },
        setParentIdAttr:function(parentIdAttr){
            this.set("parentIdAttr", parentIdAttr);
        },
        setTitleAttr:function(title){
            this.set("titleAttr", title);
        },
        getParentIdAttr:function(){
            return this.get("parentIdAttr");
        },
        getTitleAttr:function(){
            return this.get("titleAttr");
        },
        /**
         * 根据records信息转换成tree对象
         * * @returns {Object}
         * <code>
         * {
         *      title:{String}"<必选>[标题]"
         *      folder:{Boolean}"<必选>[支节点，还是叶节点]"，
         *      children:{Array}"[
         *          title:{String}
         *          folder:{Boolean}
         *          children:{Array}
         *      ]"，
         * }
         * </code>
         */
        getTree:function(){
            var records = this.get("records");
            var tree = [];
            //暂时找不到父节点的id数组，包括根节点
            var noDealIds = new Array();
            var that = this;
            //添加到父节点的children数组中
            _.each(records, function (record, key, list) {
                tree[record.id] = record;
                tree[record.id].title = record[that.getTitleAttr()];
                if (record[that.getParentIdAttr()]!=null) {
                    var treeId = record[that.getParentIdAttr()];
                    var recordTemp = tree[treeId];
                    if (recordTemp != null) {
                        if(recordTemp.children==null){
                            recordTemp.children = new Array();
                        }
                        recordTemp.children.push(record);
                        that.setTreeFolder(recordTemp,true);
                    } else {
                        noDealIds.push(record.id);
                    }
                }else{
                    noDealIds.push(record.id);
                }
            });

            var rootNodeIds = new Array();
            /**
             * 处理之前未处理的节点
             */
            for (var i = 0; i < noDealIds.length; i++) {
                var id = noDealIds[i];
                var parentId = tree[id][that.getParentIdAttr()];
                if($.isNotBank(parentId)&&tree[parentId]){
                    //parentId非空
                    if (!tree[parentId].children) {
                        tree[parentId].children = new Array();
                    }
                    tree[parentId].children.push(tree[id]);
                    that.setTreeFolder(tree[parentId],true);
                }else{
                    rootNodeIds.push(id);
                }
            }

            /**
             * 获取，pid为空的菜单
             */
            var doneTree = new Array();
            _.each(rootNodeIds, function (id, key, list) {
                doneTree.push(tree[id]);
            });

            return doneTree;

        },
        setTreeFolder:function(tree,folder){
            tree.folder=folder;
        }
    });
    return TreeModel;
})

