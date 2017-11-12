/**
 * @author:   * @date: 2016/1/16
 */
define([
    "core/js/controls/Control",
    "core/js/grid/Pagination",
    "core/js/utils/Utils"
], function ( Control,Pagination,Utils) {
    var AbstractGrid = Control.extend({
        model:null,
        /**
         * [{
         *      name:{String}[必填]<字段的唯一表示>
         *      label：{String}<显示的列标题,如果不填，则显示name的内容>
         *      editor:{String|Object}<编辑器,可以是字符串，也可以是编辑器的对象>
         *      searchoptions：{Array}<下拉框的选项>
         * }
         * ]
         */
        colModel:null,
        /**
         * json的解析器
         * {
         *      currentPage：[选填]<当前页面，默认值是1>
         *
         * }
         */
        jsonReader:null,
        /**
         * post到服务器的额外数据
         */
        postData:null,
        /**
         * 是否可分页，默认值是ture
         */
        pageable:true,
        data:null,
        /**
         * 获取列表内容
         */
        url:null,
        editurl:null,
        /**
         * 组件对象的句柄
         */
        $table:null,
        $pagination:null,
        /**
         * 表单的栏位数
         */
        formColumnSize:null,

        /**
         * {Boolean}是否需要查询工具栏，如果是true，则显示查询栏
         * @private
         */
        searchOperators:true,
        destroy:function(){
            this.model = null;
            this.$table = null;
            this.$pagination = null;
            this._super();
        }
    });
    return AbstractGrid;
});


