/**
 * @author:   * @date: 2017/9/27
 */

define(["core/js/controls/Control",
        "core/js/utils/ViewUtils",
        "core/js/CommonConstant",
        "text!/demo/tmpl/portfolio.html",
        "jquery.cubeportfolio",
        "css!/demo/css/demo.css"],
    function (Control, ViewUtils, CommonConstant,Template) {
        var portfolio = Control.extend({
            className:"hfast-container container-fluid",
            mountContent: function () {
                this.$el.append("<div class='cube-portfolio'/>");
                var el = this.$el.find(".cube-portfolio");
                for (var i = 0; i < 4; i++) {
                    var item = this.createItem();
                    el.append(item);
                }
                el.cubeportfolio({
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
                //el.cubeportfolio("destroy");
            },
            createItem: function () {
                //var s = '<div class="cbp-item"><a href="#" title="custom title 1"><img src="/demo/img/img18.jpg"/></a></div>';
                return $(Template);
            },
            destroy:function(){
                var el = this.$el.find(".cube-portfolio");
                el.cubeportfolio('destroy');
                this._super();
            }

        });
        return portfolio;
    })
