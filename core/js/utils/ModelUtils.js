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
            //把菜单添加到subMenu子菜单属性中
            //把根节点找出来，即使没有父节点的菜单，并不是pid为null，是pid不在存在当前的menuDates中
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
                //判断是否根节点
                // 1.当pid为null时，即使根节点，
                // 2.有pid，但是pid没有在menus中，也是根节点
                if (!menus[i].pid||menus[menus[i].pid]==null) {
                    doneMenus.push(menus[i]);
                }
            }

            return this.sortMenu(doneMenus);
        },
        /**
         * 排序
         * @param menus
         */
        sortMenu: function (menus) {
            var that = this;
            var newMenus = _.sortBy(menus,function(menu){
                if(menu.subMenu!=null&&menu.subMenu.length>0){
                    menu.subMenu = that.sortMenu(menu.subMenu);
                }
                if(menu.orderNo!=null){
                    return menu.orderNo;
                }else{
                    return ;
                }
            });
            return newMenus;
        }
    });
    ModelUtils.getInstance = function () {
        return new ModelUtils();
    }

    return ModelUtils.getInstance();
})
;
