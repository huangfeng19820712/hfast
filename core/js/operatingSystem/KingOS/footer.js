/**
 * @author:   * @date: 15-8-17
 */
define(["core/js/controls/AbstractControlView",
     "text!lib/hyfast-kingadmin/tmpl/footer.html"],
    function (AbstractControlView, Template) {
        var View = AbstractControlView.extend({
            xtype:$KingCons.xtype.FOOTER,
            template:Template
        });
        return View;
    });