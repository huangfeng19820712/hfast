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
        var FORM_MODEL_URL = "/rest/sysrole!get.action";

        var FieldModel = BaseModel.extend({
            url: FIELD_MODEL_URL,
            defaults: {
                shortName: "sysrole"
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
            roleId:null,
            roleDate:null,
            ajaxClient: null,
            /**
             * roleform的提交事件
             */
            onsubmit:null,
            mountContent: function () {
                var that = this;
                this.model = new FormModel();
                this.model.setAjaxClient(this.ajaxClient);
                this.model.setFetchSuccessFunction(this.setValues, this, this.model);
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
                        nameSpace:"role",
                        methodName:"save"}),
                    fields: [ {
                        "name": "id",
                        "label": "ID",
                        disabled:true,
                        rules: {
                            required: true
                        }
                    },{
                        "name": "code",
                        "label": "角色编码",
                        "itemValue": null,
                        rules: {
                            required: true
                        }
                    },{
                        "name": "name",
                        "label": "角色名称",
                        "editor": "TextEditor",
                        "itemValue": null,
                        rules: {
                            required: true
                        }
                    },{
                        "name": "inherent",
                        "label": "是否是系统预建的角色",
                        editorType: $Component.SWITCHEDITOR,
                        defaultValue:"0",
                        onText:"是",
                        offText:"否",
                        rules: {
                            required: true
                        }
                    },{
                        "name": "remark",
                        "label": "备注",
                        "editor": "TextEditor",
                        "itemValue": null
                    }],
                    $container: this.$el,
                    onrender: function (e) {
                        if(that.roleId!=null){
                            that.setRoleId(that.roleId,that.roleDate);
                        }
                    },
                    onsubmit:function(ajaxResponse){
                        that.trigger("submit",ajaxResponse);
                    }
                });

            },
            /**
             * 获取表单的参数：包括隐藏域的值和编辑器的值
             * @param   {Boolean}  addParamPrefixed  是否要添加前缀,默认是不添加
             * @param   {String} needEmptyValue 空值是否也需要包含在结果集中，默认是不需要空值的，但是查询参数中可能需要
             * @return {{}}
             */
            getAllFieldValue:function(addParamPrefixed,needEmptyValue){
                return this.formPanel.getAllFieldValue(addParamPrefixed, needEmptyValue);
            },
            /**
             * 修改roleId，同时修改整个form表单的数据
             * @param roleId
             * @param roleData  数据
             */
            setRoleId:function(roleId,roleData){
                /*var formModel = new FormModel();
                formModel.setAjaxClient(this.ajaxClient);
                formModel.setFetchSuccessFunction(this.setValues, this, formModel);*/
                this.model.clear();
                this.model.set(roleData);
                this.model.fetch({data: {id: roleId}});
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
                this.formPanel.getFormEditor().clearValue();
                this.formPanel.getFormEditor().setValues(model.attributes);
            },
            resizeLayout:function(){
                if (this._super) {
                    this._super(e);
                }
                this.formPanel.resizeLayout();
            },
            onrender:function(e){
                console.info(">>>>");
            }
        });

        return view;
    });