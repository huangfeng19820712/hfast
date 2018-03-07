/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-4-30
 * Time: 上午8:31
 * To change this template use File | Settings | File Templates.
 */
define([
        "core/js/biz/BaseMenu",
        "text!lib/hyfast-kingadmin/tmpl/menu.html",
        "core/js/context/ApplicationContext"],
    function ( BaseMenu, temple,ApplicationContext) {
        var View = BaseMenu.extend({
            initialize: function (options, triggerEvent) {
                //初始化菜单数据
                var sessionUser = ApplicationContext.getSessionUser();
                this.menuDates = sessionUser.menus;
            },
            render: function () {
                //$(".left-sidebar:first").prepend(content);
                var menus = this.getMenus(this.menuDates);
                var content = _.template(temple,{variable: 'data'})(menus );
                this.$el.prepend(content);
                var that = this;
                //菜单点击功能
                this.$el.find('.main-menu .js-sub-menu-toggle').click(function (e) {
                    e.preventDefault();
                    $li = $(this).parents('li');
                    if (!$li.hasClass('active')) {
                        $li.find('.toggle-icon').removeClass('fa-angle-left').addClass('fa-angle-down');
                        $li.addClass('active');
                    }else {
                        $li.find('.toggle-icon').removeClass('fa-angle-down').addClass('fa-angle-left');
                        $li.removeClass('active');
                    }
                    $li.find('.sub-menu').slideToggle(300);
                    $(this).parent().siblings().removeClass('active');
                });
                //手拉琴功能，展开与收缩切换
                this.$el.find('.js-toggle-minified').clickToggle(
                    function () {
                        that.$el.addClass('minified');
                        that.$el.next().addClass('expanded');
                        that.$('.sub-menu')
                            .css('display', 'none')
                            .css('overflow', 'hidden');

                        that.$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
                    },
                    function () {
                        that.$el.removeClass('minified');
                        that.$el.next().removeClass('expanded');
                        that.$('.sidebar-minified').find('i.fa-angle-left').toggleClass('fa-angle-right');
                    }
                );
            }
        });

        return View;
    });