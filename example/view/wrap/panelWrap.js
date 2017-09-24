/**
 * @date: 14-2-24
 */
define([
    "core/js/wrap/PanelWrap",
    $Component.TOOLSTRIP.src,
], function (PanelWrap,ToolStrip) {

    var panelWrap = ToolStrip.extend({}).extend({
        oninitialized:function(event){
            this.wrapCom = new PanelWrap();
            var that = this;
            this.itemOptions = [{
                roundedClass:$Rounded.ROUNDED,
                text: "alter",
                onclick: function () {
                    $.window.alert(window.rtree.toUml());
                    window.rtree.map();
                }
            },{
                text: "编辑模式",
                onclick: function () {
                    that.wrapCom.wrap(that.$el);
                }
            }, {
                text: "unwrap",
                onclick: function () {
                    that.wrapCom.unwrap();
                }
            }];
            this.viewModel = $cons.viewModel.EDIT;
        }
    });
    return panelWrap;
});
