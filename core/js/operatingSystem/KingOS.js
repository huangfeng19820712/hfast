/**
 * @author:   * @date: 2017/1/30
 */
$KingCons={};
$KingCons.prefix = "king_";
$KingCons = {
    xtype: {
        OS: {
            name:$KingCons.prefix + "OS",
            src:"core/js/operatingSystem/KingOS"
        },
        SLIDEBAR: {
            name:$KingCons.prefix + "slideBar",
            src:"core/js/operatingSystem/KingOS/slideBar"
        },
        HEADER: {
            name:$KingCons.prefix + "header",
            src:"core/js/operatingSystem/KingOS/header"
        },
        MENU: {
            name:$KingCons.prefix + "menu",
            src:"core/js/operatingSystem/KingOS/menu"
        },
        SWITCHER: {
            name:$KingCons.prefix + "Switcher",
            src:"core/js/operatingSystem/KingOS/Switcher"
        },
        FOOTER: {
            name:$KingCons.prefix + "footer",
            src:"core/js/operatingSystem/KingOS/footer"
        },
        BREADCRUMBS: {
            name:$KingCons.prefix + "breadcrumbs",
            src:"core/js/operatingSystem/KingOS/breadcrumbs"
        },
        TOPBAR: $KingCons.prefix + "topBar"
    },
    css:[
        "/core/js/operatingSystem/KingOS/css/font-awesome.css",
        "/core/js/operatingSystem/KingOS/css/main.css",
        "/core/js/operatingSystem/KingOS/css/KingOS.css",
    ]
};
define(["core/js/operatingSystem/BaseOS",
    "text!core/js/operatingSystem/KingOS/tmpl/framework.html",
    "core/js/biz/BaseApplication",
    "core/js/utils/ApplicationUtils",
    $KingCons.xtype.HEADER.src,
    $KingCons.xtype.SLIDEBAR.src,
    $KingCons.xtype.MENU.src,
    $KingCons.xtype.FOOTER.src,
    $KingCons.xtype.BREADCRUMBS.src,
    $Component.SWITCHER.src,
    "bootstrap", "modernizr",
    "bootstrap-tour",
    "jquery.dataTables",
    "bootstrap-dataTables",
    "jquery.mapael",
    "usa_states",
    "king-chart-stat",
    "king-components",
    "king-common",
    "raphael", "core/js/utils/JqueryUtils"
], function (BaseOS, temple, BaseApplication, ApplicationUtils,
             Header, SlideBar, Menu, Footer, Breadcrumbs,Switcher) {
    var KingOS = BaseOS.extend({
        xtype:$KingCons.xtype.OS,
        defaultMenuDates:null,
        menuDates:null,
        initUrl:null,
        className:"wrapper",
        /**
         * 初始化主区域的配置信息
         */
        initItems:function(){
            this._super();
            this.mainRegionId = this.getRegionName("main");
            var that = this;
            this.items = [
                {
                    id:this.mainRegionId,
                    onshow:function(){
                        var code = Backbone.history.fragment;
                        //this.setBreadcrumbsData(this.menuDates);
                        var breadcrumbs = that.getBreadcrumbs();
                        breadcrumbs.setBreadcrumbsByCode(code);
                        //修改面包屑
                        breadcrumbs .render();
                    }
                }
            ]
        },
        initializeHandle: function (options, triggerEvent) {
            this._super(options,false);
            var applicationContext = ApplicationUtils.getApplicationContext();
            var ajaxClient = applicationContext.getAjaxClient();
            var that = this;
            ajaxClient.buildClientRequest(this.initUrl)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        applicationContext.serviceConf = obj.globalConf;
                        if(that.sunOSed){
                            //给菜单的url添加要显示的区域的id
                            //that.mainRegionId = $.createId(that.xtype.name);
                            that.addShowRegion(obj.menus,that.id);
                        }
                        that.defaultMenuDates = obj.menus;
                        that.menuDates = obj.menus;
                        applicationContext.setAuthenticated(obj.authenticated);
                        applicationContext.setSessionUser(obj);
                    }
                }, false);
        },
        loadCss:function(){
            _.each($KingCons.css,function(item,idx,list){
                $global.BaseFramework._loadCss(item);
            });
        },
        mountContent:function(triggerEvent){
            var that = this;

            //设置样式
            require(that.getRequireCss($KingCons.css),
                function (Class) {
                that.renderDom();
            });

        },
        getRequireCss:function(array){
            var result = [];
            _.each(array,function(item,idx,list){
                result.push("css!"+item);
            });
            return result;
        },
        renderDom:function(){
            this.header = new Header({$container:this.$el});
            var content = _.template(temple,{variable: "data"})({id:this.mainRegionId});
            this.$el.append(content);
            //渲染区域
            this.regionsRender();
            this.menu = new Menu({defaultMenuDates:this.defaultMenuDatas,menuDates:this.menuDatas});
            this.slideBar = new SlideBar({el: this.$el.find(".bottom .container .row:first"), topViews: [this.menu]});
            this.slideBar.render();
            this.breadcrumbs = new Breadcrumbs({$container: this.$el.find(".breadcrumbContainer"),menuRef:this.menu});
            this.switcher = new Switcher({
                $container:this.$el
            });
            //this.switcher.render();
            //判断是否需要footer
            this.footer = new Footer({
                $container:this.$el.parent().parent().parent()
            });
            this.$el.parent().parent().addClass("king_os_wrapper");
        },
        /**
         * 添加显示区域
         * @param {Array} menus 菜单对象集合
         * @param {String} mainRegionId 主区域的趋于Id
         */
        addShowRegion:function(menus,mainRegionId){
            _.each(menus,function(item,idx,list){
                var url = item.url;
                if(url){
                    //包含"?"
                    if(url.indexOf("?")!=-1){
                        url+="&";
                    }else{
                        url+="?";
                    }
                    url+= "showRegion="+mainRegionId;
                    item.url = url;
                }

            });
        },

        close:function(){
            this.menuDates = null;
            this.defaultMenuDates = null;
            this.destroyLinks($KingCons.css);
            this.$el.parent().parent().removeClass("king_os_wrapper");
            this.getFooter().destroy();
            this.getMainRegion().destroy();
            this.getHeader().destroy();
            this.getBreadcrumbs().destroy();
            this.getMenu().destroy();

            this._super();
        }
    });
    return KingOS;
});
