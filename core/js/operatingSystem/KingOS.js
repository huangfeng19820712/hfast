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
        "css!/core/js/operatingSystem/KingOS/css/font-awesome.css",
        "css!/core/js/operatingSystem/KingOS/css/main.css",
        "css!/core/js/operatingSystem/KingOS/css/KingOS.css",
    ]
};
define(_.union(["core/js/operatingSystem/BaseOS",
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
],$KingCons.css), function (BaseOS, temple, BaseApplication, ApplicationUtils,
             Header, SlideBar, Menu, Footer, Breadcrumbs,Switcher) {
    var KingOS = BaseOS.extend({
        xtype:$KingCons.xtype.OS,
        defaultMenuDates:null,
        menuDates:null,
        initUrl:null,
        className:"wrapper",

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
        mountContent:function(triggerEvent){
            var that = this;
            that.renderDom();
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
            this.$el.parent().parent().removeClass("king_os_wrapper");
            this.getFooter().destroy();
            this.getMainRegion().destroy();
            this.getHeader().destroy();
            this.getBreadcrumbs().destroy();
            this.getMenu().destroy();
            ApplicationUtils.undefCsses($KingCons.css);
            requirejs.undef(this.xtype.src);

            this._super();
        }
    });
    return KingOS;
});
