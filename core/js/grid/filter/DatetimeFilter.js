/**
 * 日期格式的过滤输入控件
 *
 * @author:   * @date: 2016/1/14
 */
define([
    "core/js/grid/filter/AbstractFilter",
    $Component.DATETIMEEDITOR.src,
], function (AbstractFilter,DatetimeEditor) {
    var DateFilter = AbstractFilter.extend({
        dataInit:function(el){
            var editor = new DatetimeEditor({
                $container: $(el).parent(),
                mode:$cons.DateEditorMode.INPUT ,
                $input:$(el)
            });
        },
    });
    return DateFilter;
})

