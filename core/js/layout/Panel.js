/**
 * 窗口容器，提供四个区域给用户自定义
 * 1.title的左右两个区域，不包含标题的区域
 * 2.住内容区域
 * 3.窗口底部区域
 *
 * @author:   * @date: 2015/12/14
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/Panel.html",
    "core/js/view/Region","core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem","core/js/controls/HelpLink","core/js/layout/AbstractPanel",
    "jquery.layout",
    "core/js/utils/Utils"
], function (CommonConstant, Container, LayoutTemplate,Region,ToolStrip,ToolStripItem,HelpLink,AbstractPanel) {
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
            containerName:"mainRegion",
            autoScroll:true
        },
        footerRegionConf:{
            className:"panel-footer",
            containerName:"footerRegion",
        },
        topToolbarRegionConf:{
            className:"panel-topToolbar",
            containerName:"topToolbarRegion",
        },
        headerLeftRegionRef:null,
        headerRightRegionRef:null,
        footerRegionRef:null,
        topToolbarRegionRef:null,
        /**
         * 引用的外部插件
         */
        plugin:null,
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

        /**
         * 控制面板是否处于关注的状态
         * @property    {Boolean}
         * @default     false
         */
        _focus: false,
        /**
         * 底部子内容
         */
        footerRegion:null,

        /**
         * 顶部的区域
         * @property    {Object}
         */
        topToolbarRegion:null,
        /**
         * 是否显示标题
         */
        isShowHeader:true,

        /**
         * 是否显示标题的工具栏
         */
        isShowHeaderRightRegion:true,
        /**
         * 标题栏左边的小图片css
         */
        iconSkin:"fa fa-windows",
        className:$Component.PANEL.name.toLowerCase(),

        layout: "fit",
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initializeHandle: function () {
            this._super();
            var confId = this.getConfId(this.headerLeftRegionConf);
            this.data = {
                title:this.title,
                brief:this.brief,
                iconSkin:this.iconSkin,
                northId:this.getNorthId(),
                isShowHeader:this.isShowHeader,
                headerLeftRegionId:this.getConfId(this.headerLeftRegionConf),
                headerRightRegionId:this.getConfId(this.headerRightRegionConf),
                mainRegionId:this.getConfId(this.mainRegionConf),
                footerRegionId:this.getConfId(this.footerRegionConf),
                topToolbarRegionId:this.getConfId(this.topToolbarRegionConf),
                isShowHeaderRightRegion:this.isShowHeaderRightRegion
            };
            //this._super(options,triggerEvent);
        },
        getNorthId:function(){
            return this.id+"_north";
        },

        mountContent:function(){
            this._super();
            //有内容才显示footer
            if(!this.footerRegion){
                this.hideFooter();
            }
            //有内容才显示topToolbar
            if(!this.topToolbarRegion){
                this.hideTopToolbar();
            }
            //添加帮助按钮
            if(this.help!=null){
                var headerLeftRegion = this.getHeaderLeftRegionRef();
                if(headerLeftRegion!=null){
                    headerLeftRegion.ensureEl();
                    if(headerLeftRegion.$el!=null){
                        var helpButton = new HelpLink({
                            parent:this,
                            mode:ToolStripItem.Mode.BUTTON,
                            realClass:"btn btn-link btn-help",
                            mainContent:this.help,
                        });
                        //helpButton.render();
                    }
                }
            };

            if(this.height){
                this.plugin = this.$el.layout({
                    defaults:{
                        //closable:false,
                        slidable:false,
                        spacing_open:0,
                    },
                    center:{
                        className:"panel-content",
                        paneSelector:"#"+this.getConfId(this.mainRegionConf),
                        id:this.getConfId(this.mainRegionConf)
                    },
                    north:{
                        paneSelector:"#"+this.getNorthId(),
                        padding:0,
                        id:this.getNorthId()
                    },
                    south:{
                        paneSelector:"#"+this.getConfId(this.footerRegionConf),
                        id:this.getConfId(this.footerRegionConf)
                    }
                });
            }
        },
        onrender:function(){
            if(this.plugin){
                this.plugin.resizeAll();
            }
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
                if(this.isShowHeaderRightRegion){
                    var linkItems = [];
                    linkItems.push({
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
                    });
                    linkItems.push({
                        mode:ToolStripItem.Mode.LINK,
                        iconSkin:"fa-chevron-up",
                        realClass:"btn-borderless",
                        onclick:function(){
                            //e.preventDefault();
                            if (that._collapsed) {
                                that.expand();
                            } else {
                                that.collapse();
                            }
                        }
                    });
                    linkItems.push({
                        iconSkin:"fa-times",
                        realClass:"btn-borderless",
                        mode:ToolStripItem.Mode.LINK,
                        onclick:function(e){
                            that.close();
                        }});
                    this.headerRightRegion = {
                        comXtype:$Component.TOOLSTRIP,
                        comConf:{
                            className:"btn-group panel-header-toolbar",
                            itemOptions:linkItems
                        }
                    };

                    this._addItem(this.headerRightRegionConf);
                }
            }
            if(this.topToolbarRegion!=null){
                this.topToolbarRegionConf  = _.extend(this.topToolbarRegionConf,this.topToolbarRegion);
            }
            this._addItem(this.topToolbarRegionConf);

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
        getFooterEl:function(){
            return this.$el.children(".panel-footer");
        },
        hideFooter:function(){
            this.getFooterEl().hide();
        },
        hideTopToolbar:function(){
            this.getTopToolbarEl().hide();
        },
        getTopToolbarEl:function(){
            return this.$el.children(".panel-topToolbar");
        },
        resizeLayout:function(){
            if (this._super) {
                this._super();
            }
            if(this.plugin){
                this.plugin.resizeAll();
            }
        }
    });
    return Panel;
});
