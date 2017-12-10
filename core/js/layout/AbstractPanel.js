/**
 * @author:   * @date: 2016/1/25
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/Panel.html",
    "core/js/view/Region","core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem",
    "core/js/controls/HelpLink",
    "core/js/utils/Utils",
], function ($, CommonConstant, Container, LayoutTemplate,Region,ToolStrip,ToolStripItem,HelpLink) {
    return {
        /**
         * {boolean}控制该面板是否允许折叠，默认是不可折叠
         * @default false
         */
        collapsible: false,

        /**
         * {boolean}如果该面板允许折叠，显示初始化是否为折叠状态
         * @default false
         */
        collapsible: true,

        _collapsed: false,          //控制面板是否处于折叠状态
        /**
         * 主容器Region的配置项
         * {
         *
         *      xtype:"[必填]<字段名称，定义提交到服务端的参数名称>",
         *
         * }
         */
        mainRegion: null,
        /**
         * 主区域引用的对象
         */
        mainRegionRef:null,
        /**
         * 标题
         */
        title: null,

        /**
         * 设置title的值，并显示到页面中
         * @param title
         */
        setTitle:function(title){
            this.title = title;

        },
        /**
         * 根据子区域的配置项，获取id，如果没有，则创建一个id
         * @param conf
         */
        getConfId:function(conf){
            if(!conf.id){
                conf.id = this.getIdByConf(conf);
            }
            return conf.id;
        },
        /**
         * 根据配置生成id
         */
        getIdByConf:function(conf){
            return $.createId(this.getRegionName(conf.containerName));
        },
        /**
         * 添加子节点到
         * @param idStr
         * @param className
         * @param containerProp
         * @private
         */
        _addItem:function(conf){
            if(!conf.id){
                conf.id = this.getIdByConf(conf);
            }
            var item = {
                id: conf.id,
                className: conf.className,
            };
            if(_.isObject(this[conf.containerName])){
                item = _.extend(item,this[conf.containerName]);
            }
            this.items.push(item);
        },

        /**
         * 判断当前面板是否处于展开状态
         * @return {boolean}
         */
        isExpanded: function () {
            return !this.isCollapsed();
        },
        /**
         * 判断面板内容是否可折叠
         * @return {boolean}
         */
        isCollapsible: function () {
            return this.collapsible != null && this.collapsible;
        },
        /**
         * 收缩（折叠）面板
         */
        collapse: function () {
            if (this.isCollapsible() && this.isCollapsed())
                return;

            this._collapsed = true;   //更改面板显示状态：收缩
            this.$('#'+this.mainRegionConf.id).slideUp(300);
            this.$('i.fa-chevron-up').toggleClass('fa-chevron-down');
        },
        isCollapsed:function(){
            return this._collapsed;
        },
        /**
         * 展开面板
         */
        expand:function(){
            if (this.isCollapsible() && this.isExpanded())
                return;
            this._collapsed = false;  //更改面板显示状态：展开
            this.$('#'+this.mainRegionConf.id).slideDown(300);
            this.$('i.fa-chevron-up').toggleClass('fa-chevron-down');
        },
        /**
         * 获取主区域的引用对象
         * @returns {null}
         */
        getMainRegionRef:function(){
            if(!this.mainRegionRef){
                this.mainRegionRef = this.getRegion(this.mainRegionConf.id);
            }
            return this.mainRegionRef;
        },
    };
});
