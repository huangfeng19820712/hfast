/**
 * @author:   * @date: 2015/9/22
 */
define(["core/js/base/BaseView",
        "core/js/utils/ModelUtils","core/js/utils/Utils"],
    function (BaseView, ModelUtils,Utils) {
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
                    return this;
                }
                this.menuDates = menuDates;
                this.clearMenu();
                return this;
            },
            getMenuDates:function(){
                return this.menuDates;
            },
            clearMenu: function () {
                this.$el.find(".navItem").remove();
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
            render: function (container, triggerEvent) {
                this.initClass();
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