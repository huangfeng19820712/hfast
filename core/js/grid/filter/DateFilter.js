/**
 * 日期格式的过滤输入控件
 *
 * @author:   * @date: 2016/1/14
 */
define([
    "core/js/grid/filter/AbstractFilter",
    $Component.DATEEDITOR.src,
], function (AbstractFilter,DateEditor) {
    var DateFilter = AbstractFilter.extend({

        dataInit:function(el){
            /*$(el).datepicker({
                autoclose: true,
                format: 'yyyy-m-d',
                orientation : 'bottom'
                    });*/
            var that = this;
            var options = {$container: $(el).parent(),
                mode:$cons.DateEditorMode.INPUT ,
                $input:$(el),
                format: 'yyyy-mm-dd',
                //onhide:function(){},
                onchangeDate:function(value){
                    if(that.grid){
                        that.grid.triggerToolbar();
                    }
                }
            };
            var editor = new DateEditor(options);
        },

    });
    return DateFilter;
})

