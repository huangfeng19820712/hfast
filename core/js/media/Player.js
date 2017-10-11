/**
 * @author:   * @date: 2015/12/30
 */
define(["core/js/controls/Control",
    "core/js/utils/ViewUtils",
    "core/js/CommonConstant",
    "flowplayer"], function (Control, ViewUtils, CommonConstant) {
    var Player = Control.extend({
        xtype:$Component.PLAYER,
        eTag: "<a />",
        flvPath:"/"+$route.getJs("flowplayer","flowplayer-3.2.18.swf"),
        rtmpPath:"/"+$route.getJs("flowplayer","flowplayer.rtmp-3.2.13.swf"),
        url:null,
        autoPlay:false,
        playerMode:$cons.playerMode.FLV,
        mountContent:function(){
            this.$el.attr("href",this.url);
            // this.$el.css({display:"block"});
            if(this.playerMode==$cons.playerMode.FLV){
                var that = this;
                this.$el.flowplayer( this.flvPath,{
                    log: { level: 'debug', filter: 'org.flowplayer.slowmotion.*' },
                    clip:{
                        autoPlay:this.autoPlay,

                    },
                    onStart:function(play){
                        that.onStart.apply(this,play);
                    },
                    onError:function(play){
                        that.onError.apply(this,play);
                    },
                    onStop:function(play){
                        that.onStop.apply(this,play);
                    },
                });
            }else{
                this.createRtmp();
            }
        },
        createRtmp:function(){
            var that = this;
            this.$el.flowplayer(this.flvPath,{
                clip: {
                    url: this.url,
                    provider: 'rtmp',
                    live: true,
                    autoPlay:this.autoPlay,
                },
                onStart:function(play){
                    that.onStart.apply(this,play);
                },
                onError:function(play){
                    that.onError.apply(this,play);
                },
                onStop:function(play){
                    console.info(">>>");
                    that.trigger("stop");
                },
                //onStop: $.proxy(this.stopPlay,this),
                plugins: {
                    rtmp: {
                        url: this.rtmpPath,
                    }
                }
            });
        },
        /*onstart:function(){
        },
        onstop:function(player){
        },
        onerror:function(){}*/
    });
    return Player;
})
