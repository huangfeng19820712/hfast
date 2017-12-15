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
    _.extend($.Slider.prototype,{
        absoluteToRelative:function(jqObjects){
            //先保存位置信息，因为设置了position属性后，位置信息会改变
            var positions = [];
            _.each(jqObjects,function(item,idx,list){
                var el = $(item);
                positions[idx] = el.offset();
            });
            //把相对位置改成绝对位置
            _.each(jqObjects,function(item,idx,list){
                var el = $(item);
                var position = positions[idx];
                el.css("position", "absolute");
                el.offset(position);
            });

        },
        _navigate:function(page, dir){
            var $current	= this.$slides.eq( this.current ), $next, _self = this;
            var jqObjects = $current.find(".container-fluid>.hfast-view");
            this.absoluteToRelative(jqObjects);
            if( this.current === page || this.isAnimating ) return false;
            this.isAnimating	= true;
            // check dir
            var classTo, classFrom, d;
            if( !dir ) {
                ( page > this.current ) ? d = 'next' : d = 'prev';
            }
            else {
                d = dir;
            }
            if( this.cssAnimations && this.cssAnimations ) {
                if( d === 'next' ) {
                    classTo		= 'da-slide-toleft';
                    classFrom	= 'da-slide-fromright';
                    ++this.bgpositer;
                }
                else {classTo		= 'da-slide-toright';
                    classFrom	= 'da-slide-fromleft';
                    --this.bgpositer;
                }
                this.$el.css( 'background-position' , this.bgpositer * this.options.bgincrement + '% 0%' );
            }
            this.current	= page;
            $next			= this.$slides.eq( this.current );
            if( this.cssAnimations && this.cssAnimations ) {
                var rmClasses	= 'da-slide-toleft da-slide-toright da-slide-fromleft da-slide-fromright';
                $current.removeClass( rmClasses );
                $next.removeClass( rmClasses );
                $current.addClass( classTo );
                $next.addClass( classFrom );
                $current.removeClass( 'da-slide-current' );
                $next.addClass( 'da-slide-current' );

            }

            // fallback
            if( !this.cssAnimations || !this.cssAnimations ) {
                $next.css( 'left', ( d === 'next' ) ? '100%' : '-100%' ).stop().animate( {
                    left : '0%'
                }, 1000, function() {
                    _self.isAnimating = false;
                });
                $current.stop().animate( {
                    left : ( d === 'next' ) ? '-100%' : '100%'
                }, 1000, function() {
                    $current.removeClass( 'da-slide-current' );
                });
            }
            this._updatePage();
        }
    });

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
