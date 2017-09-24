/**
 * 窗口容器，提供四个区域给用户自定义
 * 1.title的左右两个区域，不包含标题的区域
 * 2.住内容区域
 * 3.窗口底部区域
 *
 * @author:   * @date: 2015/12/14
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/Panel.html",
    "core/js/view/Region","core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem","core/js/controls/HelpLink","core/js/layout/AbstractPanel",
    "core/js/utils/Utils"
], function ($, CommonConstant, Container, LayoutTemplate,Region,ToolStrip,ToolStripItem,HelpLink,AbstractPanel) {
    var Panel = Container.extend(AbstractPanel).extend({
        xtype:$Component.PANEL,
        headerLeftRegionConf:{
            id:null,
            className:"panel-heading-leftToolbar",
            containerName:"headerLeftRegion"
        },
        headerRightRegionConf:{
            id:null,
            className:"panel-heading-rightToolbar",
            containerName:"headerRightRegion"
        },
        mainRegionConf:{
            id:null,
            className:"panel-content",
            containerName:"mainRegion"
        },
        footerRegionConf:{
            className:"panel-footer",
            containerName:"footerRegion",
        },
        headerLeftRegionRef:null,
        headerRightRegionRef:null,
        footerRegionRef:null,
        /**
         * 布局模版
         */
        template: LayoutTemplate,
        /**
         * 标题区域内的左边子内容
         */
        headerLeftRegion:null,
        /**
         * 摘要
         */
        brief:null,
        /**
         * 帮助内容
         */
        help:null,
        /**
         * 标题区域内的右边子内容
         */
        headerRightRegion:null,


        _focus: false,          //控制面板是否处于关注的状态

        /**
         * 底部子内容
         */
        footerRegion:null,
        /**
         * 是否显示标题
         */
        isShowHeader:true,
        /**
         * 标题栏左边的小图片css
         */
        iconSkin:"fa fa-windows",


        className:$Component.PANEL.name.toLowerCase(),
        theme:"default",
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initializeHandle: function () {
            this._super();
            var confId = this.getConfId(this.headerLeftRegionConf);
            this.data = {
                title:this.title,
                brief:this.brief,
                iconSkin:this.iconSkin,
                isShowHeader:this.isShowHeader,
                headerLeftRegionId:this.getConfId(this.headerLeftRegionConf),
                headerRightRegionId:this.getConfId(this.headerRightRegionConf),
                mainRegionId:this.getConfId(this.mainRegionConf),
                footerRegionId:this.getConfId(this.footerRegionConf),
            };
            //this._super(options,triggerEvent);
        },
        /*render:function(container, triggerEvent){

            this._super(container, triggerEvent);
        },*/
        mountContent:function(){
            this._super();
            //有内容才显示footer
            if(!this.footerRegion){
                this.hideFooter();
            }
            //添加帮助按钮
            if(this.help!=null){
                var headerLeftRegion = this.getHeaderLeftRegionRef();
                if(headerLeftRegion!=null){
                    headerLeftRegion.ensureEl();
                    if(headerLeftRegion.$el!=null){
                        var helpButton = new HelpLink({
                            mode:ToolStripItem.Mode.BUTTON,
                            realClass:"btn btn-link btn-help",
                            mainContent:this.help,
                        });
                        //helpButton.render();
                    }
                }
            };

        },
        /**
         * 取消关注
         */
        unfocus:function(){
            var that = this;
            this.$('i.fa-eye').toggleClass('fa-eye-slash');
            this.$('.btn-remove').removeClass('link-disabled');
            $('body').find('#focus-overlay').fadeOut(function(){
                $(this).remove();
                that.$el.removeClass('panel-focus-enabled');
            });
            this._focus = false;  //更改面板的关注状态：取消关注
        },
        /**
         * 关注这个窗口
         */
        focus:function(){
            this.$('i.fa-eye').toggleClass('fa-eye-slash');
            this.$('.btn-remove').addClass('link-disabled');
            this.$el.addClass('panel-focus-enabled');
            $('<div id="focus-overlay"></div>').hide().appendTo('body').fadeIn(300);
            this._focus = true;  //更改面板的关注状态：关注
        },
        getHeaderRightRegionRef:function(){
            if(!this.headerRightRegionRef){
                this.headerRightRegionRef = this.getRegion(this.headerRightRegionConf.id);
            }
            return this.headerRightRegionRef;
        },

        getHeaderLeftRegionRef:function(){
            if(!this.headerLeftRegionRef){
                this.headerLeftRegionRef = this.getRegion(this.headerLeftRegionConf.id);
            }
            return this.headerLeftRegionRef;
        },

        getFooterRegionRef:function(){
            if(this.footerRegionRef){
                this.footerRegionRef = this.getRegion(this.footerRegionConf.id);
            }
            return this.footerRegionRef;
        },
        /**
         * 初始化面板标题栏区域项
         * @private
         */
        initItems: function () {
            if(this.items==null){
                this.items = [];
            }

            var that = this;
            if(this.isShowHeader){

                this._addItem(this.headerLeftRegionConf);
                this.headerRightRegion = {
                    comXtype:$Component.TOOLSTRIP,
                    comConf:{
                        className:"btn-group panel-header-toolbar",
                        itemOptions:[{
                            mode:ToolStripItem.Mode.LINK,
                            iconSkin:"fa-eye",
                            realClass:"btn-borderless",
                            onclick:function(){
                                if(that._focus){
                                    that.unfocus();
                                }else{
                                    that.focus();
                                }
                            }
                        },{
                            mode:ToolStripItem.Mode.LINK,
                            iconSkin:"fa-chevron-up",
                            realClass:"btn-borderless",
                            onclick:function(e){
                                if(that._collapsed){
                                    that.expand();
                                }else{
                                    that.collapse();
                                }
                            }
                        },{
                            iconSkin:"fa-times",
                            realClass:"btn-borderless",
                            mode:ToolStripItem.Mode.LINK,
                            onclick:function(e){
                                that.close();
                            }
                        }]
                    }
                };

                this._addItem(this.headerRightRegionConf);
            }

            if(_.isString(this.mainRegion)){
                //如果是字符串，则把字符串作为内容
                this.mainRegion = {
                    content:this.mainRegion
                }
            }
            this._addItem(this.mainRegionConf);
            if(this.footerRegion!=null){
                this.footerRegionConf  = _.extend(this.footerRegionConf,this.footerRegion);
            }
            this._addItem(this.footerRegionConf);
        },


        /*-------------------------------  公用方法 end  ---------------------------------------------------*/
        showFooter:function(){
            this.getFooterEl().show();

        },
        hideFooter:function(){
            this.getFooterEl().hide();
        },
        getFooterEl:function(){
            return this.$el.children(".panel-footer");
        }
    });
    return Panel;
});
