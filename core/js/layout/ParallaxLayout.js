/**
 * 幻灯片布局，ParallaxLayout
 * @author:   * @date: 2016/3/2
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/ParallaxLayout.html",
     "parallax-slider",
    "css!core/resources/styles/screen.css"
], function (CommonConstant, Container,Template) {
    var ParallaxLayout = Container.extend({
        xtype:$Component.PARALLAXLAYOUT,
        _defaultRegionClassName:"da-slide",
        className:"da-slider",
        //template:Template,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        mountContent:function(){
            this._super();
            this.$el.append('<div class="da-arrows"><span class="da-arrows-prev"></span><span class="da-arrows-next"></span></div>');
            this.$el.cslider({
                current     : 0,
                // index of current slide

                bgincrement : 50,
                // increment the background position
                // (parallax effect) when sliding

                autoplay    : false,
                // slideshow on / off

                interval    : 4000
                // time between transitions
            });
        },
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
    });
    return ParallaxLayout;
});
