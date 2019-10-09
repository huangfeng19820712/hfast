/**
 * @date: 14-2-24
 */
define([
    $Component.SIMPLELAYOUT.src
], function (SimpleLayout) {

    var view = SimpleLayout.extend({
        beforeInitializeHandle:function(){
            this._super();
            this.$bottomReferent =  $(".copyright").eq(0);
            this.item = {
                comXtype: $Component.LABEL,
                comConf:{
                    text:"标签"
                }
            };
        },
        onrender:function(event){
            console.info(">>>");
        }
    });

    return view;
});
