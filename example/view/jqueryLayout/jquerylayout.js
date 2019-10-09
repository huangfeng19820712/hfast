/**
 * @author:   * @date: 2016/2/20
 */
define(["jquery.layout",],
    function (Layout) {
        var view = Layout.extend({
            initialize:function(){
                this._super();
                this.tabs = [{
                 label:"字符串",
                 content:"字符串"
                 },{
                    label:"字段集组件",
                    content:{
                        xtype: $Component.FIELDSET,
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
                }];
            }
        });


        return view;
    });
