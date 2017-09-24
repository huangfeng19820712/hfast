/**
 * @author:   * @date: 2015/12/29
 */
define([ $Component.TOOLSTRIP.src,
        "core/js/controls/ToolStripItem",
    "core/js/controls/FileDownloadItem"],
    function (ToolStrip,ToolStripItem,FileDownloadItem) {
        var fileDownload = ToolStrip.extend({
            defaultItemType:FileDownloadItem,
            oninitialized:function(event){
                var that = this;
                this.itemOptions = [{
                    text: "下载",
                    url:"/rest/dmdatatype!exportExcel.action",
                },{
                    theme:null,
                    text: "下载2",
                    mode:ToolStripItem.Mode.LINK
                }];
                this.viewModel = $cons.viewModel.EDIT;
            }
        });
        return fileDownload;
    });


