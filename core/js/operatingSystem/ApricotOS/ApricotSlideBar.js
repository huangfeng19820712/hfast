/**
 * @author:   * @date: 2018/1/30
 */

define([
        "core/js/controls/AbstractControlView",
        "core/js/operatingSystem/ApricotOS/ApricotMenu",
    "text!core/js/operatingSystem/ApricotOS/tmpl/ApricotSlideBar.html"],
    function (AbstractControlView,
              Menu,
              Template) {
    var View = AbstractControlView.extend({
        xtype:$ApricotCons.xtype.SLIDEBAR,
        template:Template,
        $container:null,
        /**
         * 放在顶部的视图
         */
        topViews:[],
        /**
         * 放在底部的视图
         */
        bottomViews:[],
        /**
         *  默认菜单数据
         */
        defaultMenuDates:null,
        /**
         *  菜单数据
         */
        menuDates:null,
        menuRef:null,
        mountContent:function(){
            this._super();
            this.menuRef = new Menu({
                $container:this.$(".skin-select"),
                defaultMenuDates:this.defaultMenuDates,
                menuDates:this.menuDates
            });
        },
        getMenuRef:function(){
            return this.menuRef;
        }
    });

    return View;
});