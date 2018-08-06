/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/SimpleLayout",
    APP_NAME+"/view/login/clouds"],
    function (SimpleLayout,clouds
    ) {
        var view = SimpleLayout.extend({
            beforeInitializeHandle:function(){
                this._super();
                this.$bottomReferent =  $(".copyright").eq(0);
                this.item = {
                    comRef:null
                };
            },
            onshow:function(){
                //this._super();
                var region = this.getItemRegion();
                region.show(new clouds());
            }
        });
        return view;
    });
