/**
 * @module 瀑布流布局[FluidLayout]
 *
 *
 * @author:   * @date: 2015/12/15
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "core/js/Class"
], function (CommonConstant, Container,Class) {
    var FluidLayout = Container.extend({
        xtype:$Component.FLUIDLAYOUT,
        /**
         * 容器中分的列数，系统会自动分为最多12列,所有次数最好能被12整除，
         * 如果defaultColumnSize为null，则整除totalColumnNum后的栏位大小会设置会修改defaultColumnSize的值
         */
        totalColumnNum:null,
        /**
         * 默认的栏位大小
         */
        defaultColumnSize:null,

        _placeholderClassName:"shortcutPlaceholder",
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        beforeInitializeHandle:function(options, triggerEvent){
            this._super();
            if(this.defaultColumnSize!=null){
                this._defaultRegionClassName = this.defaultColumnSize;
            }else{
                if(this.totalColumnNum){
                    this._defaultRegionClassName = $cons.fluidLayoutClassnamePre+Math.floor(12 / this.totalColumnNum);
                }else{
                    this._defaultRegionClassName = $Column.COL_MD_12;
                }
            }
        },
        /**
         * 初始化子项的className，修改result中的className属性
         * @param item      子项的配置信息
         * @param result
         */
        initItemClassName:function(item,result){
            var className = item.className || item.columnSize || this._defaultRegionClassName;
            //处理高度不一样时，浮动塌陷问题
            result["className"] =className + " utils-inline-block";
        },

        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/

        mountContent:function(){
            this._super();
            /*this.setOffset();
            this.setSortable();*/
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
                items:".region.hfast-container",
                //connectWith :".shortcut",
                opacity :"0.6",
                change:function(){
                    that.setOffset();
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
            var els = this.$el.find(".region.hfast-container,."+this._placeholderClassName).not(".ui-sortable-helper");
            var x=0,y=0;
            var top = this.$el.offset().top;
            var left = this.$el.offset().left;
            var h=parseInt(this.$el.parent().height()/100);
            var columnObj = {};
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
        _setColumnHeight:function(columnObjs,height,columnSize){


        },
        _getColumnIndex:function(columnObjs,columnSize){

        },

        /**
         * 获取
         * @param columnObj
         * @param   columnSize  列的大小
         * @private
         */
        _getTop:function(columnObj,columnSize){

        },
        /**
         * 根据id，返回流布局中的对象
         * @param id
         * @returns {*}
         */
        getComponent:function(id){
            var region = this.getRegion(id);
            if(region){
                return region.getComRef();
            }else{
                return null;
            }
        },
        /**
         * 根据数组的下标找到组件
         */
        getComponentByIndex:function(index){
            var allRegions = this.getAllRegions();
            if(allRegions){

                var values = _.values(allRegions);
                if(values&&values[index]&&values[index].getComRef()){
                    return values[index].getComRef();
                }
            }
            return null;
        }
    });
    return FluidLayout;
});
