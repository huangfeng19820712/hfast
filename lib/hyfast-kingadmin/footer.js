/**
 * @author:   * @date: 15-8-17
 */
define(["core/js/base/BaseView",
    "backbone", "text!lib/hyfast-kingadmin/tmpl/footer.html"],
    function (BaseView, Backbone, temple) {

        var View = BaseView.extend({

            initialize: function (options) {
            },
            render: function () {
                this.$el.append(temple);
            }
        });
        return View;
    });