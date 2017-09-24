/**
 * @date: 14-2-24
 */
define([
    'core/js/controls/Label'
], function (Label) {
    var DemoText = Label.extend({
        componentClass:null,
        oninitialized:function(){
            this.componentClass = Label.extend({
                text:"标签"
            });
        }
    });
    return DemoText;
});
