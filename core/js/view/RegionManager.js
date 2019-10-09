/**
 * @module 区域管理器[RegionManager]
 * @description 区域管理器，对Region进行管理
 * 参考https://github.com/marionettejs/backbone.marionette/tree/v1.1.0
 *
 * @author:
 * @date:
 */
define([
    "core/js/Component",
    "core/js/view/Region",
    "core/js/view/ContentRegion"
], function ( Component, Region, ContentRegion) {
    var RegionManager = Component.extend({
        _regions: null,

        //事件声明：整个组件初始化完成后的事件
        oninitialized: null,

        /**
         * 触发管理器销毁的事件
         */
        onclose: null,

        /**
         * 创建Region后触发的事件
         */
        onaddregion: null,

        /**
         * 删除Region后触发的事件
         */
        onremoveregion: null,

        initialize: function () {
            this._super(false);

            this._regions = this._regions || {};

            this.trigger("initialized");  //触发初始化完成的事件
        },

        // Add multiple regions using an object literal, where
        // each key becomes the region name, and each value is
        // the region definition.
        addRegions: function (regionDefinitions, defaults) {
            return this._insertRegions(regionDefinitions, defaults, null, null);
        },

        // Add an individual region to the region manager,
        // and return the region instance
        addRegion: function (name, definition) {
            return this._insertRegion(name, definition, null, null);
        },
        _insertRegions: function (regionDefinitions, defaults, regionName, isBefore) {

            var regions = {};

            _.each(regionDefinitions, function (definition, name) {
                if (typeof definition === "string") {
                    definition = { el: definition };
                }

                if (definition.el) {
                    definition = _.defaults({}, definition, defaults);
                }

                var region = this._insertRegion(name, definition, regionName, isBefore);
                regions[name] = region;

                //如果指定了新区域添加的位置，那么在第一个新区域添加完后，后续的新区域就需要接在前面一个元素的后面
                if (regionName) {
                    regionName = name;
                    isBefore = false;
                }
            }, this);

            return regions;
        },
        _insertRegion: function (name, definition, regionName, isBefore) {
            var region;

            var isObject = _.isObject(definition);
            var isString = _.isString(definition);
            var hasSelector = !!definition.el;

            if (isString || (isObject && hasSelector)) {
                region = Region.buildRegion(definition, this._getRegionType(definition));
            } else if (_.isFunction(definition)) {
                definition = _.bind(definition, this);
                definition = definition();

                region = Region.buildRegion(definition, this._getRegionType(definition));
            } else {
                region = definition;
            }

            this._store(name, region, regionName, isBefore);   //存储新添加的区域

            this.trigger("addregion", name, region);   //触发添加Region事件

            return region;
        },
        _getRegionType: function (definition) {
            var result = Region;
            if (!$.isPlainObject(definition))
                return result;

            var type = definition["type"];
            if (type == Region.Type.CONTENT) {
                result = ContentRegion;
                definition["regionType"] = result;
            }

            return result;
        },
        /**
         * 获取所有的区域
         * @return {null}
         */
        getAllRegions: function () {
            return this._regions;
        },

        // Get a region by name
        get: function (name) {
            return this._regions[name];
        },

        // Remove a region by name
        removeRegion: function (name) {
            var region = this._regions[name];
            this._remove(name, region);
        },

        // Close all regions in the region manager, and
        // remove them
        removeRegions: function () {
            _.each(this._regions, function (region, name) {
                this._remove(name, region);
            }, this);
        },

        // Close all regions in the region manager, but
        // leave them attached
        closeRegions: function () {
            _.each(this._regions, function (region, name) {
                region.close();
            }, this);
        },

        // Close all regions and shut down the region
        // manager entirely
        close: function () {
            this.removeRegions();

            this.trigger("close");  //触发关闭的事件

            this.off(); //卸载所有的事件
        },
        /**
         * 存储新添加的区域：在指定位置插入区域
         * @param name       {String}待插入区域的名称 ，如果region中没有name，则是region对象中的id
         * @param region     {Region}待插入区域
         * @param regionName {String|null}要插入的位置区域名，不指定，默认就插入到最后
         * @param isBefore   {boolean|null}在要插入位置之前还是之后
         * @private
         */
        _store: function (name, region, regionName, isBefore) {
            var regions, _name, _regions, isAdd = false;
            if (regionName == null || regionName === "") {
                regions = this._regions;
            } else {
                regions = {}, _regions = this._regions;
                for (_name in _regions) {
                    if (_name == regionName) {
                        isAdd = true;
                        if (isBefore)
                            regions[name] = region;  //设置新增的区域
                        else {
                            regions[_name] = _regions[_name];  //拷贝已存在的区域
                            regions[name] = region;  //设置新增的区域
                            continue;
                        }
                    }
                    regions[_name] = _regions[_name]; //拷贝已存在的区域
                }
            }
            if (!isAdd)
                regions[name] = region;
            this._regions = regions;
            this._setLength();
        },

        // internal method to remove a region
        _remove: function (name, region) {
            region.destroy();  //清除区域的元素，避免内存泄露 add by 2014.10.26
            if(region.$el){
                region.$el.remove();
                region.$el = null;
            }

            delete this._regions[name];
            this._setLength();

            this.trigger("removeregion", name, region);   //触发删除Region事件

            region = null;
        },

        // set the number of regions current held
        _setLength: function () {
            this.length = _.size(this._regions);
        }
    });

    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
        'select', 'reject', 'every', 'all', 'some', 'any', 'include',
        'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
        'last', 'without', 'isEmpty', 'pluck'];

    _.each(methods, function(method) {
        RegionManager.prototype[method] = function() {
            var regions = _.values(this._regions);
            var args = [regions].concat(_.toArray(arguments));
            return _[method].apply(_, args);
        };
    });
    RegionManager.Region = Region;

    return RegionManager;
});