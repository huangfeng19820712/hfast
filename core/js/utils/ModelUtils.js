/**
 * 模型工具类，各种数据间转换
 * @author:   * @date: 2015/10/2
 */

define(["core/js/Class",], function (Class) {
    var ModelUtils = Class.extend({
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
            //过滤掉不可见的菜单
            menuDates = _.where(menuDates,{visible:'1'});

            var menus = {};
            var noDealIds = new Array();
            _.each(menuDates, function (menuDate, key, list) {
                menus[menuDate.id] = menuDate;
                menus[menuDate.id].subMenu = null;
                if (menuDate.pid != null) {
                    var menu = menus[menuDate.pid];
                    if (menu != null) {
                        if(menu.subMenu==null){

                            menu.subMenu = new Array();
                        }
                        menu.subMenu.push(menus[menuDate.id]);
                    } else {
                        noDealIds.push(menuDate.id);
                    }
                }
            });
            /**
             * 处理之前未处理的菜单数据
             */
            for (var i = 0; i < noDealIds.length; i++) {
                var id = noDealIds[i];
                var pid = menus[id].pid;
                if($.isNotBank(pid)&&menus[pid]){
                    //pid非空
                    if (!menus[pid].subMenu) {
                        menus[pid].subMenu = new Array();
                    }
                    menus[pid].subMenu.push(menus[id]);
                }
            }
            /**
             * 获取，pid为空的菜单
             */
            var doneMenus = new Array();
            for (var i in menus) {
                if (!menus[i].pid) {
                    doneMenus.push(menus[i]);
                }
            }
            return doneMenus;
        },
    });
    ModelUtils.getInstance = function () {
        return new ModelUtils();
    }

    return ModelUtils.getInstance();
})
;
