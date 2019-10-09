/**
 * 一组按钮
 * @Deprecated
 * @author:   * @date: 2015/12/8
 */
define([
        "core/js/CommonConstant",
        "core/js/controls/Control"
    ], function ( CommonConstant, Control) {
        var ButtonGroup = Control.extend({
            /**
             * 按钮的大小
             */
            size:null,
            /**
             * 间距
             */
            spacing:CommonConstant.Spacing.NULL,
            className:"btn-group",
            buttons:null,
            onrender:function(){
                if(this.buttons.length>0){
                    var that = this;
                    _.each(this.buttons,function(item,i){
                        item.$container = that.$el;
                        if(that.spacing!=null&&that.spacing!=0&&i>0){
                            item.$el.css({"margin-left":that.spacing});
                        }
                        item.render();
                    });
                }
            },
            _initElAttr:function(){
                this._super();
                this.$el.attr("role","group");
                this.$el.css("display","");
            }
        });
        ButtonGroup.size= {
            /**
             *
             */
            lg:"btn-group-lg",
            sm:"btn-group-sm",
            xs:"btn-group-xs",
        };
        return ButtonGroup;
    }
);
