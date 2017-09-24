/**
 * @author:   * @date: 2016/2/28
 */

define(["underscore", "core/js/Class"], function (_, Class) {
    /**
     * 表单处理的工具类，除了给FormEditor内部使用外，主要是提供给表单的模型解析使用，用于解决嵌套的属性面板中显示字段的问题
     */
    var FormUtils =  Class.extend({
        /**
         * 获取字段分组的内容
         * @param fieldArray
         * @param fieldTemplate
         * @param cols
         * @param labelAlign
         * @return {*}
         */
        getFieldGroupContent: function (fieldArray, fieldTemplate, cols, labelAlign) {

        },
        /**
         * 获取字段在模版中对应的配置信息
         * @param field
         * @return {{groupId: *, field: *, colSpan: *, labelId: *, emphasisId: *, required: (*|boolean), caption: *}}
         */
        getFieldTemplateData: function (field) {

        },
        /**
         * 获取模版的上下文信息
         * @param templateData
         * @param cols
         * @param labelAlign
         * @return {{rows: Array, baseCol: number}}
         */
        getFieldTemplateContext: function (templateData, cols, labelAlign) {

        },
        /**
         * 获取字段名，没有指定name，就获取id
         * @param field
         * @return {*}
         */
        getFieldName: function (field) {
            return field["name"] || field["id"];
        },
        /**
         * 根据字段名获取字段标签必填提示的名称
         * @param fieldName
         * @return {*}
         */
        getFieldEmphasisHintName: function (fieldName) {
            return this.joinString(fieldName, "_emphasis");
        },
        /**
         * 根据字段名获取字段标签的名称
         * @param fieldName
         * @return {*}
         */
        getFieldLabelName: function (fieldName) {
            return this.joinString(fieldName, "_label");
        },
        /**
         * 根据字段名获取字段显示的容器
         * @param fieldName
         * @param container   如果指定了容器，那么优先使用该容器
         */
        getFieldContainer: function (fieldName, container) {
            var controlId = this.getFieldControlName(fieldName);
            //此处不直接使用#id，是因为如果id是带有.的字符串（例如orderPanel.id_group）时，那么点后面的就被识别为className  add by 2014.1.7
            return container || ["[id='", controlId, "']"].join("");
        },
        /**
         * 根据字段名获取字段控制的名称
         * @param fieldName
         * @return {*}
         */
        getFieldControlName: function (fieldName) {
            return this.joinString(fieldName, "_control");
        },
        /**
         * 根据字段名获取字段归属的组名
         * @param fieldName
         * @private
         */
        getFieldGroupName: function (fieldName) {
            return this.joinString(fieldName, "_group");
        },
        /**
         * 连接字符串
         * @return {String}
         */
        joinString: function () {
            var argCount = arguments.length;
            var result = [];
            var arg = null;
            for (var i = 0; i < argCount; i++) {
                arg = arguments[i];
                if (arg == null)
                    continue;
                result.push(arg);
            }

            return result.join("");
        }
    });

    FormUtils.getInstance = function () {
        return new FormUtils();
    }

    return FormUtils.getInstance();
});
