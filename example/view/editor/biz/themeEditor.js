/**
 * @author:   * @date: 2016/2/26
 */
define([$Component.PANEL.src,
        $Component.TOOLSTRIPITEM.src,
        "core/js/CommonConstant"],
    function (Panel,ToolStripItem,CommonConstant) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            /*Panel 配置 End*/
            beforeInitializeHandle:function(){
                this.mainRegion={
                    //comXtype:$Component.DROPDOWNEDITOR,
                    comXtype:$Component.THEMEEDITOR,
                    comConf:{
                        value:"blue"
                    }
                };
            },

        });

        return view;
    });