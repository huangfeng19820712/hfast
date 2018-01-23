/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-4-21
 * Time: 下午11:42
 * To change this template use File | Settings | File Templates.
 */
$KingCons = {
    prefix:"king_",
    xtype:{
        SLIDEBAR:this.prefix+"slideBar",
        SWITCHER:this.prefix+"switcher",
        MENU:this.prefix+"menu",
        TOPBAR:this.prefix+"topBar",
        TABLE:this.prefix+"table",
    }
};

define(["jquery", "text!framework/kingadmin/templates/menu.html",
    "framework/kingadmin/js/plugins/topBar",
    "framework/kingadmin/js/plugins/slideBar",
    "framework/kingadmin/js/plugins/menu",
     "bootstrap", "modernizr",
    "bootstrap-tour",
    "jquery.easypiechart", "jquery.flot",
    "jquery.flot.resize",
    "jquery.flot.time",
    "jquery.flot.pie",
    "jquery.flot.tooltip",
    "jquery.sparkline",
    "jquery.dataTables",
    "bootstrap-dataTables",
    "jquery.mapael",
    "usa_states",
    "king-chart-stat",
    "king-table",
    "king-components",
    "king-common",
    , "framework/kingadmin/js/raphael", "core/js/utils/JqueryUtils"], function ($, temple,TopBar,SlideBar,Menu) {
    var topBar = new TopBar({el:$(".dashboard .wrapper")});
    var slideBar = new SlideBar({el: $(".bottom .container .row:first"),topViews:[Menu]});

    return {};
});