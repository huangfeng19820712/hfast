/**
 * 幻灯片布局，ParallaxLayout
 * @author:   * @date: 2016/3/2
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/CenterLayout.html"
], function (CommonConstant, Container,LayoutTemplate) {
    var CenterLayout = Container.extend({
        xtype:$Component.CENTERLAYOUT,
        //主要显示的内容
        item:null,
        centerRegionId:null,
        template:LayoutTemplate,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initItems:function(){
            if(this.item){
                this.item['id']=this.getCenterResionId();
                this.items=[this.item];
            }
        },
        getCenterResion$el:function(){
            return this.$("#"+this.getDropDownRegionId());
        },
        getCenterResionId:function(){
            if(!this.centerRegionId){
                this.centerRegionId = $.createId("centerRegion");
            }
            return this.centerRegionId;
        }
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
    });
    return CenterLayout;
});
