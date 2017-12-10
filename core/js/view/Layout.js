/**
 * @module 布局[Layout]
 * @description 布局：用于管理应用布局、嵌套布局以及在应用或者子应用中多个Region区域
 * https://github.com/marionettejs/backbone.marionette/tree/v1.1.0
 *
 * @author:
 * @date:
 */
define(["core/js/base/BaseView",
    "core/js/view/Region",
    "core/js/view/RegionManager"
], function (BaseView, Region, RegionManager) {
    var Layout = BaseView.extend({
        regionType: Region,
        regions: null,

        /**
         * 创建Region后触发的事件
         */
        onaddregion: null,

        /**
         * 删除Region后触发的事件
         */
        onremoveregion: null,

        /**
         * 初始化构造函数
         * @param options
         * @param triggerEvent
         */
        initialize: function (options, triggerEvent) {
            this._super(options, false);
            this._firstRender = true;

            this.initRegions(options);

            //组件初始化完成，触发事件
            if (triggerEvent == null || triggerEvent)
                this.trigger("initialized");
        },
        initRegions: function (options) {
            this._initializeRegions(options);
        },
        initializeHandle:function(){
            // this._super();
            if (this.isClosed) {
                // a previously closed layout means we need to
                // completely re-initialize the regions
                this._initializeRegions();
            }
            if (this._firstRender) {
                // if this is the first render, don't do anything to
                // reset the regions
                this._firstRender = false;
            } else if (!this.isClosed) {
                // If this is not the first render call, then we need to
                // re-initializing the `el` for each region
                this._reInitializeRegions();
            }
        },
        // Layout's render will use the existing region objects the
        // first time it is called. Subsequent calls will close the
        // views that the regions are showing and then reset the `el`
        // for the regions to the newly rendered DOM elements.
        /*mountContent: function () {
            this._super();

        },*/

        // Handle closing regions, and then close the view itself.
        /**
         * 先销毁本身的内容，再调用父类的销毁方法
         */
        close: function () {
            if (this.isClosed) {
                return;
            }
            //先删除dom相关的关联对象，最后在删除区域对象
            this.regionManager.close();
            this._super();
        },

        /**
         * 获取所有的区域
         * @return {null}
         */
        getAllRegions: function () {
            if(!this.regionManager)
                return null;
            return this.regionManager.getAllRegions();
        },
        /**
         * 根据名车获取区域对象，即使对象中的属性
         * @param name
         * @returns {*}
         */
        getRegion: function (name) {
            if(!this.regionManager)
                return null;
            return this.regionManager.get(name);
        },
        /**
         * 根据index获取区域对象
         * @param idx   区域对象中的index，从0开始
         */
        getRegionByIndex:function(idx){
            var values = _.values(this.getAllRegions());
            if(values&&idx<=values.length){
                return values[idx];
            }
            return;
        },
        // Add a single region, by name, to the layout
        addRegion: function (name, definition) {
            return this.insertRegion(name, definition, null, null);
        },
        insertRegion: function (name, definition, regionName, isBefore) {
            var regions = {};
            regions[name] = definition;
            return this._buildRegions(regions, regionName, isBefore)[name];
        },
        // Add multiple regions as a {name: definition, name2: def2} object literal
        addRegions: function (regions) {
            return this.insertRegions(regions, null, null);
        },
        insertRegions: function (regions, regionName, isBefore) {
            if (regions == null)
                return null;
            this.regions = _.extend({}, this.regions, regions);
            return this._buildRegions(regions, regionName, isBefore);
        },

        // Remove a single region from the Layout, by name
        removeRegion: function (name) {
            delete this.regions[name];
            return this.regionManager.removeRegion(name);
        },

        /**
         * 添加区域信息
         * @param regions
         * @param regionName {String|null}要插入的位置区域名，不指定，默认就插入到最后
         * @param isBefore   {boolean|null}在要插入位置之前还是之后
         * @return {*}
         * @private
         */
        _buildRegions: function (regions, regionName, isBefore) {
            var defaults = {
                regionType: this.get("regionType"),
                parent: this,
                //所以布局区域都是延迟加载的
                lazy:true,
            };

            return this.regionManager._insertRegions(regions, defaults, regionName, isBefore);
        },

        // Internal method to initialize the regions that have been defined in a
        // `regions` attribute on this layout.
        _initializeRegions: function (options) {
            var regions;
            this._initRegionManager();

            if (_.isFunction(this.regions)) {
                regions = this.regions(options);
            } else {
                regions = this.regions || {};
            }

            this.addRegions(regions);
        },

        // Internal method to re-initialize all of the regions by updating the `el` that
        // they point to
        _reInitializeRegions: function () {
            this.regionManager.closeRegions();
            this.regionManager.each(function (region) {
                region.reset();
            });
        },

        // Internal method to initialize the region manager
        // and all regions in it
        _initRegionManager: function () {

            var that = this;
            this.regionManager = new RegionManager({
                onaddregion: function (name, region) {
                    that.trigger("addregion", name,region)
                },
                onremoveregion: function (name, region) {
                    that.trigger("removeregion", name,region)
                }
            });
        }

    });

    Layout.Region = RegionManager.Region;

    return Layout;
});