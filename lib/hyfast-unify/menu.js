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
            //点击后是否自动收缩
            autoCollapseable:false,
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
                if(this.autoCollapseable){
                    //点击后搜索功能
                    jQuery(document).on('mouseout', '.mega-menu .dropdown-menu', function (e) {
                        e.stopPropagation();
                        $(e.currentTarget).css("display","");
                    })
                    jQuery(document).on('click', '.mega-menu .dropdown-menu', function (e) {
                        e.stopPropagation();
                        $(e.currentTarget).hide();
                    })
                    //针对移动端，小屏时，点击后搜索
                    jQuery(document).on('click', '.mega-menu .navItem', function (e) {
                        e.stopPropagation();
                        $(".hfast-view .header .navbar-toggle").click()
                    });
                }else{
                    jQuery(document).on('click', '.mega-menu .dropdown-menu', function (e) {
                        e.stopPropagation();
                    })
                }
            },
        });
        return View;
    });
