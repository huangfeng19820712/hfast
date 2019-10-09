/**
 * @author:   * @date: 2015/9/5
 */

define([
    "core/js/Component",
    "spin"
], function (  MXComponent,Spin) {
    var SpinLoader = MXComponent.extend({
        plugin:null,
        eTag:"<div/>",
        $background:null,
        /**
         * 持续多长时间，没有值或者是0，则不关闭，单位是秒
         */
        inDuration:null,
        xtype:$Component.SPINLOADER,
        ctor: function (options) {
            this.set(options);
            this.plugin = new Spin(this._getOptions());
        },
        /**
         * 如果没有target，则在上一次的位置显示
         * @param target    $jquery对象
         */
        show:function(target,inDuration){
            if(!this.$el){
                this.createEl();
            }
            if(target){
                target.prepend(this.$el);
                var offset = target.offset();
                this.$background.offset(offset);
                this.$background.width(target.width());
                this.$background.height(target.height());
            }
            this.plugin.spin(this.$el[0]);
            //spin是计算高度了，计算好后，需要把高度设置成0，才能显示
            this.$el.height("0");
            this.$el.show();
            //多长时间后，自动关闭窗口，并移除
            inDuration = inDuration|| this.inDuration;
            if(inDuration){
                var duration = parseFloat(inDuration) * 1000;
                var that = this;
                window.setTimeout(function () {
                    that.hide();
                }, duration);
            }
            return this;
        },
        createEl:function(){
            this.$el = $(this.eTag);
            this.$el.height("100%");
            this.$background = $('<div class="loading-fade"/>');
            this.$el.prepend(this.$background);
        },
        _getOptions:function(){
            return  {
                lines: 9, // 花瓣数目
                length: 1, // 花瓣长度
                width: 10, // 花瓣宽度
                radius: 15, // 花瓣距中心半径
                shadow: true,
                //top: 'auto',
                opacity:1/8
            };
        },
        hide:function(){
            this.$el.hide();
            return this;
        },
        destroy:function(){
            this.plugin = null;
            this._super();
        }
    });

    return SpinLoader;
});