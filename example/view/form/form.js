/**
 * @author:   * @date: 2015/10/29
 */
define(["core/js/form/BaseForm",
        "backbone", "core/js/windows/messageBox",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils", "core/js/controls/ComponentFactory",
        "core/js/utils/Utils"],
    function (BaseForm, Backbone, MessageBox, ApplicationContext,
              ApplicationUtils, ComponentFactory,Utils) {
        var View = BaseForm.extend({
            $SUBMIT: "/member!save.action",
            paramPrefix: "editObj",
            title:"请完善您的个人信息",
            warnInfo:{
                title:"温馨提醒：",
                messages:["1.必须填写银行卡信息才能取款。",
                    "2.请认证填写，以免无法打款到账。",
                    "3.取款密码为本平台的取款密码，而不是银行卡的取款密码。"]

            },
            fields: [
                {
                    name: "bank",
                    label: "开户银行",
                    rules: {
                        required: true,
                        maxlength: 20,
                    },
                    iconSkin: "fa-university",
                }, {
                    name: "bankAccount",
                    label: "银行卡号",
                    rules: {
                        required: true,
                        maxlength: 20,
                    },
                    iconSkin: "fa-cc-visa"
                }, {
                    name: "personName",
                    label: "持卡人名称",
                    rules: {
                        required: true,
                        maxlength: 20,
                    },
                    iconSkin: "fa-user"
                }, {
                    id: "bankPsw",
                    name: "bankPsw",
                    label: "取款密码",
                    rules: {
                        required: true,
                        minlength: 6,
                        maxlength: 15
                    },
                    iconSkin: "fa-lock",
                    editorType: ComponentFactory.Type.PASSWORD_EDITOR
                }, {
                    name: "passwordConfirm",
                    label: "确认密码",
                    rules: {
                        required: true,
                        equalTo: "#bankPsw",
                        minlength: 6,
                        maxlength: 15
                    },
                    editorType: ComponentFactory.Type.PASSWORD_EDITOR,
                    iconSkin: "fa-lock",
                    messages: {
                        equalTo: "两次输入密码不一致"
                    }
                }
            ],
            onsubmitSuc: function (obj) {
                //更新session中的信息
                var sessionUser = ApplicationContext.getSessionUser();
                sessionUser.userData = obj.result;
                //成功，重置表单
                this.showSucMsg();
                var clientHash = $.getClientHash();
                //如果不是客户端跳转过来的，怎跳转到真正的页面
                if(CONFIG.cons.ROUT_MEMBERINFO !=clientHash){
                    ApplicationUtils.nav(clientHash);
                }else{
                    ApplicationUtils.nav(clientHash);
                }
            }
        });
        return View;
    })
;
