/**
 * @date: 14-2-24
 */
define([
    "core/js/layout/Panel",
    "core/js/controls/ToolStripItem",
    "core/js/CommonConstant",
], function (Panel,ToolStripItem,CommonConstant) {

    var panelView = Panel.extend({
        title:"测试1",
        theme:$Theme.BLUE,
        help:"内容1",
        brief:"摘要1",
        mainRegion:"aaaa",
        width:500,
        draggable:true,
        footerRegion:{
            comXtype:$Component.TOOLSTRIP,
            comConf:{
                /*Panel的配置项 start*/
                textAlign:$TextAlign.RIGHT,
                realClass:"btn-group text-right",
                spacing :CommonConstant.Spacing.DEFAULT,
                items: [{
                    themeClass:ToolStripItem.ThemeClass.PRIMARY,
                    text:"确定",
                    onclick: function () {
                        $.window.alert("测试1");
                    }
                },{
                    themeClass:ToolStripItem.ThemeClass.CANCEL,
                    text: "取消",
                    onclick: function () {
                        $.window.confirm("测试1", {
                            yesHandle: function () {
                                alert(">>>");
                            }
                        });
                    }
                }]
                /*Panel 配置 End*/
            }
        },
        onshow:function(e){
            var mainRegionRef = this.getMainRegionRef();
            mainRegionRef.$el.droppable({
                activeClass: "ui-state-active",
                hoverClass: "ui-state-hover",
                drop: function( event, ui ) {
                    var clazz = ui.draggable.data("control").componentClass;
                    if(clazz){
                        var component = new clazz({
                            $container:mainRegionRef.$el,
                        });
                        component.render();
                    }
                }
            });
            mainRegionRef.$el.sortable({
                revert: true
            });
        }
    });
    return panelView;
});
