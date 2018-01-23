/**
 * @author:   * @date: 2018/1/13
 */
define(["core/js/controls/AbstractControlView",
    "text!core/resources/tmpl/Switcher.html",
    "css!core/resources/styles/Switcher.css"],function (AbstractControlView,Template) {
    var Switcher = AbstractControlView.extend({
        xtype:$Component.SWITCHER,
        template:Template,
        /**
         * 固定的高度
         */
        spinTop:null,
        onthemeSelect:null,
        mountContent:function(){
            this._super();
            // switcher toggle
            if( $('body').hasClass('home')){
                $('.del-style-switcher').css('right', '0').delay(1000).animate({
                    right: '-=250'
                }, 300);

            }else{
                $('.del-style-switcher').css('right', '-250px');
            }
            if(this.spinTop){
                this.$(".del-style-switcher").css({
                    top:this.spinTop,
                });
            }

            $('.del-switcher-toggle').clickToggle(
                function(){
                    $('.del-style-switcher').animate({
                        right: '+=250'
                    }, 300);
                },
                function(){

                    $('.del-style-switcher').animate({
                        right: '-=250'

                    }, 300);
                }
            );
            // check if skin has already applied before
           /* var skin = localStorage.getItem('skin');
            var skinLogo = localStorage.getItem('skinLogo');
            var rootPath = '/framework/kingadmin';
            var skinLogoDefault =rootPath+ '/img/kingadmin-logo-white.png';
            var skinLogoFullbright = rootPath+'/img/kingadmin-logo.png';

            if(skin != null) {
                $('head').append('<link rel="stylesheet" href="' + skin + '" type="text/css" />');

                // set the selected button style
                if( skin.toLowerCase().indexOf('fulldark') >= 0 ) {
                    $('.switch-skin-full.fulldark').addClass('selected');
                }else if( skin.toLowerCase().indexOf('fullbright') >= 0 ) {
                    $('.switch-skin-full.fullbright').addClass('selected');
                }
            }

            if(skinLogo != null) {
                $('.logo img').attr('src', skinLogo);
            }*/

            var that = this;

            _.each($Theme,function(item,index,list){
                var themeLi = that.createThemeLi(item);
                $(".del-section-skin>ul").append(themeLi);
            });
            // switch items
            $('.switch-skin, .switch-skin-full').click( function(e) {
                e.preventDefault();
                //that.resetStyle();
                /*$('head').append('<link rel="stylesheet" href="' + $(this).attr('data-skin') + '" type="text/css" />');

                 if($(this).hasClass('fullbright')) {
                 skinLogo = skinLogoFullbright;
                 }else {
                 skinLogo = skinLogoDefault;
                 }
                 $('.logo img').attr('src', skinLogo);
                 localStorage.setItem('skin', $(this).attr('data-skin'));
                 localStorage.setItem('skinLogo', skinLogo);*/
                that.trigger("themeSelect",e);
            });

            $('.switch-skin-full').click( function() {
                $('.switch-skin-full').removeClass('selected');
                $(this).addClass('selected');
            });

            // reset stlye
            $('.del-reset-style').click( function() {
                that.resetStyle();
            });
        },

        createThemeLi:function(theme){
            var dom = _.template('<li><a href="#" title="<%=data.themeName%>" class="switch-skin switcher-<%=data.themeName%>" data-skin="<%=data.themeName%>"><%data.themeName%></a></li>',
                {variable: "data"})({
                themeName: theme
            });
            return dom;
        },

        /**
         * 重置样式
         * @param skinLogoDefault
         */
        resetStyle:function(skinLogoDefault){
            $('head link[rel="stylesheet"]').each( function() {
                if( $(this).attr('href').toLowerCase().indexOf("skins") >= 0 )
                    $(this).remove();
            });

            $('.logo img').attr('src', skinLogoDefault);

            localStorage.removeItem('skin');
            localStorage.setItem('skinLogo', skinLogoDefault);
        }
    });

    return Switcher;
});
