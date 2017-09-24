/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/biz/BaseGrid","core/js/controls/Button" ],
    function ( BaseGrid,Button) {
        var view = BaseGrid.extend({
            url:"/rest/sysconf!page.action",
            columnsUrl:"/query/getColumns.action?shortName=sysconf",
            postData: {outorin: 1},
            selectRow: function (rowid) {
                that.$("#" + rowid + "_invdate").datetimepicker({dateFormat: 'yyyy-mm-dd hh:ii:ss'})
                    .on('changeDate', function () {
                        $(this).datetimepicker('hide'); // force close the calendar
                    });
            },
            gridComplete: function () {
                var ids = $(this).jqGrid('getDataIDs');
                for (var i = 0; i < ids.length; i++) {
                    var cl = ids[i];
                    var bt ='<div class="col-lg-12" id="grid_'+cl+'"></div>';

                    $(this).jqGrid('setRowData', ids[i], {'checked':bt});
                    var button = new Button({
                        text:"审核通过",
                        themeClass:Button.ThemeClass.DEFAULT ,
                        className: Button.ClassName.primary,
                        $container:$(this).find('#grid_'+cl),
                        onclick:function(){
                            $.window.confirm("测试1",{
                                yesHandle:function(){
                                    alert(">>>");
                                }
                            });
                        }
                    });
                    //$("#"+'grid_'+cl).on("click",function(){alert("!!!!");}) ;
                    //button.render();
                }
            }
        });

        return view;
    });