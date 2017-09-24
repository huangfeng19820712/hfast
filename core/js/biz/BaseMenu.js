/**
 * @author:   * @date: 2015/9/22
 */
define(["core/js/base/BaseView",
        "backbone","core/js/utils/Utils"],
    function (BaseView, Backbone,Utils) {
        var View = BaseView.extend({
            defaultMenuDates: null,
            menuDates: null,
            initialize: function (options, triggerEvent) {
                this._super(options, triggerEvent);
                this.render();
            },
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

            getMenuDates:function(){
                return this.menuDates;
            },
            clearMenu: function () {
                this.$el.find(".navItem").remove();
            },
            render: function (container, triggerEvent) {
                if (!this.menuDates) {
                    return;
                }
                var menus = this.getMenus(this.menuDates);
                var that = this;
                _.each(menus, function (menu) {
                    //var result = _.template(that.template)( menu);
                    var result = _.template(that.template,{variable: that.dataPre})( menu);
                    //获取子集数
                    var len = that.$el.children().length;
                    $(that.$el.children()[len - 1]).before(result);
                });
                if (triggerEvent == null || triggerEvent) {
                    this.trigger("render");   //触发渲染完成后的事件
                }
            },
        });
        return View;
    });