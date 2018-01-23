/**
 * @author:   * @date: 2017/9/22
 */
define([
    "core/js/CommonConstant",
    $Component.CONTAINER.src,
], function (CommonConstant,Container) {
    var NavigationBar = Container.extend({
        xtype:$Component.NAVIGATIONBAR,
        //tagName:"nav",
        //className:"navbar navbar-default",
        //border:0,
        _initElAttr:function(){
            this._super();
            this.$el.wrap('<nav class="navbar navbar-default" role="navigation"></nav>');
        }
    });
    return NavigationBar;
});