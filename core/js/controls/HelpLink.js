/**
 * 有弹窗帮助信息的超链接
 * @author:   * @date: 2015/12/20
 */
define(["core/js/controls/ToolStripItem",
    "core/js/controls/Button",
    "core/js/CommonConstant"], function (ToolStripItem,Button,CommonConstant) {
    var HelpLink = Button.extend({
        mode:ToolStripItem.Mode.LINK,
        iconSkin:"fa-question-circle",
        theme:null,
        mainContent:null,
        placement:null,
        panelTitle: '<i class="fa fa-book"></i> '+$i18n.HELP_LABEL,
        onrender: function () {
            var titleContent = this.title;
            this.$el.popover({
                container: 'body',
                html: true,
                trigger:"focus hover",
                title:this.panelTitle,
                content: this.mainContent,
                placement:this.placement||"right"
            });
        },
        //销毁popover
        destroy:function(){
            this.$el.popover('destroy')
            this._super();
        }

    });



    return HelpLink;
});

