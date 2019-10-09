/**
 * @author:   * @date: 2016/2/20
 */

define([
    "core/js/CommonConstant",
    "core/js/layout/Container"
], function ( CommonConstant, Container) {
    var TabLayout = Container.extend({
        xtype:$Component.TABLAYOUT,
        /**
         * {Array}
         * 如果是数组：
         * @example
         * <code>
         *     [{
         *         id: "[可选]<内容的编码>",
         *         label："[必填]<标签的标题>",
         *         content: "[必填]<可以是字符串也可以是Region对象>",
         *         subTabs:"[可选]<支持子标签页，子标签页为胶囊标签页，当此值非null时，会修改content的值>"
         *     },...]
         * </code>
         */
        tabs:null,

        /**
         * 标签栏位置，顶部、底部、左右
         * 可以参考sky tab，能是实现标签位置的变化
         * */
        position:$cons.tabPosition.TOP_LEFT,

        theme:"default",
        /**
         * tab的模式
         */
        model: $cons.tabModel.V1,

        className:"tab",

        template:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initialize: function (options, triggerEvent) {
            /**
             * 初始化过程
             * 初始化EL属性，并创建内容
             * 创建区域Region
             */
            this._super(options, triggerEvent);
        },
        /**
         * 初始化EL的属性
         * @private
         */
        _initElAttr:function(){
            //添加标签的位置与特效的类
            this._super();
            this.$el.addClass(this.model);
            //this.$el.addClass(this.position);
            this._initTabs();
        },

        /**
         *初始化tab
         * @private
         */
        _initTabs: function () {
            if(this.tabs){
                var navClass = "nav-tabs";
                if(this.model == $cons.tabModel.PILL){
                    //模式3，支持胶囊模式
                    navClass = "nav-pills"
                }
                this.$el.append('<ul class="nav '+navClass+'"/><div class="tab-content"/>');
                var ulEl = this.$("ul");
                var tabContent = this.$("div.tab-content");
                for(var i=0;i<this.tabs.length;){
                    //i使用在tab后，自增长1后 ，在使用，则在for中就不用自增长了
                    var checked = i==0;
                    var tab = this.tabs[i++];
                    ulEl.append(this._createTabLabel(tab.label,i,checked));
                    //如果有子项，则改变其content的内容。
                    if(tab.subTabs){
                        this._initSubTabs(tab);
                    }
                    tabContent.append(this._createContent(ulEl,tab.content,i,checked));
                }
            }
        },
        /**
         * 初始化子标签页的信息
         * @private
         */
        _initSubTabs:function(tab){
            tab.content = {
                comXtype: $Component.TABLAYOUT,
                comConf: {
                    model: $cons.tabModel.PILL,
                    tabs: tab.subTabs
                }
            };
        },
        /**
         *创建tab的label
         * @param label
         * @param i
         * @param checked
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _createTabLabel:function(label,i,checked){
            var href = "#"+this.getContentId(i);
            var tabLabel = $('<li '+(checked?'class="active"':'')+' ><a href="'+href+'" data-toggle="tab">'+label+'</a></li>');
            return tabLabel;
        },
        /**
         * 创建内容
         * @param   el  dom的对象
         * @param   content 内容
         * @param   i   第几个tab
         * @private
         */
        _createContent:function(el,content,i,checked){
            var contentLi = null;
            if(_.isString(content)){
                contentLi = $('<div id="'+this.getContentId(i)+'" class="tab-pane fade '+(checked?'active in':'')+'">'+content+'</div>');
            }else if(_.isObject(content)){
                //如果是对象，则是区域的配置信息
                contentLi = $('<div id="'+this.getContentId(i)+'" class="tab-pane fade '+(checked?'active in':'')+'"/>');
            }
            return contentLi;
        },
        /**
         * 添加子节点的配置信息
         * @param conf
         * @private
         */
        _addItem:function(conf,i){
            if(!conf.id){
                conf.id = this.getContentId(i);
            }
            var item = {
                id: conf.id,
                className: conf.className,
            };
            item = _.extend(item,conf);
            this.items.push(item);
        },
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initItems:function(options){
            this._super(options);
            if(this.tabs){
                for(var i=0;i<this.tabs.length;){
                    //i使用在tab后，自增长1后 ，在使用，则在for中就不用自增长了
                    var tab = this.tabs[i++];
                    if(_.isObject(tab.content)){
                        //添加Region区域
                        this._addItem(tab.content,i);
                    }
                }
            }
        },
        getContentId: function (i) {
            return this.id+"_content_"+i;
        },
        /**
         * 根据内容的id获取内容对象
         * @param contentId
         */
        getContentRefById: function (contentId) {
            return this.getRegion(contentId);
        },
        close:function(){
            this.tabs =null;
            this._super();
        }
    });



    return TabLayout;
});
