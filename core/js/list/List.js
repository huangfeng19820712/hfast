/**
 * 列表对象
 * @author:   * @date: 2016/2/29
 */
define([
    "core/js/controls/Control",
    "core/js/CommonConstant","core/js/utils/Utils"
], function ( Control,CommonConstant) {
    var List = Control.extend({
        xtype:$Component.LIST,
        className:"list-group",
        dataPre:"data",
        /**
         * 数据项,数组类型
         * [
         *  {
         *      content:"<显示的内容，必需>"
         *  }，...
         * ]
         */
        data:null,
        /**
         * 存放数据的键值对，key是id，数据项是值
         */
        _dataMap:[],
        itemTemplate:$Template.List.DEFAULT,
        mountContent:function(){
            if(this.data){
                for(var i=0;i<this.data.length;i++){
                    var item = this.data[i];
                    if(!item.id){
                        item.id = this.getItemId(i);
                    }
                    this._dataMap[item.id] = item;
                    this.$el.append(this.createItem(item));
                }
                var that = this;
                //添加点击事件
                this.$el.find(".list-group-item").on("click",function(e){
                    $(e.target).siblings().removeClass("active");
                    $(e.target).addClass("active");
                    that.trigger("select",e);
                });
            }else{
                this.data = [];
            }
        },
        createItem:function(item){
            var itemContent = _.template(this.itemTemplate, {variable: this.dataPre})(item);
            return itemContent;
        },
        /**
         * 修改子项
         * @param item
         * @param   i   第几个子项
         */
        updateItem:function(item,i){
            var $item = null;
            if(item.id){
                $item = this.$("#" + item.id);
            }else{
                if(i){
                    $item = this.$("#" + this.getItemId(i));
                }else{
                    return;
                }
            }
            //var itemContent = _.template(this.itemTemplate, {variable: this.dataPre})(item);
            var itemContent = this.createItem(item);
            $item.replaceWith(itemContent);
        },

        /**
         * 添加数组
         * @param items
         */
        insertItems:function(items){
            for(var i=0;i<items.length;i++){
                var item = items[i];
                if(item){
                    this.insertItem(item);
                }
            }

        },
        /**
         * 插入子项
         * @param item
         */
        insertItem:function(item){
            if(!item.id){
                item.id = this.getItemId(this.getData().length);
            }
            this.getData().push(item);
            this.appendItem(item);
        },
        appendItem:function(item){
            this.$el.append(this.createItem(item));
        },
        getData:function(){
            if(!this.data){
                this.data = [];
            }
            return this.data;
        },
        updateData:function(data,i){
            var data2 = this.data[i];
            _.extend(data2,data);
            this.updateItem(data2,i);
        },
        getItemId:function(i){
            return this.id+"_"+i;
        },
        /**
         * 根据item的id获取item的数据对象
         * @param id
         * @returns {*}
         */
        getItemDataById:function(id){
            return this._dataMap[id];

        },
        clear:function(){
            this.data = [];
            this.$el.empty();
        }
    });
    return List;
});
