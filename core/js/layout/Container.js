/**
 * @module 布局容器[Container]
 * @description 布局容器
 *
 * @date: 2013-11-07 下午1:36
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/view/Layout",
    "text!core/resources/tmpl/layout.html",
    "core/js/base/AbstractView",
    "core/js/utils/Utils",
    "core/js/utils/ApplicationUtils"
], function ($, CommonConstant,
             Layout,
             LayoutTemplate,
             AbstractView,
             Utils,
             ApplicationUtils) {

    var Container = Layout.extend(AbstractView).extend({
        /**
         * 布局模版
         */
        template: LayoutTemplate,

        /**
         * 定义布局中的区域 ,必须为null，不然同时初始化多个对象会有问题
         * 其中属性内容可以参考Region对象中的属性
         * [
         * {
         *      columnSize:"[栏位的大小]<可选>"
         *      region: "north",
         *      width: 200,
         *      height: 300,
         *      autoScroll: true,        //设置当显示内容超出区域时是否要显示滚动条
         *      collapsible: true,      //是否可收缩
         *      el: null,                //此区域的元素
         *      flex: 1                 //扣除已经指定了width或者height的区域，剩余的空间按各区域指定的flex进行分配
         * }
         * ]
         */
        items: null,

        /**
         * 各区域间的间隔
         */
        spacing: CommonConstant.Spacing.DEFAULT,



        dataPre:"data",
        /**
         * 外边距
         */
        margin: CommonConstant.Spacing.NONE,

        /**
         * 样式
         */
        className: "container-fluid",

        /**
         * 布局调整后触发该事件
         */
        onresize: null,

        _registerEvent: false,   //标识是否已经注册了事件

        /**
         * 存储可见视图的名称，用于仅显示某个区域，而隐藏其它区域时使用
         */
        _visibleRegionNameArray: null,

        /**
         * 如果需要计算区域布局的，就需要添加该样式，基于绝对定位进行布局
         */
        _defaultRegionClassName: null,
        /**
         * 已经渲染的子区域
         */
        renderdRegion:null,

        initialize: function (options, triggerEvent) {
            this._firstRender = true;
            //初始化本身属性信息
            this.set(options, null);

            this.initId();
            //初始化的内容，需要close中清空
            this.renderdRegion=[];
            this.beforeInitializeHandle(options, triggerEvent);
            this.initializeHandle(options, triggerEvent);
            this.afterInitializeHandle(options, triggerEvent);
        },
        /**
         * 初始化核心处理方法，由子类实现,主要是初始化数据，不包含渲染的内容
         */
        initializeHandle:function(options,triggerEvent){
            if (this.isDestroied) {
                // a previously closed layout means we need to
                // completely re-initialize the regions
                this._initializeRegions();
            }
            if (this._firstRender) {
                // if this is the first render, don't do anything to
                // reset the regions
                this._firstRender = false;
            } else if (!this.isDestroied) {
                // If this is not the first render call, then we need to
                // re-initializing the `el` for each region
                this._reInitializeRegions();
            }
            //初始化子区域信息
            this.initItems();
            //根据子区域信息初始化区域对象
            this._initializeRegions();

        },
        /**
         * DOM的渲染，初始化本身、挂载容器、初始化子区域
         * 初始化过程：
         * 1.初始化展示的页面内容
         * 2.把要输出的区域初始化称Region对象
         * @param triggerEvent
         * @returns {Container}
         */
        mountContent: function () {
            //执行父类的渲染方法,容器的渲染，依赖区域的个数，所以，需要先初始化区域，还是继续渲染
            this._super();
            this.regionsRender();
        },
        /**
         * 渲染区域的内容
         */
        regionsRender:function(){
            //父节点先渲染完后，子区域的才能渲染

            //如果各区域有配置其内容的信息，那么就根据各区域内容的配置信息来渲染各区域的内容
            // 容器是本组件渲染后，然后直接渲染区域的组件，而不是由渲染的事件来触发
            var rName, region,
                regions = this.getAllRegions();
            if(regions){
                //
                this.childrenCount = _.keys(regions).length;
                //设置parent的childrenCount也需要+1，因为是异步渲染
                //如果父组件是Container，则不需要再+1
                //如果有RegionParent则不需要+1，应为parent会根据Region的个数增加n
                //如果没有Regionparent，则是非容器组件，则需要+1
                if(this.getParent()&&!this.regionParent){
                    this.getParent().childrenCount++;
                }
                for (rName in regions) {
                    region = regions[rName];
                    region.render();   //根据区域的配置信息对区域进行渲染
                    this.renderdRegion.push(rName);
                }
            }
        },
        /**
         * 根据区域id渲染区域对象
         *  @param regionId
         */
        regionRender:function(regionId){
            var region = this.getRegion(regionId);
            if(region){
                //直接包含内容的，不是region对象
                region.render();
            }
            this.renderdRegion.push(regionId);
        },
        /**
         * 初始化区域属性，此属性与Layout中的regions不一样，需要在进行转化
         */
        initItems:function(){
            if(this.items==null){
                this.items = [];
            }
        },
        /**
         *  转换成是可以初始化化区域对象的属性对象
         */
        _initializeRegions: function () {
            var regions;
            this._initRegionManager();
            if (_.isFunction(this.regions)) {
                regions = this.regions(this);
            }else if(this.items!=null){
                regions = this._getRegionsByItems(this.getItems());  //将items转换成regions
            } else {
                regions = this.regions || {};
            }
            this.addRegions(regions);   //追加regions
            //一个区域算一个子组件
            //Todo处理异步线程渲染问题
        },
        /**
         * 初始化容器的事件
         */
        registerEvent:function(){
            this.on("show", function () {
                this.resizeLayout();  //计算各区域的布局
            });
            this.on("resize", function () {
                this.resizeLayout();  //计算各区域的布局
            });
            //注册事件，页面渲染完后，计算各区域的布局
//            this.on("render", function(){
//                this.resizeLayout();  //计算各区域的布局
//            });
        },
        /**
         * 显示某个区域的内容
         * @param regionName
         * @param content
         */
        showRegionContent: function (regionName, content) {
            this.getRegion(regionName).show(content);
        },
        /**
         * 向布局中动态追加区域
         * @param items {Object|Array}待插入的区域项配置信息
         * @return {*}  返回的是区域对象Region的数组
         */
        appendItems: function (items) {
            return this._insertItems(items, null, false, true);
        },
        /**
         * 向布局中动态追加一个区域，并返回区域的对象
          * @returns {*}    返回的是区域对象Region的对象
         */
        appendItem:function(item){
            var insertItems = this._insertItems([item], null, false, true);
            if(insertItems!=null){
                return insertItems[item.id];
            }else{
                return;
            }
        },
        /**
         * 向布局中指定的元素之前动态追加区域
         * @param regionId {String|null}区域要插入到指定的元素的ID，为空的话，就添加到容器的最后
         * @param items    {Object|Array}待插入的区域项配置信息
         * @return {*}
         */
        insertItemsBefore: function (regionId, items) {
            return this._insertItems(items, regionId, true, true);
        },
        /**
         * 向布局中指定的元素之后动态追加区域
         * @param regionId {String|null}区域要插入到指定的元素的ID，为空的话，就添加到容器的最后
         * @param items    {Object|Array}待插入的区域项配置信息
         * @return {*}
         */
        insertItemsAfter: function (regionId, items) {
            return this._insertItems(items, regionId, false, true);
        },
        /**
         * 还原原来容器中显示的区域
         */
        restore: function () {
            var visibleRegionNameArray = this._visibleRegionNameArray;
            if (visibleRegionNameArray == null || visibleRegionNameArray.length == 0)
                return;
            this.showRegions(visibleRegionNameArray.join(","));
            this._visibleRegionNameArray = null;
        },
        /**
         * 最大化显示某个区域
         * @param regionName
         */
        maximizeRegion: function (regionName) {
            var visibleRegionNameArray = this.initVisibleRegionNameArray(regionName);
            this.hideRegions(visibleRegionNameArray.join(","));  //隐藏其它区域，使得指定的区域最大化
        },
        /**
         * 初始化当前可见区域：排除掉参数中给定的区域名
         * @param regionName
         */
        initVisibleRegionNameArray: function (regionName) {
            var rName, region,
                regions = this.getAllRegions(),
                result = [];
            for (rName in regions) {
                if (regionName == rName)
                    continue;
                region = regions[rName];
                if (!region.isVisible())
                    continue;
                result.push(rName);
            }
            this._visibleRegionNameArray = result;
            return result;
        },
        /**
         * 根据给定的区域名来隐藏指定的区域
         * @param regionNames {String}多个值用逗号分隔
         */
        hideRegions: function (regionNames) {
            this._setRegionsVisible(regionNames, false);
        },
        /**
         * 根据给定的区域名来显示指定的区域
         * @param regionNames {String}多个值用逗号分隔
         */
        showRegions: function (regionNames) {
            this._setRegionsVisible(regionNames, true);
        },
        setSpacing: function (spacing) {
            this.spacing = spacing;
        },
        /**
         * 覆写模版上下文的方法
         * @override
         * @return {{}}
         */
        getTemplateContext: function () {
            //如果指定了上下文data属性，那么就用指定的，没有就用系统默认的
            var result = this._super();
            if (result)
                return result;

            result = {regions: _.values(this.regions)};

            return result;
        },
        /*-------------------------------  初始化及私有方法  ---------------------------------------------------*/
        /**
         * 向布局中动态添加区域
         *
         * @param items      {Object|Array}待插入的区域项配置信息
         * @param regionId   {String|null}区域要插入到指定的元素的ID，为空的话，就添加到容器的最后
         * @param isBefore   {boolean|null}标识区域容器的内容是追加到指定元素之前还是之后
         * @param triggerResizeLayout {boolean}是否要触发布局调整，默认是触发的
         * @return {*}
         * @private
         */
        _insertItems: function (items, regionId, isBefore, triggerResizeLayout) {
            this.items.push(items);
            var regions = this._getRegionsByItems(items);
            if (regions == null)
                return null;
            var regionObjs = this.insertRegions(regions, regionId, isBefore);   //向区域的容器中追加新的区域

            this._insertRegionContainer(regions, regionId, isBefore);   //添加区域的容器

            //触发布局调整
            if (triggerResizeLayout == null || triggerResizeLayout)
                this.resizeLayout();
            return regionObjs;
        },
        /**
         * 追加区域的容器
         * @param regions {Object}待插入的区域配置信息
         * @param regionId  {String|null}区域要插入到指定的元素的ID，为空的话，就添加到容器的最后
         * @param isBefore {boolean|null}标识区域容器的内容是追加到指定元素之前还是之后
         * @private
         */
        _insertRegionContainer: function (regions, regionId, isBefore) {
            if (!regions || !this.$el)
                return;
            var context = {regions: _.values(regions)}
            var regionContainer = _.template(this.template,{variable:this.dataPre})( context);
            var $region = this.$el.find(["[id='", regionId, "']"].join(""));
            if ($region.length == 0) {
                this.$el.append(regionContainer);
                return;
            }

            if (isBefore) {
                $region.before(regionContainer);
            } else
                $region.after(regionContainer);
        },
        /**
         * 设置指定区域的可见性
         * @param regionNames  {String}多个值用逗号分隔
         * @param isVisible    {boolean|null}是否可见
         * @private
         */
        _setRegionsVisible: function (regionNames, isVisible) {
            regionNames = $.trim(regionNames);
            if (regionNames == "")
                return;
            var regionNameArray = regionNames.split(","), region, i;
            for (i = 0; i < regionNameArray.length; i++) {
                region = this.getRegion(regionNameArray[i]);
                region.setVisible(isVisible);
            }
            this.trigger("resize");  //触发重新计算布局（宽度、高度）的事件
        },


        _getRegionsByItems: function (items) {
            if (items == null)
                return null;
            if ($.isPlainObject(items))
                items = [items];
            if (!$.isArray(items))
                return null;
            var i, region,
                ln = items.length,
                result = {};

            for (i = 0; i < ln; i++) {
                region = this._getRegionByItem(items[i]);
                result[region.id] = region;
            }
            return result;
        },

        /**
         * 根据item来生成region
         * @param item
         * @return {*}
         */
        _getRegionByItem: function (item) {
            var id = item["id"],
                el = item["el"],
                region = item["region"],
                result = item;

            if (!id || id == "") {
                id = el && el.indexOf("#") == 0 ? el.substr(1) : null;
                var preStr = region||"";
                if(!id){
                    id = $.createId(preStr);
                }
            }

            //此处不直接使用#id，是因为如果id是带有.的字符串（例如orderPanel.id_group）时，那么点后面的就被识别为className  add by 2014.4.12
            if (!el || el == "")
                result["el"] = ["[id='", id, "']"].join("");

            result["id"] = id;

            /*var className = result["className"] || "";
            className = this._defaultRegionClassName + className;*/
            //this._defaultRegionClassName是容器默认的类型，item
            this.initItemClassName(item,result);
            //result["className"] =item.className||item.columnSize ||this._defaultRegionClassName;

            return result;
        },
        /**
         * 初始化子项的className，修改result中的className属性
         * @param item      子项的配置信息
         * @param result
         */
        initItemClassName:function(item,result){
            result["className"] =item.className||item.columnSize ||this._defaultRegionClassName;
        },

        /**
         * 重新计算布局
         */
        resizeLayout: function () {
            var width = this.getWidth(),
                height = this.getHeight();
            this.calculateRegionLayout(width, height);   //计算各区域的布局
        },
        /**
         * 重置该容器的宽度和高度，并触发大小调整的事件
         * @param width
         * @param height
         */
        resizeTo: function (width, height) {
            //如果前后的宽度和高度一致，就不执行大小调整的动作 add by 2014.11.13
            if(width == this.width && height == this.height)
                return;

            this.setWidth(width);   //设置当前容器的宽度
            this.setHeight(height); //设置当前容器的高度

            this.trigger("resize");  //当容器布局调整后，触发该事件，使其重新计算各区域的布局
        },
        /**
         * 计算各区域的布局
         * @param width    容器的宽度
         * @param height   容器的高度
         */
        calculateRegionLayout: function (width, height) {
        },
        /**
         * 初始化区域的布局
         * @param region
         * @param height
         * @param width
         * @param left
         * @param top
         * @param right
         * @param bottom
         */
        _initRegionLayout: function (region, height, width, left, top, right, bottom) {
            if (region == null)
                return;

            region.ensureEl();    //先保证当前要显示区域的元素存在
            region.setLeft(left);
            region.setTop(top);
            region.setRight(right);
            region.setBottom(bottom);
            region.resizeTo(width, height);  //设置区域的宽度和高度，这里的高度、高度包含了补白padding和边框border
        },
        getItems: function () {
            return this.items || [];
        },

        getRegionName: function (regionName) {
            if(this.id)
                return [this.id, regionName].join("-");
            return regionName;
        },
        close:function(){
            if (this.isDestroied) {
                return;
            }
            this.items = null;
            //this._firstRender = false;
            this.renderdRegion = null;
            ApplicationUtils.removeComponent(this.id);
            this.unregisterEvent();
            this._super();
        }
    });

    Container.Region = Layout.Region;
    Container.Spacing = CommonConstant.Spacing;

    return Container;
});