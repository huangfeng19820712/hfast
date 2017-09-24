/**
 * @module 可监听类[Observable]
 * @description 可监听（观察）的类：仅添加事件
 * @date: 2013-11-21 下午4:20
 */
define(["core/js/Class", "core/js/Event"], function (Class, MXEvent) {

    var Observable = Class.extend({

        /**
         * 事件声明：整个组件被销毁后的事件
         */
        ondestroied: null,

        destrioed:null,

        ctor: function (options) {
        },
        /*
         * 订购事件（事件必须在初始化时先申明，否则无法订购）。
         *
         * @param eventType   事件类型。
         * @param pFunction   事件处理函数。
         *
         * @example
         * 下面的示例订购了 component 组件的 valuechanged 事件。
         * <code language="JavaScript">
         * MyComponent = Component.extend({
         *      init: function(){
         *          this.onvaluechanged = null;
         *      }
         * })
         *
         * var component = new MyComponent();
         * component.on("valuechanged", function(e) {
         *     alert(e.target + "'s value changed.");
         * });
         * </code>
         *
         * @example
         * 上一示例也可以通过在实例化组件时，通过构造参数实现订购事件。
         * <code language="JavaScript">
         * var component = Component.extend({
         *     onvaluechanged: function(e)
         *     {
         *         alert(e.target + "'s value changed.");
         *     }
         * });
         * </code>
         *
         */
        on: function (eventType, pFunction) {
            var eventType = "on" + eventType;

            //事件需要在初始化时先申明，否则没办法订购
            if (typeof(this[eventType]) == "undefined")
                return;

            if (this[eventType] == null)
                this[eventType] = new MXEvent();

            this[eventType].addEventListener(pFunction);
        },
        /**
         * 退购事件。
         *
         * @param [eventType = null]
         *            事件类型。如果参数为 null，则退购所有事件。
         * @param [pFunction = null]
         *            事件处理函数。如果参数为 null，则退购 eventType 类型的所有事件。
         *
         * @example
         * 下面的示例退购了 component 组件的一个 click 事件。
         * <code language="JavaScript">
         * MyComponent = Component.extend({
         *      init: function(){
         *          // 声明 onclick 事件。
         *          this.onclick = null;
         *      }
         * });
         *
         * function _component_click(e)
         * {
         *     alert(e.target + " is clicked.");
         *     component.off("click", _component_click);
         * }
         *
         * var component = new MyComponent();
         * component.on("click", _component_click);
         * </code>
         *
         * @example
         * 下面的示例退购了 component 组件的所有 click 事件。
         * <code language="JavaScript">
         *      var component = new MyComponent();
         *      component.off("click");
         * </code>
         *
         * @example
         * 下面的示例退购了 component 组件的所有事件。
         * <code language="JavaScript">
         *      var component = new MyComponent();
         *      component.off();
         * </code>
         *
         */
        off: function (eventType, pFunction) {
            //如果入参都为空，则将该组件的所有事件都退订
            if (eventType == null && pFunction == null) {
                for (var name in this) {
                    if (this[name] != null && this[name].constructor == MXEvent) {
                        this[name].clear();
                        this[name] = null;
                    }
                }

                return;
            }
            var eventType = "on" + eventType;
            if (typeof(this[eventType]) == "undefined")
                return;

            if (this[eventType] != null) {
                if (pFunction != null) {
                    this[eventType].removeEventListener(pFunction);   //如果事件和函数都不为空，则退订指定事件下的某个函数
                } else {
                    this[eventType].clear();     //如果退订事件的函数为空，则退订该事件下所有的函数
                }
            }
        },
        /**
         * 返回一个 Boolean 值，表示指定的 eventType 类型的事件是否已订购。返回值为 true，表示已订购；反之则没有。
         *
         * @param eventType 事件类型。
         */
        hasBound: function (eventType) {
            eventType = "on" + eventType;
            if (typeof(this[eventType]) == "undefined")
                return false;
            if (this[eventType] != null)
                return this[eventType].listeners.length > 0;

            return false;
        },
        /**
         * 触发事件。
         *
         * @param eventType 事件类型。
         * @param args 事件参数。事件参数中默认有两个属性“target”和“type”，分别表示事件触发者和触发的事件类型。
         */
        trigger: function (eventType, args) {
            var etype = "on" + eventType,
                eventObject = this[etype];


            //不存在的话，默认代表触发成功
            if (typeof(eventObject) == "undefined" || eventObject == null)
                return true;

            var e = {type:eventType,
                target:this};
            if (args){
                e.jqEvent = args
            }

            var argArray = _.toArray(arguments);
            var eventObj = null;
            if(argArray.length>1){
                var otherArgs = _.toArray(arguments).slice(1);
                eventObj = eventObject.fire(e, this,otherArgs);
            }else{
                eventObj = eventObject.fire(e, this);
            }

            return eventObj;
        },
        /**
         * 阻止冒泡事件
         * @param e
         */
        stopBubble: function (e) {
            Observable.stopBubble(e);
        },
        /**
         * 阻止浏览器默认行为的方法
         * @param e
         * @return {boolean}
         */
        stopDefault: function (e) {
            Observable.stopDefault(e);
        },
        /**
         * 组件销毁
         */
        destroy: function () {
            this.trigger("destroied");   //触发销毁事件
            this.off();    //退订该组件的所有事件
        }
    });

    Observable.stopBubble = function (e) {
        /**
         * e.stopPropagation()和e.stopImmediatePropagation()都是用来阻止事件冒泡的。
         * 只是这两个方法有个区别，就是后面的方法不仅阻止了一个事件的冒泡，也把这个元素上的其他绑定事件也阻止了。
         * 而前者只是阻止一个绑定事件的冒泡，而不影响其他绑定事件执行。
         * e.preventDefault()是用来阻止浏览器的默认行为的。
         */
        if (e) {//非IE
            if (e.stopPropagation)
                e.stopPropagation();

            if (e.stopImmediatePropagation)
                e.stopImmediatePropagation();
        }
        else {//IE
            window.event.cancelBubble = true;
        }
    }

    Observable.stopDefault = function (e) {
        //阻止默认浏览器动作(W3C)
        if (e && e.preventDefault)
            e.preventDefault();
//            //IE中阻止函数器默认动作的方式
//            else
//                window.event.returnValue = false;
        return false;
    }

    return Observable;
});