/**
 * @module 区域[Region]
 * @description 管理应用中可视化的区域，增强对backbone的视图管理
 * 参考http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
 * https://github.com/marionettejs/backbone.marionette/tree/v1.1.0
 *
 *
 * @author:
 * @date:
 */
define(["jquery",
    "core/js/controls/Control",
    "core/js/utils/ApplicationUtils",
    "core/js/Class","text!core/resources/tmpl/loading.html","jquery.mCustomScrollbar"
], function ($, Control, ApplicationUtil, Class, LoadingTemplate) {
    var Region = Control.extend({
        /**
         * 本身的类型
         */
        xtype:$Component.REGION,
        /**
         * 该区域对应的el元素，需要外部指定
         * {String|Element|jQuery }
         */
        el: null,

        /**
         * 扣除已经指定了width或者height的区域，剩余的空间按各区域指定的flex进行分配
         */
        flex: null,



        /**
         * {boolean}忽略初始化区域中要显示的组件的父对象，即如果组件指定了父对象，而又不想在此被覆盖，那么就通过才参数进行控制
         * 注意：为了解决早期遗留下的问题才引起该参数的 add by 2014.09.03
         */
        ignoreResetComParent: false,
        /**
         * {Object}标识区域中显示组件（视图）的类型
         */
        comXtype: null,
        /**
         * {Object}区域中要显示的组件（或视图）实例引用
         */
        comRef: null,

        /**
         * {String}区域中要显示的组件（或视图）源（类）
         */
        comSrc: null,

        /**
         * {String}根据{@link comSrc}创建组件实例时，需要的配置参数
         */
        comConf: null,
        ///**
        // * {Array}组件组的对象
        // */
        //comRefs:null,
        ///**
        // * {Array}组件的信息，需要的配置参数
        // * [{},{}]
        // */
        //comConfs:null,

        /**
         * {String}区域中要显示内容的URL
         */
        url: null,

        /**
         * {String}区域中要显示的内容
         */
        content: null,
        /**
         * 是否要手动显示，还是自动显示，
         * 默认是false自动显示，，true是手工显示，就是自己调用
         */
        manualShowed: false,

        /**
         * 如果设置为true，则当显示内容超出区域时显示滚动条。
         */
        autoScroll: null,

        //事件声明：整个组件初始化完成后的事件
        oninitialized: null,

        /**
         * 区域中的视图显示完成时的事件
         */
        onshow: null,

        /**
         * 区域中的视图被关闭后的事件
         */
        onclose: null,

        /*initialize: function (options, triggerEvent) {


            this.trigger("initialized");  //触发区域初始化完成的事件
        },*/

        /**
         * 在区域中显示视图
         * @param view {String/BaseView} 视图的URL或者是BaseView实例
         * @param options
         */
        show: function (view, options) {
            this.showProcessingHint();   //显示正在处理的进度条
            try {
                if (typeof view == "string") {
                    var url = $.trim(view || "");
                    //针对外部界面的请求，以http开头
                    if (url.toLowerCase().indexOf("http") == 0 || url.indexOf("#") == 0) {
                        this.navigate(url);   //导航到指定的页面
                        return;
                    }

                    this._showObjectWithUrl(url, options);
                    return;
                }

                this._showRegionContent(view);

            } catch (e) {
                var stack = e.stack;
                var exception = [e];
                if (stack) {
                    stack = e.stack.replace(/^[^\(]+?[\n$]/gm, '')
                        .replace(/^\s+at\s+/gm, '')
                        .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                        .split('\n<br>');
                } else {
                    stack = e.message;
                }
                exception.push(stack)
                this.showException(exception.join("\n<br>"));    //显示异常的错误信息
            }
        },
        /**
         * 将该区域的内容导航到指定的URL中
         * @param url       该区域要显示页面对应的路由或者外部URL
         * @param comConf   在渲染该区域时，给该区域指定的配置参数
         * @example 例如可以指定{onshow: function(){}}，用于在url加载完成后执行的一些动作
         */
        navigate: function (url, comConf) {
            url = url ? $.trim(url) : url;
            if (!url)
                return;


            //如果设置了组件参数，那么就将该参数先存储在区域中，待区域显示内容的时候使用 add by 2014.09.22
            if (comConf) {
                this.setComConf(comConf);
            }
            this.url = url;   //设置当前区域显示的URL值，便于如果子路由器尚未加载时，可获取到该区域显示的URL，待加载完成后再进行导航 add by 2014.09.24
            ApplicationUtil.setUrlRelatedRegion(this);  //设置URL关联的区域为当前区域，即改URL显示的区域
            ApplicationUtil.loadUrl(url);
        },
        /**
         * 直接放置内容到区域中
         * add by 2014.11.15
         * @param content
         */
        html: function (content) {
            this.ensureEl();    //先保证当前要显示区域的元素存在

            //先关闭（销毁）原来区域中的内容
            this.close();

            this._open(content);
            this._triggerShowEvent();   //触发该区域显示完成的事件
        },
        /**
         * 清空区域的内容
         * add by 2014.11.15
         */
        empty: function () {
            this.html("");
        },
        setComConf: function (comConf) {
            this.comConf = comConf;
        },
        /**
         * 根据配置信息来渲染区域中的内容
         * 1.如果是组件的一个引用，则展示组件的内容
         * 2.如果仅是组件的src路径，则根据路径展示
         * 3.如果url存在，则向导到这个url路径
         * 4.如果是一组组件，则根据这个数据的配置信息，展示内容 （暂时不支持）
         */
        mountContent: function () {
            /*//对el元素进行检查
            if (!this.el) {
                var err = new Error("创建Region对象时，必须指定el元素的值");
                err.name = "NoElError";
                throw err;
            }
            //this._super(options, triggerEvent);
            this.on("resize", function () {
                //this.resizeLayout();  //计算区域内部的布局
            });
            this.ensureEl();  //初始化$el */
            var content = this._getComContent();  //有指定内容，就先显示内容
            if (content) {
                this.childrenCount++;
                this._showRegionContent(content);
                return;
            }

            var url = this.url;   //如果该区域的内容关联的是一个URL
            if (url) {
                this.navigate(url);
                return;
            }

            //此处主要实现组件的懒加载
            var comSrc = this._getComSrc();
            if (comSrc) {
                this.childrenCount++;
                this.show(comSrc, this.comConf);  //如果有指定组件（视图）源，就先创建组件（视图）源
                return;
            }
        },



        /**
         * 获取当前区域显示内容关联的对象（此处的内容是视图）
         * @return {null}
         */
        getRelatedObject: function () {
            return this.$el ? this.$el.data("relatedObject") : null;
        },
        /**
         * 设置当前区域显示内容关联的对象（此处的内容是视图）
         * @param relatedObject  如果relatedObject为空，则将当前区域中内容（视图）的相关信息删除
         */
        setRelatedObject: function (relatedObject) {
            if (relatedObject) {
                //如果不想重新设置关联组件的父对象，就将ignoreResetComParent参数设置成true add by 2014.09.03
                if (!this.ignoreResetComParent) {
                    if (this.parent)
                        relatedObject.parent = this.parent;    //关联组件的父类直接就是视图了，忽略布局区域
                    else {
                        if (!relatedObject.parent)
                            relatedObject.parent = this;  //如果关联组件没有设置父对象，那么就将当前区域设置为其父对象
                    }
                }
                //设置区域父节点
                if(this){
                    relatedObject.regionParent = this;
                }
            }

            //该区域显示的内容关联的对象：某个BaseView类型（包括继承于BaseView）的组件
            if (this.$el){

                this.$el.data("relatedObject", relatedObject);    //绑定该DOM元素的当前组件
                //设置此region的$el为组件的容器节点
                if(relatedObject&&relatedObject.setContainer){
                    relatedObject.setContainer(this.$el);
                }
            }
        },
        /**
         * 刷新该区域的视图
         */
        refresh: function(){
            this._showRegionContent(this.getRelatedObject());
        },
        /**
         * 重新计算该区域的布局
         */
        resizeLayout: function () {
            //同时设置视图的宽度和高度（注意：此处仅重置视图的宽度和高度，组件不进行设置，否则会有问题）
            var relatedObject = this.getRelatedObject();
            if (relatedObject && relatedObject.resizeTo) {
                if (this._isView(relatedObject) || this._isContainerComponent(relatedObject))
                    relatedObject.resizeTo(this.getWidth(), this.getHeight());
            }
        },
        /**
         * 判断该组件是否是容器组件，如果是容器组件，就需要跟区域一起进行布局调整
         * @param relatedObject
         * @return {boolean}
         * @private
         */
        _isContainerComponent: function (relatedObject) {
            if (!relatedObject)
                return false;
            if (relatedObject["isTabComponent"])
                return true;
            return false;
        },
        setWidth: function (width) {
            this._super(width);    //设置区域本身的宽度
        },
        setHeight: function (height) {
            this._super(height);  //设置区域本身的高度
        },
        /**
         * 1、如果有指定内容，就先显示内容
         * 2、如果没有配置内容，但是配置了组件（视图）实例，就显示组件（视图）
         * @return {null}
         * @private
         */
        _getComContent: function () {
            var result = this.content;  //有指定内容，就先显示内容
            if (result)
                return result;
            return this.comRef;   //没有配置内容，但是配置了组件（视图）实例，就显示组件（视图）
        },
        /**
         * 1、如果有指定组件（视图）源，就直接显示
         * 2、如果没有显示指定组件（视图）源，那么就根据组件类型{@link xtype},来获取默认的组件（视图）源
         * @return {null}
         * @private
         */
        _getComSrc: function () {
            var result = this.comSrc;  //如果有指定组件（视图）源，就先创建组件（视图）源
            if (result)
                return result;
            return this._getDefaultComSrc();  //根据组件的类型来获取默认的组件（视图）源
        },
        /**
         * 根据组件的类型来获取默认的组件（视图）源
         * @return {*}
         * @private
         */
        _getDefaultComSrc: function () {
            //如果没有指定组件的类型，就直接返回空
            var xtype = this.comXtype;
            if (!xtype)
                return null;
            //如果指定了组件的类型，根据类型来获取组件（视图）源
            //xtype = xtype.toUpperCase();
            return xtype.src;
        },
        /**
         * 根据对象（包含视图或组件）的URL来显示区域的内容：实现对象的懒加载
         * @param objectUrl
         * @param options
         * @private
         */
        _showObjectWithUrl: function (objectUrl, options) {
            var that = this,
                comConf = this.comConf;
            if (comConf) {
                if (options)
                    options = $.extend(options, comConf);  //控件参数的优先级较高
                else
                    options = comConf;

                this.comConf = null;  //使用过后即清空上下文信息，避免下次使用再用到上次的结果 add by 2014.02.18
            }
            //
            // this.childrenCount++;
            // this.addParentAsynChild();
            require([objectUrl], function (Class) {
                if (Class == null) {
                    that.showException("请求的视图[" + Class + "]不存在");
                    return;
                }
                var object = null;
                options = $.extend({
                    asynRendered:true,
                    // $container:that.$el
                },options)
                //如果已经是对象了，那么就直接设置值
                if (that._isView(Class) || that.isClassInstance(Class)) {
                    object = Class;
                    object.set(options);
                } else
                    object = new Class(options);   //创建区域中要显示的对象

                that._showRegionContent(object);     //显示区域中的对象
            });
        },
        /**
         * 显示区域的内容
         * @param relatedObject
         */
        _showRegionContent: function (relatedObject) {
            this.ensureEl();    //先保证当前要显示区域的元素存在

            //先关闭（销毁）原来区域中的内容
            this.close();
            this.comRef = relatedObject;
            var content = this._getRegionContent(relatedObject);      //渲染区域中的内容（即设置content的内容）
            //如果没有挂着的容器的时候或者不是我们组件对象，才需要调用_open函数，加载内容
            if(!relatedObject.getContainer||!relatedObject.getContainer()){
                this._open(content);                //打开（显示）区域中的内容
            }

            this._triggerShowEvent();   //触发该区域显示完成的事件
        },
        /**
         * 显示（打开）该区域的内容
         */
        _open: function (content) {
            this.$el.empty().append(content);
            if (this.manualShowed) {
                this.$el.fadeIn("slow");
            }
            this.setAutoScroll(this.autoScroll);   //设置当显示内容超出区域时是否要显示滚动条
        },
        /**
         * 触发该区域显示完成的事件
         * @private
         */
        _triggerShowEvent: function () {

            this.trigger("show");       //该区域显示完成后，触发显示的事件

            var relatedObject = this.getRelatedObject();
            if (relatedObject)
                relatedObject.trigger("show");
        },
        /**
         * 获取该区域显示的内容(默认显示的内容是视图[继承于Backbone.View])
         *
         * @private
         */
        _getRegionContent: function (relatedObject) {
            if (this.isComponent(relatedObject))
                return this._getComponentContent(relatedObject);

            var view = relatedObject;
            if (!this._isView(view))
                return relatedObject;

            this.setRelatedObject(view);

            //view.setHeight(this.$el.height());  //将区域元素的高度和宽度设置到视图中
            //view.setWidth(this.$el.width());
            view.render();  //视图渲染
            if(view&&view.getSelfEl){
                return view.getSelfEl();
            }else{
                return view.$el;
            }
        },
        /**
         * 判断当前区域显示的是否是视图
         * @param relatedObject
         * @private
         */
        _isView: function (relatedObject) {
            if (!relatedObject)
                return false;
            var View = Backbone ? Backbone.View : null;
            return (View != null && relatedObject instanceof View);
        },
        /**
         * 如果该区域的内容是组件，那么就渲染组件的内容
         * @param component
         * @return {*}
         * @private
         * @override
         */
        _getComponentContent: function (component) {
            if (!this.isComponent(component) || !component.getSelfEl) {
                return component;
            }

            //如果是容器组件，就设置其宽高
            if (this._isContainerComponent(component)) {
                component.setHeight(this.$el.height());  //将区域元素的高度和宽度设置到视图中
                component.setWidth(this.$el.width());
            }
            this.setRelatedObject(component);

            if (this.isControl(component)) {
                component.render();
            }


            return component.getSelfEl();
        },
        /**
         * 如果设置为true，则当显示内容超出区域时显示滚动条。
         * @param autoScroll
         */
        setAutoScroll: function (autoScroll) {
           /* if (autoScroll == null)
                return;

            this.autoScroll = autoScroll;
            if (autoScroll)
                this.$el.css("overflow", "auto");*/
            if (this.autoScroll) {
                this.$el.mCustomScrollbar({
                    theme: "minimal-dark",
                    autoExpandScrollbar: true,
                    advanced: {autoExpandHorizontalScroll: true}
                });
            }
        },
        /**
         * 获取区域组件的引用
         * @returns {null}
         */
        getComRef:function(){
            return this.comRef;
        },
        /**
         * 可以覆写该方法，来决定当前区域管理的DOM元素，返回的是一个jQuery选择器对象
         * @param selector
         * @return {*}
         */
        getEl: function (selector) {
            return this._super(selector);
        },
        /**
         * 关闭（销毁）当前区域内容
         */
        close: function () {
            //$.window.removeAllErrorTipOnEl();   //移除所有跟随在元素后面的提示信息（因为这些提示信息不会自动关闭，必须由程序进行控制销毁），而此处正是页面切换的一个统一的入口 add by 2014.11.15

            this._closeRelatedObject();       //关闭该区域的关联的对象

            this.comRef = null;
            this.content = null;

            this.closeProcessingHint();   //关闭处理的进度条
            if(this.$el){
                this.$el.empty();     //清空该区域的内容
            }
            this.trigger("close");  //触发区域视图关闭事件

        },
        /**
         * 关闭（销毁）该区域关联的对象
         * @private
         */
        _closeRelatedObject: function () {
            var relatedObject = this.getRelatedObject();
            //如果当前区域显示的内容没有关联的对象，就直接返回
            if (!relatedObject)
                return;

            //销毁关联对象：依次查找关联对象是否有close、destroy、remove方法，先找到先执行
            if (!relatedObject.isClosed) {
                if (relatedObject.close) {
                    relatedObject.close();
                } else {
                    if (relatedObject.destroy) {
                        relatedObject.destroy();
                    } else {
                        if (relatedObject.remove)
                            relatedObject.remove();
                    }
                }
            }

            relatedObject = null;           //将关联对象设置为空 add by 2014.10.29
            this.setRelatedObject(null);   //删除关联对象，并且解除该关联对象与当前区域的绑定
        },
        /**
         * 在该区域中显示异常视图
         * @param message
         */
        showException: function (message) {
            this.show("core/js/view/exception", {message: message});    //显示异常的错误信息
        },
        /**
         * 在该区域中显示提示信息
         * @param message
         */
        showTip: function (message) {
            this.show("core/js/view/tip", {message: message});    //显示提示信息
        },
        /**
         * 在当前区域内显示正在处理的进度条
         */
        showProcessingHint: function () {
            var relatedObject = this.getRelatedObject();
            if (relatedObject && relatedObject.$el) {
                relatedObject.$el.hide();
            }

            this.ensureEl();
            if (!this.$el || this.$el.length === 0 || this._loadingEl)
                return;
            this._loadingEl = $(LoadingTemplate);
            this.$el.append(this._loadingEl);
        },
        /**
         * 在当前区域内关闭正在处理的进度条
         */
        closeProcessingHint: function () {
            if (this._loadingEl) {
                this._loadingEl.remove();
                this._loadingEl = null;
            }
        },
        /**
         * 通过关闭（销毁）已经存在的视图，并且清理$el来重置该区域
         * 下次再重新渲染视图的时候，会根据区域中的el元素来查询查找对应的DOM元素
         */
        reset: function () {
            this.close();
            delete this.$el;
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this.close();
            this.comRef = null;
            this.trigger("destroied");   //触发销毁事件
            this.off();
            this._super();
        }
    });

    // Build an instance of a region by passing in a configuration object
    // and a default region type to use if none is specified in the config.
    //
    // The config object should either be a string as a jQuery DOM selector,
    // a Region type directly, or an object literal that specifies both
    // a selector and regionType:
    //
    // ```js
    // {
    //   el: "#foo",
    //   regionType: MyCustomRegion
    // }
    // ```
    //
    Region.buildRegion = function (regionConfig, defaultRegionType) {
        if (regionConfig instanceof Region)
            return regionConfig;

        var regionIsString = (typeof regionConfig === "string");
        var regionSelectorIsString = regionConfig.el;
        var regionTypeIsUndefined = (typeof regionConfig.regionType === "undefined");
        var regionIsType = (typeof regionConfig === "function");

        if (!regionIsType && !regionIsString && !regionSelectorIsString) {
            throw new Error("创建的Region必须是一种Region类型，或者是DOM元素中的一个对象或者字符串");
        }

        var selector, RegionType;

        // get the selector for the region

        if (regionIsString) {
            selector = regionConfig;
        }

        if (regionConfig.el) {
            selector = regionConfig.el;
        }

        // get the type for the region

        if (regionIsType) {
            RegionType = regionConfig;
        }

        if (!regionIsType && regionTypeIsUndefined) {
            RegionType = defaultRegionType;
        }

        if (regionConfig.regionType) {
            RegionType = regionConfig.regionType;
        }

        RegionType = RegionType || Region;
        var isVisible = regionConfig.visible == null ? true : regionConfig.visible;
        var options = {
            el: selector,
            id:regionConfig.id,
            width: regionConfig.width,
            height: regionConfig.height,
            draggable:regionConfig.draggable,
            draggableConf:regionConfig.draggableConf,
            top: regionConfig.top,
            left:regionConfig.left,
            padding:regionConfig.padding,
            flex: regionConfig.flex,
            parent: regionConfig.parent,
            className: regionConfig.className,
            visible: isVisible,
            disabled:regionConfig.disabled,
            textAlign:regionConfig.textAlign,
            ignoreResetComParent: regionConfig.ignoreResetComParent,
            autoScroll: regionConfig.autoScroll,                          //如果设置为true，则当显示内容超出区域时显示滚动条，默认值为false。
            oninitialized: regionConfig.oninitialized,
            onshow: regionConfig.onshow,
            //配置区域中显示的内容
            comXtype: regionConfig.comXtype,
            comRef: regionConfig.comRef,
            comSrc: regionConfig.comSrc,
            comConf: regionConfig.comConf,
            content: regionConfig.content,
            url: regionConfig.url
        };

        //覆写区域的刷新方法，目前模型解析中有用 add by 2014.02.11
        var refresh = regionConfig.refresh;
        if (typeof refresh == "function")
            options["refresh"] = refresh;

        // build the region instance
        var region = new RegionType(options);

        return region;
    }

    /**
     * 区域显示内容的类型：content-内容，component-组件（默认）
     * @type {{CONTENT: string, COMPONENT: string}}
     */
    Region.Type = {
        CONTENT: "content",
        COMPONENT: "component"
    }
    //Region.XType = $Xtype;
    //Region.DefaultComSrc = $XtypeSrc;

    return Region;
});