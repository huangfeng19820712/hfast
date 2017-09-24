/**
 * @author:   * @date: 2016/2/26
 * 代码编辑器使用codemirror插件
 * http://codemirror.net/doc/manual.html#vimapi
 */
define([
    "core/js/controls/ToolStripItem",
    "core/js/utils/ApplicationUtils",
    "ladda",
    "jquery.fileDownload"
], function (ToolStripItem,ApplicationUtil,Ladda) {
    var FileDownload = ToolStripItem.extend({
        xtype: $Component.FILEDOWNLOADITEM,
        url:null,
        mode:ToolStripItem.Mode.LADDA,
        themeClass:ToolStripItem.ThemeClass.PRIMARY,
        prepareCallback:null,
        successCallback:null,
        failCallback:null,
        onclick: function (event) {
            var l = Ladda.create(event.jqEvent.currentTarget);
            l.start();
            var ajaxClient = ApplicationUtil.getApplicationContext().getAjaxClient();
            ajaxClient.exportFile({
                methodName:this.url,
                successCallback:function(){
                    l.stop();
                },
                failCallback:function(){
                    l.stop();
                    $.window.alert("下载失败！");
                },
            });

            return false; //this is critical to stop the click event which will trigger a normal file download!
        }

    });

    return FileDownload;
})
