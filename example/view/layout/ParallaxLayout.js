/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/TabLayout",
        "core/js/CommonConstant", "core/js/view/Region",],
    function (TabLayout, CommonConstant, Region) {
        var view = TabLayout.extend({
            tabs: [{
                label:"字段集组件",
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
            },{
                label:"字符串",
                content:"字符串"
            }]
        });


        return view;
    });
