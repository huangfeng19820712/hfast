/**
 *
 * @author:   * @date: 15-8-17
 */

define(["core/js/base/BizBaseView",
        "backbone", "core/js/windows/messageBox",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils","lib/md5"],
    function (BizBaseView, Backbone, MessageBox, ApplicationContext,ApplicationUtils,MessageDigest) {
        //loginUrl
        var loginUrl = "";
        var View = BizBaseView.extend({
            $form: $("form.login-page"),
            $LOGIN: "/AppAuthentication/login.action",
            debuged: null,
            events: {
                "click #login": "login"
            },
            login: function (e) {
                e.preventDefault();

                var that = this;
                var $userName = $("#userName");
                var $password = $("#password");

                var userName = $.trim($userName.val());
                if (userName === "" || userName == $userName.attr("placeholder")) {
                    this.showErrorMsg("请输入用户名");
                    $userName.focus();
                    return;
                }
                var verifyCode = null;
                var password = null;
                if (!this.debuged) {
                    //如果是调试模式，怎不用校验
                    password = $.trim($password.val());
                    if (password === "" || password == $password.attr("placeholder")) {
                        this.showErrorMsg("请输入密码");
                        $password.focus();
                        return;
                    }

                    //提供可以不用输入验证码与密码的接口

                    if (this.$("#verifyCode").length > 0) {
                        var $verifyCode = $("#verifyCode");
                        verifyCode = $.trim($verifyCode.val());
                        if (verifyCode === "") {
                            this.showErrorMsg("请输入验证码");
                            $verifyCode.focus();
                            return;
                        }
                    }
                }


                var ajaxClient = ApplicationContext.getAjaxClient();
                ajaxClient.buildClientRequest(this.$LOGIN)
                    .addParams({"username": userName, "password": MessageDigest.digest(password), "verifyCode": verifyCode, "admined": 0})
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if (!obj.successful) {
                            //成功失败
                            that.showErrorMsg(obj.errMsg);
                            //更新验证码
                            that.$el.find("#verifyImg").click();
                        }else{
                            var application = ApplicationContext.getApplication();

                            ApplicationContext.setAuthenticated(obj.result.authenticated);
                            application.getMenu().updateMenu(obj.result.menus).render();
                            var header = application.getHeader();
                            header.loginLogout();
                            ApplicationContext.setSessionUser(obj.result);
                            application.loginSuc();
                            ApplicationUtils.nav("main");
                        }

                    });
            },
            initialize: function (options) {
                this._super();
                var serviceConf = ApplicationContext.getServiceConf();
                this.debuged = serviceConf.debuged;
                this.data = {debuged: serviceConf.debuged};
            },
            showErrorMsg: function (msg) {
                MessageBox.warn(msg);
            },
        });
        return View;
    });