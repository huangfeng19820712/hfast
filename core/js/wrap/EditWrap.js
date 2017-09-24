/**
 * @module 编辑模式，
 * @author:   * @date: 2015/12/15
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/EditWrap.html",
    "core/js/wrap/WrapAbstract"
], function (CommonConstant, Container,LayoutTemplate,WrapAbstract) {
    var EditWrap = Container.extend(WrapAbstract).extend({
        xtype:$Component.EDITWRAP,
        wrapSelector:"div>div.view",
        /**
         * 清空模板
         */
        template:LayoutTemplate,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        render:function(container, triggerEvent){
            this._super(container, triggerEvent);
            var children = this.$(this.wrapSelector);
            this.setWrapEl(children);
        },

        /*-------------------------------  公有有方法 start ---------------------------------------------------*/

    });
    return EditWrap;
});
