/**
 * @module 手风琴布局
 * @author:   * @date: 2015/12/15
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "text!core/resources/tmpl/Accordion.html",
    "jquery.layout"
], function ($, CommonConstant, Container,LayoutTemplate) {
    var Accordion = Container.extend({
        xtype:$Component.ACCORDION,
        className:"panel-group",
        /**
         * {Array}
         * 如果是数组：
         * @example
         * <code>
         *     [{
         *         id: "[可选]<内容的编码>",
         *         name:"[可选]<给这个区域命令，一般是英语，助记与方便获取到这个区域的Region对象，在这个数组集合里唯一>",
         *         label："[必填]<标签的标题>",
         *         content: "[必填]<可以是字符串也可以是Region对象>",
         *     },...]
         * </code>
         */
        accordionItems:null,
        /**
         * 清空模板
         */
        template:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        initItems:function(options){
            this._super(options);
            if(this.accordionItems){
                for(var i=0;i<this.accordionItems.length;){
                    //i使用在tab后，自增长1后 ，在使用，则在for中就不用自增长了
                    var accordionItem = this.accordionItems[i++];
                    this._addItem(accordionItem,i);
                }
            }
        },
        /**
         * @Overide
         * 初始化EL的属性
         * @private
         */
        mountContent:function(){
            //不继承父类的方法
            // this._super();
            this._initAccordionDom();
            this.regionsRender();
        },
        /**
         * 初始化dom
         * @private
         */
        _initAccordionDom:function(){
            if(this.accordionItems){
                var len=this.accordionItems.length;
                for(var i = 0;i<len;i++){
                    var accordionItem = this.accordionItems[i];
                    accordionItem.id = accordionItem.id || this.getContentId(i);
                    accordionItem.parentId=this.id;
                    this.$el.append(this._initAccordionItemDom(accordionItem));
                }
            }
        },
        /**
         * 对象
         * @example
         * <code>
         *      {
         *          id:"[必填]<内容的id，此id用来折叠内容区域>"，
         *          label:"[必填]<此区域内容的标题>"，
         *          content:"[必填]<区域的内容>"
         *      }
         * </code>
         * @private
         */
        _initAccordionItemDom:function(conf){
            var dom =  _.template(LayoutTemplate,{variable:this.dataPre})( conf);
            return dom;
        },

        /**
         * 添加子节点的配置信息
         * @param conf
         * @private
         */
        _addItem:function(conf,i){
            if(!conf.id){
                conf.id = this.getContentId(i);
            }
            var item = {
                id: conf.id,
                className: conf.className,
                el:this.$("#"+conf.id).find(".panel-body").selector
            };
            if(_.isObject(conf.content)){
                //conf.content有可能是内容，也有
                item = _.extend(item,conf.content);
            }else{
                item = _.extend(item,{content:conf.content});
            }

            this.items.push(item);
        },
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/


        /**
         * 根据下标获取这块内容的id，这个内容的id与区域的id一致
         * @param i
         * @returns {string}
         */
        getContentId: function (i) {
            return this.id+"_content_"+i;
        },
        /**
         * 根据内容的id获取内容对象
         * @param contentId
         */
        getContentRefById: function (contentId) {
            return this.getRegion(contentId);
        },
        close:function(){
            this.accordionItems = null;
            this._super();
        },
        /**
         * 根据name获取Regin对象
         * @param name
         * @return {Region}
         */
        getRegionByName:function(name){
            var item = _.findWhere(this.accordionItems,{"name":name});
            return this.getRegionById(item.id);
        },
        /**
         * 根据id获取区域对象
         * @param id
         * @return {Region}
         */
        getRegionById:function(id){
            return this.getRegion(id);
        },
        /**
         * 根据序号，获取区域对象
         * @param i
         * @return {Region}
         */
        getRegionByIndex:function(i){
            return this.getRegion(this.getContentId(i));
        },
    });
    return Accordion;
});
