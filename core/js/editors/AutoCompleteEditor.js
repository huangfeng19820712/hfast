/**
 * @module 自动补齐编辑器[AutoComplete]
 * @description 自动补齐编辑器
 * @date: 2014-05-12 下午2:43
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor","bootstrap3-typeahead"
], function (CommonConstant, Editor) {
    var AutoCompleteEditor = Editor.extend({
        xtype: $Component.AUTOCOMPLETEEDITOR,
        name:null,
        display:null,
        url:null,
        source:null,
        plugin:null,
        /**
         * @property    {String} 如果是json对象，则是对应对象的Id对应的属性
         */
        itemId: null,
        /**
         * @property    {String} 如果是json对象，则是对应对象要显示的内容的属性
         */
        itemLabel: null,
        /**
         * @property    {Boolean}   是否可以自由输入，默认是可以
         */
        freeInput: true,
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.SIMPLE);
            }
            this._super();
        },
        /**
         * 初始化组件
         * @private
         */
        _initWithPlugIn: function () {
            var $input = this.$input;
            this.plugin = $input.typeahead({
                source:this.source,
                autoSelect: true,
                freeInput:this.freeInput});
            $input.change(function() {
                var current = $input.typeahead("getActive");
                if (current) {
                    // Some item from your model is active!
                    if (current.name == $input.val()) {
                        // This means the exact match is found. Use toLowerCase() if you want case insensitive match.
                    } else {
                        // This means it is only a partial match, you can either add a new item
                        // or take the active if you don't want new items
                    }
                } else {
                    // Nothing is active so it is a new value (or maybe empty value)
                }
            });
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this.plugin.typeahead("destroy");
            this.plugin = null;
            this._super();
        },
        /**
         * 获取选中的对象
         * @returns {*}
         */
        getValueObject:function(){
            return this.plugin.typeahead("getActive");
        },
        /**
         * 获取值
         * @returns {*}
         */
        getValue:function(){
            var item = this.plugin.typeahead("getActive");
            if(item!=null){
                return item[this.itemValue];
            }
            return;
        }
    });

    return AutoCompleteEditor;
})