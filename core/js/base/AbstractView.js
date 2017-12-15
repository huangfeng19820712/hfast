/**
 * @module 显示组件的抽象类[ViewAbstract]
 * @description 所有要显示的组件，都要继承此类，统一管理样式的基类
 * @author:   * @date: 2015/12/29
 */
define(["core/js/utils/Utils",
        "core/js/utils/ApplicationUtils",
        "core/js/base/CommonView"],
    function (Utils, ApplicationUtils,CommonView) {
        return _.extend(CommonView,{
            wrapCom:null,
            /**
             * 有三中显示模式，编辑模式、开发模式、正常模式
             */
            viewModel: null,
            /**
             * 挂载模式，
             */
            mountModel: $cons.mount.Model.append,
            /**
             * 挂载到容器的处理函数
             */
            mountHandler: null,
            /**
             * 引用外部插件的对象
             */
            plugin: null,
            /**
             * 定义是否可以拖动,boolean值
             */
            draggable: null,
            /**
             * 拖动的配置，此配置引用jquery的draggable的配置项
             */
            draggableConf: null,
            /**
             * 是否懒加载，
             * 1.如果是true，则在初始化的时候没有马上渲染
             * 2.如果是false（默认值），则初始化时就马上渲染
             */
            lazy: false,
            /**
             * 添加控件到容器的jquery对象
             */
            $container: null,

            /*==============================样式值方法========================================*/
            /**
             * 主题
             */
            theme: null,
            /**
             * 主题的css，如果有，已此为准，如果没有则以theme为准
             */
            themeClass: null,
            /**
             * 圆角的CSS样式
             */
            roundedClass: null,
            /**
             * 样式
             */
            className: null,
            /**
             * 对应dom中的class的真实值，如果此属性有值，则className、theme、themeClass 、roundedClass
             * 全部无效
             */
            realClass: null,
            /**
             * dom中role的属性值
             */
            role: null,
            /**
             * text-align
             * @param options
             */
            textAlign: null,
            /**
             * 浮动，左浮动，或者是右浮动,$cons.float
             */
            float: null,

            /**
             * 如果设置为true，则当显示内容超出区域时显示滚动条。
             */
            autoScroll: null,
            /**
             * 获取控件的内部宽度(不包含内边距padding和边框border)。可以是数字（如 500）、字符串（如“500px”或“50%”）。请使用 {@link setWidth} 方法设置该字段的值。
             */
            width: null,
            /**
             * 获取控件的内部高度(不包含内边距padding和边框border)。可以是数字（如 500）、字符串（如“500px”或“50%”）。请使用 {@link setHeight} 方法设置该字段的值。
             */
            height: null,


            /**
             * 获取控件的显示样式值。如“none”，表示隐藏控件；“block”表示强制作为块对象呈递。请使用 {@link setDisplay}
             * 方法设置该字段的值。
             */
            display: null,

            /**
             * 获取控件位置样式值。如“static”，表示无特殊定位，对象遵循 HTML 定位规则。请使用 {@link setPosition}
             * 方法设置该字段的值。
             * <p>
             * 该字段的可选值包括:
             * <ul>
             * <li>static</li>
             * <li>relative</li>
             * <li>absolute</li>
             * <li>fixed</li>
             * </ul>
             * </p>
             */
            position: null,
            /**
             * 外边距
             */
            margin: null,
            /**
             * 获取控件的左边界与父容器左边界的像素距离。请使用 {@link setLeft} 方法设置该字段的值。
             */
            left: null,

            /**
             * 获取控件的右边界与父容器右边界的像素距离。请使用 {@link setRight} 方法设置该字段的值。
             */
            right: null,

            /**
             * 获取控件的上边界与父容器上边界的像素距离。请使用 {@link setTop} 方法设置该字段的值。
             */
            top: null,

            /**
             * 获取控件的下边界与父容器下边界的像素距离。请使用 {@link setBottom} 方法设置该字段的值。
             */
            bottom: null,

            /**
             * 获取控件的外部宽度（包含内边距padding和边框border）
             */
            outerWidth: null,
            /**
             * 获取控件的外部高度（包含内边距padding和边框border）
             */
            outerHeight: null,
            /**
             * 获取控件的边框样式。如“1px solid red”，表示边框的样式为 1 像素红色的实线。请使用 {@link setBorder}
             * 方法设置该字段的值。
             */
            border: null,
            /**
             * 获取控件的内边距。如“4px”表示上下左右的内边距均为 4 像素； “4px 2px 3px 1px”则表示上边距为 4 像素，右边距为 2
             * 像素，下边距为 3 像素，左边距为 1 像素。请使用 {@link setPadding} 方法设置该字段的值。
             */
            padding: null,

            /**
             * 获取一个 Boolean 值，表示控件是否可见。如果该值为 true，则表示控件可见；反之则不可见。请使用 {@link setVisible}
             * 方法设置该字段的值。
             *
             * @default true
             */
            visible: true,
            zIndex: null,
            /**
             * 设置绑定数据配置
             * 例如：bind:{data:}
             */
            bind:null,
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
             * 初始化元素的属性
             */
            _initElAttr: function () {
                this.setWidth(this.width);
                this.setHeight(this.height);
                this.initElId();
                this.setParent(this.parent);             //设置该控件的父控件
                this.$el.data("control", this);
                this.setDisplay(this.display);
                this.setPosition(this.position);
                this.setLeft(this.left);
                this.setRight(this.right);
                this.setTop(this.top);
                this.setBottom(this.bottom);
                this.setOuterWidth(this.outerWidth);
                this.setOuterHeight(this.outerHeight);
                this.setWidth(this.width);
                this.setHeight(this.height);
                this.setBorder(this.border);
                this.setPadding(this.padding);
                this.setRole(this.role);
                if (this.zIndex) {
                    this.setZIndex(this.zIndex);
                }
                this.initClass();
                if (this.margin > 0) {
                    this.$el.css({
                        top: this.margin,
                        bottom: this.margin,
                        left: this.margin,
                        right: this.margin
                    });
                }
            },
            /**
             * 出事dom的class
             */
            initClass: function () {
                if (this.realClass != null) {
                    this.setRealClass(this.realClass);
                } else {
                    var xtypeName = this.themeClassPre;
                    if (this.themeClassPre==null&&this.xtype != null) {
                        this.$el.addClass($cons.className.view);
                        /**
                         * 自动添加标识组件的className
                         */
                        this.$el.addClass(this.xtype.name.toLowerCase());
                        xtypeName =  this.xtype.name;
                    }
                    this.setClassName(this.className);
                    this.setRoundedClass(this.roundedClass);
                    //主题，默认是this.xtype.name.toLowerCase()+this.theme
                    this.setTheme(this.themeClass, this.theme,xtypeName);
                }

                if (this.textAlign) {
                    this.$el.addClass(this.textAlign);
                }
                if (this.float) {
                    this.$el.addClass(this.float);
                }
            },
            /**
             * 设置主题
             * @param theme
             */
            setTheme: function (themeClass, theme, xtypeName) {
                var themeClassNew = themeClass;
                if (themeClassNew == null) {
                    if (theme == null || xtypeName == null) {
                        return;
                    }
                    var themeClassNew = (xtypeName?xtypeName.toLowerCase():"") + "-" + theme;
                }
                if (themeClassNew != null) {
                    this.$el.addClass(themeClassNew);
                }
            },
            /**
             * 初始化组件的id，避免没有输入id的情况
             */
            initId: function () {
                if (this.id == null) {
                    //xtype是否存在
                    if (this.xtype != null) {
                        this.id = $.createId(this.xtype.name);
                    } else {
                        this.id = $.createId();
                    }
                }
                //后续还需要观察放此处是否合适
                ApplicationUtils.addComponent(this.id, this);
            },
            /**
             * 初始化El的id，避免重复，且方便识别是哪个组件
             * */
            initElId: function () {
                if (this.$el) {
                    if (!this.$el.attr("id")) {
                        this.$el.attr("id", this.id);
                    }
                } else {
                    //console.info(">>>>>");
                }
            },

            setRole: function (role) {
                if (role == null) {
                    return;
                }
                this.$el.attr("role", role);
            },
            /**
             * 是否在初始化时就渲染
             * @return  true,则渲染，fales 则不渲染
             */
            isRenderInInit: function () {
                return !this.lazy && this.$container;
            },
            /**
             * 把el挂载到容器
             * @param container
             * @param triggerEvent
             */
            render: function (container, triggerEvent) {
                triggerEvent = triggerEvent == null ? true : triggerEvent;  //默认是触发渲染完成前后的事件

                //触发准备渲染之前的事件，如果返回false，则不执行后续的操作
                if (triggerEvent && !this.trigger("rendering"))
                    return;
                //挂载
                this.mountEl(container);
                if (this.isControl) { //Control的子类
                    this.doMountContent(triggerEvent);

                } else {
                    //BaseView的子类
                    this._super(container, false);
                    // this.triggerRender(triggerEvent);
                }
                //全部渲染完后，注册相关的时间
                this.registerEvent();

            },
            /**
             * 挂载上本对象的dom节点
             */
            mountEl: function (container) {
                var $container = this.$container;
                if ($container == null) {
                    if (container == null || container == "body" || container == document.body)
                        $container = $(document.body);
                    else {
                        //如果container本身已经是jquery对象了，那么就直接赋值
                        if (_.isObject(container) && container.length)
                            $container = container;
                        else
                            $container = this.getEl(container);
                    };
                    this.$container = container;
                }
                if (this.mountHandler) {
                    this.mountHandler();
                } else {
                    var $el = this.$el;
                    this._mountElHandle($el,$container);
                    if(this.wrapCom!=null){
                        this.wrapCom.wrap($el);
                    }
                    /*if (this.viewModel == $cons.viewModel.EDIT) {
                        var that = this;
                        //require($Component.EDITWRAP.src);
                        /!*require([$Component.EDITWRAP.src], function (EditWrap) {
                            var editWrap = new EditWrap({
                                $container:$container
                            });
                            editWrap.render();
                            editWrap.wrap(that.$el);
                            $el = editWrap.$el;
                            that._mountElHandle($el,$container);
                        });*!/
                    } else {
                        this._mountElHandle($el,$container);
                    }*/
                }
            },
            _mountElHandle: function ($el,$container) {
                if (this.mountModel == $cons.mount.Model.append) {
                    $container.append($el);   //添加到指定的位置

                } else if (this.mountModel == $cons.mount.Model.prepend) {
                    $container.prepend($el);   //添加到指定的位置
                }
            },
            /*==============================样式值方法========================================*/
            /**
             * 设置 {@link width} 字段的值。
             *
             * @param width
             *                  控件的高度,可以是数字（如 500）、字符串（如“500px”或“50%”）.
             */
            setWidth: function (width) {
                if (width == null || !this.$el)
                    return;

                this.width = width;
                this.$el.css("width", this.width);
            },
            getWidth: function () {
                return (this.width || this.$el.width()) - 2 * this.margin;
            },
            /**
             * 设置 {@link height} 字段的值。
             *
             * @param height
             *                  控件的高度，可以是数字（如 100），也可以是字符串（如 “100%”）。
             */
            setHeight: function (height) {
                if (height == null || !this.$el)
                    return;

                this.height = height;
                this.$el.css("height", this.height);
            },
            getHeight: function () {
                return (this.height || this.$el.height()) - 2 * this.margin;
            },
            /**
             * 设置z-index的值
             */
            setZIndex: function (zIndexValue) {
                this.zIndex = zIndexValue;
                this.$el.css("z-index", zIndexValue);
            },
            /**
             * 获取z-index的值
             * @returns {null}
             */
            getZIndex: function () {
                return this.zIndex;
            },
            /**
             * 设置 {@link display} 字段的值。
             *
             * @param display
             *                  css 样式的 display 属性。
             */
            setDisplay: function (display) {
                if (display == null)
                    return;

                this.display = display;
                this.$el.css("display", this.display);
            },
            /**
             * 设置dom的class
             * @param realClass
             */
            setRealClass: function (realClass) {
                if (realClass == null) {
                    return;
                }
                this.$el.removeClass().addClass(realClass);
            },

            /**
             * 设置 {@link className} 字段的值。
             *
             * @param className
             *                   一个字符串，一个或多个空格分隔的class名。
             */
            setClassName: function (className) {
                if (className == null)
                    return;

                this.className = className;
                this.$el.addClass($cons.className.container);
                this.$el.addClass(className);
            },
            setRoundedClass: function (roundedClass) {
                if (roundedClass == null) {
                    return;
                }
                this.$el.addClass(roundedClass);
            },
            /**
             * 设置 {@link position} 字段的值。
             *
             * @param position
             *                   一个字符串，表示 css 样式的 position 属性。
             */
            setPosition: function (position) {
                if (position == null)
                    return;

                this.position = position;
                this.$el.css("position", this.position);
            },
            /**
             * 设置控件的内边距。
             *
             * @param padding
             *                  一个字符串，表示css样式的 padding 属性。
             */
            setPadding: function (padding) {
                if (padding == null)
                    return;

                this.padding = padding;
                this.$el.css("padding", this.padding);
            },
            /**
             * 设置控件的边框样式。
             *
             * @param border
             *            一个字符串，表示css样式的 border 属性。
             */
            setBorder: function (border) {
                if (border == null)
                    return;

                this.border = border;
                this.$el.css("border", this.border);
            },
            /**
             * 设置 {@link left} 字段的值。
             *
             * @param left
             *              控件的左边界与父容器左边界的像素距离，可以是数字（如 50），也可以是字符串（如 50%）。
             */
            setLeft: function (left) {
                if (left == null)
                    return;

                this.left = left;
                this.$el.css("left", this.left);
            },
            /**
             * 设置 {@link right} 字段的值。
             *
             * @param right
             *                控件的右边界与父容器右边界的像素距离，可以是数字（如 50），也可以是字符串（如 50%）。
             */
            setRight: function (right) {
                if (right == null)
                    return;

                this.right = right;
                this.$el.css("right", this.right);
            },
            /**
             * 设置 {@link top} 字段的值。
             *
             * @param top
             *              控件的上边界与父容器上边界的像素距离，可以是数字（如 50），也可以是字符串（如 50%）。
             */
            setTop: function (top) {
                if (top == null)
                    return;

                this.top = top;
                this.$el.css("top", this.top);
            },
            /**
             * 设置 {@link bottom} 字段的值。
             *
             * @param bottom
             *                  控件的下边界与父容器下边界的像素距离，可以是数字（如 50），也可以是字符串（如 50%）。
             */
            setBottom: function (bottom) {
                if (bottom == null)
                    return;

                this.bottom = bottom;
                this.$el.css("bottom", this.bottom);
            },
            /**
             * 设置元素的外部宽度（该方法目前仅用于布局,外部宽度=内部宽度+paddingLeft+paddingRight+borderLeft+borderRight）
             * 注意：这里如果值在css样式文件中，在该元素尚未添加到DOM模型时，会取不到值
             * @param outerWidth
             */
            setOuterWidth: function (outerWidth) {
                if (outerWidth == null || outerWidth == this.outerWidth || !this.$el)
                    return;
                var $el = this.$el,
                    innerWidth = this.outerWidth = outerWidth;
                var paddingLeft = $el.css("padding-left");
                if (paddingLeft) {
                    paddingLeft = parseInt(paddingLeft, 10) || 0;
                    innerWidth -= paddingLeft;
                }
                var paddingRight = $el.css("padding-right");
                if (paddingRight) {
                    paddingRight = parseInt(paddingRight, 10) || 0;
                    innerWidth -= paddingRight;
                }
                //如果border的宽度计算不出来，那么就采用$el.outerWidth()-$el.innerWidth()
                innerWidth -= ($el.outerWidth() - $el.innerWidth());   //扣除了边框的宽度
                this.setWidth(innerWidth);
            },
            /**
             * 这里不取变量的值，就是担心直接设置内部高度或者增加样式，采取这种方式是最保险的
             * 注意：这里如果值在css样式文件中，在该元素尚未添加到DOM模型时，会取不到值
             * @return {*}
             */
            getOuterWidth: function () {
                var $el = this.$el;
                if ($el == null || $el.length == 0) {
                    var result = this.getWidth() || "";
                    return parseFloat(result) || 0;
                }

                return this.$el.outerWidth();
            },
            getOuterHeight: function () {
                var $el = this.$el;
                if ($el == null || $el.length == 0) {
                    var result = this.getHeight() || "";
                    return parseFloat(result) || 0
                }

                return this.$el.outerHeight();
            },

            /**
             * 设置元素的外部高度（该方法目前仅用于布局,外部高度=内部高度+paddingTop+paddingBottom+borderTop+borderBottom）
             * @param outerHeight
             */
            setOuterHeight: function (outerHeight) {
                if (outerHeight == null || outerHeight == this.outerHeight || !this.$el)
                    return;

                var $el = this.$el,
                    innerHeight = this.outerHeight = outerHeight;
                var paddingTop = $el.css("padding-top");
                if (paddingTop) {
                    paddingTop = parseInt(paddingTop, 10) || 0;
                    innerHeight -= paddingTop;
                }
                var paddingBottom = $el.css("padding-bottom");
                if (paddingBottom) {
                    paddingBottom = parseInt(paddingBottom, 10) || 0;
                    innerHeight -= paddingBottom;
                }
                //如果border的高度计算不出来，那么就采用$el.outerHeight()-$el.innerHeight()
                innerHeight -= ($el.outerHeight() - $el.innerHeight());   //扣除了边框的高度
                this.setHeight(innerHeight);
            },
            isVisible: function () {
                return this.visible;
            },
            /**
             * 设置 {@link visible} 字段的值。
             *
             * @param visible
             *                  一个 Boolean 值，表示控件是否可见。
             */
            setVisible: function (visible) {
                if (visible == null)
                    return;

                this.visible = visible;
                var display = visible ? "" : "none";
                this.$el.css("display", display);     //该元素设置成可见或不可见
            },
            /**
             * 显示控件，设置控件可见。
             */
            show: function () {
                this.setVisible(true);
            },
            /**
             * 隐藏控件，设置控件不可见。
             */
            hide: function () {
                this.setVisible(false);
            },
            /**
             * 设置容器的jquery对象
             * @param $el
             */
            setContainer:function($el){
                this.$container  = $el;
                if(this.getWrapCom()){
                    this.getWrapCom().setContainer($el);
                }
            },
            getContainer:function(){
                return this.$container;
            },
            /**
             * 获取组件本身jquery对象
             * @returns {*}
             */
            getSelfEl:function(){
                if(this.getWrapCom()&&this.getWrapCom().isWraped()){
                    return this.getWrapCom().$el;
                }else{
                    return this.$el;
                }

            },
            getWrapCom:function(){
                return this.wrapCom;
            },
            setWrapCom:function(wrapCom){
                this.wrapCom = wrapCom;
            }
        });


    });

