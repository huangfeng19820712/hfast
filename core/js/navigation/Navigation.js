/**
 * @author:   * @date: 2017/9/22
 */
define([
    "core/js/CommonConstant",
    "core/js/controls/AbstractControlView",
    "text!core/resources/tmpl/navigation.html"
], function (CommonConstant,AbstractControlView,Template) {
    var Navigation = AbstractControlView.extend({
        xtype:$Component.NAVIGATION,
        //className:"nav navbar-nav",
        /**
         * {Array}
         * <code>
         * [{
         *      label:"<可选>[显示的内容]"，
         *      subMenu:"<可选>[子菜单]"，
         *      id:"<必选>[唯一编码]"，
         *      order:"<可选>[排序使用]"，
         *      onclick:"<可选>[点击事件]"
         * },...]
         * </code>
         */
        data:null,
        template:Template,
        mountContent:function(){
            //this.initClass();
            var that = this;
            this.$el.append('<ul class="nav navbar-nav"/>');
            var ul = this.$el.find("ul");
            _.each(this.data, function (menu) {
                //var result = _.template(that.template)( menu);
                var result = _.template(that.template,{variable: that.dataPre})( menu);
                //获取子集数
                var len = that.$el.children().length;
                ul.append(result);
                //$(that.$el.children()[len - 1]).after(result);
            });
        }
    });
    return Navigation;
});