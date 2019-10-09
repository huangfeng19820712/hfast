/**
 *
 * @author:   * @date: 2017/7/24
 */
define([
        "core/js/layout/Panel",
        "core/js/CommonConstant",
        "core/js/editors/TextEditor",
        "core/js/windows/Window",
        $Component.TOOLSTRIPITEM.src,
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
            /**
             * 编辑器默认的布局模式，参考SkyFormEditor.defaultFieldsetConf.layoutMode
             */
            defaultEditorLayoutMode:null,
            /**
             * 表单编辑器的配置信息
             */
            formEditorConf:null,
            /**
             * 提交后触发的事件
             */
            onsubmit:null,
            beforeInitializeHandle:function(options, triggerEvent){
                var that = this;
                var defaultFormEdtorConf = {
                    fields: this.fields,
                    defaultFieldsetConf: {
                        defaultEditorConf: {
                            layoutMode: this.defaultEditorLayoutMode
                        }
                    },
                    ajaxClient:this.ajaxClient,
                    action:this.action,
                    defaultCollapsible:false,
                    paramPrefix:this.paramPrefix,
                    onsubmit:function(ajaxResponse){
                        that.trigger("submit",ajaxResponse);
                    }
                    /*groups:[{
                     collapsible:false,
                     }]*/
                };
                var _FormEdtorConf = _.extend(defaultFormEdtorConf,this.formEditorConf);

                this.mainRegion =  {
                    comXtype: $Component.SKYFORMEDITOR,
                    comConf: _FormEdtorConf
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
            /**
             * 获取表单的参数：包括隐藏域的值和编辑器的值
             * @param   {Boolean}  addParamPrefixed  是否要添加前缀,默认是不添加
             * @param   {String} needEmptyValue 空值是否也需要包含在结果集中，默认是不需要空值的，但是查询参数中可能需要
             * @return {{}}
             */
            getAllFieldValue:function(addParamPrefixed,needEmptyValue){
                return this.getFormEditor().getAllFieldValue(addParamPrefixed,needEmptyValue);
            },
            cancel:function(){

            }
        });

        return FormPanel;
    });
