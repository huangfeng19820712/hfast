/**
 * @author:   * @date: 2016/1/18
 */
define(["jquery",
    "underscore",
    "core/js/form/AbstractFormEditor",
    "core/js/layout/Fieldset", "core/js/utils/Utils"
], function ($, _, AbstractFormEditor, Fieldset) {
    var SkyFormEditor = AbstractFormEditor.extend({
        eTag:"<form/>",
        xtype: $Component.SKYFORMEDITOR,
        /**
         * {Array}实体表单上的面板信息,没有groups时，所有的fields都在一个默认的group中
         * @example
         * <code>
         *     [{
         *         id: "[必填]<面板编码>",
         *         title: "[必填]<面板名称>",
         *         collapsible: "[可选]<可折叠的，true|false>",
         *         expanded: "[可选]<展开的，true|false>",
         *         height: "[可选]<面板高度，不指定就按内容自动撑开>",
         *         type: "[可选，默认为字段类型面板]<面板类型 1：实体字段面板  2：实体关联面板  3：自定义面板>",
         *         viewType: "[可选,默认为页面聚合]<展现方式 1：页面聚合  2：TAB页聚合>"
         *         url: "[可选，针对实体关联面板和自定义面板有用]<通过URL来指定面板内容>"
         *         fields: [可选]<字段信息，如果是All则是所有的字段>["<字段编码1>", "<字段编码2>", "<字段编码3>"],
         *         subGroups: [可选，针对嵌套的面板而言才有][{
         *             code: "[必填]<面板编码>",
         *             title: "[必填]<面板名称>",
         *             collapsible: "[可选]<可折叠的，true|false>",
         *             expanded: "[可选]<展开的，true|false>",
         *             height: "[可选]<面板高度，不指定就按内容自动撑开>",
         *             url: "[可选]<通过URL来指定面板内容>"
         *             fields: [可选]["<字段编码1>", "<字段编码2>", "<字段编码3>"]
         *         },...],
         *         content: "[可选，针对自定义面板有用，直接指定文本也可以]"
         *     },...]
         * </code>
         */
        groups: null,

        $groups: null,

        _groupMap: null,
        /**
         * groups中index与id的映射集合
         */
        _indexIdMap:null,

        fieldIdPref: "field",

        formModel:null,

        /**
         * 默认的fieldset对象的配置
         */
        defaultFieldsetConf:null,

        /**
         * 面板的全局默认是否伸缩，如果group有定义则覆盖此值
         */
        defaultCollapsible:true,

        /**
         * 所有编辑器的对象
         */
        _editors:null,
        /**
         * 设置form的模型
         * @param model
         */
        setFormModel:function(model){


        },
        getFormModel:function(){
            return this.formModel;
        },
        _initGroupMap: function (groups) {
            this.appendGroups(groups);
        },
        /**
         * 向指定的容器元素中的指定位置插入分组
         *
         * @param $containerEl   JQuery Object 要放置分组的界面容器(JQuery对象)
         * @param groupConfigs   {Object|Array}分组的配置信息
         * @param targetGroupId  {String}新分组要插入的指定位置（目标分组的ID）
         * @param isBefore       {boolean}在指定位置之前还是之后
         * @return {*}
         * @private
         */
        _insertGroups: function ($containerEl, groupConfigs, targetGroupId, isBefore) {
            var groups = this._createGroupObjects(groupConfigs);    //根据分组的配置信息创建分组对象（Panel）
            if (groups == null)
                return this;

            this.insertGroupObjects(groups); //插入分组对象
            this._insertGroupsToContainer($containerEl, groups, targetGroupId, isBefore);   //新增分组界面元素

            return this;
        },
        /**
         * 批量添加分组对象：向groupMap插入group对象（即panel对象）
         * @param groupMap
         */
        insertGroupObjects: function (groupMap) {
            if (!$.isPlainObject(groupMap))
                return;
            var existedGroupMap = this._groupMap || {},
                groupId;
            for (groupId in groupMap) {
                existedGroupMap[groupId] = groupMap[groupId];
            }
            this._groupMap = existedGroupMap;
        },
        /**
         * 向指定的容器中的指定位置插入分组
         * @param $containerEl     要放置分组的容器(JQuery对象)
         * @param groupMap         要插入的分组对象（Panel的实例对象）
         * @param targetGroupId    指定位置（目标分组的ID）
         * @param isBefore         {boolean}在指定位置之前还是之后
         * @private
         */
        _insertGroupsToContainer: function ($containerEl, groupMap, targetGroupId, isBefore) {
            if (!groupMap || !$containerEl)
                return;
            var $groupElArray = [], groupId, group;
            for (groupId in groupMap) {
                group = groupMap[groupId];
                group.render(); //渲染分组的内容
                $groupElArray.push(group.$el);
            }
            //此处不直接使用#id，是因为如果id是带有.的字符串（例如orderPanel.id_group）时，那么点后面的就被识别为className  add by 2014.1.7
            var $targetGroupEl = $containerEl.find("[id='" + targetGroupId + "']");
            if ($targetGroupEl.length == 0) {
                $containerEl.append($groupElArray);
                return;
            }

            if (isBefore) {
                $targetGroupEl.before($groupElArray);
            } else
                $targetGroupEl.after($groupElArray);
        },
        /**
         * 创建分组对象
         * @param groupConfigArray  {Object|Array}分组的配置信息
         * @return {*}
         * @private
         */
        _createGroupObjects: function (groupConfigArray) {
            var that = this,
                result = {};
            if(this._indexIdMap==null){
                this._indexIdMap = {};
            }
            if (groupConfigArray == null){
                //var id =  $.createId(this.fieldIdPref);    //要求配置项中都必须有ID，然后以id做为键进行存储，便于后续对其的访问
                var createFieldset =  this._createFieldset(null,this.fields);
                result[createFieldset.id] = createFieldset;

                this._indexIdMap[0] = createFieldset.id;
                return result;
            }
            if ($.isPlainObject(groupConfigArray))
                groupConfigArray = [groupConfigArray];
            if (!$.isArray(groupConfigArray))
                return null;
            for (var i = 0, length = groupConfigArray.length; i < length; i++) {
                var config = groupConfigArray[i];
                if(!config){
                    continue;
                }
                var createFieldset = this._createFieldset(config,this.fields);
                result[createFieldset.id] = createFieldset;
                this._indexIdMap[i] = createFieldset.id;
                /*if(!config.id){
                    //赋值id，方便检索对象
                    config.id = createFieldset.id;
                }*/

            }

            return result;
        },
        /**
         * 根据配置中数据的位置，获取Fieldset对象
         * @param index
         * @returns {*}
         */
        getFieldset:function(index){
            //var group = this.groups[index];
            var id = this._indexIdMap(index);
            return  this._groupMap[id];
        },
        /**
         * 获取分组主体区要显示内容的配置
         * @param groupConfig
         * @return {*}
         * @private
         */
        _getGroupBodyItemsConfig: function (list, fields) {
            var result = _.filter(list, function (item) {
                if(item&&item.name&&fields.indexOf(item.name) >= 0) {
                    return true;
                } else {
                    return false;
                }
            });
            return result;
        },
        /**
         * 创建Fieldset对象,config为null时，默认使用this.fields
         * @param config    配置信息
         * @param fields    过滤的字段信息
         * @returns {*}
         * @private
         */
        _createFieldset:function(config,fields){
            var fieldsetConfig = {};

            _.extend(fieldsetConfig,this.defaultFieldsetConf);

            fieldsetConfig["parent"] = this;   //设置面板的父类为当前编辑器
            if(config==null||config.collapsible==null){
                fieldsetConfig["collapsible"] = this.defaultCollapsible;
            }else{
                fieldsetConfig["collapsible"] = config.collapsible
            }

            if(this.disabled!=undefined&&fieldsetConfig.disabled==undefined){
                fieldsetConfig.disabled = this.disabled;
            }
            if(this.readOnly!=undefined&&fieldsetConfig.readOnly==undefined){
                fieldsetConfig.readOnly = this.readOnly;
            }

            fieldsetConfig.totalColumnNum = this.totalColumnNum;
            fieldsetConfig.defaultColumnSize = this.defaultColumnSize;

            if(!config){
                this.handleHiddenFields(fields);
                //去除hidden的字段
                fieldsetConfig["fields"] = this.handleWithoutHiddenFields(fields);
            }else{
                //判断是有字段集合，还是其他控件
                if (config.fields) {
                    this.handleHiddenFields(fields);

                    //config["className"] = "h-panel h-panel-sub";    //表单内部的分组统一采用二级子面板 add by 2014.03.19
                    if(config.fields==$cons.groupField.ALL){
                        var withoutHiddenFields = this.handleWithoutHiddenFields(this.fields);
                        fieldsetConfig["fields"] = withoutHiddenFields;
                    }else{
                        var withoutHiddenFields = this.handleWithoutHiddenFields(fields);
                        fieldsetConfig["fields"] = this._getGroupBodyItemsConfig(withoutHiddenFields, config.fields);
                    }
                    if (fieldsetConfig["fields"].length == 0) {
                        return null;
                    }
                } else {
                    //其他组件
                    if (config.comXtype) {
                        fieldsetConfig["mainRegion"] = _.extend({},config);
                    } else {
                        return null;
                    }
                }
            }

            return new Fieldset(fieldsetConfig);
        },


        /**
         * 向表单中追加分组
         * @param groupConfigs  {Object|Array}分组的配置信息
         * @return {*}
         */
        appendGroups: function (groupConfigs) {
            return this._insertGroups(this.$el, groupConfigs, null, false);
        },
        triggerPanelShowEvent: function () {
            var groupMap = this._groupMap, code, view;
            if (!groupMap)
                return;
            for (code in groupMap) {
                view = groupMap[code];
                view.trigger("show");
            }
        },
        /**
         * 表单的渲染包含两部分，首先渲染表单模版，然后将组件显示到指定的容器中
         */
        mountContent: function () {
            this._super();
            this._initGroupMap(this.groups);   //初始化分组，并向当前的容器中插入分组元素

            this.on("resize", function () {
                this.resizeLayout();  //计算表单内部面板布局
            });
            this.on("show", function () {
                this.triggerPanelShowEvent();  //触发面板的显示事件
            });
            this._initEditors();
        },
        _initEditors:function(){
            //获取所有fieldset对象
            var values = _.values(this._groupMap);
            var that = this;
            _.each(values,function(value,key){
                if(_.isFunction(value.getEditors)){
                    var editors = value.getEditors();
                    that._editors = _.extend(that._editors?that._editors:{},editors);
                }
            });
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
    return SkyFormEditor;
});
