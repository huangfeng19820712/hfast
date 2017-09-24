/**
 * @date: 14-2-24
 */
define([
    $Component.EDITWRAP.src,
    $Component.TOOLSTRIP.src,
], function (EditWrap,ToolStrip) {

    var editWrapView = ToolStrip.extend({
        oninitialized:function(event){
            var that = this;
            var editWrap = new EditWrap();
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
                    editWrap.wrap(that.$el);
                }
            }, {
                text: "unwrap",
                onclick: function () {
                    editWrap.unwrap();
                }
            }];
            this.viewModel = $cons.viewModel.EDIT;
        }
    });
    return editWrapView;
});
