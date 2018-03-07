/**
 * @author:   * @date: 2017/1/30
 */
$ApricotCons={};
$ApricotCons.prefix = "apricot_";
$ApricotCons = {
    xtype: {
        OS: {
            name:$ApricotCons.prefix + "OS",
            src:"core/js/operatingSystem/ApricotOS"
        },
        SLIDEBAR: {
            name:$ApricotCons.prefix + "slideBar",
            src:"core/js/operatingSystem/ApricotOS/ApricotSlideBar"
        },
        HEADER: {
            name:$ApricotCons.prefix + "header",
            src:"core/js/operatingSystem/ApricotOS/ApricotHeader"
        },
        MENU: {
            name:$ApricotCons.prefix + "menu",
            src:"core/js/operatingSystem/ApricotOS/menu"
        },
        SWITCHER: {
            name:$ApricotCons.prefix + "Switcher",
            src:"core/js/operatingSystem/ApricotOS/Switcher"
        },
        FOOTER: {
            name:$ApricotCons.prefix + "footer",
            src:"core/js/operatingSystem/ApricotOS/footer"
        },
        BREADCRUMBS: {
            name:$ApricotCons.prefix + "breadcrumbs",
            src:"core/js/operatingSystem/ApricotOS/breadcrumbs"
        },
        TOPBAR: $ApricotCons.prefix + "topBar"
    },
    css:[
        //"css!/framework/unify/css/style.css",
        "css!/framework/unify/plugins/font-awesome/css/font-awesome.min.css",
        "css!/core/js/operatingSystem/ApricotOS/css/style.css",
        "css!/core/js/operatingSystem/ApricotOS/css/entypo-icon.css",
        "css!/core/js/operatingSystem/ApricotOS/css/weather-icons.min.css",
        //"css!/core/js/operatingSystem/ApricotOS/js/skin-select/skin-select.css",
        "css!/core/js/operatingSystem/ApricotOS/js/tip/tooltipster.css",
        "css!/core/js/operatingSystem/ApricotOS/js/pace/themes/pace-theme-center-simple.css",
        "css!/core/js/operatingSystem/ApricotOS/js/slidebars/slidebars.css",
        "css!/core/resources/styles/apricot.css",
    ]
};
define(_.union(["core/js/operatingSystem/BaseOS",
    "text!core/js/operatingSystem/ApricotOS/tmpl/framework.html",
    "core/js/biz/BaseApplication",
    "core/js/utils/ApplicationUtils",
    $ApricotCons.xtype.HEADER.src,
    $ApricotCons.xtype.SLIDEBAR.src,
    $Component.BREADCRUMBS.src,
    "text!core/js/operatingSystem/ApricotOS/tmpl/ApricotBreadcrumbs.html",
    /*
     $ApricotCons.xtype.SLIDEBAR.src,
    $ApricotCons.xtype.MENU.src,
    $ApricotCons.xtype.FOOTER.src,
    */
    $Component.SWITCHER.src,
    "core/js/operatingSystem/ApricotOS/js/pace/pace",
    //Sliding Effect Control
    "core/js/operatingSystem/ApricotOS/js/skin-select/jquery.cookie",
    //"core/js/operatingSystem/ApricotOS/js/skin-select/skin-select",
    //Showing Date
    //"core/js/operatingSystem/ApricotOS/js/clock/date",
    //NEWS STICKER
    "core/js/operatingSystem/ApricotOS/js/custom/scriptbreaker-multiple-accordion-1",
    "core/js/operatingSystem/ApricotOS/js/slidebars/slidebars.min",
    "core/js/operatingSystem/ApricotOS/js/search/jquery.quicksearch",
    "core/js/operatingSystem/ApricotOS/js/tip/jquery.tooltipster",
    "core/js/operatingSystem/ApricotOS/js/nano/jquery.nanoscroller",
    "core/js/operatingSystem/ApricotOS/js/pace/pace",
    "raphael", "core/js/utils/JqueryUtils"
],$ApricotCons.css), function (BaseOS, temple, BaseApplication, ApplicationUtils,
             Header,SlideBar,Breadcrumbs,
             BreadcrumbsTempalate,
             //Header, , Menu, Footer, Breadcrumbs,
             Switcher,Pace) {
    var ApricotOS = BaseOS.extend({
        xtype:$ApricotCons.xtype.OS,
        defaultMenuDates:null,
        menuDates:null,
        initUrl:null,
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
            this.renderDom();
        },
        renderDom:function(){
            this.$el.append('<!-- Preloader --><div id="preloader"><div id="status">&nbsp;</div></div>');
            this.header = new Header({
                $container:this.$el,
                //mountModel:$cons.mount.Model.prepend,
            });
            this.slideBar = new SlideBar({
                $container:this.$el,
                //mountModel:$cons.mount.Model.prepend,
                defaultMenuDates:this.defaultMenuDates,
                menuDates:this.menuDates
            });
            //this.header = new Header({$container:this.$el});
            var content = _.template(temple,{variable: "data"})({id:this.mainRegionId});
            this.$el.append(content);
            //渲染区域
            this.regionsRender();
            this.breadcrumbs = new Breadcrumbs({
                $container: this.$(".container-fluid.paper-wrap"),
                mountModel:$cons.mount.Model.prepend,
                template:BreadcrumbsTempalate,
                menuRef:this.slideBar.getMenuRef()});
           /* this.slideBar = new SlideBar({
                $container: this.$el.find(".bottom .container .row:first"),
                topViews: [this.menu]});*/
            //this.menu = new Menu({defaultMenuDates:this.defaultMenuDatas,menuDates:this.menuDatas});
            /*this.menu = new Menu({defaultMenuDates:this.defaultMenuDatas,menuDates:this.menuDatas});
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
            this.$el.parent().parent().addClass("king_os_wrapper");*/
            this.initObj();
        },

        initObj:function(){
            //NEWS STICKER

            $(".topnav").accordionze({
                accordionze: true,
                speed: 500,
                closedSign: '<img src="/core/js/operatingSystem/ApricotOS/img/plus.png">',
                openedSign: '<img src="/core/js/operatingSystem/ApricotOS/img/minus.png">'
            });

            var mySlidebars = new $.slidebars();

            $('.toggle-left').on('click', function() {
                mySlidebars.toggle('right');
            });

            $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');



            $('.tooltip-tip-x').tooltipster({
                position: 'right'

            });

            $('.tooltip-tip').tooltipster({
                position: 'right',
                animation: 'slide',
                theme: '.tooltipster-shadow',
                delay: 1,
                offsetX: '-12px',
                onlyOne: true

            });
            $('.tooltip-tip2').tooltipster({
                position: 'right',
                animation: 'slide',
                offsetX: '-12px',
                theme: '.tooltipster-shadow',
                onlyOne: true

            });
            $('.tooltip-top').tooltipster({
                position: 'top'
            });
            $('.tooltip-right').tooltipster({
                position: 'right'
            });
            $('.tooltip-left').tooltipster({
                position: 'left'
            });
            $('.tooltip-bottom').tooltipster({
                position: 'bottom'
            });
            $('.tooltip-reload').tooltipster({
                position: 'right',
                theme: '.tooltipster-white',
                animation: 'fade'
            });
            $('.tooltip-fullscreen').tooltipster({
                position: 'left',
                theme: '.tooltipster-white',
                animation: 'fade'
            });


            $(".nano").nanoScroller({
                //stop: true
                scroll: 'top',
                scrollTop: 0,
                sliderMinHeight: 40,
                preventPageScrolling: true
                //alwaysVisible: false

            });
            Pace.start({
                ajax: false, // disabled
                document: false, // disabled
                eventLag: false, // disabled
            });
            /*window.paceOptions = {
                ajax: false, // disabled
                document: false, // disabled
                eventLag: false, // disabled
                elements: {
                    selectors: ['.my-page']
                }
            };*/

            /*app*/

            $('.nav-toggle').click(function() {
                //get collapse content selector
                var collapse_content_selector = $(this).attr('href');

                //make the collapse content to be shown or hide
                var toggle_switch = $(this);
                $(collapse_content_selector).slideToggle(function() {
                    if ($(this).css('display') == 'block') {
                        //change the button label to be 'Show'
                        toggle_switch.html('<span class="entypo-minus-squared"></span>');
                    } else {
                        //change the button label to be 'Hide'
                        toggle_switch.html('<span class="entypo-plus-squared"></span>');
                    }
                });
            });


            $('.nav-toggle-alt').click(function() {
                //get collapse content selector
                var collapse_content_selector = $(this).attr('href');

                //make the collapse content to be shown or hide
                var toggle_switch = $(this);
                $(collapse_content_selector).slideToggle(function() {
                    if ($(this).css('display') == 'block') {
                        //change the button label to be 'Show'
                        toggle_switch.html('<span class="entypo-up-open"></span>');
                    } else {
                        //change the button label to be 'Hide'
                        toggle_switch.html('<span class="entypo-down-open"></span>');
                    }
                });
                return false;
            });
            //CLOSE ELEMENT
            $(".gone").click(function() {
                var collapse_content_close = $(this).attr('href');
                $(collapse_content_close).hide();



            });

//tooltip
            $('.tooltitle').tooltip();

            /*skin-select*/
            // toggle skin select
            $("#skin-select #toggle").click(function() {
                if($(this).hasClass('active')) {
                    $(this).removeClass('active')
                    $('#skin-select').animate({ left:0 }, 100);
                    $('.wrap-fluid').css({"width":"auto","margin-left":"250px"});
                    $('.navbar').css({"margin-left":"240px"});

                    $('#skin-select li').css({"text-align":"left"});
                    $('#skin-select li span, ul.topnav h4, .side-dash, .noft-blue, .noft-purple-number, .noft-blue-number, .title-menu-left').css({"display":"inline-block", "float":"none"});
                    //$('body').css({"padding-left":"250px"});


                    $('.ul.topnav li a:hover').css({" background-color":"green!important"});

                    $('.ul.topnav h4').css({"display":"none"});

                    $('.tooltip-tip2').addClass('tooltipster-disable');
                    $('.tooltip-tip').addClass('tooltipster-disable');


                    $('.datepicker-wrap').css({"position":"absolute", "right":"300px"});
                    $('.skin-part').css({"visibility":"visible"});
                    $('#menu-showhide, .menu-left-nest').css({"margin":"10px"});
                    $('.dark').css({"visibility":"visible"});

                    $('.search-hover').css({"display":"none"});
                    $('.dropdown-wrap').css({"position":"absolute", "left":"0px", "top":"53px"});

                } else {
                    $(this).addClass('active')
                    //$('#skin-select').animate({ left:-200 }, 100);
                    $('#skin-select').animate({ left:-200 }, 100);

                    $('.wrap-fluid').css({"width":"auto", "margin-left":"50px"});
                    $('.navbar').css({"margin-left":"50px"});

                    $('#skin-select li').css({"text-align":"right"});
                    $('#skin-select li span, ul.topnav h4, .side-dash, .noft-blue, .noft-purple-number, .noft-blue-number, .title-menu-left').css({"display":"none"});
                    //$('body').css({"padding-left":"50px"});
                    $('.tooltip-tip2').removeClass('tooltipster-disable');
                    $('.tooltip-tip').removeClass('tooltipster-disable');

                    $('.datepicker-wrap').css({"position":"absolute", "right":"84px"});

                    $('.skin-part').css({"visibility":"visible", "top":"3px"});
                    $('.dark').css({"visibility":"hidden"});
                    $('#menu-showhide, .menu-left-nest').css({"margin":"0"});

                    $('.search-hover').css({"display":"block", "position":"absolute", "right":"-100px"});

                    $('.dropdown-wrap').css({"position":"absolute", "left":"-10px", "top":"53px"});
                }
                return false;
            });
            // show skin select for a second
            setTimeout(function(){
                $("#skin-select #toggle").addClass('active').trigger('click');
            },10)

            $('#status').fadeOut(); // will first fade out the loading animation
            $('#preloader').fadeOut(); // will fade out the white DIV that covers the website.
            $('body').delay(350).css({
                'overflow': 'visible'
            });
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
            this.destroyLinks($ApricotCons.css);
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
    return ApricotOS;
});
