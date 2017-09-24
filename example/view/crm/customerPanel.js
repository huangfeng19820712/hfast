/**
 * @author:   * @date: 2016/2/29
 */
define([
        $Component.PANEL.src,
        $Component.TOOLSTRIPITEM.src,"ladda",
        "core/js/context/ApplicationContext"],
    function ( Panel,ToolStripItem,Ladda,ApplicationContext) {
        var panel = Panel.extend({
            mainRegion : {
                comXtype: $Component.SKYFORMEDITOR,
                comConf: {
                    readOnly:true,
                    fields: [{
                        name:"id",
                        hidden:true,
                    },{
                        label: "姓名",
                        name: "name",
                    },{
                        label: "手机",
                        name: "phone",
                    },{
                        label: "QQ",
                        name: "qq",
                    },{
                        label:"邮箱",
                        name:"email",
                    }],
                    $url:"/customerInfo/getCustomer.action",
                    initializeHandle:function(){
                        this.setCustomer();
                    },
                    setCustomer:function(){
                        var ajaxClient = ApplicationContext.getAjaxClient();
                        var that = this;
                        var id = this.getValue("id");
                        ajaxClient.buildClientRequest(this.$url)
                            .addParams({"id": id})
                            .post(function (compositeResponse) {
                                var obj = compositeResponse.getSuccessResponse();
                                if (obj) {
                                    that.setValues(obj);
                                }
                            });
                    }
                }
            },
            footerRegion: {
                comXtype: $Component.TOOLSTRIP,
                className: "text-right",
                comConf: {
                    /*Panel的配置项 start*/
                    textAlign: $TextAlign.RIGHT,
                    itemOptions: [{
                        text: "下一个",
                        mode:ToolStripItem.Mode.LADDA,
                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                        onclick: function (event) {
                            var l = Ladda.create(event.jqEvent.currentTarget);
                            l.start();
                            var panel = this.getParent($Component.PANEL);
                            var fromEditor = panel.getMainRegionRef().getComRef();
                            fromEditor.setCustomer();
                            l.stop();
                        }
                    }]
                    /*Panel 配置 End*/
                }
            },
        });
        return panel;
    });

