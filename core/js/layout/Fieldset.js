/**
 * @author:   * @date: 2016/1/21
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/Fieldset.html",
    "core/js/view/Region",
    "core/js/controls/ComponentFactory","core/js/layout/AbstractPanel","core/js/utils/Utils",
    "css!framework/unify/plugins/sky-forms-pro/skyforms/css/sky-forms.css",
    "css!framework/unify/plugins/sky-forms-pro/skyforms/custom/custom-sky-forms.css"
], function (CommonConstant, Container, LayoutTemplate,
             Region, ComponentFactory,AbstractPanel) {
    /**
     * 注意，仅处理隐藏的字段
     */
    var Fieldset = Container.extend(AbstractPanel).extend({
        xtype: $Component.FIELDSET,
        mainRegionConf: {
            className: "sky-form fielset-main",
            containerName: "mainRegion"
        },
        /**
         * 布局模版
         */
        template: LayoutTemplate,
        /**
         * 标题区域内的左边子内容
         */
        headerLeftRegion: null,
        /**
         * 摘要
         */
        brief: null,
        /**
         * 帮助内容
         */
        help: null,
        /**
         * 标题区域内的右边子内容
         */
        headerRightRegion: null,

        /**
         * 是否显示标题
         */
        isShowHeader: true,

        /**
         * 标题栏左边的小图片css
         */
        iconSkin: "fa fa-windows",
        className: $Component.FIELDSET.name.toLowerCase(),
        /**
         * {Array}实体表单上的字段信息
         * [{
             *      id:"<输入框的id，不是必需>"
             *      name:"[必填]<字段名称，定义提交到服务端的参数名称>",
             *      realName:"[必须存在，但不是必填]<最后传输到服务器的参数名称,默认同name>",
             *      label:"<字段显示的别名，如果，没有则使用name>",
             *      hidden："<是否是隐藏，true|false ,默认是false>",不处理隐藏的字段
             *      value："<值>",
             *      rules:"<校验规则,jquery.validate的关于这个字段的rules属性>{}",
             *      message："<校验规则,jquery.validate的关于这个字段的messages属性>{",
             *      editorType:"<编辑器类型，默认是文本类型>",
             *      iconSkin:"<小图片的class>",
             *      decimals："<针对number类型的编辑器，保留几位小数>",
             *      step:"<针对number类型的编辑器，增量值>"，
             *      readonly："<是否可以编辑，true|false，默认是false>",
             *      colspan:"<number,占用的栏位>",
             * },...
             * ]
             */
        fields: null,
        /**
         * {Object}默认编辑器的配置
         */
        defaultEditorConf:null,
        /**
         * 字段对象的引用数组
         */
        _fieldsObj:null,
        /**
         * 容器中分的列数，系统会自动分为最多12列,所有次数最好能被12整除，
         * 如果defaultColumnSize为null，则整除totalColumnNum后的栏位大小会设置会修改defaultColumnSize的值
         */
        totalColumnNum:1,
        /**
         * 默认的栏位大小
         */
        defaultColumnSize:null,
        /**
         * 默认的栏位class类
         */
        _defaultColumnClassName:null,

        /**
         * 设置是否有滚动条
         */
        autoScroll:true,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initializeHandle: function () {
            this._super();
            this.data = {
                title: this.title,
                brief: this.brief,
                iconSkin: this.iconSkin,
                mainRegionId: this.getConfId(this.mainRegionConf),
                collapsible:this.collapsible,
            };
            this._fieldsObj={};
            if(this.defaultColumnSize!=null){
                this._defaultColumnClassName = this.defaultColumnSize;
            }else{
                if(this.totalColumnNum){
                    this._defaultColumnClassName = $cons.fluidLayoutClassnamePre+Math.floor(12 / this.totalColumnNum);
                }else{
                    this._defaultColumnClassName = $Column.COL_MD_12;
                }
            }
        },

        /**
         * 创建字段
         * @param fields
         */
        createFields: function (fields) {
            var fieldObj = this._addFields(fields, 0);
            this._fieldsObj = _.extend(this._fieldsObj,fieldObj);
        },
        /**
         *
         * @param fields
         * @param startColumn   开始的列
         * @param startRow      开始的行
         * @private
         */
        _addFields:function(fields,startColumn,startRow){
            var fieldObjs = {};
            if (fields != null && _.isArray(fields)) {
                var that = this;
                var i = startColumn;
                var j = 0;
                var row = startRow;
                _.each(fields,function(field,key){
                    if(field){
                        var fieldConf = {};
                        _.extend(fieldConf,that.defaultEditorConf,field);
                        var fieldObj = that.createField(fieldConf);
                        var fieldColumnSize = 1;
                        if(fieldConf.colspan){
                            fieldColumnSize = fieldConf.colspan;
                        }

                        fieldObjs[fieldConf.name] = fieldObj;
                        fieldObj.render();
                        //Todo 此处初始化后在设置父节点，这样造成Region渲染后，才会渲染子组件，与框架整体思路违背
                        //如果在配置参数中就设置parent与naturalFather、regionParent，会在成渲染事件冒泡中断，父组件的children不一致
                        fieldObj.setParent(that);

                        /*//给Region添加子组件
                        fieldObj.regionParent = that.getRegion(that.mainRegionConf.id);
                        fieldObj.setNaturalFather(that.getRegion(that.mainRegionConf.id));*/


                        if(that.totalColumnNum>1){
                            //var m = i%that.totalColumnNum;
                            var m = i+fieldColumnSize;
                            //i=+fieldColumnSize;
                            //if(m==0){
                            if(i==0||that.totalColumnNum<m){
                                row = that._addRow(j);
                                that.getMainRegionEl().append(row);
                                //每新增一个行，清零
                                i=0;
                                j++;
                            }
                        }else{
                            row = that.getMainRegionEl();
                        }
                        row.append(fieldObj.$el);
                        i+=fieldColumnSize;
                    }
                });

            }
            return fieldObjs;
        },
        /**
         * 动态的添加字段
         * @param fields
         */
        addFields:function(fields){
            var length = this.fields.length;
            var fieldObj = {};
            if(length>0){
                //添加到field中
                this.fields = _.union(this.fields, fields);
                //添加UI的部分
                var mod = length %this.totalColumnNum;
                var row = this.getLastRow();
                fieldObj = this._addFields(fields, mod,row);
                this._fieldsObj = _.extend(this._fieldsObj,fieldObj);
            }
            return fieldObj;
        },
        /**
         * 创建行
         * @param num
         * @private
         */
        _addRow:function(num){
            var el = $("<div/>");
            el.addClass("fieldset-row");
            //添加
            //el.css("display","inline-block");
            el.attr("id",this.id+"_row"+num);
            return el;
        },
        /**
         * 获取最后一行
         */
        getLastRow:function(){
            return this.$el.find(".fieldset-row:last");
        },
        createField: function (fieldConf) {
            var field = _.extend(fieldConf);

            /*if (field.parent == null) {
                field.parent = this;
            }*/
            if(field.editorType==null){
                field.editorType = $Component.TEXTEDITOR;
            }
            if(this.disabled!=undefined&&field.disabled==undefined){
                field.disabled = this.disabled;
            }
            if(this.readOnly!=undefined&&field.readOnly==undefined){
                field.readOnly = this.readOnly;
            }
            if(this._defaultColumnClassName){
                var columnSizeClassName = this._defaultColumnClassName;
                if(field.colspan){
                    columnSizeClassName = this._getColumnSizeClassName(field.colspan);

                }
                field.sizeClass = field.sizeClass?field.sizeClass:columnSizeClassName;
            }

            if(this.editorLayoutMode==$cons.EditorLayoutMode.VERTICAL){
                field.layoutMode = $cons.EditorLayoutMode.VERTICAL;
                if(this.editorLabelSizeClass){
                    field.labelSizeClass = this.editorLabelSizeClass
                }
                if(this.editorControlGroupSizeClass){
                    field.controlGroupSizeClass = this.editorControlGroupSizeClass
                }

            }

            return ComponentFactory.createEditor(field.editorType,field);
        },
        /**
         * 根据columnSize算出列的大小，如col-md-6
         * @param columnSize
         * @returns {string}
         * @private
         */
        _getColumnSizeClassName:function(columnSize){
            return $cons.fluidLayoutClassnamePre+(Math.floor(12 / this.totalColumnNum)*columnSize);
        },
        getMainRegionEl:function(){
            if(this.getRegion(this.mainRegionConf.id).$el.length==0){
                this.getRegion(this.mainRegionConf.id).ensureEl();

            }
            return this.getRegion(this.mainRegionConf.id).$el;
        },
        mountContent:function(){
            this._super();
            this.createFields(this.fields);
            var $legend = this.$("legend a.btn-borderless");
            if($legend&&$legend.length>0){
                var that = this;
                $legend.on("click", function (e) {
                    e.preventDefault();
                    if (that._collapsed) {
                        that.expand();
                    } else {
                        that.collapse();
                    }
                });
            }
            // this.setAutoScroll(this.autoScroll);
            //this.renderComponents(_.values(this._fieldsObj));
        },

        /**
         * 如果设置为true，则当显示内容超出区域时显示滚动条。
         * @param autoScroll
         */
        /*setAutoScroll: function (autoScroll) {
            /!* if (autoScroll == null)
                 return;

             this.autoScroll = autoScroll;
             if (autoScroll)
                 this.$el.css("overflow", "auto");*!/
            if (autoScroll) {
                this.$el.mCustomScrollbar({
                    theme: "minimal-dark",
                    autoExpandScrollbar: true,
                    advanced: {autoExpandHorizontalScroll: true}
                });
            }
        },*/

        /**
         * 初始化面板标题栏区域项
         * @private
         */
        initItems: function () {
            if (this.items == null) {
                this.items = [];
            }
            var that = this;

            if (_.isString(this.mainRegion)) {
                this.mainRegion = {
                    content: this.mainRegion
                }
            }
            this._addItem(this.mainRegionConf);
        },
        /**
         * 获取所有编辑器
         * @returns {null}
         */
        getEditors:function(){
            return this._fieldsObj;
        },

        /**
         * 返回字段的字段的编辑器
         * @param fieldName
         */
        getEditor:function(fieldName){
            if(fieldName){
                return this._fieldsObj[fieldName];
            }
        },

        close:function(triggerEvent){
            if (this.isDestroied) {
                return;
            }
            for(var i in this._fieldsObj){
                var obj = this._fieldsObj[i];
                if(obj&& _.isFunction(obj.destroy)){
                    obj.destroy();
                }
            }
            this._super(triggerEvent);
        },
        /*-------------------------------  初始化及私有方法 end  ---------------------------------------------------*/
    });
    return Fieldset;
});
