/**
 * @author:   * @date: 2015/10/29
 */
define(["core/js/base/BizBaseView",
        "backbone", "text!core/resources/tmpl/BaseForm.html", "core/js/windows/messageBox",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils", "lib/md5", "core/js/utils/Utils",
        "core/js/controls/ComponentFactory",
        "validate",
        "core/js/utils/JqueryUtils","bootstrap.touchspin"],
    function (BizBaseView, Backbone, template, MessageBox,
              ApplicationContext, ApplicationUtils, MessageDigest,
              Utils, ComponentFactory) {
        var View = BizBaseView.extend({
            $form: null,
            formId: "mainForm",
            template: template,
            dataPre: "data",
            $SUBMIT: null,
            /**
             * {Array}实体表单上的面板信息
             * @example
             * <code>
             *     [{
             *         id: "[必填]<面板编码>",
             *         title: "[必填]<面板名称>",
             *         collapsible: "[可选]<可折叠的，true|false>",
             *         expanded: "[可选]<展开的，true|false>",
             *         height: "[可选]<面板高度，不指定就按内容自动撑开>",
             *         type: "[可选，默认为字段类型面板]<面板类型 1：实体字段面板  2：实体关联面板  3：自定义面板>",
             *         viewType: "[可选,默认为页面聚合]<展现方式 1：页面聚合  2：TAB页聚合>"
             *         url: "[可选，针对实体关联面板和自定义面板有用]<通过URL来指定面板内容>"
             *         fields: [可选]["<字段编码1>", "<字段编码2>", "<字段编码3>"],
             *         subGroups: [可选，针对嵌套的面板而言才有][{
             *             code: "[必填]<面板编码>",
             *             title: "[必填]<面板名称>",
             *             collapsible: "[可选]<可折叠的，true|false>",
             *             expanded: "[可选]<展开的，true|false>",
             *             height: "[可选]<面板高度，不指定就按内容自动撑开>",
             *             url: "[可选]<通过URL来指定面板内容>"
             *             fields: [可选]["<字段编码1>", "<字段编码2>", "<字段编码3>"]
             *         },...],
             *         content: "[可选，针对自定义面板有用，直接指定文本也可以]"
             *     },...]
             * </code>
             */
            groups: null,
            /**
             * {Array}实体表单上的字段信息
             * [{
             *      id:"<输入框的id，不是必需>"
             *      name:"[必填]<字段名称，定义提交到服务端的参数名称>",
             *      realName:"[必须存在，但不是必填]<最后传输到服务器的参数名称>",
             *      label:"<字段显示的别名，如果，没有则使用name>",
             *      hidden："<是否是隐藏，true|false ,默认是false>",
             *      value："<值>",
             *      rules:"<校验规则,jquery.validate的关于这个字段的rules属性>{}",
             *      messages："<校验规则,jquery.validate的关于这个字段的messages属性>{",
             *      editorType:"<编辑器类型，默认是文本类型>",
             *      iconSkin:"<小图片的class>",
             *      decimals："<针对number类型的编辑器，保留几位小数>",
             *      step:"<针对number类型的编辑器，增量值>"，
             *      disable："<是否可以编辑，true|false，默认是false>"
             * },...
             * ]
             */
            fields: null,
            /**
             * 属性前缀，如:editObj,则提交的属性为editObj.name
             */
            paramPrefix: null,
            onsubmitSuc:null,
            onsubmitFail:null,
            title:null,
            /**
             * 可以是一条，或者是多条
             * {
             *  title:"<显示的标题>"
             *  messages:"<显示的警告信息，是个数组>[]"
             * }
             */
            warnInfo:null,
            validate: {
                // Do not change code below
                errorPlacement: function (error, element) {
                    error.insertAfter(element.parent());
                },
                messages: {},
                rules: {},
                submitHandler: function (form) {
                    var that = this.view;
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
                }
            },
            initialize: function (options, triggerEvent) {
                this._super(options, triggerEvent);
                //组装fields信息
                if (this.fields) {
                    for (var i = 0; i < this.fields.length; i++) {
                        var item = this.fields[i];
                        var realName = item.name;
                        if (this.paramPrefix) {
                            realName = this.paramPrefix + "." + realName;
                        }
                        //没有直接设置的realName才会设置
                        if(!item.realName){
                            item.realName = realName;
                        }
                        if (item.rules) {
                            //设置校验信息
                            this.validate.rules[realName] = item.rules;
                        }
                        if (item.messages) {
                            //设置校验信息
                            this.validate.messages[realName] = item.messages;
                        }
                        //设置id
                        if ($.isBank(item.id)) {
                            item.id = this.formId + "_" + this.paramPrefix + "_" + item.name;
                        }
                    }
                }
                this.data = {formId: this.formId,
                    fields: this.fields,title:this.title,
                    warnInfo:this.warnInfo};
            },
            onrender: function (e) {
                this.$form = this.$("#" + this.formId);
                var validator = this.$form.validate(this.validate);
                validator.view = this;
                //初始化number格式
                var numbers = _.where(this.fields,{editorType: ComponentFactory.Type.NUMBER_EDITOR});
                for(var i=0;i<numbers.length;i++){
                    var item  = numbers[i];
                    this.createNumber(item);
                }
                //初始化时间格式
                return;
            },
            createNumber:function(field){
                var id = field.id;
                var input = this.$("#" + id);
                input.TouchSpin({
                    min: field.rules.min||0,
                    max:field.rules.max||1000000,
                    decimals: field.decimals||2, //精度
                    step:field.step|| 1,//增量或减量
                });


            }
        });
        return View;
    })
;
