/**
 * @author:   * @date: 2016/1/21
 */
define([$Component.BOOTSTRAPGRID.src,
        $Component.PAGEMODEL.src,
        $Component.TOOLSTRIPITEM.src,
        "core/js/utils/ApplicationUtils",],
    function (BootstrapGrid, PageModel,ToolStripItem,ApplicationUtils
    ) {
        var roleTable = BootstrapGrid.extend({
            thead: ["name", "tableName"],
            colModel: [
                {name: "id", label: "id", key: true,formatoptions:{maxLength:4}},
                {name: "code", label: "编码"},
                {name: "name", label: "名称"}
            ],
            data: null,
            initializeHandle: function () {
                //初始化data
                var that = this;
                this.model = new PageModel({
                    nameSpace: "role",
                    methodName: "page",
                    async: false,
                    syncable: false
                });
                var applicationContext = ApplicationUtils.getApplicationContext();
                this.ajaxClient = applicationContext.getAjaxClient();
                this.model.setAjaxClient(this.ajaxClient);
                //this.model.setFetchSuccessOnceFunction(this.renderView,this);
                this.model.pageFetch();
                this.toolbarItemOptions = [
                    _.extend(ToolStripItem.DefaultCommand.add,{
                        onclick: function () {
                            that.model.addRecord({
                                id: $.uuid(),
                                code:"",
                                name:""
                            });
                            //获取此焦点

                        }
                    }),_.extend(ToolStripItem.DefaultCommand.delete,{
                        onclick: function () {
                            var activeRecordId = that.getActiveRecordId();
                            if(activeRecordId){
                                that.model.delete(activeRecordId,true,function(){
                                    //删除成功后，列表中也要删除，联动的内容也要修改
                                    that.deleteTr(activeRecordId);
                                    that.activeFirstTr();
                                });
                            }
                        }
                    })
                ];
            },
            changeRecord:function(record){
                if(record!=null&&record.id){
                    this.model.changeRecord({
                        id:record.id
                    },record)
                }
            }
        });
        return roleTable;
    });
