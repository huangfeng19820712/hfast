/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/form/FormPanel",
        "core/js/model/BaseModel",
        "core/js/base/BaseViewModel",
        "core/js/windows/Window",
        "core/js/utils/ApplicationUtils",
        "core/js/rpc/Action"],
    function (FormPanel, BaseModel, BaseViewModel, Button,
              ApplicationUtils,Action) {
        var FIELD_MODEL_URL = "/form/getFields.action";
        var FORM_MODEL_URL = "/rest/sysunit!get.action";

        var FieldModel = BaseModel.extend({
            url: FIELD_MODEL_URL,
            defaults: {
                shortName: "sysunit"
            },
            parse: function (result, options) {
                return {fields: result};
            }
        });

        var FormModel = BaseModel.extend({
            url: FORM_MODEL_URL,
            defaults: {
                id: "1"
            }
        });

        var view = BaseViewModel.extend({
            model: null,
            formPanel: null,
            unitId:null,
            ajaxClient: null,
            mountContent: function () {
                var that = this;
                this.formPanel = new FormPanel({
                    //必须添加，不然会渲染两次
                    parent:that,
                    width:"100%",
                    height:"100%",
                    isShowHeader:false,
                    border:"0px",
                    ajaxClient:this.ajaxClient,
                    paramPrefix:"editObj",
                    action:new Action({
                        nameSpace:"unit",
                        methodName:"merge"}),
                    fields: [ {
                        "name": "id",
                        hidden:true,
                    },{
                        "name": "unitName",
                        "label": "组织名称",
                        "editor": "TextEditor",
                        "itemValue": null,
                        rules: {
                            required: true
                        }
                    }, {
                        "name": "parentId",
                        "label": "父组织Id",
                        "editor": "TextEditor",
                        "itemValue": null
                    }, {
                        "name": "level",
                        "label": "组织级别",
                        "editor": "TextEditor",
                        "itemValue": null
                    }, {
                        "name": "status",
                        "label": "状态",
                        "editor": "TextEditor",
                        "itemValue": null
                    }, {
                        "name": "remark",
                        "label": "备注",
                        "editor": "TextEditor",
                        "itemValue": null
                    }],
                    $container: this.$el,
                    onrender: function (e) {
                        if(that.unitId!=null){
                            that.setUnitId(that.unitId);
                        }
                    },
                });

            },
            /**
             * 修改unitId，同时修改整个form表单的数据
             * @param unitId
             */
            setUnitId:function(unitId){
                var formModel = new FormModel();
                formModel.setAjaxClient(this.ajaxClient);
                formModel.setFetchSuccessFunction(this.setValues, this, formModel);
                formModel.fetch({data: {id: unitId}});
            },

            /**
             * 把节点的title设置到表单中，新增的情况下，只有title
             * @param   node      {FancytreeNode}
             * @param   parentNode  {FancytreeNode}
             */
            setNodeTitle:function(node,parentNode){
                this.formPanel.getFormEditor().clearValue();
                this.formPanel.getFormEditor().setValues({
                    unitName:node.title,
                    parentId:parentNode.data.id,
                });
            },
            /**
             * 设置值
             */
            setValues: function (model) {
                this.formPanel.getFormEditor().setValues(model.attributes);
            },
            resizeLayout:function(){
                if (this._super) {
                    this._super(e);
                }
                this.formPanel.resizeLayout();
            }
        });

        return view;
    });