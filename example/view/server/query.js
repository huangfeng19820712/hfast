/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/biz/BaseGrid","core/js/controls/Button" ],
    function ( BaseGrid,Button) {
        var view = BaseGrid.extend({
            entity:"",
            url:null,
            columnsUrl:null,
            postData: {outorin: 1},
            //formColumnSize :3,
            initializeHandle:function(){
                this.url = "/rest/"+this.entity+"!page.action";
                this.columnsUrl = "/query/getColumns.action?shortName="+this.entity;
                this.editurl = "/rest/"+this.entity+"!oper.action?gridPlugin=jqGrid";
                this.exportExcelUrl = "/rest/"+this.entity+"!exportExcel.action";
                this._super();
            },
        });

        return view;
    });