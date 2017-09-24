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

                this.$el.flowplayer( this.flvPath,{
                    clip:{
                        autoPlay:this.autoPlay,

                    },
                    onError: $.proxy(this.onError,this)
                });
            }else{
                this.createRtmp();
            }
        },
        createRtmp:function(){
            this.$el.flowplayer(this.flvPath,{
                clip: {
                    url: this.url,
                    provider: 'rtmp',
                    live: true,
                    autoPlay:this.autoPlay
                },
                onError: $.proxy(this.onError,this),
                plugins: {
                    rtmp: {
                        url: this.rtmpPath,
                    }
                }
            });
        },
        onError:function(){
            console.info(">>>>");
        }
    });
    return Player;
})
