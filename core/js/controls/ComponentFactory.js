/**
 * @module 组件工厂[ComponentFactory]
 * @description 组件工厂，用于创建各种组件
 *
 * @author:
 * @date: 2013-08-26 上午9:51
 */
var componetArray = ["core/js/Component"];
_.each($Component,function(component){
    if(component.label&&component.type&&
        (component.type==$cons.componentType.EDITOR||
        component.type==$cons.componentType.FILTER)){
        componetArray.push(component.src);
    }
});
define(componetArray, function (Component) {

    var ComponentFactory = {
        /*
         * @deprecated 由$Component的类型代替
         * 编辑器类型：1-隐藏字段；2-文本编辑器；3-数字编辑器；4-日期时间编辑器；5-下拉列表编辑器；6-下拉树编辑器；
         *             7-复选框编辑器；8-单选框编辑器；9-二态编辑器
         * 控制器类型：10-按钮
         */
        Type: {
            HIDDEN: 1,                       //hidden
            TEXT_EDITOR: 2,                 //text
            NUMBER_EDITOR: 3,              //numberfield
            DATE_TIME_EDITOR: 4,           //datefield
            DROP_DOWN_LIST_EDITOR: 5,     //
            DROP_DOWN_TREE_EDITOR: 6,
            CHECKBOX_EDITOR: 7,            //checkbox
            RADIO_EDITOR: 8,                //radio
            DIMORPHIC_EDITOR: 9,          //二态编辑器
            FILE_EDITOR: 21,          //文件上传编辑器
            HTML_EDITOR: 22,          //富文本编辑器
            IMAGE_EDITOR: 23,        //图片编辑器
            ORG_SELECTOR_EDITOR: 31,          //部门选择编辑器
            USER_SELECTOR_EDITOR: 32,          //人员选择编辑器
            LOOKUP_SELECTOR_EDITOR: 33,          //查询选择编辑器
            BUTTON: 10,                      //button
            LABEL: 11                        //label
        },
        /**
         * 创建组件
         *
         * @param compType
         * @param options
         * @return {null}
         */
        create: function (editorType, options) {
            var result = null;
            editorType = editorType || $Component.TEXTEDITOR;
            var Clazz = require(editorType.src);
            result = new Clazz(options);
            return result;
        },
        /**
         * 判断是否是组件类型
         * @param component
         * @return {boolean}
         */
        isComponent: function (component) {
            return component instanceof Component;
        },
        /**
         * 判断是否是编辑器类型
         * @param editor
         * @return {boolean}
         */
        isEditor: function (editor) {
            return editor instanceof Editor;
        },

        /**
         * 创建编辑器
         * @param editorType 编辑器类型{@link Type}
         * @param options 编辑器配置参数
         * @return {null} 编辑器控件
         */
        createEditor: function (editorType, options) {
            var result = null;
            editorType = editorType || $Component.TEXTEDITOR;
            var Clazz = require(editorType.src);
            result = new Clazz(options);
            return result;
        },
        /**
         *
         * @param filterType
         * @param options
         * @return {null} 编辑器控件
         */
        createComponent:function(componentType, options){
            var result = null;
            var Clazz = require(componentType.src);
            result = new Clazz(options);
            return result;
        },
        /**
         * 通过编辑器的类型转成成过滤器的类型，并实例化此过滤器
         * @param editorType 编辑器类型{@link Type}
         * @param options 编辑器配置参数
         * @return {null} 编辑器控件
         */
        createFilterByEditor:function(editorType, options){
            var result = null;

            var filterType = null;
            if(editorType){
                switch(editorType.name){
                    case $Component.DATEEDITOR.name:
                        filterType = $Component.DATEFILTER;
                        break;
                    case $Component.DATETIMEEDITOR.name:
                        filterType = $Component.DATETIMEFILTER;
                        break;
                    case $Component.TOUCHSPINEDITOR.name:
                        filterType = $Component.TOUCHSPINFILTER;
                        break;
                }
            }
            if(filterType){
                var Clazz = require(filterType.src);
                result = new Clazz(options);
            }
            return result;
        }
    };

    return ComponentFactory;
});