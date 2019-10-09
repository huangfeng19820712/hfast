/**
 * @author:
 * @date: 15-1-8
 */

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
define([], function () {
    var initializing = false, fnTest = /\b_super\b/;

    /**
     * The base Class implementation (does nothing)
     * @class
     */
    var Class = function () {
    }

    /**
     * add implementation method
     * @param options
     * @param value
     */
    Class.prototype.set = function (options, value) {
        if (!$.isPlainObject(options)) {
            var key = options;
            if (typeof key != "string")
                return;

            key = $.trim(key);
            if (key === "")
                return;

            options = {};
            options[key] = value;
        }

        var isEventDispatcher = typeof (this.on) == "function";
        var key, option;
        for (key in options) {
            option = options[key];
            if (isEventDispatcher && typeof (this[key]) == "object"
                && typeof (option) == "function"
                && key.substring(0, 2) == "on") {
                this.on(key.substr(2), option);
            } else {
                this[key] = option;
            }

            option = null;
        }
    };

    Class.prototype.get = function (propName, defaultValue) {
        var result = this[propName];
        if (result == null)
            result = defaultValue;
        return result;
    };
    /**
     * 根据给定的对象，判断该对象是否是Class的实例
     * @param object
     * @return {boolean}
     */
    Class.prototype.isClassInstance = function (object) {
        return object instanceof Class;
    };

    /**
     * Create a new Class that inherits from this Class
     * @param {object} prop
     * @return {function}
     */
    Class.extend = function (prop) {
        var _super = this.prototype;
        // Instantiate a base Class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        initializing = false;

        // Copy the properties over onto the new prototype
        for (var name in prop) {
            // Check if we're overwriting an existing function
            prototype[name] = typeof prop[name] == "function" &&
                typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                (function (name, fn) {
                    return function () {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, prop[name]) :
                prop[name];
        }

        // The dummy class constructor
        function newClass() {
            // All construction is actually done in the ctor method
            if (!initializing && this.ctor)
                this.ctor.apply(this, arguments);
        }

        // Populate our constructed prototype object
        newClass.prototype = prototype;

        // Enforce the constructor to be what we expect
        newClass.prototype.constructor = newClass;

        // And make this class extendable
        newClass.extend = arguments.callee;

        return newClass;
    };

    return Class;
});