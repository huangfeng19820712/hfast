/**
 * 视图的工具类，由于BaseView与Control中都有关于视图的操作，
 * @author:   * @date: 2015/12/29
 */
define(["underscore", "core/js/Class"], function (_, Class) {
    var ViewUtils = Class.extend({
        /**
         * 生成icon的class
         * @param icon     主题
         * @param rotated  旋转方式
         * @param size    大小
         * @param isList    是否列表项目
         */
        createIconClass: function (icon, rotated, size, isList) {
            if(icon==null){
                return null;
            }
            var items = [" fa"];
            items.push(icon);
            if(rotated){
                items.push(rotated);
            }
            if(size){
                items.push(size);
            }
            if(isList){
                items.push("fa-li");
            }
            return items.join(" ");
        },
        /**
         * 获取组件对象
         */
        getControl:function(){

        }
    });
    ViewUtils.getInstance = function () {
        return new ViewUtils();
    }

    return ViewUtils.getInstance();
});
