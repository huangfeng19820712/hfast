/**
 * @date: 14-2-24
 */
define([
    $Component.TOOLSTRIP.src,
    $Component.DROPDOWNCONTAINER.src,
    "core/js/utils/ApplicationUtils","core/js/wrap/EditWrap"
], function (ToolStrip,DropDownContainer,ApplicationUtils,EditWrap) {
    var toolStrip = ToolStrip.extend({
        initializeHandle:function(){
            var that = this;
            this.itemOptions = [{
                roundedClass:$Rounded.ROUNDED,
                text: "alter",
                onclick: function () {
                    $.window.alert(window.rtree.toUml());
                }
            },{
                toolStripItemType:DropDownContainer,
                text: "编辑模式",
                onclick: function () {
                }
            }, {
                text: "unwrap",
                onclick: function () {
                }
            }];
            this.viewModel = $cons.viewModel.EDIT;
        }
    });
    return toolStrip;
});
