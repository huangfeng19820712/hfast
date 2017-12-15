/**
 * @author:   * @date: 2015/9/5
 */

define(["jquery",
    "underscore",
    "core/js/Component",
    "core/js/utils/Log",
    'text!/core/js/windows/templates/ModalDialog.html',
    "bootstrap",
], function ($, _, MXComponent , Log,tmpl) {
    var ModalDialog = MXComponent.extend({
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
        ctor: function (options) {
            this.set(options);
            this.returnValue = null;
            var data = {
                /**
                 * 标题
                 */
                title:null,
                /**
                 * 内容
                 */
                body:null,
            };
            if(options){
                data = {"title": options.title, "body": options.body};
            }
            var template  = _.template(tmpl)(data);
            var el = $("body").append(template);
            this.$el = $("div.modal");
            this.$title = this.$el.find(".modal-title");
            this.$body = this.$el.find(".modal-body");
            this.$footer = this.$el.find(".modal-footer");
        },
        /**
         * 显示窗口
         */
        show: function () {
            this.$el.modal('show');   //显示窗口
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
            if(this.beforeHide instanceof Function){
                var result = this.beforeHide();
                if(!result){
                    return ;
                }
            }
            this.$el.modal('hide');
            if(this.afterHide instanceof Function){
                this.afterHide();
            }
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
         * 需要覆盖的内容，如果返回是
         * @return Boolean  如果是true，则继续执行，如果是fals，则直接返回
         *
         */
        beforeHide:null,
        afterHide:null,
    });

    return ModalDialog;
});