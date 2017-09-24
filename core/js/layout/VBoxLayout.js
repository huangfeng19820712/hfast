/**
 * @module 垂直布局[VBoxLayout]
 * @description 垂直布局
 *
 * @author:
 * @date: 2013-11-07 下午2:33
 */
define(["jquery", "underscore", "core/js/layout/Container", "core/js/CommonConstant"],
    function ($, _, Container, CommonConstant) {
    var VBoxLayout = Container.extend({
        /**
         * {String}垂直布局方式：
         * 1、auto: 没有定任何布局方式，Auto布局就是默认的布局方式，它采用原始的HTML流式排版的布局方式，如果内容超出容器，那么就自动出现容器级的滚动条
         * 2、fit: 它是按容器的宽高来限定容器的内容，不可能超出容器(内部实现基于垂直布局)
         * @default fit
         */
        layout: "fit",

        /**
         * 默认区域的收缩按钮
         */
        defaultCollapsedIconSkin: " h-icon-up ",

        /**
         * 默认区域的展开按钮
         */
        defaultExpandedIconSkin: " h-icon-down ",

        _defaultRegionClassName: " h-box-item ",   //如果需要计算区域布局的，就需要添加该样式，基于绝对定位进行布局

        initialize: function (options, triggerEvent) {
            this._initDefaultRegionClassName(options);  //初始化区域的默认样式
            this._super(options, triggerEvent);
        },

        /**
         * 没有定任何布局方式，它采用原始的HTML流式排版的布局方式，如果内容超出容器，那么就自动出现容器级的滚动条
         * @return {boolean}
         */
        isAutoLayout: function () {
            return this.layout == VBoxLayout.Layout.AUTO;
        },
        /**
         * 它是按容器的宽高来限定容器的内容，不可能超出容器
         * @return {boolean}
         */
        isFitLayout: function () {
            return this.layout == null || this.layout == VBoxLayout.Layout.FIT;
        },

        /**
         * 根据区域的配置信息获取该区域对应的可收缩条区域
         * @param item
         * @returns {*}
         */
        getCollapsedBarRegionByItem: function(item){
            var result = this._super(item);
            if(result == null)
                return result;
            var iconSkin = item["expandedIconSkin"] || this.defaultExpandedIconSkin;
            result["height"] = CommonConstant.ToolBar.HEIGHT;
            result["content"] = '<div class="h-pull-left"><p class="h-panel-title">' + result["content"] + '</p></div><div class="h-pull-right"><a id="expandBtn" href="javascript:void(0)" title="展开" class="h-icon ' + iconSkin + '"></a></div>';
            return result;
        },
        /**
         * 计算各区域的布局：区域的指定的高度是不包含间距（spacing）的
         * @param width    容器的宽度
         * @param height   容器的高度
         * @override
         */
        calculateRegionLayout: function (width, height) {
            //如果是fit布局，那么就直接使用垂直布局来实现
            if (this.isFitLayout()) {
                this._calculateRegionLayout(width, height, this.spacing);
            }
        },

        _initDefaultRegionClassName: function (options) {
            options = options || {};
            if (options["layout"])
                this.layout = options["layout"];
            if (this.isFitLayout()) {
                this._defaultRegionClassName = " h-box-item ";
                return;
            }
            if (this.isAutoLayout()) {
                this._defaultRegionClassName = "";
                return;
            }
        },

        /**
         * 计算各区域的布局：区域的指定的高度是不包含间距（spacing）的
         * @param width    容器的宽度
         * @param height   容器的高度
         * @param spacing  各区域间的间距
         */
        _calculateRegionLayout: function (width, height, spacing) {
            //这些变量最终都要作用于center
            var top = spacing,
                left = spacing,
                flexHeight = this.getFlexHeight(height, spacing);
            width = width - 2 * spacing;   //宽度需要减去左右间距

            var regions = this.getAllRegions();
            var regionName, region, regionFlex, regionHeight;
            for (regionName in regions) {
                region = regions[regionName];
                //不可见区域不计算在内
                if (!region.isVisible())
                    continue;
                regionFlex = region["flex"];
                if (regionFlex)
                    regionHeight = regionFlex * flexHeight - spacing;   //如果是flex布局，高度需要扣除间距
                else
                    regionHeight = region.getOuterHeight();  //计算使用的宽度都是包含了补白padding和边框border

                this._initRegionLayout(region, regionHeight, width, left, top, null, null);

                top += (regionHeight + spacing);
            }
        },
        /**
         * 获取每份flex的高度
         */
        getFlexHeight: function (height, spacing) {
            var totalFlexHeight = height;
            var regions = this.getAllRegions();
            var regionName, region, regionFlex, flex = 0;
            for (regionName in regions) {
                region = regions[regionName];
                //不可见区域不计算在内
                if (!region.isVisible())
                    continue;
                regionFlex = region["flex"];
                if (regionFlex)
                    flex += regionFlex;
                else
                    totalFlexHeight -= (region.getOuterHeight() + spacing);  //这里的高度是不计算间隔的，因此在计算剩余空间时，需要加上顶部的间隔
            }

            totalFlexHeight -= spacing;  //单独再扣除底部的间隔

            if (flex == 0)
                return 0;

            return totalFlexHeight / flex;
        }
    });

    VBoxLayout.Region = Container.Region;
    VBoxLayout.Spacing = Container.Spacing;
    VBoxLayout.Layout = {
        "AUTO": "auto",
        "FIT": "fit"
    }

    return VBoxLayout;
});