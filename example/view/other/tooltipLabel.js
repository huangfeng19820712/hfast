/**
 * @author:   * @date: 2016/3/24
 */
define([
        "backbone", "core/js/layout/FluidLayout",
        "core/js/controls/TooltipLabel"],
    function (Backbone,FluidLayout,TooltipLabel) {

        var tooltipLabel = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_3,
            items:null,
            initItems:function(){
                var items = [];
                for(var i in $cons.tooltip.Align){
                    var value = $cons.tooltip.Align[i];
                    items.push({
                        comXtype:$Component.TOOLTIPLABEL,
                        comConf:{
                            $container: this.$el,
                            text:value,
                            align:value,
                            opacity:"1"
                        }
                    });
                }
                for(var i in $cons.tooltip.Align){
                    var value = $cons.tooltip.Align[i];
                    items.push({
                        comXtype:$Component.TOOLTIPLABEL,
                        comConf:{
                            $container: this.$el,
                            text:value,
                            noborder:true,
                            align:value,
                            opacity:"1"
                        }
                    });
                }
                this.items = items;
            }
        });

        return tooltipLabel;
    });
