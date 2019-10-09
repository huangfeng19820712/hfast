/**
 * @module AbstractView与BaseView中共有的属性与方法
 * @author:   * @date: 2015/12/29
 */
define(["core/js/utils/Utils",
        "core/js/utils/ApplicationUtils",
        "core/js/FrameworkConfAccessor"],
    function (Utils, ApplicationUtils,FrameworkConfAccessor) {
        var CommonView = _.extend({},{
            /**
             * 是否已经渲染
             */
            rendered:false,
            /**
             * 是否完成挂载
             */
            mounted:false,
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
             * 大小的样式
             */
            sizeClass:null,
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
                this.mounted =true;

                //console.info("组件ID："+this.getId()+"完成渲染！");

                if(this.isTriggerRender()){
                    //子组件都渲染完后，才触发本组件渲染完成事件
                    this.triggerRender(triggerEvent);
                }

            },
            /**
             * 初始化dom的class
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
                    this.setSizeClass (this.sizeClass);
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
                //console.info(theme+">>"+themeClassPre);
                this.setTheme(this.themeClass,theme,themeClassPre);
                this.theme = theme
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

            setSizeClass:function(className){
                if (className == null)
                    return;
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
             * 组件完全渲染后，触发此事件
             * @param triggerEvent
             */
            triggerRender:function(triggerEvent){

                this.rendered = true;
                //触发渲染完成后的事件
                if (triggerEvent == null || triggerEvent) {
                    this.trigger("render");   //触发渲染完成后的事件
                    //console.info("组件id："+this.id+"完成渲染事件。");
                }

                if(this.getParent()&&this.getParent().childRenderDone){
                    //如果是异步渲染，则通知父节点，他的字节点已经渲染好
                    this.getParent().childRenderDone(this.getId());
                }

                //如果是Region，则需要触发Region的Show事件
                if(this.regionParent&&this.regionParent._triggerShowEvent){
                    //由子节点调用出发事件
                    this.regionParent._triggerShowEvent(true);

                }

            },
            /**
             * 是否需要触发渲染的事件
             */
            isTriggerRender:function(){
                /*
                 1.当没有子组件的时候，this.childrenCount与this.childRenderCount都是0，则触发
                 2.子组件都渲染完，本组件也完成挂载，则触发
                 3.子组件渲染完，但是本组件还没有完成挂载（this.mounted为false），则也不触发
                 4.当本组件已经渲染的，则不触发
                 */
                if(this.mounted&&!this.rendered&&this.childrenCount==this.childRenderCount){
                    return true;
                }else{
                    return false;
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
                /* if(this.childIds==null){
                 this.childIds = [];
                 }*/
                if(this.childrenCount==0){
                    return;
                }
                this.childRenderCount++;
                if(this.isTriggerRender()){
                    this.triggerRender();
                    //console.info("组件id："+this.id+"有子组件:"+this.childrenCount+";子组件id："+id+"完成渲染；已渲染："+this.childRenderCount);
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
                this.parent = parent;
                if(parent&&parent.getId){
                    //console.info("组件id："+this.id+"的parentId:"+parent.getId());
                }
                //由于是先设置naturalFather，如果没有值，默认是parent
                if(!this.getNaturalFather()){
                    this.setNaturalFather(parent);
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
             * 获取ID
             * @returns {*}
             */
            getId:function(){
                return this.id;
            },
            /**
             * 获取亲生父组件，有可能是region
             */
            getNaturalFather:function(){
                /*if(this.naturalFather){
                 return this.naturalFather;
                 }else {
                 return this.parent;
                 }*/
                return this.get("naturalFather");
            },
            /**
             *
             * @param naturalFather
             */
            setNaturalFather:function(naturalFather){
                if(this.get("naturalFather")){
                    return ;
                }
                this.set("naturalFather", naturalFather);
                this.naturalFather  = naturalFather;
                if(naturalFather&&naturalFather.addChildId){
                    naturalFather.addChildId(this.id);
                    //console.info("组件id："+this.id+"的naturalFatherId:"+naturalFather.getId());
                    // parent.childInitializedCount++;
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
            /***********************AbstractView与BaseView一样 END***********************************/
        });

        return CommonView;
    });

