/**
 * @author:   * @date: 2015/12/29
 */
define([ $Component.TOOLSTRIP.src,
        "core/js/controls/ToolStripItem",
        $Component.SPINLOADER.src],
    function (ToolStrip,ToolStripItem,SpinLoader) {
        var fileDownload = ToolStrip.extend({
            oninitialized:function(event){
                var that = this;
                this.itemOptions = [{
                    roundedClass:$Rounded.ROUNDED,
                    text: "loading3秒",
                    mode:ToolStripItem.Mode.LADDA,
                    themeClass:ToolStripItem.ThemeClass.INFO,
                    onclick:function(event){
                        var spinLoader = new SpinLoader({
                            inDuration:3
                        });
                        spinLoader.show($("body"));
                    }
                },{
                    roundedClass:$Rounded.ROUNDED,
                    text: "loading3秒",
                    mode:ToolStripItem.Mode.LADDA,
                    themeClass:ToolStripItem.ThemeClass.INFO,
                    onclick:function(event){
                        $.window.showLoader($("body"), 3);
                    }
                },{
                    text: "ladda2",
                    mode:ToolStripItem.Mode.LADDA,
                    themeClass:ToolStripItem.ThemeClass.PRIMARY,
                    onclick:function(event){
                        $.window.showLoader($(".breadcrumbs"));
                    }
                }];
                this.viewModel = $cons.viewModel.EDIT;
            }
        });
        return fileDownload;
    });


