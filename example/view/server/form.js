/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/form/FormPanel",
        "core/js/model/BaseModel",
        "core/js/base/BaseViewModel",
        "core/js/windows/Window",
        "core/js/utils/ApplicationUtils"],
    function ( FormPanel,BaseModel,BaseViewModel,Button,ApplicationUtils) {
        var FIELD_MODEL_URL = "/form/getFields.action";
        var FORM_MODEL_URL = "/rest/frmform!get.action";

        var FieldModel = BaseModel.extend({
            url:FIELD_MODEL_URL,
            defaults:{
                shortName:"frmform"
            },
            parse:function(result, options){
                return {fields:result};
            }
        });

        var FormModel = BaseModel.extend({
            url:FORM_MODEL_URL,
            defaults:{
                id:"1"
            }
        });

        var view = BaseViewModel.extend({
            model:null,
            formPanel:null,
            ajaxClient:null,
            initializeHandle:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                this.ajaxClient = applicationContext.getAjaxClient();

                var postParam = {shortName:"frmform"};

                this.model = new FieldModel();
                this.model.setAjaxClient(this.ajaxClient);
                this.model.fetch({data:postParam});
                this.model.on("fetchSuccess",$.proxy(this.rendForm,this));
                /*var that = this;
                ajaxClient.buildClientRequest(fieldUrl)
                    .addParams(postParam)
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if (obj&&obj.result) {
                            that.rendForm(obj.result);
                        }
                    });*/

            },
            rendForm:function(){
                var that = this;
                //Todo render与show的定义要清晰，还是会有没有渲染完，就触发事件的情况
                this.formPanel = new FormPanel({
                    fields:this.model.get("fields"),
                    $container:this.$el,
                    onrender: function (e) {
                        var formModel = new FormModel();
                        formModel.setAjaxClient(that.ajaxClient);
                        formModel.fetch({data:{id:"1"}});
                        formModel.on("fetchSuccess",$.proxy(that.setValues,that,formModel));
                    }
                });
                // this.formPanel.render(this.$el);
                /*var formModel = new FormModel();
                formModel.setAjaxClient(that.ajaxClient);
                formModel.fetch({data:{id:"1"}});*/
                // formModel.on("fetchSuccess",$.proxy(this.setValues,this,formModel));
                // this.formPanel.show();
            },
            /**
             * 设置值
             */
            setValues:function(model){
                this.formPanel.getFormEditor().setValues(model.attributes);

            }
        });

        return view;
    });