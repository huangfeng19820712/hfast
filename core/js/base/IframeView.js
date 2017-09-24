/**
 * @module Iframe的视图[IframeView]
 * @description 包含Iframe的视图
 *
 * @author:
 * @date: 2013-10-07 上午10:16
 */
define([
    "core/js/base/BaseView",
    "core/js/context/ApplicationContext",
    "core/js/utils/IframeUtil",
    "core/js/utils/Utils"
], function ($, _, BaseView, ApplicationContext, IframeUtil) {
    var IframeView = BaseView.extend({
        /**
         * iframe视图要显示的URL，如果以#开头的话，就默认基于系统的backbone路由，然后以main.html做为入口引导页
         */
        url: null,

        template: '',

        contentWindow: function(){
            var iframeEl = this.getIframeEl();
            return IframeUtil.getIframeWindow(iframeEl);
        },
        getRelatedObject: function(){
            var contentWin = this.contentWindow();
            if(contentWin == null)
                return null;
            var mainRegionElArray = contentWin.$.find(ApplicationContext.getMainRegionEl());
            if(mainRegionElArray == null || mainRegionElArray.length == 0)
                return null;
            var mainRegionEl = mainRegionElArray[0];
            return contentWin.$(mainRegionEl).data("relatedObject");
        },
        initialize: function (options) {
            options = options || {};
            options["iframeId"] = options["iframeId"] || this._generateIframeId();

            this._super(options);   //设置选项值
        },
        getTemplate: function () {
            return IframeUtil.generateIframeContent(this.getIframeId(), this.get("url"));
        },
        /**
         * 设置iframe的URL，并重新加载页面
         * @param url
         * @param triggerReload   是否触发重新加载iframe界面，默认需要触发重新加载
         */
        setUrl: function (url, triggerReload) {
            this.set({url: url});   //设置URL

            //重新加载该页面
            triggerReload = triggerReload == null ? true : triggerReload;   //默认当URL变化的时候，需要重新加载该iframe的内容
            if (triggerReload)
                this.reload();
        },
        refresh: function () {
            this.reload();
        },
        /**
         * 重新加载iframe页面内容
         * @return {*}
         */
        reload: function () {
            var iframeEl = this.getIframeEl();
            if (iframeEl == null)
                return;

            iframeEl.src = this._getIframeUrl();

            return this;
        },
        /**
         * 获取iframe表单元素
         * @return {*}
         */
        getIframeEl: function () {
            var $iframeEl = this.$("#" + this.getIframeId());
            return $iframeEl.get(0);
        },
        getIframeId: function () {
            return this.get("iframeId");
        },
        /**
         * 清理iframe的内容，当调用remove方法时，将触发该方法
         */
        close: function (triggerRootEl) {
            this._clearIframeContent();   //对iframe内容进行处理

            this._super(triggerRootEl);  //执行父类的清理方法
        },
        /**
         * 清空iframe的内容，重置iframe的src为空
         * @private
         */
        _clearIframeContent: function () {
            IframeUtil.clearIframeContent(this.getIframeEl());
        },
        _getIframeUrl: function (url) {
            url = url || this.get("url");
            return IframeUtil.getIframeUrl(url);
        },
        _generateIframeId: function () {
            return IframeUtil.generateIframeId($.uuid());
        }
    });

    return IframeView;
});