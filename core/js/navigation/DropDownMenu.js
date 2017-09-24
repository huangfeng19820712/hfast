/**
 * @author:   * @date: 2016/1/7
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/DropDownContainer",
    "core/js/controls/ToolStripItem",
    $Component.MENU.src,
], function (CommonConstant, DropDownContainer,ToolStripItem,Menu) {
    var DropDownMenu = DropDownContainer.extend({
        xtype:$Component.DROPDOWNMENU,
        /**
         * {Array}
         * <code>
         * [{
         *      label:"<可选>[显示的内容]"，
         *      subMenu:"<可选>[子菜单]"，
         *      id:"<必选>[唯一编码]"，
         *      order:"<可选>[排序使用]"，
         *      onclick:"<可选>[点击事件]"
         * },...]
         * </code>
         */
        menus:null,
        /**
         * @link DropDownMenu.layout
         */
        layout:null,
        _initElAttr:function(){
            this._super();
            if(this.layout==DropDownMenu.layout.right){
                this.$el.addClass("navbar-right");
            }
        },
        mountContent:function(){
            //在按钮后面添加下拉框的内容
            var that = this;
            this.mainButton = new ToolStripItem({
                text:this.text,
                $container:this.$el,
                themeClass:[this.btnTheme,"dropdown-toggle"].join(" "),
                onclick: $.proxy(that.showDropDownRegion,that),
            });
            this.mainButton.$el.append('<span class="caret"></span>')
                .append('<span class="sr-only">Toggle Dropdown</span>');
            var menu = new Menu({
                id:this.getDropDownRegionId(),
                menus:this.menus,
                $container:this.$el,
            });
            this._initRegionManager();
        },
    });

    DropDownMenu.layout = {
        left:"LEFT",
        right:"RIGHT"
    }

    return DropDownMenu;
});