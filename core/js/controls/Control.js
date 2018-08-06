/**
 * @module 控件基类[Control]
 * @description
 * 表示所有控件的基类，它继承于 {@link Component} 类。框架中控件包含有基础控件、容器控件、编辑器控件、数据控件等。
 *
 *
 * @author:
 * @date:
 */
define(["jquery", "underscore",
        "core/js/Component",
        "core/js/base/AbstractView",
        "core/js/utils/ApplicationUtils"],
    function ($, _, MXComponent, AbstractView,ApplicationUtils) {
        /**
         * @class
         * @extends {Component}
         */
    var Control = MXComponent.extend(AbstractView).extend({
        /**
         * 获取控件是否可以对用户交互作出响应。如果该值为 true，则表示控件可以对用户交互作出响应；反之则不能。
         * 请使用 {@link setEnabled} 方法设置该字段的值。
         *
         * @default true
         */
        enabled: true,

        /**
         * 获取控件的标签。
         *
         * @default <div/>
         */
        eTag: "<div/>",

        /**
         * 获取该控件的占位符，该占位符为一个 JQuery 对象。
         */
        $el: null,

        /**
         * 模板格式化后的内容
         */
        content:null,

        /**
         * 值允许为Component类型的组件、函数、jquery对象、jquery能找到的选择器(selector)，但最终必须都能够被转换成Component类型的实例对象
         *
         * @description 通过该属性来关联该控件的父类控件
         */
        cascadeFrom: null,

        /**
         * 声明事件：级联事件，当父对象{@link cascadeFrom}值变更时，会触发该事件
         */
        oncascade: null,
        /**
         * 声明事件，当组件准备渲染前触发。
         */
        onrendering: null,

        /**
         * 声明事件，当组件渲染完成后触发。
         */
        onrender: null,

        /**
         * 声明事件：当组件显示在界面上时触发
         */
        onshow: null,

        /**
         * 声明事件：布局调整后触发该事件
         */
        onresize: null,

        ctor: function (options) {
            this._super(options);
        },

        initialize: function (options,triggerEvent) {
            this._super(options,false);
            this.initId();
            this.beforeInitializeHandle(options, triggerEvent);
            this.initializeHandle(options,triggerEvent);
            //this._initElAttr();    //初始化元素的属性
            this.afterInitializeHandle(options, triggerEvent);
        },
        /**
         * 初始化核心处理方法，由子类实现,主要是初始化数据，不包含渲染的内容
         */
        initializeHandle:function(){

        },

        /**
         * DOM的渲染，初始化本身、挂载容器、初始化子区域
         * 初始化过程：
         * 1.初始化展示的页面内容
         * 2.把要输出的区域初始化称Region对象
         * @param triggerEvent
         * @returns {Container}
         */
        render: function (container, triggerEvent) {
            //初始化本身的EL信息
            this.ensureEl();
            this._super(container, triggerEvent);   //执行父类的渲染方法
            return this;
        },


        /**
         * 确保当前区域关联的DOM元素存在（即该区域要显示的内容所关联的DOM元素）
         */
        ensureEl: function () {
            if (!this.$el || this.$el.length === 0) {
                this.$el = this.getEl(this.el);
                //尝试从父几点中获取
                if ((!this.$el || this.$el.length === 0)&&this.getParent()) {
                    this.$el = this.getParent().getEl(this.el);
                }
                //还没有内容找到$el,则直接初始化
                if(!this.$el || this.$el.length === 0){
                    this.$el = $(this.eTag);
                }

                this._initElAttr();  //初始化元素的属性
            }
        },
        /**
         * 初始化元素的属性
         */
        _initElAttr: function () {
            if(this.$el&&this.$el.parent().length>0){
                this.$container = this.$el.parent();
            }
            this.setCascadeFrom(this.cascadeFrom);  //设置被级联的父对象，并向其注册onchange事件

            this._super();

            if (this.visible === false) {
                this.hide();
            }
            if (this.enabled === false) {
                this.setEnabled(this.enabled);
            }
        },

        /**
         * 获取解析后的视图模版的内容
         * @return {*}
         * @private
         */
        _getTemplateContent: function () {
            var template = this.getTemplate();
            return this._parseTemplate(template);
        },
        /**
         * 获取视图模版
         * @return {*}
         */
        getTemplate: function () {
            return this.get("template", null);
        },
        /**
         * 解析模版，将模版中的动态内容根据上下文信息进行替换
         */
        _parseTemplate: function (template) {
            var context = this.getTemplateContext();
            if (context == null){
                context = {}
            }
                //return template;
            if(this.dataPre){
                return _.template(template,{variable: this.dataPre})( context);
            } else{
                return _.template(template)( context);
            }
        },
        /**
         * 获取模版的上下文信息
         * @return {*}
         */
        getTemplateContext: function () {
            return this.data||this.get("data", null);
        },
        /**
         * 根据给定的对象，判断该对象是否是Control控件的实例，如果是，则返回该控件实例对象，否则返回false|null
         * @param object       Control实例或者jquery对象
         * @return {boolean}
         */
        isControl: function (object) {
            var result = object instanceof Control || this.isComponent(object);
            if (result)
                return object;
            if ($.isPlainObject(object) && $.isFunction(object.data)) {
                result = object.data("control");
            }

            return result;
        },
        /**
         * 移动控件到指定位置。
         *
         * @param left
         *            一个数字，表示 css 样式的 left 属性。
         * @param top
         *            一个数字，表示 css 样式的 top 属性。
         */
        moveTo: function (left, top) {
            this.setLeft(left);
            this.setTop(top);
        },
        /**
         * 重设控件的大小。
         *
         * @param outerWidth
         *           控件的宽度（包含了补白padding和边框border），可以是数字（如 100），也可以是字符串（如 “100%”）。
         * @param outerHeight
         *          控件的高度（包含了补白padding和边框border），可以是数字（如 100），也可以是字符串（如 “100%”）。
         */
        resizeTo: function (outerWidth, outerHeight) {
            this.setOuterWidth(outerWidth);     //这里的宽度包含了补白padding和边框border
            this.setOuterHeight(outerHeight);   //这里的高度包含了补白padding和边框border

            this.trigger("resize");  //触发布局调整的事件
        },
        /**
         * 设置 {@link enabled} 字段的值。
         * @param enabled
         */
        setEnabled: function (enabled) {
            if (enabled == null || !this.$el)
                return;

            this.enabled = enabled;
            this.$el.toggleClass("h-disabled", !this.enabled);   //更改样式
        },
        /**
         * 设置会影响自身值得父对象（级联的父对象）
         * @param cascadeFrom
         */
        setCascadeFrom: function (cascadeFrom) {
            this.cascadeFrom = cascadeFrom;

            //建立当前对象与父对象的关联，监听父对象值的变化
            if (cascadeFrom)
                this._registerCascadeEvent();  //注册与关联父对象的级联事件
        },
        /**
         * 注册级联事件
         * @private
         */
        _registerCascadeEvent: function () {
            var cascadeFromComponents = this.getCascadeFromComponents();   //获取级联父对象的组件
            if (cascadeFromComponents.length == 0)
                return;

            var that = this,
                cascadeFromComponent;
            //向级联父对象注册一个onchanged事件
            for(var i=0,count=cascadeFromComponents.length; i<count; i++){
                cascadeFromComponent = cascadeFromComponents[i];
                cascadeFromComponent.on("changed", function () {
                    var params = {
                        "cascadeFrom": this,
                        "value": this.getValue ? this.getValue() : null,
                        "displayValue": this.getDisplayValue ? this.getDisplayValue() : null
                    }
                    that.trigger("cascade", params);   //触发当前组件的级联事件
                })
            }
        },
        /**
         * 获取cascadeFrom组件
         * @return {Array}
         * @private
         */
        getCascadeFromComponents: function () {
            var cascadeFromEls = this._getCascadeFromObjects(),
                result = [],
                cascadeFromEl;
            if (!cascadeFromEls)
                return result;

            if(!$.isArray(cascadeFromEls)){
                cascadeFromEl = this.isControl(cascadeFromEls);
                if(cascadeFromEl)
                    result.push(cascadeFromEl);
            }else{
                for(var i=0,count=cascadeFromEls.length; i<count; i++){
                    cascadeFromEl = this.isControl(cascadeFromEls[i]);
                    if(cascadeFromEl)
                        result.push(cascadeFromEl);
                }
            }

            return result;
        },
        /**
         * 获取cascadeFrom对象
         * @return {*}
         * @private
         */
        _getCascadeFromObjects: function () {
            var cascadeFrom = this.cascadeFrom;
            if (cascadeFrom == null)
                return null;
            if (typeof cascadeFrom == "function") {
                cascadeFrom = $.proxy(cascadeFrom, this);  //cascadeFrom作用域绑定到当前对象上
                cascadeFrom = cascadeFrom();
            }
            if (typeof cascadeFrom != "string")
                return cascadeFrom;

            return this.getCascadeFromEl(cascadeFrom);
        },
        /**
         * 根据给定的选择器，获取cascadeFrom元素，允许子类进行覆写，来限定其上下文信息
         * @param selector  多个值用逗号分隔
         * @return {*|HTMLElement}
         */
        getCascadeFromEl: function (selector) {
            if(!selector)
                return null;
            var selectorArray = selector.split(","),
                result = [],
                item, el;
            for(var i=0, count=selectorArray.length; i<count; i++){
                item = selectorArray[i];
                el = this.getEl(selector);
                if(!el)
                    continue;
                result.push(el);
            }

            if(result.length == 0)
                return null;
            if(result.length == 1)
                return result[0];

            return result;
        },
        /**
         * 该方法与 this.$el.find(p_expression) 等同。
         *
         * @param expression`
         * @return {*}
         */
        $: function (expression) {
            if (this.$el != null)
                return this.$el.find(expression);

            return this.getEl(expression);
        },
        get$: function(param){
            if(!param)
                return $;
            return $(param);
        },
        /**
         * 提供给子类覆盖的，让该组件中的元素，是有一定的上下文，返回一个jquery选择器对象
         * 默认是从整个DOM元素进行查找
         * @param selector
         * @return a jquery selector
         */
        getEl: function (selector) {
            var parent = this.getParent();
            if (parent == null || !parent.$)
                return $(selector);

            return parent.$(selector);
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            if(this.$el){
                if(this.draggable){
                    this.$el.draggable( "destroy" );
                }
                this.$el.data("control", null);
                this.$el.remove();
                this.$el = null;
            }
            this.setWrapCom(null);
            this.parent = null;
            delete this.parent;
            ApplicationUtils.removeComponent(this.id);
            this._super();
        }
    });

    return Control;
});