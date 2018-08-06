/**
 * @module 视图基类[BaseView]
 * @description 所有视图的基类，继承于Backbone的View
 *
 * @author
 * @version 1.0 @Date: 2013-05-31 上午11:29
 */
define(["core/js/Event","backbone","core/js/windows/messageBox",
        "core/js/utils/ApplicationUtils",
        "core/js/base/CommonView"],
    function (MXEvent,Backbone,MessageBox,ApplicationUtils,CommonView) {
    // var option = _.extend(CommonView,);
    var BaseView = Backbone.View.extend(CommonView).extend({
        //var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];   //基类View可配置的参数
        /**
         * 视图的类型
         */
        xtype:$Component.BASEVIEW,
        /**
         * 是否延迟加载模板，即在渲染的时候才加载模板，
         * 以实现动态加载模板功能,延迟加载模板，在使用的时候在加载模板
         */
        lazyLoadTemplate:false,
        /**
         * 需要模板的显示，为null时，
         * 一种情况是根据js的名称自动获取
         * 一种情况是直接通过js创建
         */
        template: null,  //该布局使用的模版对象，不需要再进行加工处理了，由_.template直接生成出来的对象
        data: null,        //用于模版对象解析的模型上下文
        dataPre:"data",       //引用数据的前缀
        height: null,   //该视图的高度，不指定，默认为100%

        isDestroied: false,

        _registerEvent: false,   //标识是否已经注册了事件

        /**
         * 添加控件到容器的jquery对象
         */
        $container: null,

        //事件声明：整个组件初始化完成后的事件
        oninitialized: function(){},

        /**
         * 事件声明：当视图渲染完成后触发的事件，渲染完成不一定可见
         */
        onrender:function (event) {},

        /**
         * 事件声明：当视图显示完成（已经可见了）后触发的事件
         */
        onshow: null,
        /**
         * 事件声明：销毁完后调用
         */
        onclose: null,

        /**
         * 事件声明：布局调整后触发该事件
         */
        onresize: null,

        /**
         * 获取一个 Boolean 值，表示是否已经初始化。
         *
         * @default false
         */
        initialized: false,
        /**
         * 是否懒加载，
         * 1.如果是true，则在初始化的时候没有马上渲染
         * 2.如果是false（默认值），则初始化时就马上渲染
         */
        lazy: false,
        /**
         * 初始化构造函数
         * @param options
         * @param triggerEvent
         */
        initialize: function (options, triggerEvent) {
            this.set(options, null);

            this.beforeInitializeHandle(options, triggerEvent);
            this.initializeHandle(options, triggerEvent);
            //this._initElAttr();    //初始化元素的属性
            this.afterInitializeHandle(options, triggerEvent);
        },

        /**
         * 需要子类集成
         * 在此处不能初始化一个默认的函数，
         */
        //mountContent:null,

        beforeInitializeHandle:function(options, triggerEvent){

        },


        /**
         * 结束初始化
         */
        afterInitializeHandle:function(options, triggerEvent){
            if(triggerEvent===false){
                return ;
            }
            //组件初始化完成，触发事件
            this.initialized = true;
            if (triggerEvent == null || triggerEvent){
                this.trigger("initialized");
            }
            //判断是否需要马上渲染
            if (this.isRenderInInit()) {
                this.render();
            }
        },

        /**
         * 是否在初始化时就渲染
         * @return  true,则渲染，fales 则不渲染
         */
        isRenderInInit: function () {
            return !this.lazy && this.$container;
        },
        /**
         * 初始化核心处理方法，由子类实现,主要是初始化数据，不包含渲染的内容
         */
        initializeHandle:function(){

        },

        _initElAttr: function () {
            this.setHeight(this.height);  //设置视图的高度
            this.setParent(this.parent);  //设置父视图
            this.initClass();
        },
        /**
         * 视图渲染
         */
        render: function (container, triggerEvent) {
            this._initElAttr();
            //如果没有template，则不执行
            if(!this.template&&this.lazyLoadTemplate){
                //当this.template为null与启动延迟
                var that = this;
                require([ApplicationUtils.getTemplateByRoute()],function(tmpl){
                    that.template = tmpl;
                    that.doMountContent(triggerEvent);
                });

            }else{
                //当this.template为null与没有启动延迟时，不使用模板
                this.doMountContent(triggerEvent);
            }
            //全部渲染完后，注册相关的时间
            this.registerEvent();
        },
        /**
         * 安装内容
         * @param triggerEvent
         */
        mountContent:function(){
            this.$el.html(this._getTemplateContent());   //根据视图模版对界面进行渲染
        },
        /**
         * 重置该容器的宽度和高度，并触发大小调整的事件
         * @param width
         * @param height
         */
        resizeTo: function (width, height) {
            this.setWidth(width);    //设置当前容器的宽度
            this.setHeight(height);  //设置当前容器的高度

            this.trigger("resize");  //当容器布局调整后，触发该事件，使其重新计算各区域的布局
        },
        setWidth: function (width) {
            if (width == null || parseFloat(width) == 0)
                return;

            this.width = width;
            this.$el.width(this.width);
        },
        setHeight: function (height) {
            if (height == null || parseFloat(height) == 0)
                return;

            this.height = height;
            this.$el.height(height);
        },
        getWidth: function () {
            return this.$el.width();
        },
        getHeight: function () {
            return this.$el.height();
        },
        /**
         * 设置视图的高度
         * @param height
         */
        setHeight: function (height) {
            height = height || "100%";

            this.$el.css("height", height);
        },
        /**
         * 视图模版切换
         * @param template
         * @param context
         */
        swapTemplate: function (template, context) {
            if (context != null) {
                this.setTemplateContext(context);  //设置模版上下文
            }

            this.setTemplate(template);   //更改视图模版
        },
        /**
         * 获取模版的上下文信息
         * @return {*}
         */
        getTemplateContext: function () {
            return this.get("data", null);
        },
        /**
         * 设置模版的上下文信息
         * @param context
         */
        setTemplateContext: function (context) {
            if (context == null)
                return;

            if (!$.isPlainObject(context)) {
                context = {data: context};
            }

            this.set("data", context);
        },
        /**
         * 获取视图模版
         * @return {*}
         */
        getTemplate: function () {
            return this.get("template", null);
        },
        /**
         * 设置视图模版
         * @param template
         */
        setTemplate: function (template) {
            this.set("template", this._parseTemplate(template));
        },
        /**
         * 获取解析后的视图模版的内容
         * @return {*}
         * @private
         */
        _getTemplateContent: function () {
            var template = this.getTemplate();
            var content = null;
            if(template){
                content = this._parseTemplate(template);
            }
            return content;
        },
        /**
         * 解析模版，将模版中的动态内容根据上下文信息进行替换
         */
        _parseTemplate: function (template) {
            var context = this.getTemplateContext();
            if (context == null)
                return template;
            if(this.dataPre){

                return _.template(template,{variable: this.dataPre})( context);
            } else{
                return _.template(template)( context);
            }
        },
        get: function (attr, defaultValue) {
            var result = this[attr];
            if (result == null)
                result = defaultValue;
            return result;
        },
        /**
         * 设置该视图的默认值
         * @param key    属性的键或者是一个对象
         * @example（例如：{el: "#main"}）
         * @param value  允许为空
         */
        set: function (key, value) {
            this.registerSelfEvent(this);  //预先绑定事件

            if (key == null)
                return;
            var options = null;
            if ($.isPlainObject(key))
                options = key;
            else {
                options = {};
                options[key] = value;
            }

            var isEventDispatcher = typeof (this.on) == "function";
            var option = null;
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
        },
        /**
         * 绑定事件,绑定自身定义的initialize、close、show、resize等事件
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
         * 关闭该视图，即关闭窗口，将该视图从DOM模型中移除，并且移除相关事件
         *
         */
        close: function () {
            if (this.isDestroied) {
                return;
            }

            this.isDestroied = true;

            this.el = null;

            this.undelegateEvents();   //注销事件

            this.remove();   //销毁自身

            if(this.$el){
                this.$el.off().remove();   //清空内容
                this.$el = null;
            }

            //删除变量
            delete this.$el; // Delete the jQuery wrapped object variable
            delete this.el; // Delete the variable reference to this node

            this.parent = null;
            delete this.parent;

            this.trigger("destroied");   //触发关闭的事件
            this.off();  //退订该视图的所有事件
        },
        /**
         * 为了与control一直，添加destroy，实际上就是close
         */
        destroy:function(){
            this.close();
        },
        on: function (eventType, pFunction) {
            var eventType = "on" + eventType;

            //事件需要在初始化时先申明，否则没办法订购
            if (typeof(this[eventType]) == "undefined")
                return;

            if (this[eventType] == null)
                this[eventType] = new MXEvent();

            this[eventType].addEventListener(pFunction);
        },
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
        hasBound: function (eventType) {
            eventType = "on" + eventType;
            if (typeof(this[eventType]) == "undefined")
                return false;
            if (this[eventType] != null)
                return this[eventType].listeners.length > 0;

            return false;
        },
        trigger: function (eventType, args) {
            var etype = "on" + eventType;

            //不存在的话，默认代表触发成功
            if (typeof(this[etype]) == "undefined" || this[etype] == null)
                return true;

            var e = args || {};
            e.type = eventType;
            if (!e.target)
                e.target = this;
            //设置父函数，由于要转化上下文，所以如果_super与本方法名不一致，则去掉
            if(this[etype]&&this._super.name!=etype){
                this._super=null;
            }

            return this[etype].fire(e, this);
        },
        /**
         * 该方法与 this.$el.find(p_expression) 等同。
         *
         * @param expression
         * @return {*}
         */
        $: function (expression) {
            if (this.$el != null)
                return this.$el.find(expression);

            return this.getEl(expression);
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
        showErrorMsg: function (msg) {
            MessageBox.warn(msg);
        },
        showSucMsg:function(msg){
            var m = msg||"操作成功";
            MessageBox.success(m);
        }

    });

    return BaseView;
});