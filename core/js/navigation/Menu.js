/**
 * 菜单
 * @module
 * @description
 *
 * @date: 2013-09-03 下午2:50
 */
define([
    "core/js/CommonConstant",
    "core/js/controls/Control",
    "text!core/resources/tmpl/menuItem.html"
], function ( CommonConstant, Control,menuItemTmpl) {
    var Menu = Control.extend({
        xtype:$Component.MENU,
        eTag: "<ul />",

        /**
         * {Array}
         * <code>
         * [{
         *      label:"<可选>[显示的内容]"，
         *      subMenu:"<可选>[子菜单]"，
         *      id:"<必选>[唯一编码]"，
         *      order:"<可选>[排序使用]"，
         *      onclick:"<可选>[点击事件]"
         * },...]
         * </code>
         */
        menus:null,
        className:"dropdown-menu",

        _initElAttr:function(){
            this._super();
            this.$el.attr("role","menu");
        },
        mountContent:function(){
            if(this.menus&&this.menus.length>0){
                var that= this;
                _.each(this.menus,function(item,index){
                    var el = that.createItem(item);
                    if(item.onclick){
                        el.bind("click",item.onclick);
                    }
                    that.$el.append(el);
                });
            }
        },
        /**
         * 创建单个菜单对象
         * @param option
         * @returns {*|jQuery|HTMLElement}
         */
        createItem:function(option){
            var newVar = null;
            if(_.isString(option)){
                newVar = option;
            }else {
                newVar = _.template(menuItemTmpl, {variable: "data"})(option);
            }


            return $(newVar);
        }
    });
    Menu.SEPARATOR = '<li role="separator" class="divider"></li>';

    return Menu;
});