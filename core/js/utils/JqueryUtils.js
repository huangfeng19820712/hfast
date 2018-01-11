/**
 * Created with IntelliJ IDEA.
 * User:
 * Date: 15-4-23
 * Time: 下午4:30
 * To change this template use File | Settings | File Templates.
 */
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
// code
    // toggle function
    $.fn.clickToggle = function (f1, f2) {
        return this.each(function () {
            var clicked = false;
            $(this).bind('click', function () {
                if (clicked) {
                    clicked = false;
                    return f2.apply(this, arguments);
                }

                clicked = true;
                return f1.apply(this, arguments);
            });
        });

    };
    $.fn.convertForm2Model = function (clazz) {
        var findClazz = clazz||".form-control";
        var inputs = this.find(findClazz);
        var model = {};

        for(var i=0;i< inputs.length;i++){

            var input = $(inputs[i]);
            var name = input.attr("name");
            model[name]=input.val();
        }
        return model;

    };

    $.fn.extend({
        animateCss: function (animationName, callback) {
            var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);
                if (callback) {
                    callback();
                }
            });
            return this;
        }
    });


}));