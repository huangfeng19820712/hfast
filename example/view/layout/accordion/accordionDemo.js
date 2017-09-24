/**
 * @date: 14-2-24
 */
define(['jquery',
    'core/js/layout/Accordion',
    'core/js/controls/Label'
], function ($, Accordion,Label) {
    var accordionDemo = Accordion.extend({
        beforeInitializeHandle:function(options, triggerEvent){
            this._super();
            this.accordionItems =  [
                {
                    label: "one",
                    height: 40
                },
                {
                    label: "two",
                    content:{
                        comXtype: $Component.FIELDSET,
                        comConf: {
                            fields: [{
                                label: "时间",
                                name: "datetime",
                                editorType: $Component.DATETIMEEDITOR,
                                rules: {
                                    required: true,
                                },
                            },{
                                label: "文本",
                                name: "text",
                                editorType: $Component.TEXTEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            },{
                                label: "日期",
                                name: "date",
                                editorType: $Component.DATEEDITOR,
                                rules: {
                                    required: true,
                                    maxlength: 20,
                                },
                            }]
                        }
                    }
                },
                {
                    label: "three",
                },
                {
                    label: "four",
                    height: 40
                }
            ];
        },
        //监听渲染事件
        onrender: function (e) {
            this.getRegionByIndex(1).show("demo/view/layout/labelView",
                {text: "one",/**
                 * 定义是否可以拖动,boolean值
                 */
                draggable:true,
                width:50,
                draggableConf:{
                    //connectToSortable:".panel-content",
                    appendTo: "body",
                    helper: "clone",
                    /*helper: function(){
                        var label = new Label({
                            text:"test",
                            zIndex:99,
                            width:50
                        });
                        label.render();
                        return label.$el;
                    },*/
                    create:function( event, ui ){

                    },
                    start:function(event, ui ){
                    }
                }});

            /*
            this.getRegion("two").show("demo/view/layout/labelView", {text: "two"});
            this.getRegion("three").show("demo/view/layout/labelView", {text: "three(扣除已经指定了height，剩余的空间按指定的flex进行分配)", fontSize: "20px"});
            this.getRegion("four").show("demo/view/layout/labelView", {text: "four"});*/
        },
       /* onshow: function () {
            //设置背景颜色，为了演示效果
            //$("#one").css("background", "#123");
            //$("#two").css("background", "#321");
            //$("#three").css("background", "#231");
            //$("#four").css("background", "#132");
        }*/
    });
    return accordionDemo;
});

