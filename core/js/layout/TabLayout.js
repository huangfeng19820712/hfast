/**
 * @author:   * @date: 2016/2/20
 */

define([
    "core/js/CommonConstant",
    $Component.TOOLSTRIP.src,
    "core/js/layout/Container",
    "core/js/utils/ApplicationUtils",
    "text!core/resources/tmpl/tabLabel.html",
    "jquery.layout"
], function (CommonConstant,ToolStrip, Container,ApplicationUtil,tabLabelTmpl) {
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

        //theme:"default",
        /**
         * tab的模式
         */
        model: $cons.tabModel.V1,
        className:"tab",
        template:null,
        $navs:null,
        $labels:null,
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
         * {Boolean} 是否需要延迟加载，默认是false
         */
        lazyRendered:false,

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
                var regionId = that.getContentId(tabId);
                //延迟加载
                if(that.lazyRendered&&!_.contains(that.renderdRegion,regionId)){
                    //获取区域的id
                    that.regionRender(regionId);
                }
                that.handleShowJqGrid(tabId);
                that.trigger("shownTab",event);
            });
            if(!this.lazyRendered){
                this.regionsRender();
            }else{
                //序号从1开始
                var contentIdByIndex = this.getContentIdByIndex(1);
                this.regionRender(contentIdByIndex);
            }

        },
        afterMountContent:function(triggerEvent){
            this._super(triggerEvent);
            if(this.navable&&this.leftToolStrip){
                var width = this.leftToolStrip.$el.outerWidth(true);
                this.$navs.css("margin-left",width+"px");
            }

            if(this.height){
                var that = this;
                this.plugin = this.$el.layout({
                    defaults:{
                        //closable:false,
                        slidable:false,
                        spacing_open:0,
                    },
                    center:{
                        //className:"tab-content",
                        paneSelector:"#"+this.getTabContentId(),
                        id:this.getTabContentId(),
                        onresize:function() {
                            that.resizeCenterRegion();
                        }
                    },
                    north:{
                        paneSelector:"#"+this.getContentTabsId(),
                        id:this.getContentTabsId()
                    },/*
                     south:{
                     paneSelector:"#"+this.getConfId(this.footerRegionConf),
                     id:this.getConfId(this.footerRegionConf)
                     }*/
                });
                //设置content-tabs下面的按钮，都能跨域中间层显示
                this.$labels.find(".btn-group").on("mouseover",function(){
                    that.plugin.allowOverflow(this);
                });
            }
        },
        /**
         * 处理包含JqGrid的tab
         * @param tabId
         */
        handleShowJqGrid:function(tabId){
            var contentRef = this.getContentRefByTabId(tabId);
            //针对jqgrid做特殊处理
            if(contentRef&&contentRef.comRef){
                if(contentRef.comRef.xtype === $Component.JQGRID){
                    this.refreshGrid(contentRef.comRef);
                }else{
                    var childrenComponent = ApplicationUtil.getChildrenComponent(contentRef.comRef,$Component.JQGRID);
                    var that = this;
                    _.each(childrenComponent,function(item,idx,list){
                        that.refreshGrid(item);
                    });
                }

            }
        },
        /**
         * 获取content-tabs的
         * @returns {string}
         */
        getContentTabsId:function(){
            return this.getId()+"content-tabs";
        },
        /**
         * 获取tab-content
         * @returns {string}
         */
        getTabContentId:function(){
            return this.getId()+"tab-content";
        },



        /**
         * 刷新grid组件，让其显示出来
         * @param gridComponent
         */
        refreshGrid:function(gridComponent){
            //设置grid的宽度，tab切换过来是，宽度变成0
            var el = gridComponent.$el;
            //减2，2为border的内容
            var width = el.width()-2;
            gridComponent.$table.jqGrid('setGridWidth',width);
            //contentRef.comRef.reload();
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
                this.$el.append('<div class="tab-content" id='+this.getTabContentId()+'/>');
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
            this.$labels.attr("id",this.getContentTabsId());
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
         * 中间区域改变的事件
         * @param event jquery的事件对象
         */
        onresizeCenter:null,
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
         * 根据序号获取内容的id
         * @param tabId
         * @returns {string}
         */
        getContentIdByIndex: function (index) {
            var tabId = this.getTabId(index);
            return this.getContentId(tabId);
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
        /**
         * 获取没有激活的tabId
         */
        getDeactiveTabIds:function(){
            return $(this.$(".page-tabs-content>li:not(.active)")[0]).data("tabId");
        },

        /**
         * 重新刷新区域的内容，当高度改变，或者是内容改变时，需要刷新相关的区域
         */
        resizeCenterRegion:function(){
            //刷新区域的方法
            /*if(this.plugin){
                this.plugin.resizeAll();
            }*/
            //触发子组件的resize事件
            //获取子组件信息
            var activeTabId = this.getActiveTabId();
            var component = this.getComponentByTabId(activeTabId);
            if(component&&component.resize){
                component.resize();
            }
        },

        /**
         * 根据id，返回流布局中的对象
         * @param id
         * @returns {*}
         */
        getComponentByTabId:function(id){
            var index = id.replace(this.id + "_", "");
            return this.getComponentByIndex(index);
        },
        /**
         * 根据数组的下标找到组件
         */
        getComponentByIndex:function(index){
            if(index>0){
                var region = this.getRegionByIndex(index-1);
                var comRef = region.getComRef();
                return comRef;
            }
            return;
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
