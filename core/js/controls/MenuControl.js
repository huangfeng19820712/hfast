/**
 * @author:   * @date: 2016/3/24
 */

define([
    "core/js/utils/ModelUtils",
    "core/js/CommonConstant",
    "core/js/controls/Control",
], function (ModelUtils,CommonConstant, Control) {
    var MenuControl = Control.extend({
        /**
         *  默认菜单数据
         */
        defaultMenuDates:null,
        /**
         *  菜单数据
         */
        menuDates:null,
        /**
         * 重置成初始化菜单
         */
        resetMenu: function () {
            this.updateMenu(this.defaultMenuDates);
        },
        /**
         * menus 的数据
         * @param menus
         */
        updateMenu: function (menuDates) {
            if (!menuDates) {
                return;
            }
            this.menuDates = menuDates;
            this.clearMenu();
            return this;
        },
        getMenuDates:function(){
            return this.menuDates;
        },
        /**
         * 清理菜单
         */
        clearMenu: function () {

        },
        /**
         *
         * @param menuDates
         * @returns {Array}
         * <code>
         * [{
             *      code:"<必选>[唯一编码，单应用中的路由使用]"，
             *      id:"<必选>[唯一编码]"，
             *      name:"<必选>[显示的名称]"，
             *      order:"<可选>[排序使用]"，
             *      subMenu:"<可选>[子菜单]"，
             *      type:"<必选>[菜单的类型]"，
             *      url:"<可选>[菜单路径]"，
             *      visiable:"<可选>[是否要显示]"
             * },...]
         * </code>
         */
        getMenus: function (menuDates) {
            return ModelUtils.getMenus(menuDates);
        },
        mountContent:function(){
            this.$el.html(this._getTemplateContent());   //根据视图模版对界面进行渲染
        },
    });
    return MenuControl;
});