/**
 * @author:   * @date: 2016/1/18
 */
define([$Component.TOOLSTRIP.src,
    $Component.TOOLSTRIPITEM.src,
    "core/js/form/AbstractFormEditor",
    "core/js/controls/ComponentFactory", "core/js/utils/Utils"
], function (ToolStrip,ToolStripItem,
             AbstractFormEditor, ComponentFactory) {
    var NavFormEditor = AbstractFormEditor.extend({
        eTag:"<form/>",
        xtype: $Component.NAVFORMEDITOR,
        className:"navbar-form",
        fieldIdPref: "field",
        formModel:null,
        /**
         * 所有编辑器的对象
         */
        _editors:null,
        /**
         * 按钮栏的配置
         */
        toolStripConf:null,
        toolStripRef:null,
        /**
         * 设置form的模型
         * @param model
         */
        setFormModel:function(model){
        },
        getFormModel:function(){
            return this.formModel;
        },
        /**
         * 表单的渲染包含两部分，首先渲染表单模版，然后将组件显示到指定的容器中
         */
        mountContent: function () {
            this._super();
            this.createFields(this.fields);
            //this._initEditors();
            //添加按钮
            if(this.toolStripConf){
                var conf = _.extend({
                    $container: this.$el,
                    parent:this
                },this.toolStripConf);
                this.toolStripRef = new ToolStrip(conf);
            }
        },
        /**
         * 创建字段集合
         * @param fields
         */
        createFields:function(fields){
            this._editors = [];
            if (fields != null && _.isArray(fields)) {
                var that = this;
                _.each(fields,function(field,key){
                    if(field){
                        field.$container = that.$el;
                        field.className = "form-group";
                        var fieldObj = that.createField(field);
                        //that.$el.append(fieldObj.$el);
                        that._editors[field.name] = fieldObj;
                    }
                });
            }
        },
        /**
         * 创建单个字段
         * @param field
         * @returns {*|null}
         */
        createField:function(field){
            return ComponentFactory.createEditor(field.editorType,field);
        },
        destroySelf:function(){
            var values = _.values(this._groupMap);
            var that = this;
            _.each(values,function(value,key){
                if (_.isFunction(value.destroy)){
                    value.destroy();
                }
            });
            this._super();
        }
    });
    return NavFormEditor;
});
