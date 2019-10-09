/**
 * @date: 14-2-24
 *
 *
 * http://inorganik.github.io/countUp.js/
 */
define([
    $Component.NAVIGATIONBAR.src,
    $Component.TOOLSTRIPITEM.src,
    'core/js/controls/Label',
    "core/js/base/BaseViewModel",
    "countUp"
], function (NavigationBar,ToolStripItem,Label,BaseViewModel,CountUp) {
    var DemoText = BaseViewModel.extend({
        countUp:null,
        label:null,
        mountContent:function(){
            var view = new NavigationBar({
                $container:this.$el,
                items:[
                    this.formOption()
                ]
            });
            this.label = new Label({
                $container:this.$el,
                className:"counter",
                //themeClass:Label.ThemeClass.DEFAULT,
                text:"1235",
            });
            /*this.$(".counter").counterUp({
                delay: 10,
                time: 1000
            });*/

            this.initCountUp(2);


            if (!this.countUp.error) {
                this.countUp.start();
            } else {
                console.error(this.countUp.error);
            }
        },
        initCountUp:function(duration){
            var options = {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
            };
            var startValue =  94.62;
            var endValue = 24.02;
            /**
             * target = id of html element, input, svg text element, or var of previously selected element/input where counting occurs
             startVal = the value you want to begin at
             endVal = the value you want to arrive at
             decimals = (optional) number of decimal places in number, default 0
             duration = (optional) duration in seconds, default 2
             options = (optional, see demo) formatting/easing options object
             */
            this.countUp = new CountUp(this.label.id, 0, 4464, 0, duration, options);
        },
        topToolbarOption: function () {
            var that = this;
            return {
                comXtype:$Component.NAVFORMEDITOR,
                //左边浮动
                className:"pull-left",
                comConf:{
                    fields:[
                        {
                            isShowLabel:false,
                            placeholder: "文本",
                            name: "text",
                            editorType: $Component.TEXTEDITOR,
                            rules: {
                                required: true,
                                maxlength: 20,
                            },
                        },{
                            isShowLabel:false,
                            placeholder:"duration",
                            name:"duration",
                            editorType:$Component.TOUCHSPINEDITOR,
                            rules: {
                                required: true,
                            },
                        }
                    ],
                    toolStripConf:{
                        itemOptions: [{
                            //roundedClass:$Rounded.ROUNDED,
                            iconSkin:"fa-search",
                            text: "查询",
                            title:'查询',
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function () {
                                var allFieldValue = this.getParent().getParent().getAllFieldValue();
                                console.info(allFieldValue)
                                $.window.alert("值在console中");
                            }
                        },{
                            //roundedClass:$Rounded.ROUNDED,
                            text: "增加1000",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function () {
                                that.countUp.update(that.countUp.endVal+1000);
                            }
                        },{
                            //roundedClass:$Rounded.ROUNDED,
                            text: "pause/Resume",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function () {
                                that.countUp.pauseResume();
                            }
                        },{
                            //roundedClass:$Rounded.ROUNDED,
                            text: "start",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function () {
                                var allFieldValue = this.getParent().getParent().getAllFieldValue();
                                var allFieldValue2 = allFieldValue["duration"];
                                //that.countUp = new CountUp(that.label.id, 0, 4464, 0,allFieldValue2, options);
                                that.initCountUp(allFieldValue2);
                                //that.countUp.duration = allFieldValue2;
                                that.countUp.start();
                            }
                        },{
                            //roundedClass:$Rounded.ROUNDED,
                            text: "reset",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick: function () {
                                that.countUp.reset();
                            }
                        }]
                    }
                }
            };
        },
    });

    return DemoText;
});
