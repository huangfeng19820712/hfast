/**
 * @module AbstractView与BaseView中共有的属性与方法
 * @author:   * @date: 2015/12/29
 */
define(["core/js/utils/Utils",
        "core/js/utils/ApplicationUtils"],
    function (Utils, ApplicationUtils) {

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
            /***********************AbstractView与BaseView一样 END***********************************/
        };


    });

