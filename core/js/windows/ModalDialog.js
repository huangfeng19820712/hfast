/**
 * @author:   * @date: 2015/9/5
 */

define([
    "core/js/Component",
    "core/js/utils/Log",
    "core/js/controls/Button",
    "core/js/controls/ToolStrip",
    "core/js/CommonConstant",
    'text!/core/js/windows/templates/ModalDialog.html',
    "bootstrap",
], function (MXComponent ,Log,Button,ToolStrip,CommonConstant,tmpl) {
    var ModalDialog = MXComponent.extend({
        xtype:$Component.MODALDIALOG,
        /**
         * 模态对话框的dom对象
         */
        $el:null,
        /**
         * 标题对象
         */
        $title:null,
        /**
         * 内容对象
         */
        $body:null,
        $footer:null,
        arguments: null,              //父页面传递给弹出窗口的参数
        returnValue: null,           //弹出窗口关闭时，传递给回调函数的返回值
        /**
         * 关闭窗口前触发
         */
        onhide:null,
        /**
         * 关闭窗口后触发
         */
        onhidden:null,
        /**
         * 打开窗口前触发
         */
        onshow:null,
        /**
         * 打开窗口后触发
         */
        onshown:null,
        ctor: function (options) {
            this.set(options);
            this.returnValue = null;
            this.initId();
            var data = {
                /**
                 * 标题
                 */
                title:null,
                /**
                 * 内容
                 */
                body:null,
                /**
                 * html中的id
                 */
                id:this.id,
            };

            if(options){
                data.title = options.title;
                data.body = options.body;
                // data = {"title": options.title, "body": options.body,"id":this.id};
            }
            var template  = _.template(tmpl)(data);
            var el = $("body").append(template);
            // this.$el = $("div.modal");
            this.$el = $("#"+this.id);
            this.$title = this.$el.find(".modal-title");
            this.$body = this.$el.find(".modal-body");
            this.$footer = this.$el.find(".modal-footer");
            this.registerEvent();
        },
        /**
         * 初始化组件的id，避免没有输入id的情况
         */
        initId: function () {
            if (this.id == null) {
                //xtype是否存在
                if (this.xtype != null) {
                    this.id = $.createId(this.xtype.name);
                } else {
                    this.id = $.createId();
                }
            }
            //后续还需要观察放此处是否合适
            // ApplicationUtils.addComponent(this.id, this);
        },
        registerEvent:function(){
            var that = this;
            this.$el.on("hide.bs.modal",function(event){
                //清空宽度属性,与bootstrap的日期控件冲突
                if($(event.target).find(".modal-dialog").length>0){
                    $(event.target).find(".modal-dialog").width("");
                    that.trigger("hide",event);
                }
            });
            this.$el.on("hidden.bs.modal",function(event){
                if($(event.target).find(".modal-dialog").length>0){
                    that.trigger("hidden",event);
                }
            });
            this.$el.on("show.bs.modal",function(event){
                if($(event.target).find(".modal-dialog").length>0){
                    that.trigger("show",event);
                }

            });
            this.$el.on("shown.bs.modal",function(event){
                if($(event.target).find(".modal-dialog").length>0){
                    that.trigger("show",event);
                }
            });
        },
        /**
         * 显示窗口
         */
        show: function () {
            this.$el.modal('show');   //显示窗口
        },

        /**
         * 弹出一个模态对话框。
         *
         * @param {Object} msg    [必填]确认的内容
         * @param {Object} options [可选]配置参数，json格式，可配置的信息说明如下：
         * <pre>
         *        title：    确认信息的标题(默认为：提示信息)
         *        buttons：  按钮的参数
         *        width：    弹窗的宽
         *        onhidden:    关闭事件触发的函数
         * </pre>
         */
        showMessage:function(msg,options){
            this.setTitle(options.title||$i18n.alertLabel);
            this.setBody(msg);
            if(options.buttons){
                var buttonGroup = new ToolStrip({
                    textAlign:$TextAlign.RIGHT,
                    realClass:"btn-group text-right",
                    spacing :CommonConstant.Spacing.DEFAULT,
                    itemOptions: options.buttons
                });
                buttonGroup.render();
                this.setFooter(buttonGroup.$el);
                this.showFooter();
                if(options.width){
                    this.setWidth(options.width);
                }
            }else{
                this.hideFooter();
            }
            this.show();
            this.off("hidden");
            this.on("hidden", options.onhidden);
        },
        /**
         * 弹出一个包含一个按钮的模态对话框（默认是不开启锁屏的）
         *
         * @param {Object} msg    [必填]确认的内容
         * @param {Object} options [可选]配置参数，json格式，可配置的信息说明如下：
         * <pre>
         *        label：        确定按钮的名字(默认为：确定)
         *        handle:        点击确定按钮后执行的回调函数
         *        title：        确认信息的标题(默认为：提示信息)
         *        duration: {Number}窗口几秒后自动关闭（默认值为0秒[即不自动关闭]，单位为秒）
         *        icon:     {String}定义消息图标。可定义“core/js/lib/artDialog/skins/icons/”目录下的图标名作为参数名（不包含后缀名）
         *        lock:     {Boolean}默认值为true。开启锁屏(中断用户对话框之外的交互，用于显示非常重要的操作/消息，所以不建议频繁使用它，它会让操作变得繁琐)
         *        id:       {String/Number}设定对话框唯一标识。用途：1、防止重复弹出;2、定义id后可以使用art.dialog.list[youID]获取扩展方法
         * </pre>
         */
        alert:function(msg, options){
            options = options || {};
            var yesBtnTitle = options["yesBtnTitle"] || $i18n.BTN_CONFIRM;
            var that = this;
            var yesHandle = options["yesHandle"]|| function(){
                that.hide();
            };
            var buttons = [
                {text: yesBtnTitle,
                    onclick: yesHandle,
                    themeClass:Button.ThemeClass.rounded ,
                    className: Button.ClassName.primary,
                    autofocus: true}
            ];

            var alertOpts = {
                buttons: buttons,
                cancel: options["cancel"],
                quickClose: options["quickClose"] == null ? false : options["quickClose"],
                align: options["align"],
                title:options["title"] ||$i18n.alertLabel,
                icon: options["icon"] || "h-icon-xl h-icon-info-xl",
                duration: options["duration"],
                lock: options["lock"] == null ? true : options["lock"],
                id: options["id"]
            };
            this.showMessage(msg,alertOpts);
        },
        /**
         * 弹出一个包含两个按钮的模态对话框（默认为二态[确认、取消]对话框）。
         *
         * @param {Object} msg    [必填]确认的内容
         * @param {Object} options [可选]配置参数，json格式，可配置的信息说明如下：
         * <pre>
         *        yesBtnTitle：确定按钮的名字(默认为：确定)
         *        noBtnTitle：取消按钮的名字(默认为：取消)
         *        yesHandle：点击确定按钮后执行的回调函数
         *        noHandle：点击取消按钮后执行的回调函数
         *        title：        确认信息的标题(默认为：提示信息)
         *        duration: {Number}窗口几秒后自动关闭（默认值为0秒[即不自动关闭]，单位为秒）
         *        icon:     {String}定义消息图标。可定义“core/js/lib/artDialog/skins/icons/”目录下的图标名作为参数名（不包含后缀名）
         *        lock:     {Boolean}默认值为true。开启锁屏(中断用户对话框之外的交互，用于显示非常重要的操作/消息，所以不建议频繁使用它，它会让操作变得繁琐)
         *        id:       {String/Number}设定对话框唯一标识。用途：1、防止重复弹出;2、定义id后可以使用art.dialog.list[youID]获取扩展方法
         * </pre>
         */
        confirm:function(msg, options){
            options = options || {};
            var yesBtnTitle = options["yesBtnTitle"] || $i18n.BTN_CONFIRM;
            var noBtnTitle = options["noBtnTitle"] || $i18n.BTN_CANCEL;
            var yesHandle = options["yesHandle"];
            var that = this;
            var noHandle = options["noHandle"] || function(){
                that.hide();
            };


            var buttons = [{
                text: yesBtnTitle,
                onclick: yesHandle,
                themeClass:Button.ThemeClass.rounded ,
                className: Button.ClassName.primary,
                autofocus: true
            },{
                text: noBtnTitle,
                onclick: noHandle,
                themeClass:Button.ThemeClass.rounded ,
                className: Button.ClassName.cancel,
            }];
            var confirmOpts = {
                buttons: buttons,
                cancel: options["cancel"],
                quickClose: options["quickClose"] == null ? false : options["quickClose"],
                align: options["align"],
                title: options["title"] || "确认信息",
                icon: options["icon"] || "h-icon-xl h-icon-info-xl",
                duration: options["duration"],
                lock: options["lock"] == null ? true : options["lock"],
                id: options["id"]
            };
            this.showMessage(msg,confirmOpts);
        },
        /**
         * 获取弹出框的标题
         * @return {*}
         */
        getTitle: function(){
            return this.$title.text().trim();
        },
        /**
         * 设置弹出框的标题
         * @param title
         */
        setTitle: function(title){
            this.$title.empty().append(title);
        },
        getBody:function(){
            return this.$body.text().trim();
        } ,
        setBody: function(body){
            this.$body.empty().append(body);
        },
        getFooter:function(){
            return this.$footer.text().trim();
        } ,
        setFooter: function(footer){
            this.$footer.empty().append(footer);
        },
        showFooter:function(){
            this.$footer.show();
        },
        hideFooter:function(){
            this.$footer.hide();
        },
        hide: function () {
            /*if(this.beforeHide instanceof Function){
                var result = this.beforeHide();
                if(!result){
                    return ;
                }
            }*/
            this.$el.modal('hide');
            /*this.$el.find(".modal-dialog").width(null);
            if(this.afterHide instanceof Function){
                this.afterHide();
            }*/
        },
        /**
         * 设置模态窗口的宽度
         */
        setWidth:function(width){
            this.$el.find(".modal-dialog").width(width);
        },
        /**
         * 父页面传递给弹出窗口的参数
         * @return {null}
         */
        getArguments: function () {
            return this.arguments;
        },
        /**
         * 获取弹出窗口的返回值
         * @return {null}
         */
        getReturnValue: function (returnValue) {
            return this.returnValue;
        },
        /**
         * 设置弹出窗口的返回值
         */
        setReturnValue: function (returnValue) {
            this.returnValue = returnValue;
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            if(this.$el){
                if(this.draggable){
                    this.$el.draggable( "destroy" );
                }
                this.$el.data("control", null);
                this.$el.remove();
                this.$el = null;
            }

        }
    });

    return ModalDialog;
});