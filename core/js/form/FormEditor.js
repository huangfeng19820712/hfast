/**
 * @author:   * @date: 2016/1/18
 */
define([
    "core/js/form/AbstractFormEditor",
    "core/js/layout/Panel",
    "text!core/templates/form/form.html"
], function (AbstractFormEditor, Panel, FormViewTemplate) {

    AbstractFormEditor.DEFAULT_FORM_TEMPLATE = FormViewTemplate;
    var FormUtils = AbstractFormEditor.FormUtils;

    var FormEditor = AbstractFormEditor.extend({
        //纵向布局样式
        className: "",

        template: FormViewTemplate,

        /*-------------------表单布局相关---------------*/
        /**
         * 配置表单共显示几列，必须是能被12整除的（1，2，3，4，6, 12）
         */
        cols: 3,

        /**
         * 各分组间的间隔
         */
        spacing: 5,

        /**
         * {Array}实体表单上的面板信息
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
         *         fields: [可选]["<字段编码1>", "<字段编码2>", "<字段编码3>"],
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

        /**
         * {boolean}如果该值为true，它是按表单容器的高度来限定容器的内容，不可能超出容器，滚动条出现在内部的各个分组中
         */
        isFit: true,

        _groupMap: null,

        /**
         * 存储分组面板的高度，为尽可能减少存储信息，进行如下约定：
         * 如果高度值大于0小于5，即认为该高度是flex值，否则即认为为height的值
         */
        _groupHeightMap: null,

        /**
         * 触发表单的布局调整
         */
        onresize: null,

        /**
         * 根据给定的分组ID来隐藏指定的分组
         * @param groupIds {String}多个值用逗号分隔
         */
        hideGroups: function (groupIds) {
            this._setGroupVisible(groupIds, false);
        },
        /**
         * 根据给定的分组ID来显示指定的分组
         * @param groupIds {String}多个值用逗号分隔
         */
        showGroups: function (groupIds) {
            this._setGroupVisible(groupIds, true);
        },
        /**
         * 显示分组中主体区的内容
         * @param groupId
         * @param content
         */
        showGroupContent: function (groupId, content) {
            var group = this.getGroup(groupId);
            if (!group)
                return;
            group.showBodyContent(content);
        },
//        /**
//         * 重新加载字段集：
//         * 1.如果有传入分组的ID，那么就按照分组进行重新加载；
//         * 2.如果没有传入分组的ID，
//         * @param groupIds     多个值用逗号分隔
//         * @param isAllGroups  当groupIds为空时有效，用于判断是否刷新所有分组
//         */
//        reloadFieldSet: function(groupIds, isAllGroups){
//            //如果分组ID为空，并且需要刷新所有分组，那么就先获取所有分组的名称
//            if((groupIds == null || groupIds == "") && isAllGroups){
//                groupIds = this.getAllGroupNames();
//            }
//            if(groupIds == null || groupIds == ""){
//                this.reloadNoneGroupFieldSet();   //重新加载未分组的字段集
//                return;
//            }
//            this.reloadFieldSetByGroups(groupIds);  //
//        },
//        /**
//         * 重新加载未分组的字段集
//         * 1.如果表单不存在分组，那么返回的就是整个表单的字段；
//         * 2.如果表单存在分组，那么返回的就是尚未分组的字段
//         */
//        reloadNoneGroupFieldSet: function(){
//            var content = this._getNoneGroupContent(true),
//                $noneGroupEl = null;
//            if(this.hasGroup()){
//                var noneGroup = this.getGroup("default_group");
//                $noneGroupEl = noneGroup.getBodyContentRegion().$el;
//            }else{
//                $noneGroupEl = this.$el;
//            }
//            $noneGroupEl.get(0).innerHTML = content;
//        },
//        /**
//         * 刷新字段类型的分组（仅针对于字段分组），即显示或隐藏分组中的某些字段后，重新渲染分组
//         * @param groupIds  多个值用逗号分隔
//         */
//        reloadFieldSetByGroups: function(groupIds){
//            if(groupIds == null || groupIds == "")
//                return;
//            var groupIdArray = groupIds.split(","),
//                needRenderComponent = false,
//                groupId, group, groupConfig, groupContent, fields;
//            for(var i= 0, count=groupIdArray.length; i<count; i++){
//                groupId = groupIdArray[i];
//                group = this.getGroup(groupId);
//                if(!group)
//                    continue;
//                groupConfig = this.getGroupConfigById(groupId);
//                //如果分组的配置信息不存在，或者不是字段类型的分组，就不执行后续操作
//                if(!groupConfig || !groupConfig["fields"])
//                    continue;
//
//                needRenderComponent = true;
//                groupContent = this.getFieldGroupContent(groupConfig, true);
//
//                //此处必须调用这么使用，而不能调用jquery的html方法来赋值，这样的话会把相关的jquery对象删除，导致原来组件的事件无法触发 add by 2014.06.03
//                group.getBodyContentRegion().$el.get(0).innerHTML = groupContent;
//            }
//            if(needRenderComponent){
//                //TODO:目前在IE下会有问题，如果重新渲染组件，那么会出现一些在其它地方注册的事件无法生效的问题，所以代码先注释
////                this._initComponent(this._componentConfig);   //初始化表单控件，因为IE下会把组件删除了，所以需要重新渲染
//                this._renderFormWithComponent();                 //重新渲染表单上的组件
//            }
//        },
        /**
         * 根据分组的ID获取分组对象（Panel实例对象）
         * @param groupId   分组ID
         * @return {Panel}
         */
        getGroup: function (groupId) {
            if (!groupId || !this.hasGroup())
                return null;

            return this._groupMap[groupId];
        },
        /**
         * 获取所有分组的ID
         * @return {*}
         */
        getAllGroupNames: function(){
            if(!this.hasGroup())
                return null;
            return _.keys(this._groupMap);
        },
        /**
         * 判断表单是否有分组
         */
        hasGroup: function(){
            return this._groupMap != null;
        },
        /**
         * 向表单中追加分组
         * @param groupConfigs  {Object|Array}分组的配置信息
         * @return {*}
         */
        appendGroups: function (groupConfigs) {
            return this._insertGroups(this.$el, groupConfigs, null, false);
        },
        /**
         * 向表单中指定分组之前插入新分组
         *
         * @param targetGroupId {String}新分组要插入的指定位置（目标分组的ID）
         * @param groupConfigs  {Object|Array}分组的配置信息
         * @return {*}
         */
        insertGroupsBefore: function (targetGroupId, groupConfigs) {
            return this._insertGroups(this.$el, groupConfigs, targetGroupId, true);
        },
        /**
         * 向表单中指定分组之后插入新分组
         *
         * @param targetGroupId {String}新分组要插入的指定位置（目标分组的ID）
         * @param groupConfigs  {Object|Array}分组的配置信息
         * @return {*}
         */
        insertGroupsAfter: function (targetGroupId, groupConfigs) {
            return this._insertGroups(this.$el, groupConfigs, targetGroupId, false);
        },
        /**
         * 单个添加分组对象：向groupMap插入group对象（即panel对象）
         * @param groupId
         * @param groupObject
         */
        addGroupObject: function (groupId, groupObject) {
            if (groupId == null || groupId === "" || groupObject == null)
                return;
            var groupMap = {};
            groupMap[groupId] = groupObject;
            this.insertGroupObjects(groupMap);
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
         * 根据给定的字段名，隐藏该字段所属的组
         * @param fieldNames  多个值用逗号分隔
         */
        hideRow: function (fieldNames) {
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(",");
            var rowEl = null;
            for (var i = 0; i < fieldNameArray.length; i++) {
                rowEl = this.getRowEl($.trim(fieldNameArray[i]));
                this.setElVisible(rowEl, false);
            }
        },
        /**
         * 根据给定的字段名，显示该字段所属的行
         * @param fieldNames  多个值用逗号分隔
         */
        showRow: function (fieldNames) {
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(",");
            var rowEl = null;
            for (var i = 0; i < fieldNameArray.length; i++) {
                rowEl = this.getRowEl($.trim(fieldNameArray[i]));
                this.setElVisible(rowEl, true);
            }
        },
        /**
         * 根据给定的字段名，隐藏该字段所属的组（包括标签和组件）
         * @param fieldNames  多个值用逗号分隔
         */
        hideFieldGroup: function (fieldNames) {
            this._setFieldGroupVisible(fieldNames, false);
        },
        /**
         * 根据给定的字段名，显示该字段所属的组（包括标签和组件）
         * @param fieldNames  多个值用逗号分隔
         */
        showFieldGroup: function (fieldNames) {
            this._setFieldGroupVisible(fieldNames, true);
        },
        /**
         * 根据给定的字段名，设置该字段所属的组跨几列（共12列）
         * @param fieldName
         * @param colSpan
         */
        setFieldGroupColSpan: function (fieldName, colSpan) {
            var fieldGroupEl = this.getFieldGroupColEl($.trim(fieldName));
            if (fieldGroupEl == null)
                return;
            var $fieldGroupEl = $(fieldGroupEl);
            if ($fieldGroupEl.length == 0)
                return;
            colSpan = colSpan || "1";
            var className = $fieldGroupEl.get(0).className || "";
            var oldNameArray = className.split(" ");
            var result = [];
            for (var i = 0; i < oldNameArray.length; i++) {
                if (oldNameArray[i].indexOf("h-col-g12-") != -1)
                    continue;
                result.push(oldNameArray[i]);
            }

            result.push("h-col-g12-" + colSpan);

            $fieldGroupEl.get(0).className = result.join(" ");
        },
        /**
         * 根据字段名获取该字段归属行的DOM元素
         * @param fieldName
         * @return HTML ELEMENT
         */
        getRowEl: function (fieldName) {
            var fieldGroupColEl = this.getFieldGroupColEl(fieldName);
            if (fieldGroupColEl == null)
                return null;
            return $(fieldGroupColEl).closest('[data-role="row"]');
        },
        /**
         * 根据字段名获取该字段归属列的DOM元素
         * @param fieldName
         * @return HTML ELEMENT
         */
        getFieldGroupColEl: function (fieldName) {
            if (fieldName == null || fieldName === "")
                return null;
            var fieldGroupName = FormUtils.getFieldGroupName(fieldName);
            var $fieldGroupEl = this.$("#" + fieldGroupName);
            if ($fieldGroupEl.length == 0)
                return null;

            return $fieldGroupEl.closest('[data-role="col"]');
        },

        /*-------------------------------表单初始化操作  ---------------------------------------------------*/

        init: function (triggerEvent) {
            var autoRender = this.autoRender;
            this.autoRender = false;

            this._super(false);  //调用父类的初始化方法

            this._initGroupMap(this.groups);   //初始化分组，并向当前的容器中插入分组元素

            this.on("resize", function () {
                this.resizeLayout();  //计算表单内部面板布局
            });
            this.on("show", function(){
                this.triggerPanelShowEvent();  //触发面板的显示事件
            });

            triggerEvent = triggerEvent == null ? true : triggerEvent;  //默认是触发初始化完成后的事件
            if (triggerEvent)
                this.trigger("initialized");   //触发初始化完成后的事件

            //实例化完成后，自动渲染表单
            if (autoRender){
                this.render();   //渲染该表单
                this.autoRender = autoRender;
            }
        },
        triggerPanelShowEvent: function(){
            var groupMap = this._groupMap, code, panel;
            if (!groupMap)
                return;
            for(code in groupMap){
                panel = groupMap[code];
                panel.trigger("show");
            }
        },
        /**
         * 重置面板布局
         */
        resizeLayout: function () {
            var groupMap = this._groupMap;
            if (!groupMap)
                return;
            var formView = this.getParent(),
                formEditorRegion = formView.getFormEditorRegion();
            if(!formEditorRegion)
                return;

            var width = formEditorRegion.getWidth(),
                height = formEditorRegion.getHeight();
            width -= 20;  //需要扣除内边距padding上下各10，共20 add by 2014.09.19
            height -= 20;  //需要扣除内边距padding上下各10，共20 add by 2014.03.20

            if(!this._isFit()){
                this._resizeGroupWidth(width);
                return;
            }

            this._resizeGroup(width, height);
        },
        _isFit: function(){
            //如果为null，等同于true
            return !(this.isFit === false)
        },
        _resizeGroupWidth: function(width){
            if(this.$el.get(0).scrollHeight > 0){
                width -= 17;
            }

            var groupMap = this._groupMap,
                panelId, panel;
            for (panelId in groupMap) {
                panel = this.getGroup(panelId);

                panel.setWidth(width);
                panel.trigger("resize", {formTrigger: true});
            }
        },
        /**
         * 计算各区域的布局：固定高度的面板=面板的初始高度-5个像素的间距，按比率计算的面板=计算出来的面板高度-5个像素的间距
         * 注意：此处各区域的高度是包含间距（spacing）的，因此需要扣除，这个跟布局的计算方式是不一样的
         * @param width   容器的宽度
         * @param height   容器的高度
         */
        _resizeGroup: function (width, height) {
            var groupHeightMap = this._groupHeightMap,
                panelSize = _.size(groupHeightMap);

            //这些变量最终都要作用于center
            var flexHeight = this._getGroupFlexHeight(height),
                i = 0,
                panelId, panel, panelFlex, panelHeight;

            for (panelId in groupHeightMap) {
                ++i;

                height = groupHeightMap[panelId];
                height = parseInt(height, 10) || 0;
                if (height <= 0)
                    continue;
                panel = this.getGroup(panelId);
                if(panel.isCollapsed()){
                    panelHeight = panel.getHeight();
                }else{
                    panelFlex = height > 5 ? 0 : height;
                    if (panelFlex) {
                        panelHeight = panelFlex * flexHeight;
                    } else {
                        panelHeight = height;
                    }
                }

                //如果分组个数超过1个，并且不是最后一个，都需要设置底部间距
                if (panelSize > 1 && panelSize != i){
                    var marginBottom = panel.$el.css("margin-bottom");
                    marginBottom = parseInt(marginBottom, 10);
                    //如果已经有设置了底部的间距，那么就不再重复设置了 add by 2014.06.24
                    // 主要是修复在IE8下有分组又有下拉框时，显示下拉框，会触发window.resize事件，从而导致其它分组区域不断缩小的BUG
                    if(marginBottom != 5){
                        panel.$el.css("margin-bottom", 5);
                    }
                    //针对非收缩的情况才需要扣除间隔，收缩情况是不包含间隔的
                    if(!panel.isCollapsed())
                        panelHeight -= 5;
                }

                panel.setHeight(panelHeight);
                panel.setWidth(width);
                panel.trigger("resize", {formTrigger: true});
            }
        },
        /**
         * 获取每份flex的高度=(总高度-固定面板的高度)/份数
         */
        _getGroupFlexHeight: function (height) {
            var totalFlexHeight = height,
                groupHeightMap = this._groupHeightMap,
                flex = 0,
                panelId, panel, panelFlex;
            for (panelId in groupHeightMap) {
                height = groupHeightMap[panelId];
                height = parseInt(height, 10) || 0;
                if (height <= 0)
                    continue;
                panel = this.getGroup(panelId);
                if(panel.isCollapsed()){
                    totalFlexHeight -= (panel.getHeight() + this.spacing);  //面板收缩的情况：收缩时的高度是不包含间隔的，因此需要添加进来
                }else{
                    panelFlex = height > 5 ? 0 : height;
                    if (panelFlex){
                        flex += panelFlex;
                    }else {
                        totalFlexHeight -= height;  //这里的高度是不计算间隔的，间隔默认是包含在高度中的
                    }
                }
            }

            if (flex == 0)
                return 0;

            return totalFlexHeight / flex;
        },
        _initGroupMap: function (groups) {
            if (!groups)
                return;
            this.setPadding("10px");  //如果有分组存在，那么就需要设置表单的间距为10px；
            this.appendGroups(groups);
        },
        /**
         * 渲染表单模版，实现父类的方法
         */
        renderFormTemplate: function () {
            this._renderWithGroup();              //根据分组进行渲染
        },
        /**
         * 根据分组来渲染表单内容
         * @private
         */
        _renderWithGroup: function () {
            if (!this.hasGroup()) {
                this.$el.html(this._getNoneGroupContent(false));  //如果没有分组，就按没分组的方式来展现字段
                return;
            }

            var topGroupId, groupId, groupMap = this._groupMap, groupBodyContent;
            for (groupId in groupMap) {
                if (!topGroupId) {
                    topGroupId = groupId;
                    break;
                }
            }

            //建一个基础信息的分组来存储
            groupBodyContent = this._getNoneGroupContent(false);
            if (groupBodyContent) {
                var defaultGroupId = "default_group";
                var defaultGroupConfig = {
                    "id": defaultGroupId,
                    "title": "基础信息",
                    "items": [
                        {
                            comRef: groupBodyContent
                        }
                    ]
                }
                this.insertGroupsBefore(topGroupId, defaultGroupConfig);
            }
        },
        /**
         * 获取分组主体区要显示内容的配置
         * @param groupConfig
         * @return {*}
         * @private
         */
        _getGroupBodyItemsConfig: function (groupConfig) {
            var result = [],
                regionId = "panel_body_content";

            //如果分组的内容是字段，那么该分组的主体内容就显示字段，此处不需要过滤掉不可见的组件，因为默认已经是都可见了
            if (groupConfig["fields"]) {
                return {id: regionId, autoScroll: true, comRef: this.getFieldGroupContent(groupConfig, false) };
            }
            //如果分组的内容是URL，那么该分组的主体内容就显示URL指向的页面
            var url = groupConfig["url"];
            if (url) {
                result = {
                    id: regionId,
                    flex: 1,
                    className: "h-noborder",          //如果是指定URL的，默认都不显示边框，否则会出现边框重叠加粗 add by 2014.09.24
                    xtype: Panel.Region.XType.IFRAME,
                    comConf: {
                        url: url,
                        parent: this
                    }
                }
                return result;
            }
            //如果分组的内容是tabs，那么该分组的主体内容就显示tabs配置信息构成的Tab页
            var tabs = groupConfig["tabs"];
            if (tabs) {
                result = {
                    id: regionId,
                    flex: 1,
                    className: "h-noborder",          //如果分组内容是Tabs，默认都不显示边框，否则会出现边框重叠加粗 add by 2014.09.24
                    xtype: Panel.Region.XType.CARD,
                    comConf: {
                        tabs: tabs,
                        parent: this
                    }
                }
                return result;
            }
            var xtype = groupConfig["xtype"];
            if(xtype){
                result = {
                    id: regionId,
                    flex: 1,
                    className: "h-noborder",          //如果分组内容是某类型的组件，默认都不显示边框，否则会出现边框重叠加粗 add by 2014.09.24
                    xtype: xtype,
                    comConf: groupConfig["comConf"]
                }
                return result;
            }
            var comRef = groupConfig["comRef"];
            if(comRef){
                result = {
                    id: regionId,
                    flex: 1,
                    className: "h-noborder",          //如果分组内容是组件，默认都不显示边框，否则会出现边框重叠加粗 add by 2014.09.24
                    comRef: comRef,
                    comConf: groupConfig["comConf"]
                }
                return result;
            }
            var content = groupConfig["content"];
            if (content)
                return {id: regionId, content: content };
            return null;
        },
        /**
         * 获取未分组的内容
         * 1.如果表单不存在分组，那么返回的就是整个表单的字段；
         * 2.如果表单存在分组，那么返回的就是尚未分组的字段
         * @param isFilterInvisible   是否过滤不可见的属性，用于对某些字段进行隐藏或者显示后，对字段分组进行重新渲染时使用
         * @return {*}
         * @private
         */
        _getNoneGroupContent: function (isFilterInvisible) {
            var groupTemplate = this._getTemplate();
            var groupTemplateData = this.getNoneGroupFieldsTemplateData(isFilterInvisible);

            //如果没有待解析的数据，就直接返回
            if (groupTemplateData == null || groupTemplateData.length == 0)
                return "";

            return this._parseGroupTemplate(groupTemplate, groupTemplateData);
        },
        /**
         * 获取未分组字段的模版上下文信息
         * 1.如果表单不存在分组，那么返回的就是整个表单的字段；
         * 2.如果表单存在分组，那么返回的就是尚未分组的字段
         * @param isFilterInvisible   是否过滤不可见的属性，用于对某些字段进行隐藏或者显示后，对字段分组进行重新渲染时使用
         * @return {Array}
         */
        getNoneGroupFieldsTemplateData: function (isFilterInvisible) {
            var fieldNames = this.getNoneGroupFieldNames();
            return this.getFieldsTemplateData(fieldNames, isFilterInvisible);
        },
        /**
         * 获取未分组的字段名
         * 1.如果表单不存在分组，那么返回的就是整个表单的字段；
         * 2.如果表单存在分组，那么返回的就是尚未分组的字段
         * @return {Array}
         */
        getNoneGroupFieldNames: function () {
            var groupMap = this._groupMap,
                fieldArray = this.fields,
                result = [],
                groupFieldArray = [],
                groupId, fields, field, j, fieldCount, fieldName, isExisted;
            if(!groupMap)
                return this.getAllFieldNames();

            for (groupId in groupMap) {
                fields = groupMap[groupId]["fields"];
                if (!fields)
                    continue;
                groupFieldArray = groupFieldArray.concat(fields);
            }

            for (var i = 0, count = fieldArray.length; i < count; i++) {
                isExisted = false;
                field = fieldArray[i];
                fieldName = FormUtils.getFieldName(field);

                for (j = 0, fieldCount = groupFieldArray.length; j < fieldCount; j++) {
                    if (fieldName == groupFieldArray[j]) {
                        isExisted = true;
                        break;
                    }
                }
                if (!isExisted)
                    result.push(fieldName);  //如果不存在某个分组中，就设置到结果集中
            }
            return result;
        },
        /**
         * 获取表单所有的字段名
         * @return {Array}
         */
        getAllFieldNames: function(){
            var fieldArray = this.fields,
                result = [],
                field, j, fieldName;
            if(fieldArray == null)
                return result;
            for (var i = 0, count = fieldArray.length; i < count; i++) {
                field = fieldArray[i];
                fieldName = FormUtils.getFieldName(field);

                result.push(fieldName);  //如果不存在某个分组中，就设置到结果集中
            }
            return result;
        },
        /**
         * 根据分组的ID来获取分组的配置信息
         * @param groupId
         * @return {*}
         */
        getGroupConfigById: function(groupId){
            if(groupId == null || groupId === "" || !this.groups)
                return null;
            var groups = this.groups,
                group;
            for(var i= 0, count=groups.length; i<count; i++){
                group = groups[i];
                if(groupId == group["id"])
                    return group;
            }
            return null;
        },
        /**
         * 获取字段分组的内容
         * @param groupConfig
         * @param isFilterInvisible   是否过滤不可见的属性，用于对某些字段进行隐藏或者显示后，对字段分组进行重新渲染时使用
         * @return {*}
         */
        getFieldGroupContent: function (groupConfig, isFilterInvisible) {
            var groupTemplate = groupConfig["fieldTemplate"] || this._getTemplate(),
                groupTemplateData = this.getFieldsTemplateData(groupConfig["fields"], isFilterInvisible);

            //如果没有待解析的数据，就直接返回
            if (groupTemplateData == null || groupTemplateData.length == 0)
                return "";
            return this._parseGroupTemplate(groupTemplate, groupTemplateData);
        },
        /**
         * 解析表单的分组的模版
         * @param groupTemplate
         * @param groupTemplateData
         * @private
         */
        _parseGroupTemplate: function (groupTemplate, groupTemplateData) {
            var cols = this.get("cols", 3),
                labelAlign = this.isLabelRightAlign() ? "h-text-right" : "",
                groupContext = FormUtils.getFieldTemplateContext(groupTemplateData, cols, labelAlign);
            if (groupContext == null)
                return groupTemplate;

            return _.template(groupTemplate, groupContext);
        },
        /**
         * 设置分组是否可见
         * @param groupIds    {String}分组的ID，多个值用逗号分隔
         * @param isVisible   {Boolean}这些分组是否可见
         * @private
         */
        _setGroupVisible: function (groupIds, isVisible) {
            if (!groupIds)
                return;
            var groupIdArray = groupIds.split(","),
                groupMap = this._groupMap,
                group, groupId;
            if (!groupMap)
                return;
            for (var i = 0, count = groupIdArray.length; i < count; i++) {
                groupId = $.trim(groupIdArray[i]);
                group = groupMap[groupId];
                if (!group)
                    continue;
                group.setVisible(isVisible);     //该分组设置成可见或不可见
            }
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
         * 创建分组对象
         * @param groupConfigArray  {Object|Array}分组的配置信息
         * @return {*}
         * @private
         */
        _createGroupObjects: function (groupConfigArray) {
            if (groupConfigArray == null)
                return null;
            if ($.isPlainObject(groupConfigArray))
                groupConfigArray = [groupConfigArray];
            if (!$.isArray(groupConfigArray))
                return null;

            this._groupHeightMap = this._groupHeightMap || {};
            var that = this,
                result = {},
                i, length, config, id, panel, height;
            for (i = 0, length = groupConfigArray.length; i < length; i++) {
                config = groupConfigArray[i];
                config["className"] = "h-panel h-panel-sub";    //表单内部的分组统一采用二级子面板 add by 2014.03.19
                config["items"] = config["items"] || this._getGroupBodyItemsConfig(config);
                config["parent"] = this;   //设置面板的父类为当前编辑器
                config["layout"] = config["layout"] || "auto";  //分组默认都是自动的流式布局，不需要计算高度的

                //如果不是自适应容器的高度，并且没有指定面板的高度，就将布局设置成auto；从而解决按照默认div排版，根据内容自动撑开div add by 2014.09.23
                if(!this._isFit() && !config["height"]){
                    config["layout"] = "auto";
                }

                id = config["id"];    //要求配置项中都必须有ID，然后以id做为键进行存储，便于后续对其的访问
                panel = new Panel(config);
                panel.on("resize", function (e) {
                    //如果是表单全局触发的，就不再重复触发布局事件
                    var isFormTrigger = e["formTrigger"];
                    if (isFormTrigger)
                        return;
                    that.resizeLayout();   //触发该表单中其它面板重新布局
                });
                result[id] = panel;
                if(config["layout"] != "auto")
                    this._groupHeightMap[id] = config["height"] || config["flex"] || 1;  //存储分组的高度
            }

            return result;
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
         * 设置字段组（包括字段和标签）是否可见
         * @param fieldNames  多个值用逗号分隔
         * @param visible
         * @private
         */
        _setFieldGroupVisible: function(fieldNames, visible){
            if (fieldNames == null)
                return;
            var fieldNameArray = fieldNames.split(","),
                fieldName, fieldGroupEl, editor;
            for (var i = 0; i < fieldNameArray.length; i++) {
                fieldName = $.trim(fieldNameArray[i]);
                fieldGroupEl = this.getFieldGroupColEl(fieldName);
                editor = this.getEditor(fieldName);

                //同时设置编辑器是否可见，这里不调用setVisible避免重复设置组件是否显示
                if(editor)
                    editor.visible = visible;

                this.setElVisible(fieldGroupEl, visible);
            }
        },
        /**
         * 错误信息与输入框的对齐方式
         * add by 2014.07.07
         * @return {*}
         */
        getErrorMsgAlign: function(){
            if(this.cols == 1){
                return "bottom";
            }
            return "right";
        },
        /**
         * 根据当前给定的字段名，获取界面上，下一个组件对应的字段
         * 主要用于按回车或者tab键，光标自动下移
         * add by 2014.07.14
         * @param currentFieldName  如果为空，就返回第一个字段
         * @return {*}
         * @private
         * @override
         */
        _getNextFieldName: function(currentFieldName){
            if(!this.hasGroup())
                return this._super(currentFieldName);
            var groups = this.groups,
                group, fields, currentIndex;
            for(var i= 0, count=groups.length; i<count; i++){
                group = groups[i];
                fields = group["fields"];
                if(fields == null || fields.length == 0)
                    continue;
                if(!currentFieldName){
                    return fields[0];
                }
                currentIndex = _.indexOf(fields, currentFieldName);
                if(currentIndex == -1)
                    continue;
                //如果已经是该分组的最后一项了，就将当前字段名设置为空，取下一个分组的第一个字段
                if(currentIndex == fields.length -1){
                    currentFieldName = null;
                    continue;
                }

                return fields[currentIndex + 1];
            }
            return null;
        },
        /**
         * 组件销毁，便于浏览器进行内存回收，防止内存不断飙升
         * @override
         */
        destroySelf: function () {
            this._super();   //先销毁组件，再销毁面板，顺序不能调换（因为如果调换的话，dom元素已经被删除，就无法获取其中的data数据了），否则会影响文件上传控件的销毁

            //销毁面板分组
            this.groups = null;
            var panelMap = this._groupMap,
                panelId, panel;
            for(panelId in panelMap){
                panel = panelMap[panelId];
                if(_.isFunction(panel.close))
                    panel.close();
                panel = null;
            }

            this._groupMap = null;
            this._groupHeightMap = null;
        }

    });
    FormEditor.Type = AbstractFormEditor.Type;
    FormEditor.ShowErrorType = AbstractFormEditor.ShowErrorType;
    FormEditor.FormUtils = AbstractFormEditor.FormUtils;
    FormEditor.Scene = AbstractFormEditor.Scene
    FormEditor.LabelAlign = AbstractFormEditor.LabelAlign;
    return FormEditor;
});
