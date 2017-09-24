/**
 * @module 事件类[Event]
 * @description 事件类，事件有自己的声明周期，包括声明、订购、退购、触发等。通常事件包含一个方法集合；集合中的每个方法在事件触发时都会被执行。
 *
 * @author:
 * @date: 2013-08-13 下午5:06
 */
define(["jquery", "underscore", "core/js/Class"], function ($, _, Class) {
    var Event = Class.extend({
        /**
         * 获取监听事件的方法集合。请使用 {@link addEventListener}、{@link insertEventListener} 或
         * {@link removeEventListener} 方法向集合中添加或移除监听。
         * @inner
         * @item function
         * @index 监听方法在集合中的顺序（从 0 开始计数）。
         */

        listeners: null,

        ctor: function () {
            this.listeners = [];
        },
        /**
         * 将监听方法添加到集合 {@link listeners} 的末尾。
         *
         * @param listener 一个 function 对象。
         */
        addEventListener: function (listener) {
            if (!_.isFunction(listener) || _.indexOf(this.listeners, listener) != -1)
                return;

            this.listeners.push(listener);
        },
        /**
         * 将监听方法添加到集合 {@link listeners} 的指定位置。
         *
         * @param index     新方法在集合中的位置。
         * @param listener  一个 function 对象。
         */
        insertEventListener: function (index, listener) {
            if (!_.isFunction(listener) || _.indexOf(this.listeners, listener) != -1)
                return;

            this.listeners.splice(index, 0, listener);
        },
        /**
         * 从 {@link listeners} 集合中移除指定的 function 对象。
         *
         * @param listener    一个 function 对象。
         * @return {boolean}
         */
        removeEventListener: function (listener) {
            var index = _.indexOf(this.listeners, listener);
            if (index == -1)
                return false;

            this.listeners.splice(index, 1);
        },
        /**
         * 清空所有监听方法
         */
        clear: function () {
            this.listeners = [];
        },
        /**
         * 执行所有的监听当前事件的方法，如果某个监听方法返回false，则不再执行后续的方法
         *
         * @param e  执行监听方法所需的参数。
         * @param context 执行监听方法所需的上下文，即this对象的指向。
         */
        fire: function (e, context) {
            var result = true;
            var target = e.target;
            var func = null;
            for (var i = 0; i < this.listeners.length; i++) {
                func = this.listeners[i];
                //如果入参中指定了context或target，就将方法的上下文（this对象）绑定到该context或target上，使得所有的组件触发的事件，this都绑定到当前组件上
                var args = null;
                if (context != null || target != null) {
                    if (context == null){
                        context = target;
                    }
                    var argArray = _.toArray(arguments);
                    if(argArray.length>2){
                        args = _.toArray(arguments).slice(2);

                    }
                    func = _.bind(func, context,e,args);
                }
                result = func();
                if (result == null)
                    result = true;
                if (!result)
                    break;
            }
            return result;
        }
    });

    return Event;
});