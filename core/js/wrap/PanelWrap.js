/**
 * @module 编辑模式，
 * @author:   * @date: 2015/12/15
 */
define([
    "core/js/CommonConstant",
    $Component.PANEL.src,
    "core/js/wrap/WrapAbstract",
    $Component.TOOLSTRIPITEM.src
], function (CommonConstant, Panel,WrapAbstract,ToolStripItem) {
    var PanelWrap = Panel.extend(WrapAbstract).extend({
        xtype:$Component.EDITWRAP,
        wrapSelector:".panel-content:first",
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        render:function(container, triggerEvent){
            this._super(container, triggerEvent);
            var children = this.$(this.wrapSelector);
            this.setWrapEl(children);
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
        /*-------------------------------  公有有方法 start ---------------------------------------------------*/

    });
    return PanelWrap;
});
