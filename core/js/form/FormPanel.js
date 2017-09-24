/**
 *
 * @author:   * @date: 2017/7/24
 */
define([
        "core/js/layout/Panel",
        "core/js/CommonConstant",
        "core/js/editors/TextEditor",
        "core/js/windows/Window",
        "core/js/controls/ToolStripItem",
        "core/js/utils/ApplicationUtils"
    ],
    function ( Panel, CommonConstant, TextEditor, Window, ToolStripItem,
              ApplicationUtils) {
        var FormPanel = Panel.extend({
            xtype: $Component.FORMPANEL,
            theme: $Theme.BLUE,
            /**
             * 此fields的内容同AbstractFormEditor的fields
             */
            fields:null,
            submitLabel:"确定",
            cancelLabel:"取消",
            beforeInitializeHandle:function(options, triggerEvent){
                this.mainRegion =  {
                    comXtype: $Component.SKYFORMEDITOR,
                        comConf: {
                        fields: this.fields,
                        /*groups:[{
                            collapsible:false,
                        }]*/
                    }
                }
                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                    textAlign: $TextAlign.RIGHT,
                    comConf: {
                        /*Panel的配置项 start*/

                            spacing: CommonConstant.Spacing.DEFAULT,
                            itemOptions: [{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: this.submitLabel,
                            onclick: $.proxy(this.onSubmit,this),
                        }, {
                            themeClass: ToolStripItem.ThemeClass.CANCEL,
                            text: this.cancelLabel,
                            onclick: $.proxy(this.onCancel,this)
                        }]
                        /*Panel 配置 End*/
                    }
                }
                // this._super();
            },
            /**
             * 获取表单编辑器对象
             * @returns {*|null}
             */
            getFormEditor:function(){
                var skyFormEditor = this.getMainRegionRef().getComRef();
                return  skyFormEditor;
            },
            onSubmit:function(){
                var skyFormEditor = this.getFormEditor();
                skyFormEditor.validate();
            },
            onCancel:function(){

            }
        });

        return FormPanel;
    });
