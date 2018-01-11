/**
 * 幻灯片布局，ParallaxLayout
 * @author:   * @date: 2016/3/2
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/ParallaxLayout.html",
     "parallax-slider",
    $route.getCss("animate"),
    "css!core/resources/styles/screen.css"
], function (CommonConstant, Container,Template) {
    _.extend($.Slider.prototype,{
        _init 				: function( options ) {

            this.options 		= $.extend( true, {}, $.Slider.defaults, options );
            this.$slides		= this.$el.children('div.da-slide');
            this.slidesCount	= this.$slides.length;
            this.current		= this.options.current;
            if( this.current < 0 || this.current >= this.slidesCount ) {
                this.current	= 0;
            }
            //设置默认的class
            this.$slides.eq( this.current ).addClass( 'da-slide-current' );
            //不是当前页设置成
            for(var i=0;i<this.$slides.length;i++){
                var className = null;
                if(i==this.current){
                    className= 'da-slide-current';
                }else{
                    className= 'animated bounceOutLeft';
                }
                $(this.$slides[i]).addClass( className );
            }

            var $navigation		= $( '<nav class="da-dots"/>' );
            for( var i = 0; i < this.slidesCount; ++i ) {
                $navigation.append( '<span/>' );
            }
            $navigation.appendTo( this.$el );

            this.$pages			= this.$el.find('nav.da-dots > span');
            this.$navNext		= this.$el.find('span.da-arrows-next');
            this.$navPrev		= this.$el.find('span.da-arrows-prev');

            this.isAnimating	= false;

            this.bgpositer		= 0;

            this.cssAnimations	= Modernizr.cssanimations;
            this.cssTransitions	= Modernizr.csstransitions;

            if( !this.cssAnimations || !this.cssAnimations ) {

                this.$el.addClass( 'da-slider-fb' );

            }

            this._updatePage();

            // load the events
            this._loadEvents();

            // slideshow
            if( this.options.autoplay ) {

                this._startSlideshow();

            }

        },
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
            //this.absoluteToRelative(jqObjects);
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

                    /*classTo		= 'da-slide-toleft';
                    classFrom	= 'da-slide-fromright';*/
                    classTo		= "bounceOutLeft";
                    classFrom	= 'bounceInRight';
                    ++this.bgpositer;
                }
                else {
                    /*classTo		= 'da-slide-toright';
                    classFrom	= 'da-slide-fromleft';*/
                    classTo		= 'bounceOutRight';
                    classFrom	= 'bounceInLeft';
                    --this.bgpositer;
                }
                this.$el.css( 'background-position' , this.bgpositer * this.options.bgincrement + '% 0%' );
            }
            this.current	= page;
            $next			= this.$slides.eq( this.current );
            if( this.cssAnimations && this.cssAnimations ) {
                //var rmClasses	= 'da-slide-toleft da-slide-toright da-slide-fromleft da-slide-fromright';
                var rmClasses	= 'animated bounceOutLeft bounceInRight bounceOutRight bounceInLeft';
                $current.removeClass( rmClasses );
                $next.removeClass( rmClasses );
                $current.addClass( "animated" );
                $next.addClass( "animated" );
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
