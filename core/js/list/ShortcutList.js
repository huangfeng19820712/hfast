/**
 * 列表对象
 * @author:   * @date: 2016/2/29
 */
define([
    "core/js/controls/Control",
    "core/js/CommonConstant",
    "text!core/resources/tmpl/shortcut.html"
], function (Control,CommonConstant,Template) {
    var ShortcutList = Control.extend({
        xtype:$Component.SHORTCUTLIST,
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
        itemTemplate:Template,
        itemsDraggable:true,
        _placeholderClassName:null,//"placeholder",
        mountContent:function(){
            if(this.data){
                for(var i=0;i<this.data.length;i++){
                    var item = this.data[i];
                    if(!item.id){
                        item.id = this.getItemId(i);
                    }
                    this.$el.append(this.createItem(item));
                }
                this.setOffset();
                this.setSortable();

            }else{
                this.data = [];
            }
        },
        /**
         * 设置排序功能
         */
        setSortable:function(){
            var that = this;
            this.$el.sortable({
                //通过时间延迟和距离延迟来防止意外的排序。
                delay: 300,
                //cursor: "move",
                placeholder: this._placeholderClassName ,
                items:".shortcut",
                //connectWith :".shortcut",
                opacity :"0.6",
                /*beforeStop:function(){
                    console.info("beforstop>>")
                },*/
                change:function(event,ui){
                    //console.info("change>>");
                    ui.placeholder.height(ui.item.height());
                    ui.placeholder.css("visibility","visible")
                    that.setOffset();
                },
                start:function(event,ui){

                },
                stop: function(event, ui) {
                    /*var p = ui.item.parent();
                    if(p.hasClass("dock_middle")){//落在侧边栏
                        item.removeAttr("style");
                    }*/
                    //Deskpanel.switchCurrent(index);
                    that.setOffset();
                }
            }).disableSelection(); //禁用选择匹配的元素集合内的文本内容。
        },
        /**
         * 设置位置
         */
        setOffset:function(){
            var els = this.$el.find(".shortcut,."+this._placeholderClassName).not(".ui-sortable-helper");
            var x=0,y=0;
            var top = this.$el.offset().top;
            var left = this.$el.offset().left;
            var h=parseInt(this.$el.parent().height()/100);
            els.each(function () {
                $(this).offset({
                    left:left+x*82+10,
                    top:top+y*100+10,
                });
                y++;
                if(y>=h){
                    y=0;
                    x++;
                }
            });
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
            var itemContent = _.template(this.itemTemplate, {variable: this.dataPre})(item);
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
        clear:function(){
            this.data = [];
            this.$el.empty();
        },
        destroy:function(){
            this.unregisterEvent();
            this._super();
        }
    });
    return ShortcutList;
});
