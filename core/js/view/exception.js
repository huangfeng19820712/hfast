/**
 * @module 异常界面[ExceptionView]
 * @description 异常界面
 *
 * @author:
 * @date:
 */
define(["core/js/context/ApplicationContext",
    "core/js/base/BaseView",
    "text!core/resources/tmpl/system_exception.html"
], function (ApplicationContext, BaseView, exceptionTemplate) {
    var ExceptionView = BaseView.extend({
        template: exceptionTemplate,
        initialize: function (options) {
            options = options || {};
            options["data"] = {
                message: options["message"] || ""
            };

            this._super(options);
        }
    });

    return ExceptionView;
});

