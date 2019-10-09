/**
 * @author:   * @date: 2015/9/22
 */
define(["core/js/grid/JqGrid",
        "core/js/utils/ApplicationUtils",
        "core/js/utils/Utils"],
    function (JqGrid,ApplicationUtils,Utils) {
        var BaseGrid = JqGrid.extend({
            columnsUrl:null,
            exportExcelUrl:null,
            hiddenColumns:null,
            initializeHandle: function () {
                this.ajaxClient = this.getAjaxClient();
                //同步执行
                var that = this;
                if(this.columnsUrl){
                    this.ajaxClient.buildClientRequest(this.columnsUrl)
                        .post(function (compositeResponse) {
                            var obj = compositeResponse.getSuccessResponse();
                            if(obj&&obj.result&&obj.result.records){
                                that.initColumns(obj.result.records);
                            }
                        },false);
                }
                if(!this.postData){
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
            /**
             * 初始化列表信息
             * @param data
             */
            initColumns:function(data){
                for(var i in data){
                    //设置编辑与查询的子项
                    if($.isNotBank(data[i].itemValue)){
                        data[i].edittype="select";
                        data[i].editoptions={value:data[i].itemValue};
                        data[i].stype = "select";
                        data[i].formatter = "select";
                        data[i].searchoptions={value:":全部;"+data[i].itemValue};
                    }
                    if(this.hiddenColumns&&this.hiddenColumns.length>0){
                        var isContains = _.contains(this.hiddenColumns, data[i].name);
                        if(isContains){
                            //设置隐藏属性
                            data[i].hidden = true;
                        }
                    }
                    //当有caption，但是没有label属性时，需要把把caption设置成label
                    if(data[i].caption&&!data[i].label){
                        data[i].label = data[i].caption;
                    }
                }
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