/**
 * @module 边界布局[BorderLayout]
 *
 *
 * @author:   * @date: 2015/12/15
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "jquery.layout"
], function ($, CommonConstant, Container) {
    var BorderLayout = Container.extend({
        xtype:$Component.BORDERLAYOUT,
        /**
         * 底部的参考对象，用来设置容器的高度
         */
        $bottomReferent:null,
        /**
         * 清空classname
         */
        className:null,
        /**
         * 引用的外部插件
         */
        plugin:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/

        /**
         * 初始化布局属性：将items转换成regions
         *
         * @private
         */
        _getRegionsByItems: function (items) {
            var i, comp,
                ln = items.length,
                result = {};
            for (i = 0; i < ln; i++) {
                comp = items[i];
                result[comp.region] = this._getRegionByItem(comp);
            }
            return result;
        },
        /**
         * 自动计算容器的高度
         * @private
         */
        _autoCalculateHeight:function(newHeight){
            var height =newHeight-this.getParent().$el.offset().top- this.$bottomReferent.outerHeight() ;
            this.setHeight(height);
        },
        /**
         * @Override
         * 根据item来生成region
         * @param item
         * @return {*}
         */
        _getRegionByItem: function (item) {
            var result =  this._super(item);
            //修改各个布局的className
            var region = item["region"];
            result["className"] = "ui-layout-"+region;
            return result;
        },
        _getLayoutConf:function(){
            if(this.items){
                var conf = {};
                for(var i=0;i<this.items.length;i++){
                    var item = this.items[i];
                    item.region;
                    conf[item.region]=item;
                }
                return conf;
            }
        },
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        /**
         * 获取中心区域
         * @return {*}
         */
        getCenterRegion: function () {
            return this.getRegion(BorderLayout.Region.CENTER)
        },
        /**
         * 获取顶部（北）区域
         * @return {*}
         */
        getNorthRegion: function () {
            return this.getRegion(BorderLayout.Region.NORTH);
        },
        /**
         * 获取底部（南）区域
         * @return {*}
         */
        getSouthRegion: function () {
            return this.getRegion(BorderLayout.Region.SOUTH);
        },
        /**
         * 获取左边（西）区域
         * @return {*}
         */
        getWestRegion: function () {
            return this.getRegion(BorderLayout.Region.WEST);
        },
        /**
         * 获取右边（东）区域
         * @return {*}
         */
        getEastRegion: function () {
            return this.getRegion(BorderLayout.Region.EAST);
        },

        /**
         * 显示后才调用jquery layout的控件，如果只是渲染后马上调用center区域会少一块，那块是滚动的宽度
         * @override
         */
        onshow:function(){
            if(this.$bottomReferent!=null&&!this.height){
                var height = this.$bottomReferent.offset().top - this.getParent().$el.offset().top ;
                this.setHeight(height);
                //注册窗口改变事件
                this.registerEvent();
            }
            //this.setHeight("100px");
            this.plugin = this.$el.layout(this._getLayoutConf());
        },
        resizeHandle:function(){
            this._autoCalculateHeight($(window).height());
        },
        unregisterEvent:function(){
            //取消绑定
            $(window).off("resize", this.resizeHandle);
            this._super();
        },
        /**
         * 注册窗口代表事件
         */
        registerEvent:function(){
            this._super();
            $(window).on("resize", $.proxy(this.resizeHandle,this));
        },

        /**
         * 重新刷新区域的内容，当高度改变，或者是内容改变时，需要刷新相关的区域
         */
        resizeRegion:function(region,size){
            //刷新区域的方法
            if(this.plugin){
                this.plugin.sizePane(region,size);
            }
        },
        /**
         * 刷新所有的区域
         */
        resizeAll:function(){
            this.plugin.resizeAll();
        },
        /**
         * 根据id，返回流布局中的对象
         * @param id
         * @returns {*}
         */
        getComponent:function(id){

        },
        /**
         * 根据数组的下标找到组件
         */
        getComponentByIndex:function(index){

        },
        close:function(){
            this.plugin =null;
            //销毁时间
            this._super();
        }
    });
    BorderLayout.Region = {
        "NORTH": "north",       //北
        "SOUTH": "south",       //南
        "WEST": "west",         //西
        "EAST": "east",         //东
        "CENTER": "center",     //中心
        Type: Container.Region.Type  //区域类型
    };
    return BorderLayout;
});
