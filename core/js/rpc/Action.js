/**
 *
 * @author:   * @date: 2018/6/13
 */

define([
    "core/js/Class"], function ( Class) {
    var Action = Class.extend({
        nameSpace:null,
        methodName:null,
        ctor: function (options) {
            this.set(options);

        },
        /**
         * 核心方法，子类必须继承
         * @returns {string}
         */
        getUrl:function(){
            return "/"+this.nameSpace+"/"+this.methodName+".action";
        },
        setMethodName:function(methodName){
            this.methodName = methodName;
        }
    });
    return Action;
})