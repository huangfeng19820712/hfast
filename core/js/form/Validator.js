/**
 * 使用jquery-validator组件
 * https://github.com/jquery-validation/jquery-validation/releases/tag/1.17.0
 * @author:   * @date: 2016/2/8
 */
define(["core/js/Component","validate"],function(Component){
    var Validator = Component.extend({
        $form:null,
        $view:null,
        _validator:null,
        initialize:function(options,triggerEvent){
            if(this.$form&&this.rules){
                var conf = this._getValidateConf();
                this._validator = this.$form.validate(conf);
            }
        },
        _getValidateConf:function(){
            var conf = {
                errorPlacement:this.errorPlacement,
                rules:this.rules,
                submitHandler:this.submitHandler,
                ignore:""
            };
            if(this.messages){
                conf.messages = this.messages;
            }
            return conf;
        },
        // Do not change code below
        errorPlacement: function (error, element) {

            element.closest(".hfast-view").append(error);
            error.prev().addClass("state-error");
            //error.insertAfter(element.closest(".hfast-view"));
        },
        messages: null,
        /**
         * 使用jquery的 validator组件
         */
        rules: null,
        submitHandler: function (form) {
            var that = this.$view;
            var model = that.$form.convertForm2Model();

            //处理密码的格式
            var pswds = _.where(that.fields, {editorType: ComponentFactory.Type.PASSWORD_EDITOR});
            for (var i = 0; i < pswds.length; i++) {
                var item = pswds[i];
                model[item.realName] = MessageDigest.digest(model[item.realName]);
            }

            that.ajaxClient.buildClientRequest(that.$SUBMIT)
                .addParams(model)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.successResponse;
                    if (obj) {
                        if(!obj.successful){
                            that.showErrorMsg(obj.errMsg);
                            that.trigger("submitFail",obj);
                        }else{
                            that.trigger("submitSuc",obj);
                        }
                    }
                });
            return false;
        },
        validate:function(){
            this._validator.form();
        }
    });
    return Validator;
});
