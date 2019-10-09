/**
 * @author:   * @date: 2016/1/17
 */
define([
        "core/js/layout/FluidLayout",
        "core/js/windows/Window", "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils",
        "core/js/model/BaseModel",
        "core/js/model/PageModel","core/js/controls/Button"],
    function (FluidLayout, Window,
              ApplicationContext, ApplicationUtils,BaseModel,PageModel,Button) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            dbsModel:null,
            initialize: function (options,triggerEvent) {
                this.items = [];
                this.items.push(this.dbsItem());
                this.items.push(this.keysItem());
                this.items.push(this.valueItem());
                this._super(options,triggerEvent);
            },
            dbsItem:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                this.ajaxClient = applicationContext.getAjaxClient();
                var DbsModel = BaseModel.extend({
                    url:"/redis/getDbs.action",
                    async:false,
                    parse:function(result, options){
                        //设置Model的dbs属性存放结果
                        return {dbs:result};
                    },
                    getDbs:function(){
                        return this.get("dbs")
                    }
                });
                this.dbsModel = new DbsModel();
                this.dbsModel.setAjaxClient(this.ajaxClient);
                this.dbsModel.fetch();

                var dbs = this.dbsModel.getDbs();


                var btnItems = [];
                var that = this ;
                if(dbs!=null){
                    for(var i=0;i<dbs.length;i++){
                        (function(patternKey){
                            btnItems.push({
                                text: patternKey,
                                roundedClass:$Rounded.ROUNDED,
                                onclick:function(event){

                                    var grid = that.getGrid();
                                    grid.setDefaultPostData({
                                        patternKey:patternKey+"*"
                                    });
                                    grid.reload();
                                }
                            });
                        })(dbs[i]);
                    }
                }
                return {
                    comXtype:$Component.NAVIGATIONBAR,
                    columnSize:$Column.COL_MD_12,
                    comConf:{
                        items:[
                            {
                                comXtype:$Component.NAVFORMEDITOR,
                                comConf:{
                                    fields:[{
                                        editorType: $Component.TOOLSTRIP,
                                        itemOptions:btnItems

                                    }],
                                }
                            }

                        ]
                    }

                };
            },
            getGrid:function(){
                return this.getRegionByIndex(1).getComRef();
            },
            /**
             * 获取子类配置对象
             * @returns {{comXtype: ($global.constants.component.BOOTSTRAPGRID|{name, label, src, type}), columnSize: string, comConf: {paginationMode: string, thead: string[], colModel: *[],  data: null, initializeHandle: Function}}}
             */
            keysItem:function(){
                var that = this;
                return {
                    comXtype:$Component.BOOTSTRAPGRID,
                    columnSize:$Column.COL_MD_2,
                    comConf:{
                        paginationMode:$cons.PaginationMode.SIMPLE,
                        thead: ["num", "key"],
                        colModel: [
                            {name: "num", label: "序号",key:true},
                            {name: "key", label: "key"}
                        ],
                        rownumbers:false,
                        nameSpace:"redis",
                        methodName:"keysPage",
                        onselect:function(event,data){
                            var key = data.key;
                            var codeEditor = that.getComponentByIndex(2);
                            var applicationContext = ApplicationUtils.getApplicationContext();
                            var ajaxClient = applicationContext.getAjaxClient();
                            //var that =this;
                            ajaxClient.buildClientRequest("redis/getValue.action?key="+key).post(function (compositeResponse) {
                                var obj = compositeResponse.getSuccessResponse();
                                if (obj.successful) {
                                    codeEditor.setValue(JSON.stringify(obj.result));
                                    codeEditor.format();
                                }
                            },false);
                        }
                    }
                };
            },
            valueItem:function(){
                return {
                    comXtype:$Component.CODEEDITOR,
                    columnSize:$Column.COL_MD_10,
                    comConf:{
                        mode:$cons.CodeEditorMode.json,
                    }
                };
            }
        });

        return view;
    });
