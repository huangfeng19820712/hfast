/**
 * @module 应用程序的基类[Application]
 * @description 应用程序的基类
 *
 * @author
 * @version 1.0
 * @Date: 2013-05-29 上午11:52
 */
define(["core/js/Component",
    "core/js/utils/Log",
    "core/js/context/ApplicationContext",
    "core/js/utils/ApplicationUtils",
    "core/js/view/Region",
], function (MXComponent, Log, ApplicationContext,ApplicationUtils,Region) {
    var Application = MXComponent.extend({
        /**
         * Constructor
         */
        ctor: function (options) {
            this._super(options);
        },
        /**
         * 应用开始运行启动
         *
         * @return {number}
         */
        run: function () {
            // Initialize instance .
            if (!this.applicationDidFinishLaunching()) {
                return 0;
            }

            //TODO：后续看这些是否需要统一到一个地方配置，包括依赖的先后关系  add by 2013.10.17
            //this.includeCoreStyle(["core", "widget"]);  //引入底层平台需要的核心CSS文件

            //this._attachResizeEvent();  //注册调整应用布局大小的事件
        },
        getApplicationContext: function(){
            ApplicationContext.setRegionClass(Region);
            return  ApplicationContext;
        },
        getApplicationUtils:function(){
            return ApplicationUtils;
        },
        /**
         * 注册调整应用布局大小的事件
         * @private
         */
        _attachResizeEvent: function () {
            var that = this;
            /*$(window).resize(function () {
                that._resizeApplicationLayout();
            });*/
        },
        /**
         * 调整应用布局的大小
         * @private
         */
        _resizeApplicationLayout: function () {
            var $body = $(document.body);
            var body = $body.get(0);
            var applicationRegion = ApplicationContext.getApplicationRegion();
            var applicationEl = ApplicationContext.getApplicationRegionEl();
            var mainEl = ApplicationContext.getMainRegionEl();
            var $applicationEl = applicationEl ? $(applicationEl) : null;
            var width = body.offsetWidth;
            var height = body.offsetHeight;

            if ($applicationEl != null && $applicationEl.length != 0) {
                applicationRegion.resizeTo(width, height);  //针对整体应用窗口
            } else {
                var mainRegion = Region.buildRegion(mainEl);
                mainRegion.resizeTo(width, height);  //针对弹出窗口
            }
        },
        includeCoreStyle: function (coreCss) {
            if (coreCss == null)
                return;
            if (typeof coreCss == "string")
                coreCss = [coreCss];

            var buffer = null;
            for (var i = 0; i < coreCss.length; i++) {
                buffer = [];
                buffer.push("css!core_style/", coreCss[i]);
                require([buffer.join("")]);
            }
        },
        /*
         * 应用启动完成后执行的操作（给子类override）
         */
        applicationDidFinishLaunching: function () {
            return true;
        }
    });

    return Application;
});