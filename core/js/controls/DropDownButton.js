/**
 * @author:   * @date: 2016/1/7
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/DropDownContainer",
    "core/js/controls/ToolStripItem",
    "core/js/CommonConstant",
    $Component.MENU.src,
], function (CommonConstant, DropDownContainer,ToolStripItem,CommonConstant,Menu) {
    var DropDownButton = DropDownContainer.extend({
        xtype:$Component.DROPDOWNBUTTON,
        mountContent:function(){
            //在按钮后面添加下拉框的内容
            var that = this;
            this.mainButton = new ToolStripItem({
                parent:this,
                text:this.text,
                $container:this.$el,
                iconSkin:CommonConstant.Icon.CARET_DOWN,
                onclick: $.proxy(that.showDropDownRegion,that),
            });
            this.$el.append(this.initDropDownEL());
            this.regionsRender();
        },

    });
    return DropDownButton;
});