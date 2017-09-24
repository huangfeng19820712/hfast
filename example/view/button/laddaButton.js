/**
 * @author:   * @date: 2015/12/29
 */
define([ $Component.TOOLSTRIP.src,
        "core/js/controls/ToolStripItem",
        "ladda"],
    function (ToolStrip,ToolStripItem,Ladda) {
        var fileDownload = ToolStrip.extend({
            oninitialized:function(event){
                var that = this;
                this.itemOptions = [{
                    roundedClass:$Rounded.ROUNDED,
                    text: "ladda",
                    mode:ToolStripItem.Mode.LADDA,
                    themeClass:ToolStripItem.ThemeClass.INFO,
                    onclick:function(event){
                        var l = Ladda.create(event.jqEvent.currentTarget);
                        l.start();
                    }
                },{
                    text: "ladda2",
                    mode:ToolStripItem.Mode.LADDA,
                    themeClass:ToolStripItem.ThemeClass.PRIMARY,
                    onclick:function(event){
                        var l = Ladda.create(event.jqEvent.currentTarget);
                        l.start();
                    }
                }];
                this.viewModel = $cons.viewModel.EDIT;
            }
        });
        return fileDownload;
    });


