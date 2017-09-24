/**
 * @author:   * @date: 2015/9/22
 */
define(["core/js/grid/JqGrid",
        "core/js/utils/ApplicationUtils"],
    function (JqGrid,ApplicationUtils) {
        var BaseGrid = JqGrid.extend({
            columnsUrl:null,
            exportExcelUrl:null,
            initializeHandle: function () {
                var ajaxClient = this.getAjaxClient();
                //同步执行
                var that = this;
                ajaxClient.buildClientRequest(this.columnsUrl)
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if(obj&&obj.result){
                            that.initColums(obj.result);
                        }
                        /*if (!obj.successful) {
                            //成功失败
                            that.showErrorMsg(obj.errMsg);
                        }else{
                            that.initColums(obj.result);
                        }*/
                    },false);
                if(this.postData){
                    this.postData = {};
                }
                this.postData["gridPlugin"] = "jqGrid";
                //Todo 从服务器读取的数据
                this.searchOperators = true;

            },
            initGrid:function(){
                this._super();
                var that = this;
                if(this.pageable){
                    this.$table.navSeparatorAdd("#"+this.getPagerId()).navButtonAdd("#"+this.getPagerId(),{
                        caption:"导出excel",
                        buttonicon:"glyphicon-download-alt",
                        onClickButton: function(){
                            if(that.exportExcelUrl){
                                var ajaxClient = that.getAjaxClient();
                                ajaxClient.exportFile(that.exportExcelUrl);
                            }
                            return false;
                        },
                        position:"last"
                    })
                }

            },
            initColums:function(data){
                this.colModel = data;
            },
            getAjaxClient:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                var ajaxClient = applicationContext.getAjaxClient();
                return ajaxClient;
            }
        });
        return BaseGrid;
    });