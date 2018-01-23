/**
 * @author:   * @date: 2017/1/30
 */
define(["core/js/layout/Container"
], function (Container) {
    var BaseOS = Container.extend({
        /**
         * 是否是子框架，如果是，则需要制定显示的区域
         */
        sunOSed:false,
        /**
         * 主区域的对象
         */
        mainRegion:null,
        /**
         * 主区域的配置信息
         */
        mainRegionConf:null,
        mainRegionId:"main",
        slideBar:null,
        breadcrumbs:null,
        switcher:null,
        menu:null,
        /**
         * 显示内容
         * @param routeUrl  {String}    显示的url路径
         * @param param     {Object}    传给路径的参数
         */
        showContent:function(routeUrl,param){
            var url = CONFIG.currentModuleName+"/view/" + routeUrl;
            //显示内容
            this.getMainRegion().show(routeUrl, param);
            //修改面包屑
            var breadcrumbs = this.getBreadcrumbs();
            if(breadcrumbs){
                breadcrumbs.setBreadcrumbsByCode(Backbone.history.fragment).render();
            }
        },
        /**
         * 获取主区域对象
         * return {Object}
          */
        getMainRegion:function(){
            return  this.getRegion(this.mainRegionId);
        },
        getHeader: function () {
            return this.header;
        },
        getFooter: function () {
            return this.footer;
        },
        getBreadcrumbs: function () {
            return this.breadcrumbs;
        },
        getMenu: function () {
            return this.menu;
        },
        close:function(){
            this.mainRegion = null;
            this.mainRegionConf = null;
            this.slideBar = null;
            this.breadcrumbs = null;
            this.switcher = null;
            this._super();
        }
    });
    return BaseOS;
});
