/**
 * @module 组件基类[Component]
 * @description 所有组件的基类，在框架中控件、编辑器、容器控件、视图、视图控制器等均为组件。通常组件向外暴露出属性、方法和事件，并有自己的生命周期。
 * 组件的生命周期包括实例化、初始化，通常在实例化的过程中会自动初始化； 也可以通过将 {@link autoInit} 属性设置为
 * false，在实例化过程中不自动初始化，而是在程序中手动调用 {@link initialize } 方法(为与Backbone的初始化方法保持一致)进行初始化。
 *
 * @author:
 * @date: 2013-08-14 上午9:29
 */
define(["jquery", "core/js/Observable", "core/js/utils/Log"], function ($, Observable, Log) {
    /**
     * @class
     * @extends {Observable}
     */
    var Component = Observable.extend({
        /**
         * 获取组件的唯一标识
         */
        id: null,

        /**
         * 获取一个 Boolean 值，表示是否需要在实例化时自动调用 {@link init} 方法。
         *
         * @default true
         */
        autoInit: true,

        /**
         * 标识组件是否已经销毁
         */
        isDestroied: false,

        /**
         * 获取一个 Boolean 值，表示是否已经初始化。
         *
         * @default false
         */
        initialized: false,

        /**
         * 必须声明事件函数，不然this._super是指向激活事件的方法
         * 事件声明：整个组件初始化完成后的事件
         */
        oninitialized: function(){},

        /**
         * 事件声明：整个组件被销毁后的事件
         */
        ondestroied: function(){},


        getId: function () {
            return this.id;
        },
        /**
         * 根据给定的对象，判断该对象是否是Component控件的实例
         * @param object
         * @return {boolean}
         */
        isComponent: function (object) {
            return object instanceof Component;
        },

        ctor: function (options) {
            this.set(options);
            if (this.autoInit) {
                this.initialize(options,true);
            }
        },
        /**
         * 注册组件的事件
         * add by 2014.09.26
         * @param options
         * @param value
         */
        set: function(options, value){
            this.registerSelfEvent(this);  //预先绑定事件
            this._super(options, value);
        },
        initialize : function (options,triggerEvent) {
            triggerEvent = triggerEvent == null ? true : triggerEvent;  //默认是触发初始化完成后的事件

            this.initialized = true;

            //组件初始化完成，触发事件
            if (triggerEvent)
                this.trigger("initialized");
        },
        getLog: function(){
            return Log;
        },
        /**
         * 注册自身的对外开放的时间
         * @param options
         */
        registerSelfEvent: function (options) {
            //如果已经注册过了自身的事件，就不再重复注册了
            if (this._registerEvent)
                return;
            var isEventDispatcher = typeof (this.on) == "function";   //判断是否有委托事件
            var key, option;
            for (key in options) {
                if (key == "on" || !isEventDispatcher)
                    continue;

                option = options[key];
                if (typeof (this[key] == "object")
                    && typeof (option) == "function"
                    && key.substring(0, 2) == "on") {
                    this[key] = null;    //将该值置空，才能保证后续为其创建事件对象
                    this.on(key.substr(2), option);
                }
            }

            option = null;
            this._registerEvent = true;
        },
        /**
         * 获取需要计算的结果，即参数有可能是函数
         * @param needCalculateResult
         * @return {*}
         */
        getCalculateResult: function(needCalculateResult){
            var result, calculateResultFunction;
            if (typeof needCalculateResult == "function") {
                calculateResultFunction = $.proxy(needCalculateResult, this);  //绑定函数执行的上下文
                result = calculateResultFunction();
            }else{
                result = needCalculateResult;
            }

            return result;
        }
    });

    return Component;
});