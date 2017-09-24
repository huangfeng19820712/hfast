/**
 * @author:   * @date: 2015/12/30
 */
define(["core/js/controls/Control",
    "core/js/utils/ViewUtils",
    "core/js/CommonConstant",], function (Control, ViewUtils, CommonConstant) {
    var Icon = Control.extend({
        xtype:$Component.ICON,
        /**
         * icon的样式
         */
        icon: null,
        rotated: null,
        stacked: null,
        size: null,
        isList: false,
        isInverse: false,
        /**
         * 显示的标签
         */
        text: null,
        template: '<i class="<%=data.iconSkin%> fa-fw"></i><%=data.text%>',
        inverseClass: "fa-inverse",
        /**
         *  引用数据的前缀
         */
        dataPre: "data",
        data: null,
        initialize: function (options,triggerEvent) {
            this.data = {
                iconSkin: ViewUtils.createIconClass(this.icon, this.rotated, this.size, this.isList),
                text: this.text,
            };
            this._super(options,triggerEvent);
        },
        mountContent:function(){
            if (this.stacked != null) {
                //this.data["stacked"] = this.stacked;
                var span = $("<span/>").addClass("fa-stack fa-lg");
                switch (this.stacked) {
                    case CommonConstant.IconStacked.SQUARE_O:
                        span.append(this.createStackedDom(false)).append(this.createContentDom(false));
                        break;
                    case CommonConstant.IconStacked.BAN:
                        span.append(this.createContentDom(false)).append(this.createStackedDom(true));
                        break;
                    default :
                        span.append(this.createStackedDom(false)).append(this.createContentDom(true));
                        break;
                }
                this.content = span;
                this.$el.append(this.content);
                if(this.text){
                    this.$el.append(this.text);
                }
            } else {
                this.content = _.template(this.template, {variable: this.dataPre})(this.data);//_.template(this.template, options),
                this.$el.append(this.content);
            }
        },
        /**
         * 创建内容的dom
         * @param isInverse
         * @returns {*|jQuery}
         */
        createContentDom: function (isInverse) {
            var contentDom = $("<i/>").addClass("fa fa-fw").addClass(this.icon).addClass("fa-stack-1x")
            if(isInverse){
                contentDom.addClass(this.inverseClass);
            }
            return contentDom;
        },
        /**
         * 创建修饰的dom
         * @param isDanger
         * @returns {*|jQuery}
         */
        createStackedDom: function (isDanger) {
            var stackedDom = $("<i/>").addClass("fa").addClass(this.stacked).addClass("fa-stack-2x");
            if(isDanger){
                stackedDom.addClass("text-danger");
            }
            return stackedDom;
        }
    });
    return Icon;
})
