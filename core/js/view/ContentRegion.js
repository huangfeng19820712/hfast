/**
 * @module 内容区域[ContentRegion]
 * @description 内容区域，直接放置HTML文本即可显示
 *
 * @author:
 */
define(["core/js/view/Region"], function ( Region) {
    var ContentRegion = Region.extend({
        /**
         * 显示区域的内容
         * @param content
         */
        show: function (content) {
            this._showRegionContent(content);
        },
        /**
         * 获取区域的内容
         * @param content
         * @return {*}
         * @private
         * @override
         */
        _getRegionContent: function (content) {
            return content;
        }
    });

    return ContentRegion;
});