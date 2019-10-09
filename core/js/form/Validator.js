/**
 * 使用jquery-validator组件
 * https://github.com/jquery-validation/jquery-validation/releases/tag/1.17.0
 * @author:   * @date: 2016/2/8
 */
define(["core/js/Component","validate"],function(Component){

    //处理一个checkbox的switchEditor插件
    $.validator.prototype.elementValue = function( element ) {
        var val,
            $element = $( element ),
            type = element.type;

        if (( type === "radio" || type === "checkbox")&&!$element.hasClass("form-control-switchEditor") ) {
            return this.findByName( element.name ).filter(":checked").val();
        } else if ( type === "number" && typeof element.validity !== "undefined" ) {
            return element.validity.badInput ? false : $element.val();
        }

        val = $element.val();
        if ( typeof val === "string" ) {
            return val.replace(/\r/g, "" );
        }
        return val;
    };
    $.validator.prototype.getLength =  function( value, element ) {
        switch ( element.nodeName.toLowerCase() ) {
            case "select":
                return $( "option:selected", element ).length;
            case "input":
                $element = $( element );
                if ( this.checkable( element )&&!$element.hasClass("form-control-switchEditor")  ) {
                    return this.findByName( element.name ).filter( ":checked" ).length;
                }
        }
        return value.length;
    };
    var Validator = Component.extend({
        $form:null,
        $view:null,
        _validator:null,
        messages: null,
        /**
         * 使用jquery的 validator组件
         */
        rules: null,
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
                //忽略title中的信息，应该框架中修改input的value会修改title
                ignoreTitle:true,
                /**
                 * 校验成功的方法，支持单个组件校验
                 */
                /*success:function(error, element ){
                    console.info("success");
                    error.prev().removeClass("state-error");
                },*/
                /**
                 * 修改插件中的方法
                 * @param element
                 * @param errorClass
                 * @param validClass
                 */
                highlight: function( element, errorClass, validClass ) {
                    //添加自动以的class
                    $(element).parents(".hfast-controlGroup").addClass("state-error");

                    /*下面为插件代码*/
                    if ( element.type === "radio" ) {
                        this.findByName( element.name ).addClass( errorClass ).removeClass( validClass );
                    } else {
                        $( element ).addClass( errorClass ).removeClass( validClass );
                    }

                },
                unhighlight: function( element, errorClass, validClass ) {
                    //删除自动以的class
                    $(element).parents(".hfast-controlGroup").removeClass("state-error");

                    /*下面为插件代码*/
                    if ( element.type === "radio" ) {
                        this.findByName( element.name ).removeClass( errorClass ).addClass( validClass );
                    } else {
                        $( element ).removeClass( errorClass ).addClass( validClass );
                    }
                },
                //去掉自身的提交事件
                // submitHandler:this.submitHandler,
                ignore:""
            };
            if(this.messages){
                conf.messages = this.messages;
            }
            return conf;
        },
        // Do not change code below
        /**
         * 只有第一次初始化的时候，才回调用此方法
         * @param error
         * @param element
         */
        errorPlacement: function (error, element) {

            element.closest(".hfast-view").append(error);
            //error.insertAfter(element.closest(".hfast-view"));
        },
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
            return this._validator.form();
        },
        /**
         * 重置表单中的状态
         */
        reset:function(){
            this._validator.resetForm();
        }
    });
    return Validator;
});
