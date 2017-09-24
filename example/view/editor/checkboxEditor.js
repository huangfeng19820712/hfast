/**
 * @author:   * @date: 2016/3/26
 */
define([
        "backbone",
        "core/js/layout/FluidLayout",
        "core/js/editors/CheckboxEditor",
        "core/js/utils/ApplicationUtils"],
    function (Backbone, FluidLayout, CheckboxEditor, ApplicationUtils) {
        var length = 0;
        var items = [{
            comXtype: $Component.CHECKBOXEDITOR,
            comConf: {
                id:"checkbox"+length,
                model:$cons.checkbox.Model.MINIMAL,
                name:"checkbox"+length,
                defaultValue:"aa,bb",
                onchecked:function(event){
                    console.info(event);
                },
                onunchecked:function(event){
                    console.info(event);
                },
                items:[{
                    label:"aa",
                    value:"aa"
                },{
                    label:"bb",
                    value:"bb"
                }]
            }
        }];
        length++;
        for(var i in $cons.checkbox.Model){
            var model = $cons.checkbox.Model[i];
            items.push({
                comXtype: $Component.CHECKBOXEDITOR,
                comConf: {
                    model:model,
                    name:"checkbox"+length,
                    defaultValue:"aa",
                    onchecked:function(event){
                        console.info(event);
                    },
                    onunchecked:function(event){
                        console.info(event);
                    },
                    items:[{
                        label:"aa",
                        value:"aa"
                    },{
                        label:"bb",
                        value:"bb"
                    }]
                }
            });
            length++;
        }
        var checkboxEditor = FluidLayout.extend({

            items: null,
            /*Panel的配置项 start*/
            /*Panel 配置 End*/
            initItems:function(){
                this.items = [];
                //this.items.push(this.getAllModelPanel());
                this.items.push(this.getActionPanel());
            },
            getAllModelPanel:function(){
                return {
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"所有样式",
                        mainRegion:{
                            //panel下面在赖个流动布局
                            comXtype:$Component.FLUIDLAYOUT,
                            comConf:{
                                defaultColumnSize:$Column.COL_MD_3 ,
                                items:items
                            }
                        }
                    }
                };
            },
            getActionPanel:function(){
                return {
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"操作",
                        mainRegion:{
                            //panel下面在赖个流动布局
                            comXtype:$Component.FLUIDLAYOUT,
                            comConf:{
                                defaultColumnSize:$Column.COL_MD_3 ,
                                items:items,
                            }
                        },
                        footerRegion:{
                            comXtype:$Component.TOOLSTRIP,
                            comConf:{
                                /*Panel的配置项 start*/
                                textAlign:$TextAlign.RIGHT,
                                realClass:"btn-group text-right",
                                items: [{
                                    text:"获取值",
                                    onclick: function () {
                                        var component = ApplicationUtils.getComponentById("checkbox0");
                                        console.info(component.getValue());
                                    }
                                },{
                                    text: "取消",
                                    onclick: function () {

                                    }
                                }]
                                /*Panel 配置 End*/
                            }
                        }
                    }
                };
            }
        });

        return checkboxEditor;
    });
