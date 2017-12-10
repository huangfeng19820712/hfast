/**
 * @author:   * @date: 2016/2/20
 */

define(["jquery",
    "core/js/CommonConstant",
    $Component.TOOLSTRIP.src,
    "core/js/layout/Container",
    "text!core/resources/tmpl/tabLabel.html"
], function ($, CommonConstant,ToolStrip, Container,tabLabelTmpl) {
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
        $navs:null,
        $labels:true,
        /**
         * 是否需要导航
         */
        navable:null,
        /**
         * 当前的页数，第一个tab标签页
         */
        firstTab:null,
        leftToolStrip:null,
        leftToolStripOption:null,
        rightToolStrip:null,
        rightToolStripOption:null,

        /**
         * {Array}  所有的tabId
         */
        tabIds:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initItems:function(options){
            this._super(options);
            if(this.tabs){
                for(var i=0;i<this.tabs.length;){
                    //i使用在tab后，自增长1后 ，在使用，则在for中就不用自增长了
                    var tab = this.tabs[i++];
                    if(_.isObject(tab.content)){
                        //添加Region区域
                        this._addItem(tab.content,this.getTabId(i));
                    }
                }
            }
        },
        /**
         * 初始化EL的属性
         * @private
         */
        mountContent:function(){
             //不继承父类的方法
            // this._super();
            // this.$el.empty();
            //添加标签的位置与特效的类
            this.$el.addClass(this.model);
            //this.$el.addClass(this.position);
            this._initTabs();
            //添加内容显示的事件
            var that = this;
            this.$('a[data-toggle="tab"]').on('show.bs.tab',function(event){
                var tabId = $(event.target).parent().data("tabId");
                that.trigger("showTab",event);
            });
            this.$('a[data-toggle="tab"]').on('shown.bs.tab',function(event){
                var tabId = $(event.target).parent().data("tabId");
                that.handleShowJqGrid(tabId);
                that.trigger("shownTab",event);
            });
            this.regionsRender();
        },
        afterMountContent:function(triggerEvent){
            this._super(triggerEvent);
            if(this.navable&&this.leftToolStrip){
                var width = this.leftToolStrip.$el.outerWidth(true);
                this.$navs.css("margin-left",width+"px");
            }
        },

        handleShowJqGrid:function(tabId){

            var contentRef = this.getContentRefByTabId(tabId);
            //针对jqgrid做特殊处理
            if(contentRef&&contentRef.comRef&&contentRef.comRef.xtype === $Component.JQGRID){
                //设置grid的宽度，tab切换过来是，宽度变成0
                var el = contentRef.comRef.$el;
                var width = el.width();
                contentRef.comRef.$table.jqGrid('setGridWidth',width);
            }
        },

        /**
         *初始化tab
         * @private
         */
        _initTabs: function () {
            if(this.tabs){
                var navClass = "nav-tabs";
                if(this.model == $cons.tabModel.PILL){
                    //模式3，支持胶囊模式                                          C
                    navClass = "nav-pills"
                }
                //this.$el.append('<ul class="nav '+navClass+'"/>');
                this.$el.append(this._initTabLabel());
                this.$el.append('<div class="tab-content"/>');
                var ulEl = this.$("ul.page-tabs-content");
                var tabContent = this.$("div.tab-content");
                this.tabIds = [];
                for(var i=0;i<this.tabs.length;){
                    //i使用在tab后，自增长1后 ，在使用，则在for中就不用自增长了
                    var checked = i==0;
                    var tab = this.tabs[i++];
                    var tabId = this.getTabId(i);
                    this.tabIds.push(tabId);
                    var tabLabel = this._createTabLabel(tab,tabId , checked);
                    this.addRemoveTabHandle(tabLabel);
                    ulEl.append(tabLabel);
                    //如果有子项，则改变其content的内容。
                    if(tab.subTabs){
                        this._initSubTabs(tab);
                    }
                    tabContent.append(this._createContent(ulEl,tab.content,tabId,checked));
                }
            }
        },
        /**
         * 添加关闭tab事件
         */
        addRemoveTabHandle:function(tabLabel,i){
            //获取关闭按钮
            var removeIcon = tabLabel.find(".fa-times-circle");
            if(removeIcon.length>0){
                //如果有关闭按钮，则添加关闭功能
                this.getContentId(i);
                var that = this;
                removeIcon.on("click", $.proxy(this.removeTabHandle,this));
            }

        },
        /**
         * 具体的关闭操作
         * @param event
         */
        removeTabHandle:function(event){
            var tabId = $(event.target).data("tabId");
            this.removeTab(tabId);
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
        _initTabLabel:function(){
            this.$labels = $("<div/>");
            this.$labels.addClass("content-tabs");
            var that = this;
            if(this.navable){
                var leftToolStripOption = [{
                    iconSkin: "fa-backward",
                    onclick:$.proxy(this.prevTab,this)
                }];
                if(this.leftToolStripOption){
                    leftToolStripOption = _.union(leftToolStripOption,this.leftToolStripOption);
                }
                this.leftToolStrip = new ToolStrip({
                    $container:this.$labels,
                    className:"roll-nav roll-left J_tabLeft",
                    itemOptions:leftToolStripOption
                });
                /*var leftButton = $('<button class="nav-tabs roll-nav roll-left J_tabLeft"><i class="fa fa-backward"></i></button>');
                this.$labels.append(leftButton);*/
            }
            this.$labels.append(this._initNav());
            if(this.navable){
                var rightToolStripOption = [{
                    iconSkin: "fa-forward",
                    onclick:$.proxy(this.nextTab,this)
                }];
                if(this.rightToolStripOption){
                    rightToolStripOption = _.union(rightToolStripOption,this.rightToolStripOption);
                }
                this.rightToolStrip = new ToolStrip({
                    $container:this.$labels,
                    className:"roll-nav roll-right J_tabRight",
                    itemOptions:rightToolStripOption
                });
                /*var rightButton = $('<button class="nav-tabs roll-nav roll-right J_tabRight"><i class="fa fa-forward"></i></button>');
                this.$labels.append(rightButton);
                rightButton.on("click", $.proxy(this.nextTab,this));*/
            }
            return this.$labels;
        },
        _initNav:function(){
            this.$navs = $("<nav/>");
            this.$navs.addClass("page-tabs J_menuTabs");
            this.$navs.append("<ul class='nav nav-tabs page-tabs-content'/>");
            this.$navsDiv = $("<div class='nav-div'/>");
            this.$navsDiv.append(this.$navs);
            return this.$navsDiv;
        },
        /**
         *创建tab的label
         * @param label
         * @param i
         * @param checked
         * @returns {*|jQuery|HTMLElement}
         * @private
         */
        _createTabLabel:function(tabOption,tabId,checked){
            var tabLabelId = this.getTabLabelId(tabId);
            var href = "#"+this.getContentId(tabId);
            var template = _.template(tabLabelTmpl,{variable: "data"})({
                checked:checked,
                href:href,
                label:tabOption.label,
                tabId:tabId,
                tabLabelId:tabLabelId,
                closeable:tabOption.closeable
            });
            var tabLabel = $(template);
            return tabLabel;
        },
        /**
         * 创建内容
         * @param   el  dom的对象
         * @param   content 内容
         * @param   i   第几个tab
         * @private
         */
        _createContent:function(el,content,tabId,checked){
            var contentLi = null;
            if(_.isString(content)){
                contentLi = $('<div id="'+this.getContentId(tabId)+'" class="tab-pane fade '+(checked?'active in':'')+'">'+content+'</div>');
            }else if(_.isObject(content)){
                //如果是对象，则是区域的配置信息
                contentLi = $('<div id="'+this.getContentId(tabId)+'" class="tab-pane fade '+(checked?'active in':'')+'"/>');
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
        /*-------------------------------  初始化及私有方法 end ---------------------------------------------------*/

        /**
         * 显示tab的内容事件，显示前触发，输入的参数是tab对象
         * @param event jquery的事件对象
         */
        onshowTab:null,
        /**
         * 显示tab的内容事件，显示前触发，输入的参数是tab对象
         * @param event jquery的事件对象
         */
        onshownTab:null,
        /**
         * 获取tabid
         * @returns {string}
         */
        getTabId:function(i){
            return this.id+"_"+i;
        },
        /**
         * 获取tab的标签id
         * @param tabId
         * @returns {string}
         */
        getTabLabelId:function(tabId){
            return tabId+"_label";
        },
        /**
         * 获取内容的id
         * @param tabId
         * @returns {string}
         */
        getContentId: function (tabId) {
            return tabId+"_content";
        },
        /**
         * 根据内容的id获取内容对象
         * @param contentId
         */
        getContentRefById: function (contentId) {
            return this.getRegion(contentId);
        },
        /**
         * 根据tabId获取内容对象
         * @param tabId
         */
        getContentRefByTabId:function(tabId){
            return this.getRegion(this.getContentId(tabId));
        },
        /**
         * 根据序号获取内容的区域对象
         * @param index
         */
        getContentRefByIndex:function(index){
            var tabId = this.getTabId(index);
            var contentId = this.getContentId(tabId);
            return this.getContentRefById(contentId);
        },

        labelTotalWidth: function(l){
            var k = 0;
            $(l).each(function() {
                k += $(this).outerWidth(true);
            });
            return k;
        },
        prevTab:function(){
            var that = this;
            //marginLeft
            var marginLeft = Math.abs(parseInt(this.$navs.css("margin-left")));
            //非label的宽度，导航的宽度
            var buttonsWidth = that.labelTotalWidth(this.$labels.children().not(this.$navsDiv));
            //导航条的宽度
            var navWidth = this.$labels.outerWidth(true) - buttonsWidth;
            //偏移量
            var offset = 0;
            var tabsContent = this.$navs.find(".page-tabs-content");
            if (tabsContent.width() < navWidth) {
                return false
            } else {
                //获取排除的tab
                var firstTab = this.firstTab || tabsContent.children().first();
                var n = 0;
                while ($(firstTab).length>0&&(n + $(firstTab).outerWidth(true)) <= marginLeft) {
                    n += $(firstTab).outerWidth(true);
                    firstTab = $(firstTab).next()
                }
                //n = 0;
                if (that.labelTotalWidth($(firstTab).prevAll()) > navWidth) {
                    while ($(firstTab).length>0&&(n + $(firstTab).outerWidth(true)) < (navWidth) && firstTab.length > 0) {
                        n += $(firstTab).outerWidth(true);
                        firstTab = $(firstTab).prev()
                    }
                    offset = that.labelTotalWidth($(firstTab).prevAll());
                }else{
                    firstTab = tabsContent.children().first();
                }
                this.firstTab = firstTab;
            }
            this.$navs.find(".page-tabs-content").animate({
                marginLeft: 0 - offset + "px"
            }, "fast");
        },
        /**
         * 下一页
         * @returns {boolean}
         */
        nextTab:function(){
            var that = this;
            //marginLeft
            var marginLeft = Math.abs(parseInt(this.$navs.css("margin-left")));
            //非label的宽度，导航的宽度
            var buttonsWidth = that.labelTotalWidth(this.$labels.children().not(this.$navsDiv));
            //导航条的宽度
            var navWidth = this.$labels.outerWidth(true) - buttonsWidth;
            //偏移量
            var offset = 0;
            var tabsContent = this.$navs.find(".page-tabs-content");
            if (tabsContent.width() < navWidth) {
                return false
            } else {
                //获取排除的tab
                var firstTab = this.firstTab || tabsContent.children().first();
                var n = 0;
                while ($(firstTab).length>0&&(n + $(firstTab).outerWidth(true)) <= marginLeft) {
                    n += $(firstTab).outerWidth(true);
                    firstTab = $(firstTab).next()
                }
                //n = 0;
                while ($(firstTab).length>0&&(n + $(firstTab).outerWidth(true)) < (navWidth) && firstTab.length > 0) {
                    n += $(firstTab).outerWidth(true);
                    firstTab = $(firstTab).next()
                }
                offset = that.labelTotalWidth($(firstTab).prevAll());
                if (offset > 0) {
                    this.$navs.find(".page-tabs-content").animate({
                        marginLeft: 0 - offset + "px"
                    }, "fast")
                    this.firstTab = firstTab;
                }
            }
        },
        goTab:function(tabId){
            var that = this;
            var $tabLabel = this.$("#" + this.getTabLabelId(tabId));
            var marginLeft = that.labelTotalWidth($tabLabel.prevAll());
            var marginRight = that.labelTotalWidth($tabLabel.nextAll());
            //非label的宽度，导航的宽度
            var buttonsWidth = that.labelTotalWidth(this.$labels.children().not(this.$navs));
            //导航条的宽度
            var navWidth = this.$labels.outerWidth(true) - buttonsWidth;
            //偏移量
            var offset = 0;
            var tabsContent = this.$navs.find(".page-tabs-content");
            if (tabsContent.width() < navWidth) {
                offset = 0
            } else {
                //获取当前的也得第一个tab
                var firstTab = this.firstTab||tabsContent.children().first();
                var activeTabId = this.getActiveTabId();
                if(activeTabId){
                    var firstTab = this.getPageFirstTab(activeTabId);
                    offset = that.labelTotalWidth(firstTab.prevAll());
                    this.firstTab = firstTab;
                }

            }
            this.$navs.find(".page-tabs-content").animate({
                marginLeft: 0 - offset + "px"
            }, "fast")
        },
        goActiveTab:function(){
            var activeTabId = this.getActiveTabId();
            this.goTab(activeTabId);
        },
        /**
         * 获取标签页所在的页数第一个tab
         * @param tabId
         * @returns {jquery}
         */
        getPageFirstTab:function(tabId){
            var that = this;
            var $tabLabel = this.$("#" + this.getTabLabelId(tabId));
            var tabWidth = that.labelTotalWidth($tabLabel.prevAll());
            //marginLeft
            var marginLeft = Math.abs(parseInt(this.$navs.css("margin-left")));
            //非label的宽度，导航的宽度
            var buttonsWidth = that.labelTotalWidth(this.$labels.children().not(this.$navs));
            //导航条的宽度
            var navWidth = this.$labels.outerWidth(true) - buttonsWidth;
            //偏移量
            var offset = 0;
            var tabsContent = this.$navs.find(".page-tabs-content");
            var pageCount = 0;
            if (tabsContent.width() > navWidth) {
                var tmpTab = null;
                var pageCount = 0;
                var firstTab = tabsContent.children().first();
                var pageTab = firstTab;
                var n = 0;
                while ($(firstTab).length>0&&(n + $(firstTab).outerWidth(true)) <= marginLeft) {
                    n += $(firstTab).outerWidth(true);
                    firstTab = $(firstTab).next()
                }
                //n = 0;
                while ($(firstTab).length>0&&$(firstTab).attr("id")!=$tabLabel.attr("id")&& firstTab.length > 0) {
                    n += $(firstTab).outerWidth(true);
                    firstTab = $(firstTab).next();
                    if((n + $(firstTab).outerWidth(true)) >= (navWidth)){
                        pageCount++;
                        n -=navWidth;
                        pageTab = firstTab;
                    }
                }
                return pageTab;
                //offset = that.labelTotalWidth(tmpTab.prevAll());
            }
            return this.firstTab;
            //return pageCount;
        },
        /**
         * 关闭tab
         * @param tab
         */
        removeTab:function(tabId){
            //1.线判断是否是激活状态
            //2.删除tab
            //3.如果是激活状态，选择另一大tab作为激活状态
            var indexOf = _.indexOf(this.tabIds,tabId);
            this.tabIds = _.without(this.tabIds,tabId);
            var isActive = this.isActive(tabId);
            
            //获取内容
            var component = this.getContentRefById(tabId);
            if(component){
                component.close();
            }
            var contentId = this.getContentId(tabId);
            this.removeTabLabel(tabId);
            this.removeTabContent(tabId);
            //激活新tab
            if(isActive){
                //如果激活，则获取下一个tab,然后激活
                if(indexOf>=this.tabIds.length){
                    indexOf = this.tabIds.length-1;
                }
                var activeTabId = this.tabIds[indexOf];
                this.activeTab(activeTabId);
            }
        },
        /**
         * 删除tab的内容
         * @param tabId
         */
        removeTabContent:function(tabId){
            var contentId = this.getContentId(tabId);
            var $div = this.$("#" + contentId);
            $div.remove();
        },
        /**
         * 删除tab的lable
         * @param tabId
         */
        removeTabLabel:function(tabId){
            var tabLabelId = this.getTabLabelId(tabId);
            var $tabLabel = this.$("#" + tabLabelId);
            $tabLabel.remove();
        },
        /**
         * 删除当前的激活的tab
         */
        removeActiveTab:function(){
            var activeTabId = this.getActiveTabId();
            this.removeTab(activeTabId);
        },
        /**
         * 删除掉未激活的tab
         */
        removeUnActiveTab:function(){
            var tabs = this.$(".page-tabs-content>li").not(this.$(".page-tabs-content>li.active"));
            var that = this;
            _.each(tabs,function(tab,index){
                var tabId = $(tab).data("tabId");
                that.removeTab(tabId);
            });
        },
        /**
         * 是否激活的状态
         * @param tabId
         * @returns {boolean}
         */
        isActive:function(tabId){
            var tabLabelId = this.getTabLabelId(tabId);
            var $tabLabel = this.$("#" + tabLabelId);
            var hasClass = $tabLabel.hasClass("active");
            return hasClass;
        },
        /**
         *
         * @param tabId
         */
        activeTab:function(tabId){
            var tabLabelId = this.getTabLabelId(tabId);
            var $tabLabel = this.$("#" + tabLabelId);
            $tabLabel.find("a").tab('show');
        },

        /**
         * 获取激活的标签的tabId
         * @returns {String}
         */
        getActiveTabId:function(){
            return $(this.$(".page-tabs-content>li.active")[0]).data("tabId");
        },

        close:function(){
            this.tabs =null;
            leftToolStrip:null;
            rightToolStrip:null;
            this._super();
        }
    });



    return TabLayout;
});
