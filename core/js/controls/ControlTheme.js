/**
 * @author:   * @date: 2018/1/13
 */
define(["core/js/controls/AbstractControlView",
    "css!core/resources/styles/Switcher.css"],
    function (AbstractControlView) {
    var ControlTheme = AbstractControlView.extend({
        xtype:$Component.CONTROLTHEME,
        eTag:"<ul/>",
        /**
         * 值与dom关联信息的映射对象如：{blue：liId}
         */
        valueMap:null,
        onthemeSelect:null,
        mountContent:function(){
            var that = this;
            this.valueMap = {};
            _.each($Theme,function(item,index,list){
                var themeLi = that.createThemeLi(item);
                that.$el.append(themeLi);
                that.valueMap[item] = that.getDomId(item);
            });
            this._iniThemeEvents();
            if(this.value){
                this.setValue(this.value);
            }
        },
        getDomId:function(value){
            return this.getId()+"_"+value;
        },
        /**
         * 设置值与dom的联动
         */
        setValue:function(value){
            var domId = this.getDomId(value);
            this.setSelect($("#" + domId));
        },
        setSelect:function($el){
            $el.siblings(".selected").removeClass("selected");
            $el.addClass("selected");
        },
        /**
         * 初始化事件
         * @private
         */
        _iniThemeEvents:function(){
            var that = this;
            this.$el.on("click","li>a",function(e){
                e.preventDefault();
                that.setSelect($(e.target).parent());
                that.trigger("themeSelect",e);
            });
        },
        createThemeLi:function(theme){
            var dom = _.template('<li id="<%=data.domId%>"><a href="javascript:void(0);" title="<%=data.themeName%>" class="switch-skin switcher-<%=data.themeName%>" data-skin="<%=data.themeName%>"><%data.themeName%></a></li>',
                {variable: "data"})({
                themeName: theme,
                domId:this.getDomId(theme)
            });
            return dom;
        },
    });

    return ControlTheme;
});
