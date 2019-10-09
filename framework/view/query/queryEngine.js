/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/biz/BaseGrid","core/js/controls/Button" ],
    function ( BaseGrid,Button) {
        var view = BaseGrid.extend({
            id:null,
            initializeHandle:function(){
                this.url = "/query/pageByQryId.action?id="+this.id;
                this.columnsUrl = "/query/getColumnsByQryId.action?id="+this.id;
                this._super();
            },
        });
        return view;
    });