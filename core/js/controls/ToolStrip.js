/**
 * 为菜单、工具栏等控件提供基类。
 *
 * @date: 2013-09-03 下午5:04
 */
define([
    "core/js/controls/Control",
    "core/js/CommonConstant",
    "core/js/controls/ToolStripItem"
], function (Control,CommonConstant, ToolStripItem) {
    var ToolStrip = Control.extend({
        xtype:$Component.TOOLSTRIP,
        items: null,
        /**
         * {Array}  ToolStripItem的参数
         * @example
         * <code>
         * [{
         *      toolStripItemType:"[可选]<默认根据ToolStrip#defaultItemType的类型来定义>"
         * },...]
         * </code>
         */
        itemOptions:null,
        /**
         * 按钮的大小
         */
        size:null,
        /**
         * 间距
         */
        spacing:CommonConstant.Spacing.NULL,
        defaultItemType: ToolStripItem,
        role:"group",
        className:"btn-group",
        _initItems: function () {
            if(!this.items){
                this.items = [];    //初始化后，该字段转为内部使用，所以先清空
                if(this.itemOptions){
                    var items = this.itemOptions;
                    this.appendItems(items);
                }
            }

        },
        mountContent: function () {
            //添加size
            this._initItems();
            if(this.size){
                this.$el.addClass(this.size);
            }
            // this._super();
        },
        /**
         * 根据给定的菜单项的ID，获取对应的菜单项
         * @param itemIds  菜单项ID，多值用逗号分割
         * @return {*}  菜单项 {@link ToolStripItem} 数组
         */
        getItems: function (itemIds) {
            if (itemIds == null)
                return this.items;

            var itemIdArray = itemIds.split(",");
            if (itemIdArray.length == 0)
                return null;

            var result = [];
            var item = null;
            for (var i = 0, itemIdCount = itemIdArray.length; i < itemIdCount; i++) {
                item = this.getItemById(itemIdArray[i]);
                if (item == null)
                    continue;

                result.push(item);
            }

            return result;
        },
        getItemById: function (itemId) {
            itemId = itemId ? $.trim(itemId) : "";
            if (itemId == "")
                return null;

            var $item = this.$("#" + itemId);
            if ($item == null || $item.length != 1)
                return null;

            return $item.data("control");
        },
        hideItems: function (itemIds) {
            this._setItemsVisible(itemIds, false);
        },
        showItems: function (itemIds) {
            this._setItemsVisible(itemIds, true);
        },
        disableItems: function (itemIds) {
            this._setItemsEnabled(itemIds, false);
        },
        enableItems: function (itemIds) {
            this._setItemsEnabled(itemIds, true)
        },
        appendItems: function (itemOptions) {
            if ($.isPlainObject(itemOptions)) {
                this.appendItem(itemOptions);
                return;
            }

            if (_.isArray(itemOptions)) {
                var itemOption = null;
                for (var i = 0; i < itemOptions.length; i++) {
                    this.appendItem(itemOptions[i]);
                }
                return;
            }
        },
        appendItem: function (itemOption) {
            var result = itemOption;

            if ($.isPlainObject(itemOption)) {

                if(!itemOption.parent){
                    itemOption.parent = this;
                }

                if(itemOption.toolStripItemType){
                    result = new itemOption.toolStripItemType(itemOption);
                }else{
                    result = new this.defaultItemType(itemOption);

                }
                result.render();
            }

            this._appendItem(result);

            //result.setParent(this);   //设置该工具栏项归属的工具栏

            return result;
        },
        /**
         * 提供一个方法，根据指定值删除 {@link mx.controls.ToolStripItem} 对象。
         *
         * @param id
         *            一个数字或者字符串，表示要刪除的 {@link ToolStripItem} 对象的
         *            {@link ToolStripItem.id} 属性的值。
         */
        removeItemById: function (id) {
            var item = this.getItemById(id);
            if (item == null)
                return;

            return this.removeItem(item);
        },
        /**
         * 从 {@link items} 集合中移除所有的项。若要从 {@link ToolStrip} 中移除单个项，请使用 {@link removeItem} 方法。
         */
        clearItems: function () {
            while(this.items.length>0){
                this.removeItem(this.items[0]);
            }
        },
        /**
         * 从 {@link items} 集合中移除指定的 {@link ToolStripItem}对象。
         * 从集合中移除项时，有关移除的项的所有信息均会被删除。若要从集合中移除所有项，请使用 {@link clearItems} 方法。
         *
         * @param item
         *            一个 {@link ToolStripItem} 对象。
         */
        removeItem: function (item) {
            if (item == null)
                return;
            item.$el.remove();
            this.items = _.without(this.items, item);
        },
        _setItemsVisible: function (itemIds, visible) {
            var itemArray = this.getItems(itemIds);
            if (itemArray == null)
                return;

            var item = null;
            for (var i = 0; i < itemArray.length; i++) {
                item = itemArray[i];
                item.setVisible(visible);
            }
        },
        _setItemsEnabled: function (itemIds, enabled) {
            var itemArray = this.getItems(itemIds);
            if (itemArray == null)
                return;

            var item = null;
            for (var i = 0; i < itemArray.length; i++) {
                item = itemArray[i];
                item.setEnabled(enabled);
            }
        },
        _appendItem: function (item) {
            /*if(this.spacing!=null&&this.spacing!=0&&this.items.length>0){

            }*/
            item.$el.css({"margin-left":this.spacing});
            item.$el.css({"margin-right":this.spacing});
            this.items.push(item);

            this._getContainer().append(item.$el);
        },
        /**
         * 放置菜单项的容器，直接上级，因为有可能组件外层还有包裹其它东西
         * @return {*}
         * @private
         */
        _getContainer: function () {
            return this.$el;
        },

        activeItems:function(itemsIndex){
            this.clearActive();
            if(itemsIndex){
                this.eachItems(function(item){
                    item.$el.addClass("active");
                },itemsIndex)
            }
        },
        /**
         * 切换激活状态
         */
        toggleActiveItems:function(){
            this.eachItems(function(item){
                item.$el.toggleClass("active");
            });
        },
        activeAll:function(){
            this.eachItems(function(item){
                item.$el.addClass("active");
            });
        },
        clearActive:function(){
            this.eachItems(function(item){
                item.$el.removeClass("active");
            });
        },
        /**
         * 遍历整个items项的操作
         * @param itemsIndexs
         * @param handle    为函数，输入参为item项
         */
        eachItems:function(handle,itemsIndexs){
            if(itemsIndexs){
                for(var i in itemsIndexs){
                    handle(this.items[itemsIndexs[i]]);
                }
            }else{
                //遍历所有
                _.each(this.items,function(item,key){
                    handle(item,key);
                });
            }
        }
    });

    ToolStrip["IconSkin"] = ToolStripItem["IconSkin"];
    ToolStrip.size= {
        /**
         *
         */
        lg:"btn-group-lg",
        sm:"btn-group-sm",
        xs:"btn-group-xs",
    };
    return ToolStrip;
});