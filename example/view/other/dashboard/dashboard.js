/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
        "core/js/controls/ToolStripItem",
        "core/js/controls/HelpLink",
        $Component.SWITCHER.src, "core/js/utils/ApplicationUtils",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/minChart.html",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/statItem.html",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/reminder.html",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/percent.html",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/notice.html",
        "text!"+CONFIG.appCnName+"/view/other/dashboard/tmpl/card.html",
        "css!"+CONFIG.appCnName+"/view/other/dashboard/css/dashboard.css",
        "jquery.sparkline","jquery.easypiechart","jquery.counterup"],
    function (FluidLayout, CommonConstant, Region, Panel, ToolStripItem, HelpLink, Switcher,
              ApplicationUtils,minChartTemplate,statItemTemplate,reminderTemplate,percentTemplate,
              noticeTemplate,cardTemplate) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,
            initItems: function () {
                this.items = [];

                this.items.push({
                    content: _.template(statItemTemplate,{variable: "data"})({
                        icon:"fa-caret-down",
                        bigNumber:"260",
                        title:"订单数量",
                        smallNumber:"3%"
                    })
                });
                this.items.push({
                    content: _.template(statItemTemplate,{variable: "data"})({
                        icon:"fa-caret-up",
                        bigNumber:"23,000",
                        currency:"￥",
                        title:"订单金额",
                        smallNumber:"5%"
                    })
                });
                this.items.push({
                    content: _.template(statItemTemplate,{variable: "data"})({
                        icon:"fa-caret-up",
                        bigNumber:"23,000",
                        title:"用户人数",
                        smallNumber:"10%"
                    })
                });

                this.items.push({
                    id:"minChart",
                    content: _.template(minChartTemplate)
                });
                this.items.push({
                    columnSize: $Column.COL_MD_2,
                    content: _.template(reminderTemplate,{variable: "data"})
                });

                //百分比
                this.items.push({
                    columnSize: $Column.COL_MD_2,
                    content: _.template(percentTemplate,{variable: "data"})({
                        percent:"70",
                        title:"用户人数",
                    })
                });
                this.items.push({
                    columnSize: $Column.COL_MD_2,
                    content: _.template(percentTemplate,{variable: "data"})({
                        percent:"20",
                        title:"在线人数",
                    })
                });
                this.items.push({
                    columnSize: $Column.COL_MD_2,
                    content: _.template(percentTemplate,{variable: "data"})({
                        percent:"80",
                        title:"充值人数",
                    })
                });
                this.items.push({
                    columnSize: $Column.COL_MD_3,
                    content: _.template(noticeTemplate,{variable: "data"})
                });

                this.items.push({
                    columnSize: $Column.COL_MD_3,
                    content: _.template(cardTemplate,{variable: "data"})
                });

            },
            onrender: function (event) {
                var values = this.getRandomValues();
                var params = {
                    type: 'bar',
                    barWidth: 5,
                    height: 25
                }

                params.barColor = '#CE7B11';
                this.getRegion("minChart").$el.find('#mini-bar-chart1').sparkline(values[0], params);
                params.barColor = '#1D92AF';
                this.getRegion("minChart").$el.find('#mini-bar-chart2').sparkline(values[1], params);
                params.barColor = '#3F7577';
                this.getRegion("minChart").$el.find('#mini-bar-chart3').sparkline(values[2], params);


                this.initSparkline(this.getRegionByIndex(0).$el, "#3F7577");
                this.initSparkline(this.getRegionByIndex(1).$el, "#CE7B11");
                this.initSparkline(this.getRegionByIndex(2).$el, "#1D92AF");



                this.initPercent(this.getRegionByIndex(5).$el, "#1D92AF");
                this.initPercent(this.getRegionByIndex(6).$el, "#FFB800");
                this.initPercent(this.getRegionByIndex(7).$el, "#E60404");

                //数字特效
                this.$(".big-number").counterUp({
                    delay: 10,
                    time: 1000
                });
            },

            initPercent:function($el,colorNumber){
                var cOptions = {
                    animate: 3000,
                    trackColor: "#ccc",
                    scaleColor: "#ddd",
                    lineCap: "square",
                    lineWidth: 5,
                    barColor: colorNumber,
                    onStep: function(from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    }
                }
                $el.find('.easy-pie-chart').easyPieChart(cOptions);

            },

            initSparkline:function($el,colorNumber){
                $el.find(".sparkline-stat-item").css("background-color",colorNumber);
                if( $el.find('.sparkline-stat-item .inlinesparkline').length > 0 ) {
                    var sparklineElement = $el.find('.sparkline-stat-item .inlinesparkline')[0];
                    var values1 = this.getRandomValues();
                    this.sparklineStat(sparklineElement,values1);
                }
            },

            sparklineStat:function(sparklineElement,values1){
                var params = {
                    width:'' + this.$('.sparkline-stat-item').innerWidth() + '',
                    height: '60px',

                    spotRadius: '2',
                    spotColor: false,
                    minSpotColor: false,
                    maxSpotColor: false,

                    lineWidth: 1,
                    lineColor: "rgba(255,255,255, 0.2)",
                    fillColor: 'rgba(255,255,255, 0.1)',
                    highlightLineColor: '#fff',
                    highlightSpotColor: '#fff',
                    disableInteraction: true
                }
                $(sparklineElement).sparkline(values1[0], params);
            },

            getRandomValues:function() {
                // data setup
                var values = new Array(20);

                for (var i = 0; i < values.length; i++){
                    values[i] = [5 + this.randomVal(), 10 + this.randomVal(), 15 + this.randomVal(), 20 + this.randomVal(), 30 + this.randomVal(),
                        35 + this.randomVal(), 40 + this.randomVal(), 45 + this.randomVal(), 50 + this.randomVal()]
                }

                return values;
            },
            randomVal:function(){
                return Math.floor( Math.random() * 80 );
            }
        });

        return view;
    });

