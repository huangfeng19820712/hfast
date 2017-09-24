/**
 * @module 编辑模式，
 * @author:   * @date: 2015/12/15
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "jquery.layout"
], function (CommonConstant, Container,LayoutTemplate) {
    return {
        /**
         * 是否被封装,默认值是false
         * {boolean}
         */
        wraped:false,
        /**
         * 要包装的selector
         */
        wrapEl:null,
        /**
         * 要包装的jquery对象
         */
        $wrapEl:null,
        /**
         * 包装流程
         * 1.把$el添加到region里
         * 2.然后把region的$el挂载到parent的$container中
         * @param $el
         */
        wrap:function($el){
            if(!this.wraped){
                if(!this.isRendered()){
                    this.render($el.parent());
                }else{
                    this.show();
                }
                this.getWrapEl().append($el);
                this.wraped = true;
            }
        },
        unwrap:function(){
            if(this.wraped){
                var children = this.getWrapEl().children();
                this.$container.append(children);
                this.hide();
                this.wraped = false;
            }
        },
        getWrapEl:function(){
            if(this.$wrapEl.length==0){
                this.$wrapEl = this.$(this.wrapSelector);
            }
            return this.$wrapEl;
        },
        setWrapEl:function($el){
            this.$wrapEl = $el;
        },
        /**
         * 返回是否包裹
         * @returns {boolean}
         */
        isWraped:function(){
            return this.wraped;
        }
    };
});
