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
        initialize:function(options){
            this._super(options);
            this.initAttributes({
                /**
                 *记录的集合,{Array.<Object>}
                 */
                records:null,
                /**
                 * 被选择的记录的id，{Array.<String>}
                 */
                selectedIds:null,
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
         * 保存选择的id
         * @param options       额外需要传递到服务端的数据
         * @param selectedIds   选择的id
         * @param methodName    方法名称
         * @param nameSpace
         *
         * @returns {boolean}
         */
        saveSelectedIds:function(options,selectedIds,methodName,nameSpace){
            var selectedIds_old = this.get("selectedIds");
            selectedIds_old = _.uniq(selectedIds_old,true);
            var selectedIds_new = _.uniq(selectedIds,true);
            var changeSelectedIds = this.getChangeSelectedIds(selectedIds_old, selectedIds_new);

            if(changeSelectedIds){
                var action = new Action({
                    nameSpace:this.nameSpace,
                    methodName:methodName
                });
                var data = _.extend({
                    //格式化成json字符串
                    changeSelectIds: JSON.stringify(changeSelectedIds)
                },options);
                this.fetch({
                    url:action.getUrl(),
                    data: data
                });
                this.setSelectedIds(selectedIds_new);
                return true;
            }else{
                return false;
            }
        },
        /**
         * 获取变更的被选择的id
         * 变更的内容有:删除的、新增的，没有修改的
         * @return  {false|Object}    当返回false是，表示没有要更新的内容
         */
        getChangeSelectedIds:function(selectedIds_old,selectedIds_new){
            //新的集合不在旧的集合中的，表示是新增的；
            var selectedIds_add = _.difference(selectedIds_new,selectedIds_old);
            //旧的集合不在新的集合中的，表示是删除的
            var selectedIds_delete = _.difference(selectedIds_old,selectedIds_new);
            if(selectedIds_add.length==0&&selectedIds_delete==0){
                //表示没有变动
                return false;
            }else{
                return {
                    addIds:selectedIds_add.length==0?null:selectedIds_add,
                    deleteIds: selectedIds_delete
                }
            }
        },

        /**
         * 返回的内容转换成模型中的属性，return 是模型本身
         * @param {Model}  model    模型对象
         * @param {Object} result   返回的结果
         * @param {Object} options  请求的参数
         * @return {Model} 模型本身
         */
        responeToModel:function(model,result,options){
            var newVar = null;
            if(result){
                var newVar = model.set({
                    records: result.records?model.parse(result.records, options):null,
                    selectedIds:result.selectedIds?model.parse(result.selectedIds, options):null
                }, options);
            }
            return newVar;
        },

        setSelectedIds:function(selectedIds){
            this.set("selectedIds", selectedIds);
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
            var selectedIds = this.get("selectedIds");
            var tree = [];
            //暂时找不到父节点的id数组，包括根节点
            var noDealIds = new Array();
            var that = this;
            //添加到父节点的children数组中
            _.each(records, function (record, key, list) {
                tree[record.id] = record;
                tree[record.id].title = record[that.getTitleAttr()];
                //设置是否已被选择
                tree[record.id].selected = _.contains(selectedIds,record.id);
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

