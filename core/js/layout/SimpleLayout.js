/**
 * @module 继承BorderLayout,只有一个响应式的主布局[SimpleLayout]
 *
 *
 * @author:   * @date: 2015/12/15
 */
define([
    "core/js/layout/BorderLayout",
], function (BorderLayout) {
    var SimpleLayout = BorderLayout.extend({
        xtype:$Component.SIMPLELAYOUT,
        /**
         * 此item存放唯一布局的组件信息
         */
        item:null,
        onresize:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/


        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        /**
         * 初始化区域属性，此属性与Layout中的regions不一样，需要在进行转化
         */
        initItems:function(){
            this._super();
            if(this.item){
                var that = this;
                var itemConfig = _.extend(this.item,{
                    region: BorderLayout.Region.CENTER,  //中间区域
                    padding:0,
                    border:0,
                    /**
                     * Five parameters are automatically returned to all callback functions, in this order:
                     * @param name - Always one of: "north", "south", "east" or "west"
                     * @param element - The pane-element the callback was for, inside a jQuery wrapper
                     * @param state - The 'state branch' for this pane, eg: state.north
                     * @param options - The 'option branch' for this pane, eg: options.north
                     * @param name - If a 'name' was specified when creating the layout, else returns an empty string.
                     */
                    onresize:function(pane,element,state,options,name){
                        var event = {};
                        event.layout = {
                            "pane":pane,
                            "element":element,
                            "state":state,
                            "options":options,
                            "name":name
                        };
                        that.trigger("resize",event);
                    }
                });
                this.items = [itemConfig];
            }

        },
        getItemRegion:function(){
            return this.getRegion(BorderLayout.Region.CENTER)
        },
        /**
         * 返回流布局中的对象
         * @returns {*}
         */
        getItemComponent:function(){
            return this.getCenterRegion().getComRef();
        },
        close:function(){
            this.plugin =null;
            //销毁时间
            this._super();
        }
    });
    return SimpleLayout;
});
