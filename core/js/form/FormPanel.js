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
            ajaxClient:null,
            /**
             * 属性前缀，如:editObj,则提交的属性为editObj.name
             */
            paramPrefix:null,
            action:null,
            submitLabel:"保存",
            cancelLabel:"取消",
            beforeInitializeHandle:function(options, triggerEvent){
                this.mainRegion =  {
                    comXtype: $Component.SKYFORMEDITOR,
                        comConf: {
                        fields: this.fields,
                        ajaxClient:this.ajaxClient,
                        action:this.action,
                        defaultCollapsible:false,
                        paramPrefix:this.paramPrefix
                        /*groups:[{
                            collapsible:false,
                        }]*/
                    }
                }
                var that = this;
                this.footerRegion = {
                    comXtype: $Component.TOOLSTRIP,
                    textAlign: $TextAlign.RIGHT,
                    comConf: {
                        /*Panel的配置项 start*/

                            spacing: CommonConstant.Spacing.DEFAULT,
                            itemOptions: [{
                            themeClass: ToolStripItem.ThemeClass.PRIMARY,
                            text: this.submitLabel,
                            onclick: function(){
                                that.submit();
                            }
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
            setAction:function(methodName, methodVersion){
                var skyFormEditor = this.getMainRegionRef().getComRef();
                skyFormEditor.setAction(methodName,methodVersion);
            },
            /**
             * 获取表单编辑器对象
             * @returns {*|null}
             */
            getFormEditor:function(){
                var skyFormEditor = this.getMainRegionRef().getComRef();
                return  skyFormEditor;
            },
            submit:function(){
                var skyFormEditor = this.getFormEditor();
                skyFormEditor.submit();
            },
            cancel:function(){

            }
        });

        return FormPanel;
    });
