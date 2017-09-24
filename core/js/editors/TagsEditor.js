/**
 * @author:   * @date: 2016/2/26
 * 使用bootstrap-tagsinput插件
 * http://bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/
 */
define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "bootstrap-tagsinput"
], function ($, _, CommonConstant, Editor) {
    var TagsEditor = Editor.extend({
        xtype: $Component.TAGSEDITOR,
        name: null,
        display: null,
        url: null,
        plugin: null,
        /**
         * @property    {String} 如果是json对象，则是对应对象的Id对应的属性
         */
        itemId: null,
        /**
         * @property    {String} 如果是json对象，则是对应对象要显示的内容的属性
         */
        itemLabel: null,
        /**
         * @property    {String} 获取数据的url
         */
        url: null,
        /**
         * @property    {Number}    最多的tag个数
         */
        maxTags: null,
        /**
         * @property    {Number}    最多的字符串个数
         */
        maxChars: null,

        /**
         * @property    {String}    去除空格
         */
        trimValue: true,
        /**
         * @property    {Boolean}   是否允许重复，默认是不允许的
         */
        allowDuplicates: false,
        /**
         * @property    {Boolean}   是否可以自由输入，默认是可以
         */
        freeInput: true,
        /**
         * @property    {Boolean}   是否获取焦点就显示提现的内容
         */
        showHintOnFocus:false,
        /**
         * 标签的的class函数,function(item){}
         * 输入参
         * @property    {function}
         * @param   {Object} item   选择的对象
         */
        tagClass: function (item) {
            return "label label-info"
        },
        /**
         * 失去焦点事件
         */
        onblur: null,
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
            var that = this;
            //设置placeholder
            this.setPlaceholder(this.placeholder);
            this.plugin = this.$input.tagsinput({
                maxTags: that.maxTags,
                maxChars: that.maxChars,
                tagClass: that.tagClass,
                itemValue: that.itemId,
                itemText: that.itemLabel,
                trimValue: that.trimValue,
                allowDuplicates: that.allowDuplicates,
                freeInput: that.freeInput,
                typeahead: {
                    showHintOnFocus:that.showHintOnFocus,
                    source: function (query) {
                        return $.getJSON(that.url);
                    }
                }
            })[0];
            this.plugin.$input.bind("blur", function () {
                //如果编辑器不可编辑，就不进行任何处理 add by 2014.03.17
                if (that.isReadOnly())
                    return;
                that.confirmInputResult();   //对输入的结果进行确认，并且触发相关的事件
            });
            //添加按键时间
            /*this.plugin.$container.on('keydown', 'input', function (event) {
                switch (event.which) {
                    //down arrow
                    case 46:
                        //this.addDownArrowEvent(event);
                        console.info(">>>");
                        break;
                }
            }, this);*/
        },

        /**
         * 获取选择的对象
         */
        getValueObjects: function () {
            return this.plugin.items();
        },

        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroy: function () {
            this.plugin.destroy();
            this.plugin = null;
            this._super();
        }
    });

    return TagsEditor;
})
