/**
 * @author:   * @date: 2018/1/30
 */

define(["core/js/controls/MenuControl",
    "text!core/js/operatingSystem/ApricotOS/tmpl/ApricotMenu.html"],
    function (MenuControl,
              Template) {
    var ApricotMenu = MenuControl.extend({
        xtype:$ApricotCons.xtype.MENU,
        template:Template,
        className:"skin-part",
        dataPre:"data",
        mountContent:function(){
            //this._super();
            var menus = this.getMenus(this.menuDates);
            var that = this;
            _.each(menus, function (menu) {
                //var result = _.template(that.template)( menu);
                var result = _.template(that.template,{variable: that.dataPre})( menu);
                //获取子集数
                that.$el.append(result);
                //var len = that.$el.children().length;
                //$(that.$el.children()[len - 1]).before(result);
            });
        },
    });

    return ApricotMenu;
});