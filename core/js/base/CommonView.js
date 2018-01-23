/**
 * @module AbstractView与BaseView中共有的属性与方法
 * @author:   * @date: 2015/12/29
 */
define(["core/js/utils/Utils",
        "core/js/utils/ApplicationUtils",
        "core/js/FrameworkConfAccessor"],
    function (Utils, ApplicationUtils,FrameworkConfAccessor) {

        return {
            /**
             * 是否已经渲染
             */
            rendered:false,
            /**
             * 统计初始化的子组件个数
             */
            // childInitializedCount:0,
            /**
             * 是否是异步渲染，false不是，true：是
             */
            asynRendered:false,
            /**
             * 现有异步的子组件个数，然后在异步实例化，因为js是单线程的
             */
            childrenCount:0,
            /**
             *  异步加载的子组件，如Layout子类，需要通过require在家js然后才能渲染
             */
            asynChildIds:null,
            /**
             * 统计异步子组件是否都已经渲染完成
             */
            asynChildRenderCount:0,
            childRenderCount:0,
            /**
             * 子组件id素组
             */
            childIds:null,
            /**
             * 获取控件所属的父对象，但是不包括region对象。
             */
            parent: null,
            /**
             *  区域父节点，组件包含了区域，区域里面包含了子组件
             */
            regionParent:null,
            /**
             * 主题
             */
            theme: null,
            /**
             * 主题的css，如果有，已此为准，如果没有则以theme为准
             */
            themeClass: null,
            /**
             * 最后添加到dom中的主题类
             */
            _realThemeClass:null,
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
            /***********************AbstractView与BaseView一样***********************************/
            /**
             * 挂摘内容是很重要的，所以添加一个
             */
            doMountContent:function(triggerEvent){
                if (this.mountContent) {
                    this.mountContent();
                }
                this.afterMountContent(triggerEvent);
            },
            afterMountContent:function(triggerEvent){
                this.initDraggable();
                //当没有子组件的时候，才触发渲染事件
                if(this.childrenCount==0){
                    //子组件都渲染完后，才触发本组件渲染完成事件
                    this.triggerRender(triggerEvent);
                }
            },
            /**
             * 出事dom的class
             */
            initClass: function () {
                if (this.realClass != null) {
                    this.setRealClass(this.realClass);
                } else {
                    var themeClassPre = this.getThemeClassPre();
                    var theme = this.getTheme();
                    //所有的组件都要添加hfast-view类
                    if (this.xtype != null) {
                        this.$el.addClass($cons.className.view);
                        /**
                         * 自动添加标识组件的className
                         */
                        this.$el.addClass(this.xtype.name.toLowerCase());
                    }
                    this.setClassName(this.className);
                    this.setRoundedClass(this.roundedClass);
                    //主题，默认是this.xtype.name.toLowerCase()+this.theme
                    this.setTheme(this.themeClass, theme,themeClassPre);
                }

                if (this.textAlign) {
                    this.$el.addClass(this.textAlign);
                }
                if (this.float) {
                    this.$el.addClass(this.float);
                }
            },
            /**
             * 获取主题的前缀名称
             * @returns {string}
             */
            getThemeClassPre:function(){
                var xtypeName = this.themeClassPre;
                if (this.themeClassPre==null&&this.xtype != null) {
                    xtypeName =  this.xtype.name;
                }
                return  xtypeName;
            },

            /**
             * 获取主题
             * @returns {null|*}
             */
            getTheme:function(){
                return this.theme||FrameworkConfAccessor.getProjectTheme();
            },
            /**
             * 设置主题
             * @param theme
             */
            setTheme: function (themeClass, theme, themeClassPre) {
                var themeClassNew = themeClass;
                if (themeClassNew == null) {
                    if (theme == null || themeClassPre == null) {
                        return;
                    }
                    var themeClassNew = (themeClassPre?themeClassPre.toLowerCase():"") + "-" + theme;
                }
                if (themeClassNew != null) {
                    this._realThemeClass = themeClassNew;
                    this.$el.addClass(themeClassNew);
                }
            },
            /**
             * 替换掉现有的主题
             * @param   theme   系统提供的主题对象
             */
            toggleTheme:function(theme){
                //删除主题
                this.$el.removeClass(this._realThemeClass);
                var themeClassPre = this.getThemeClassPre();
                console.info(theme+">>"+themeClassPre);
                this.setTheme(this.themeClass,theme,themeClassPre);
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
            initDraggable:function(){
                //完全渲染完后,给组件添加拖拽功能
                if (this.draggable) {
                    var conf = {
                        cursor: "move",
                        /*cursorAt: { top: -12, left: -20 },
                         helper: function( event ) {
                         return $( "<div class='ui-widget-header'>I'm a custom helper</div>" );
                         }*/
                    };
                    if (this.draggableConf) {
                        conf = this.draggableConf;
                    }
                    this.$el.draggable(conf);
                }
            },
            /**
             * 组件完全渲染后，触发此时间
             * @param triggerEvent
             */
            triggerRender:function(triggerEvent){
                this.rendered = true;
                //触发渲染完成后的事件
                if (triggerEvent == null || triggerEvent) {
                    this.trigger("render");   //触发渲染完成后的事件
                }
                if(this.getNaturalFather()&&this.getNaturalFather().childRenderDone){
                    //如果是异步渲染，则通知父节点，他的字节点已经渲染好
                    this.getNaturalFather().childRenderDone(this.id);
                }
            },
            /**
             * 子节点调用父节点的功能，通知已渲染完成
             * @param id
             */
            childRenderDone:function(id){
                /*if(this.xtype.name=="Panel"){
                    console.info(this.childRenderCount);
                }*/


                this.childRenderCount++;
                // console.info("组件id："+this.id+"有子组件:"+this.childrenCount+";子组件id："+id+"完成渲染；已渲染："+this.childRenderCount);
                if(!this.rendered&&this.childrenCount==this.childRenderCount){
                    //子组件都渲染完后，才触发本组件渲染完成事件
                    this.triggerRender();
                }
            },
            addParentAsynChild:function(id){
                if(this.parent&&this.parent.addAsynChildId){
                    // this.parent.asynChildrenCount++;
                }
            },
            addAsynChildId:function(id){
                if(this.asynChildIds==null){
                    this.asynChildIds = [];
                }
                this.asynChildIds.push(id);
            },
            /**
             * 添加子组件的id
             * @param id
             */
            addChildId:function(id){
                if(this.childIds==null){
                    this.childIds = [];
                }
                this.childIds.push(id);
            },
            /**
             * 是否已经渲染过，默认是false，渲染后变成true
             * @returns {boolean}
             */
            isRendered:function(){
                return this.rendered;
            },
            /**
             * 设置控件所属的父对象。
             * @param parent
             */
            setParent: function (parent) {
                this.set("parent", parent);
                if(parent&&parent.addChildId){
                    parent.addChildId(this.id);
                    // parent.childInitializedCount++;
                }
            },
            /**
             * 返回最接近本元素的xtype
             * @param xtype
             */
            getParent: function (xtype) {
                if (xtype) {
                    var parent = this.getParent();
                    while (parent) {
                        if (parent.xtype === xtype) {
                            return parent;
                        }
                        parent = parent.getParent();
                    }
                } else {
                    return this.parent;
                }
            },
            /**
             * 获取亲生父组件，有可能是region
             */
            getNaturalFather:function(){
                if(this.regionParent){
                    return this.regionParent;
                }else {
                    return this.parent;
                }

            },
            /**
             * 从新刷新内容
             */
            refresh:function(){
                this.$el.empty();
                this.render();
            },

            /**
             * 注册事件
             */
            registerEvent: function () {

            },
            /**
             * 取消注册事件，在销毁 的时候使用
             */
            unregisterEvent: function () {

            },

            /**
             * 销毁Link，css样式
             * @param url   {String}
             */
            destroyLink:function(url){
                $("link[href='"+url+"']").remove();
            },
            /**
             * 销毁link集合
             * @param links  {Array}
             */
            destroyLinks:function(links){
                var that = this;
                _.each(links,function(item,idx,list){
                    that.destroyLink(item);
                });
            }
            /***********************AbstractView与BaseView一样 END***********************************/
        };


    });

