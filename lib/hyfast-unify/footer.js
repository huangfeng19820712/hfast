/**
 * @author:   * @date: 15-8-17
 */
define(["core/js/base/BaseView",
    "backbone", "text!lib/hyfast-unify/tmpl/footer.html"],
    function (BaseView, Backbone, temple) {
        var content = temple;
        var View = BaseView.extend({
            initialize: function (options) {
                this.render();
            },
            render: function (container, triggerEvent) {
                this.$el.append(content);
            }
        });
        return View;
    });