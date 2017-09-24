/**
 *
 * @author:   * @date: 2017/3/3
 */
define([
    "core/js/grid/filter/AbstractFilter",
    $Component.TOUCHSPINEDITOR.src,
], function (AbstractFilter,TouchSpinEditor) {
    var DateFilter = AbstractFilter.extend({
        dataInit:function(el){
            var editor = new TouchSpinEditor({
                $container: $(el).parent(),
                $input:$(el),
                displayButtons:true,
            });
        },
    });
    return DateFilter;
})
