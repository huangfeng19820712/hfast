/**
 * @author:   * @date: 2016/3/3
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/layout/FluidLayout", "core/js/windows/Window",
        "core/js/CommonConstant", "core/js/controls/ToolStrip",
        "core/js/controls/ToolStripItem",
        "core/js/CommonConstant",
        "core/js/controls/HelpLink",
        "core/js/utils/Utils","core/js/view/Region"],
    function (BaseView, Backbone, FluidLayout, Window, CommonConstant, ToolStrip,
              ToolStripItem,
              CommonConstant,
              HelpLink,
              Utils,Region) {
        var view = FluidLayout.extend({
            initItems:function(){
                this.items = [];
                var numItems = [];
                for (var i = 0; i < 10; i++) {
                    numItems.push({
                        text: i.toString(),
                        isToggle: true,
                        themeClass: ToolStripItem.ThemeClass.CHECKBOX,
                        roundedClass:$Rounded.ROUNDED
                    });

                }
                var that = this;
                this.items.push({
                    columnSize: $Column.COL_MD_8,
                    comXtype:$Component.TOOLSTRIP,
                    comConf:{
                        size:ToolStrip.size.sm,
                        spacing: CommonConstant.Spacing.DEFAULT,
                        itemOptions:numItems}
                },{
                    columnSize: $Column.COL_MD_4,
                    comXtype:$Component.TOOLSTRIP,
                    comConf:{
                        size:ToolStrip.size.sm,
                        itemOptions: [ {
                            text: "单",
                            onclick:$.proxy(that.checkNum,that,[1,3,5,7,9])
                        }, {
                            text: "双",
                            onclick:$.proxy(that.checkNum,that,[0,2,4,6,8])
                        }, {
                            text: "反",
                            onclick:$.proxy(that.toggleNum,that)
                        }]
                    }
                });
            },
            checkNum:function(){
                var e = arguments[arguments.length];
                var items= null;
                if(arguments.length==2){
                    items = arguments[0]
                }
                var numGroupComponent = this.getNumGroupComponent(0);
                numGroupComponent.activeItems(items);
            },
            /**
             *  切换号码的激活状态
             */
            toggleNum:function(){
                var numGroupComponent = this.getNumGroupComponent(0);
                numGroupComponent.toggleActiveItems();

            },
            getNumGroupComponent:function(num){
                var componentByIndex = this.getComponentByIndex(0);
                return  componentByIndex;
            }
        });
        return view;
    });
