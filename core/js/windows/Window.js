/**
 * @author:   * @date: 2015/9/5
 */

define([
    "core/js/utils/Log",
    "core/js/controls/Button",
    "core/js/controls/ToolStrip",
    "core/js/CommonConstant"
], function (Log,Button,ToolStrip,CommonConstant) {
    var WindowPlugin = function ($) {
        if ($.window == null)
            $.window = {};

        $.window.getActive =function(){
            var ApplicationContext = require("core/js/context/ApplicationContext");
            return ApplicationContext.getModalDialog();
        }

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
        $.window.alert = function (msg, options) {
            var modalDialog = $.window.getActive();

            options = options || {};
            var yesBtnTitle = options["yesBtnTitle"] || $i18n.BTN_CONFIRM;
            var yesHandle = options["yesHandle"]|| function(){
                    modalDialog.hide();
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
            $.window.showMessage(msg,alertOpts);
            //return modalDialog;
        };
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
        $.window.confirm = function (msg, options) {
            var modalDialog = $.window.getActive();
            options = options || {};
            var yesBtnTitle = options["yesBtnTitle"] || $i18n.BTN_CONFIRM;
            var noBtnTitle = options["noBtnTitle"] || $i18n.BTN_CANCEL;
            var yesHandle = options["yesHandle"];
            var noHandle = options["noHandle"] || function(){
                    modalDialog.hide();
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
            $.window.showMessage(msg,confirmOpts);
        };
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
        $.window.showMessage = function(msg,options){
            var modalDialog = $.window.getActive();
            modalDialog.setTitle(options.title||$i18n.alertLabel);
            modalDialog.setBody(msg);
            if(options.buttons){
                var buttonGroup = new ToolStrip({
                    textAlign:$TextAlign.RIGHT,
                    realClass:"btn-group text-right",
                    spacing :CommonConstant.Spacing.DEFAULT,
                    itemOptions: options.buttons
                });
                buttonGroup.render();
                modalDialog.setFooter(buttonGroup.$el);
                modalDialog.showFooter();
                if(options.width){
                    modalDialog.setWidth(options.width);
                }
            }else{
                modalDialog.hideFooter();
            }
            modalDialog.show();
            modalDialog.off("hidden");
            modalDialog.on("hidden", options.onhidden);
        };
        $.window.alertError = function(){
            $.window.alert("系统异常，请与管理员联系！");
        }

        /**
         * 获取父窗口传递给子窗口的参数
         * @return {*|null}
         */
        $.window.getArguments = function () {
            var modalDialog = $.window.getActive();
            if (modalDialog == null)
                return null;
            return modalDialog.getArguments();
        }
        /**
         * 设置弹出窗口的返回值
         */
        $.window.setReturnValue = function (returnValue) {
            var modalDialog = $.window.getActive();
            if (modalDialog == null)
                return;
            modalDialog.setReturnValue(returnValue);
        }
        $.window.getLoader =function(){
            var ApplicationContext = require("core/js/context/ApplicationContext");
            return ApplicationContext.getLoader();
        }
        /**
         * 显示加载器
         * @param target
         * @param inDuration
         */
        $.window.showLoader = function(target,inDuration){
            var loader = $.window.getLoader();
            loader.show(target,inDuration);
        }
        /**
         * 隐藏加载器
         */
        $.window.hideLoader = function(){
            var loader = $.window.getLoader();
            loader.hide();
        }
    }


    return WindowPlugin($);
});