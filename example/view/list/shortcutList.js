/**
 * @author:   * @date: 2016/2/29
 */
define([
        $Component.SIMPLELAYOUT.src],
    function ( SimpleLayout) {
        var view = SimpleLayout.extend({
            item:{
                comXtype: $Component.SHORTCUTLIST,
                height:"100%",
                comConf:{
                    data: [{title: "win0", icon: "/"+APP_NAME+"/view/list/images/win10.png"},
                        {title: "baidu", icon: "/"+APP_NAME+"/view/list/images/baidu.png"},
                        {title: "doc", icon: "/"+APP_NAME+"/view/list/images/doc.png"},
                        {title: "download", icon: "/"+APP_NAME+"/view/list/images/download.png"},
                        {title: "github", icon: "/"+APP_NAME+"/view/list/images/github.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        /*{title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},
                        {title: "kyzg", icon: "/"+APP_NAME+"/view/list/images/kyzg.png"},*/
                    ],
                }
            },
            /*resizeHandle:function(){
                this._super();
                var itemRegion = this.getItemRegion();
                itemRegion.getComRef().set
            },*/
            onresize:function(event){
                var itemRegion = this.getItemRegion();
                itemRegion.getComRef().setOffset()
            },
            beforeInitializeHandle:function(){
                this._super();
                this.$bottomReferent =  $(".copyright").eq(0);
                /*this.item = {
                 comRef:null
                 };*/
            }
        });

        return view;
    });

