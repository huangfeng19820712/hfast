/**
 * @author:   * @date: 2016/2/26
 */
define([$Component.PANEL.src,$Component.TOOLSTRIPITEM.src],
    function (Panel,ToolStripItem) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            mainRegion:{
                comXtype:$Component.TEXTEDITOR,
                comConf:{
                    placeholder:"查询",
                    buttons:[{
                        mode:ToolStripItem.Mode.LADDA,
                        text:"解密",
                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                        onclick:function(event){

                        }
                    },{
                        mode:ToolStripItem.Mode.LADDA,
                        text:"加密",
                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                        onclick:function(event){

                        }
                    }]
                }
            }
            /*Panel 配置 End*/
        });

        return view;
    });