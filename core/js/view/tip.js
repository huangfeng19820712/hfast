/**
 * @module 提示框[ExceptionView]
 * @description 提示框
 *
 * @author:
 * @date: 2013-11-07 下午8:09
 */
define(["core/js/context/ApplicationContext",
    "core/js/base/BaseView",
    "text!core/resources/tmpl/system_tip.html"
], function (ApplicationContext, BaseView, tipTemplate) {
    var ExceptionView = BaseView.extend({
        template: tipTemplate,

        initialize: function (options) {
            options = options || {};
            options["data"] = {
                core_style: ApplicationContext.getCoreStyle(),  //获取样式的基础根路径
                message: options["message"] || ""
            };

            this._super(options);
        }
    });

    return ExceptionView;
});