/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
    "muuri",
    "hammerjs",
    "text!"+APP_NAME+"/view/other/inlineBlock/inlineBlock.html",
    "css!"+APP_NAME+"/view/other/inlineBlock/inlineBlock.css"],
    function (FluidLayout, CommonConstant,Region,Panel,Muuri,Hammer,Template) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_3,
            items: null,
            mountContent:function(){
                this.$el.append(Template);
            }
        });

        return view;
    });
