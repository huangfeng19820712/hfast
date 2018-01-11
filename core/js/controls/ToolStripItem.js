/**
 * 按钮与超链接
 * @module 工具栏子项[ToolStripItem]
 * @description 提供一个对 {@link ToolStrip} 可以包含的所有元素的事件和布局进行管理的抽象基类。
 *
 * @date: 2013-09-03 下午2:50
 */
define(["jquery",
    "underscore",
    "core/js/CommonConstant",
    "core/js/controls/Control",
    "ladda"
], function ($, _, CommonConstant, Control) {
    var ToolStripItem = Control.extend({
        xtype:$Component.TOOLSTRIPITEM,
        eTag: "<a />",

        /**
         * 元素的模版
         */
        template: null,
        /**
         *  引用数据的前缀
         */
        dataPre:"data",
        /**
         * 获取元素控件的显示文本。请使用 {@link setText} 方法设置文本的值。
         */
        text: null,
        /**
         * 带图标按钮上的图标对应的CSS，即className
         */
        iconSkin: null,
        /**
         * 提示内容
         */
        title:null,

        /**
         * 当点击按钮并且 {@link Control.enabled} 字段值为 true 时触发该事件。
         */
        onclick: null,
        /**
         * 可以保存其他值，在checkbox模式下需要
         */
        value:null,
        /**
         * 当光标聚焦在改按钮上时，按下键盘键时触发
         */
        onkeydown: null,
        /**
         * model,是按钮，还是超链接
         */
        mode:null,

        theme:$Theme.DEFAULT,
        /**
         * 启动二胎模式，是否有切换的状态，active的一个状态，没有active又是另一种状态
         */
        isToggle:false,
        /**
         * 作为输入参绑定的对象
         */
        bindingObj:null,
        /**
         * 用于标识是否要触发document.body的单击事件，主要是用于能够关闭例如提示信息或者下拉框的窗口 add by 2014.06.11
         * @default true
         */
        triggerBodyClick: true,

        /**
         * 是否允许方向盘向左键导航：即按方向盘向左键触发其它按钮聚焦操作
         */
        leftKeyNavigatable: false,

        /**
         * 是否允许方向盘向右键导航：即按方向盘向右键触发其它按钮聚焦操作
         */
        rightKeyNavigatable: false,

        /**
         * 是否允许空格键导航：即按空格键触发单击操作
         */
        spaceKeyNavigatable: false,

        /**
         * 是否允许回车键导航：即按回车键触发单击操作
         */
        enterKeyNavigatable: false,
        /**
         * 主题的样式class前缀
         */
        themeClassPre:"btn",
        theme:"default",
        /**
         * 聚焦按钮
         * add by 2014.07.14
         */
        focus: function(){
            var that = this;
            window.setTimeout(function(){
                that.$el.focus();
            })
        },
        /**
         * 单击按钮
         * add by 2014.07.14
         */
        click: function(event){
            this.$el.click(event);
        },
        /**
         * 判断按钮是否激活状态，针对二态按钮
         */
        isActive:function(){
            return this.$el.hasClass("active");
        },
        /**
         * 设置是否激活的状态
         * @param isActive  boolean值，true，激活，false是否
         */
        setActive:function(isActive){
            if(isActive){

                this.$el.addClass("active");
            }else{
                this.$el.removeClass("active");
            }
        },
        setText: function (text) {
            this.text = text;
            //修改页面的上得内容
            if(this.$el){
                this.$("span").text(text)
            }
        },
        getText: function () {
            return this.text;
        },
        /**
         * 判断按钮是否可用
         * @return {*}
         */
        isEnabled: function(){
            var enabled = this.enabled;
            if(enabled == null)
                enabled = true;
            return this.isVisible() && enabled;
        },
        /**
         * 设置 {@link enabled} 字段的值。
         */
        setEnabled: function (enabled) {
            if (enabled == null)
                enabled = true;

            this.enabled = enabled;

            if (enabled) {
                this.$el.removeAttr("disabled");            //删除按钮失效的样式
                this._registerButtonClickEvent(true);         //注册单击事件
            } else {
                this.$el.attr("disabled","true");              //添加按钮失效的样式
                this._registerButtonClickEvent(false);       //删除单击事件
            }
        },
        /**
         * 设置 {@link visible} 字段的值。
         */
        setVisible: function (visible) {
            this.visible = visible;

            var display = visible ? "" : "none";
            this.$el.css("display", display);
        },
        /**
         * 获取可配置的参数
         * @return {{id: *, className: *, iconSkin: *, text: *, template: *, onclick: *}}
         */
        getOptions: function () {
            return {
                id: this.id,
                className: this.className,
                iconSkin: this.iconSkin,
                text: this.text,
                template: this.template,
                onclick: this.onclick
            };
        },
        initialize: function (options,triggerEvent) {
            this.className = ToolStripItem.ClassName.DEFAULT;
            this._super(options,triggerEvent);
        },
        /*render: function (container, triggerEvent) {
            this._super(options,triggerEvent);
            this._init$El();    //初始化$el


        },*/
        /**
         * 初始化当前元素
         *
         * @return {*|HTMLElement}
         * @private
         */
        _initElAttr: function () {
            this._setDefaultCommandOptions();    //根据id来进行默认按钮配置参数的设置

            var options = {
                id: this.id,
                iconSkin: "",
                text: "",
                isToggle:this.isToggle,
                title:this.title
            };

            if (this.iconSkin)
                options.iconSkin = this.iconSkin;
            if (this.text!=null)
                options.text = this.text;

            this.content = _.template(this.template,{variable: this.dataPre})( options);//_.template(this.template, options),
                that = this;

            this.$el = $(this.content);
            //添加size
            if(this.size){
                this.$el.addClass(this.size);
            }

            if(this.mode==ToolStripItem.Mode.LADDA){
                this.$el.addClass("ladda-button");
                this.$el.attr("data-style","slide-up");
            }

            this._bindKeyboardNavigation();  //绑定键盘导航事件

            this._registerButtonClickEvent(true);   //注册单击事件

            this._super();
        },
        /**
         * 绑定键盘导航事件
         * @private
         */
        _bindKeyboardNavigation: function(){
            var that = this;
            this.$el.keydown(function(event){
                that._triggerKeyboardNavigation(event);   //触发键盘导航：空格键、回车键
            });
        },
        /**
         * 通过绑定键盘按钮来导航表单编辑器控件
         * add by 2014.07.14
         * @private
         */
        _triggerKeyboardNavigation: function(event){

            //触发键盘操作，如果返回false，即可拦截默认的操作
            var result = this.trigger("keydown", event);
            if(!result)
                return;

            var KeyCode = CommonConstant.KeyCode;

            switch( event.keyCode ) {
                case KeyCode.ENTER:       //回车键导航
                case KeyCode.NUMPAD_ENTER:
                    if(this.enterKeyNavigatable){
                        this.click(event);  //触发单击操作
                    }else{
                        this.stopDefault(event);        //阻止默认行为
                        return false;
                    }
                    break;
                case KeyCode.SPACE:        //空格键导航
                    if(this.spaceKeyNavigatable){
                        this.click(event);  //触发单击操作
                    }
                    break;
                case KeyCode.LEFT:         //向左方向盘键导航
                    if(this.leftKeyNavigatable){
                        var preItem = this.getPreviousItem();
                        if(preItem){
                            preItem.focus();   //聚焦前一个按钮
                        }
                    }
                    break;
                case KeyCode.RIGHT:        //向右方向盘键导航
                    if(this.rightKeyNavigatable){
                        var nextItem = this.getNextItem();
                        if(nextItem){
                            nextItem.focus();   //聚焦后一个按钮
                        }
                    }
                    break;
            }
        },
        /**
         * 根据id来进行默认按钮配置参数的设置
         * @private
         */
        _setDefaultCommandOptions: function () {
            var id = this.id || "";
            id = id.toLowerCase();

            var options = ToolStripItem.DefaultCommand[id] || {};

            this.className = this.className || options["className"];
            this.iconSkin = this.iconSkin || options["iconSkin"];
            if(this.text==null){
                this.text =  options["text"];
            }
            this.mode = this.mode||ToolStripItem.Mode.BUTTON;
            var template = this.template || options["template"];
            //根据上下文设置按钮的默认摸板
            if (!template) {
                if(this.mode==ToolStripItem.Mode.BUTTON||this.mode==ToolStripItem.Mode.LADDA){
                    template = $Template.Button.DEFAULT;
                }else if(this.mode==ToolStripItem.Mode.LINK){
                    template = $Template.Link.DEFAULT;
                }else if(this.mode==ToolStripItem.Mode.ITEMBOX){
                    template = $Template.ItemBox.NORMAL;
                }
                /*//只有文字没有图标的按钮
                if (!this.iconSkin && this.text)
                    template = ToolStripItem.Template.TEXT;
                //只有图标没有文字的按钮
                if (this.iconSkin && !this.text)
                    template = ToolStripItem.Template.ICON;
                //即有图标又有文字的按钮
                if (this.iconSkin && this.text)
                    template = ToolStripItem.Template.NORMAL;*/
            }

            this.template = template;
        },
        _registerButtonClickEvent: function (triggerRegisterEvent) {
            this.$el.off("click");   //删除元素上的单击事件

            if (triggerRegisterEvent == null)
                triggerRegisterEvent = true;

            if (triggerRegisterEvent) {
                this.$el.on("click", function (e) {
                    var that = $(this).data("control");

                    //$.window.removeAllErrorTipOnEl();   //移除所有跟随在元素后面的提示信息 add by 2014.06.23

                    //因为按钮本身可能是包含在浮窗（popup）中，此时就不能先触发文档主体的单击事件 add by 2014.06.17
                    if(that.triggerBodyClick == null || that.triggerBodyClick)
                        $(document.body).click();  //触发表单主体的单击事件，为了能够关闭例如提示信息或者下拉框的窗口 add by 2014.06.11

//                    if(that.enabled){
//                        that.setEnabled(false);   //先将按钮设置成不可用，避免重复使用
//                        //一秒后，将按钮设置成可用
//                        setTimeout(function(){
//                            that.setEnabled(true);
//                        }, 1000);
//                    }
                    e.bindingObj = that.bindingObj;
                    that.trigger("click",e);    //触发打击操作
                    //不能阻止冒泡行为，这样bootstrap的行为会被阻止
                    //that.stopBubble(e);         //阻止冒泡
                    that.stopDefault(e);        //阻止默认行为
                    //return false;  //return false很强大，可以同时阻止事件冒泡和浏览器的默认行为。
                });
            }
        },
        /**
         * 支持键盘操作：Tab键对应的操作，获取前一个按钮
         * 在工具栏（ToolBar）中指定
         * add by 2014.07.15
         */
        getPreviousItem: function(){},
        /**
         * 支持键盘操作：Tab键对应的操作，获取后一个按钮
         * 在工具栏（ToolBar）中指定
         * add by 2014.07.15
         */
        getNextItem: function(){}
    });

    //ToolStripItem.Template.Button = CommonConstant.Template.Button;

    /**
     * 系统默认提供的按钮图片
     * @type {{ADD: string, EDIT: string, DELETE: string, VIEW: string, COPY: string, PRINT: string, DOWNLOAD: string, IMPORT: string, EXPORT: string, REFRESH: string, RELEASE: string}}
     */
    ToolStripItem.IconSkin = CommonConstant.ButtonIcon;

    ToolStripItem.ClassName = {
        "DEFAULT":"btn",
        "ROUNDED" :"btn rounded"
    };
    ToolStripItem.size= {
        /**
         *
         */
        lg:"btn-lg",
        sm:"btn-sm",
        xs:"btn-xs",
    };
    ToolStripItem.ThemeClass = {
        "DEFAULT":"btn-default",
        "PRIMARY":"btn-primary",
        "INFO":"btn-info",
        "SUCCESS":"btn-success",
        "WARNING":"btn-warning",
        "DANGER":"btn-danger",
        "LINK":"btn-link",
        "CANCEL":"btn-u-default",
        "CHECKBOX":"btn-checkbox",
    }

    ToolStripItem.Mode = {
        BUTTON:"button",
        LINK:"link",
        LADDA:"ladda",
        ITEMBOX:'itemBox'
    }

    /**
     * 系统默认提供的按钮
     * @type {{save: {text: string, className: string}, add: {text: string, iconSkin: string}, update: {text: string, iconSkin: string}, delete: {text: string, iconSkin: string}, view: {text: string, iconSkin: string}, copy: {text: string, iconSkin: string}, print: {text: string, iconSkin: string}, download: {text: string, iconSkin: string}, import: {text: string, iconSkin: string}, export: {text: string, iconSkin: string}, refresh: {text: string, iconSkin: string}, release: {text: string, iconSkin: string}}}
     */
    ToolStripItem.DefaultCommand = {
        "clear": {
            template: '<a id="<%=id%>" class=" h-icon h-icon-close" href="javascript:void(0)">&nbsp;</a>'
        },
        "save": {
            text: "保 存",
            className: "h-btn-primary"
        },
        "add": {
            text: "新 增",
            iconSkin: ToolStripItem.IconSkin.ADD
        },
        "update": {
            text: "修 改",
            iconSkin: ToolStripItem.IconSkin.EDIT
        },
        "delete": {
            text: "删 除",
            iconSkin: ToolStripItem.IconSkin.DELETE
        },
        "view": {
            text: "查 看",
            iconSkin: ToolStripItem.IconSkin.VIEW
        },
        "copy": {
            text: "复 制",
            iconSkin: ToolStripItem.IconSkin.COPY
        },
        "print": {
            text: "打 印",
            iconSkin: ToolStripItem.IconSkin.PRINT
        },
        "download": {
            text: "下 载",
            iconSkin: ToolStripItem.IconSkin.DOWNLOAD
        },
        "upload": {
            text: "上 传",
            iconSkin: ToolStripItem.IconSkin.UPLOAD
        },
        "import": {
            text: "导 入",
            iconSkin: ToolStripItem.IconSkin.IMPORT
        },
        "export": {
            text: "导 出",
            iconSkin: ToolStripItem.IconSkin.EXPORT
        },
        "refresh": {
            text: "刷 新",
            iconSkin: ToolStripItem.IconSkin.REFRESH
        },
        "release": {
            text: "发 布",
            iconSkin: ToolStripItem.IconSkin.RELEASE
        }
    }

    return ToolStripItem;
});