/**
 * @author:   * @date: 2017/9/27
 */

define(["core/js/controls/Control",
        "core/js/utils/ViewUtils",
        "core/js/CommonConstant",
        "text!core/resources/tmpl/portfoliobox.html",
        "jquery.cubeportfolio",],
    function (Control, ViewUtils, CommonConstant,Template) {
        var Portfoliobox = Control.extend({
            xtype:$Component.PORTFOLIO,
            className:"container-fluid",
            /**
             * {Array}实体表单上的字段信息
             * [{
             *      id:"<输入框的id，不是必需>"
             *      title:"<图片标题，不是必填>",
             *      imgUrl:"[必须存在，但不是必填]<没有图片的路径，则不显示出出来>",
             *      content:"<图片的详细说明>",
             * },...
             * ]
             */
            data:null,
            /**
             * 在模板语言中的前缀
             */
            dataPre:"data",
            /**
             * 插件的el对象
             */
            $pluginEl:null,
            /**
             * 插件的对象
             */
            plugin:null,
            mountContent: function () {
                if(this.data&&this.data.length>0){
                    this.$el.append("<div class='cube-portfolio'/>");
                    this.$pluginEl = this.$el.find(".cube-portfolio");
                    var that = this;
                    _.each(this.data,function(value,key,list){
                        var item = that.createItem(value);
                        that.$pluginEl.append(item);
                    });
                    /*for (var i = 0; i < 4; i++) {
                        var item = this.createItem();
                        this.$pluginEl.append(item);
                    }*/
                    this.plugin = this.$pluginEl.cubeportfolio({
                        layoutMode: 'grid',
                        rewindNav: true,
                        scrollByPage: false,
                        defaultFilter: '*',
                        animationType: 'slideLeft',
                        gapHorizontal: 20,
                        gapVertical: 20,
                        gridAdjustment: 'responsive',
                        mediaQueries: [{
                            width: 1600,
                            cols: 4
                        }, {
                            width: 1200,
                            cols: 3
                        }, {
                            width: 800,
                            cols: 3
                        }, {
                            width: 500,
                            cols: 2
                        }, {
                            width: 320,
                            cols: 1
                        }],
                        caption: 'zoom',
                        displayType: 'lazyLoading',
                        displayTypeSpeed: 100
                    });
                }
                //el.cubeportfolio("destroy");
            },
            createItem: function (data) {
                //var s = '<div class="cbp-item"><a href="#" title="custom title 1"><img src="/demo/img/img18.jpg"/></a></div>';
                return _.template(Template,{variable: this.dataPre})( data);
            },
            destroy:function(){
                if(this.$pluginEl){
                    this.$pluginEl.cubeportfolio('destroy');
                }
                this._super();
            }

        });
        return Portfoliobox;
    })
