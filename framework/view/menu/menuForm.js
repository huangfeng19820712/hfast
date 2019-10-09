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
        var FORM_MODEL_URL = "/menu/get.action";

        var FieldModel = BaseModel.extend({
            url: FIELD_MODEL_URL,
            defaults: {
                shortName: "sysmenu"
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
            menuId:null,
            ajaxClient: null,
            mountContent: function () {
                var that = this;
                this.formPanel = new FormPanel({
                    //必须添加，不然会渲染两次
                    title:"菜单表单",
                    parent:this,
                    width:"100%",
                    height:"100%",
                    ajaxClient:this.ajaxClient,
                    paramPrefix:"editObj",
                    action:new Action({
                        nameSpace:"menu",
                        methodName:"save"}),
                    fields: [ {
                        "name": "id",
                        hidden:true,
                    },{
                        "name": "leafed",
                        hidden:true,
                    },{
                        "name": "name",
                        "label": "菜单名称",
                        "itemValue": null,
                        rules: {
                            required: true
                        }
                    }, {
                        "name": "pid",
                        "label": "父菜单Id",
                        "itemValue": null
                    }, {
                        "name": "url",
                        "label": "url地址",
                        "itemValue": null
                    }, {
                        "name": "code",
                        "label": "编码",
                        "itemValue": null
                    }, {
                        "name": "tip",
                        "label": "提示",
                        "itemValue": null
                    }, {
                        "name": "ico",
                        "label": "图片",
                        "itemValue": null
                    }, {
                        "name": "visible",
                        "label": "是否显示",
                        onText:"是",
                        offText:"否",
                        editorType:$Component.SWITCHEDITOR,
                    }, {
                        "name": "orderNo",
                        "label": "排序号",
                        "itemValue": null
                    }],
                    $container: this.$el,
                    onrender: function (e) {
                        if(that.menuId!=null){
                            that.setMenuId(that.menud);
                        }
                    },
                });

            },
            /**
             * 修改menuId，同时修改整个form表单的数据
             * @param menuId
             */
            setMenuId:function(menuId){
                var formModel = new FormModel();
                formModel.setAjaxClient(this.ajaxClient);
                formModel.setFetchSuccessFunction(this.setValues, this, formModel);
                formModel.fetch({data: {id: menuId}});
            },

            /**
             * 把节点的title设置到表单中，新增的情况下，只有title
             * @param   node      {FancytreeNode}
             * @param   parentNode  {FancytreeNode}
             */
            setNodeTitle:function(node,parentNode){
                this.formPanel.getFormEditor().clearValue();
                this.formPanel.getFormEditor().setValues({
                    name:node.title,
                    pid:parentNode.data.id,
                });
            },
            /**
             * 设置值
             */
            setValues: function (model) {
                this.formPanel.getFormEditor().setValues(model.attributes);
            }
        });

        return view;
    });