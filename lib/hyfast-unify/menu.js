/**
 * @author:   * @date: 2015/9/12
 */
define(["core/js/biz/BaseMenu",
        "backbone", "text!lib/hyfast-unify/tmpl/menu.html",
    "core/js/utils/Utils"],
    function (BaseMenu, Backbone, tmpl,Utils) {

        var View = BaseMenu.extend({
            defaultMenuDates: null,
            menuDates: null,
            template:tmpl,
            initialize: function (options, triggerEvent) {
                this.defaultMenuDates = options.defaultMenuDates;
                this.menuDates = options.menuDates;
                this._super(options, triggerEvent);
            },
            onrender:function(){
                this.handleHeader();
                this.handleMegaMenu();

            },
            //Fixed Header
            handleHeader: function () {
                jQuery(window).scroll(function () {
                    if (jQuery(window).scrollTop()) {
                        jQuery(".header-fixed .header-sticky").addClass("header-fixed-shrink");
                    }
                    else {
                        jQuery(".header-fixed .header-sticky").removeClass("header-fixed-shrink");
                    }
                });
            },
            //Header Mega Menu
            handleMegaMenu: function () {
                jQuery(document).on('click', '.mega-menu .dropdown-menu', function (e) {
                    e.stopPropagation();
                })
            },
        });
        return View;
    });
