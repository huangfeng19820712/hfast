/**
 * @author:   * @date: 2016/1/17
 */
define([
        "core/js/layout/FluidLayout","core/js/controls/Button" ],
    function ( FluidLayout,Button) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: [{
                comXtype:$Component.JQGRID,
                comConf:{
                    url:"view/grid/treedata.json",
                    pageable:false,
                    // colNames:['编号','姓名','密码','年龄','地址','出生日期'],
                    colModel:[
                        {
                            "name":"category_id",
                            "index":"accounts.account_id",
                            "sorttype":"int",
                            "key":true,
                            "hidden":true,
                            "width":50,

                        },{
                            "name":"name",
                            "index":"name",
                            "sorttype":"string",
                            "label":"Name",
                            "width":170,
                            sortable: false
                        },{
                            "name":"price",
                            "index":"price",
                            "sorttype":"numeric",
                            "label":"Price",
                            "width":90,
                            "align":"right"
                        },{
                            "name":"qty_onhand",
                            "index":"qty_onhand",
                            "sorttype":"int",
                            "label":"Qty",
                            "width":90,
                            "align":"right"
                        },{
                            "name":"color",
                            "index":"color",
                            "sorttype":"string",
                            "label":"Color",
                            "width":100
                        },{
                            "name":"lft",
                            "hidden":true
                        },{
                            "name":"rgt",
                            "hidden":true
                        },{
                            "name":"level",
                            "hidden":true
                        },{
                            "name":"uiicon",
                            "hidden":true
                        }
                    ],
                    jsonReader:{
                        root:"rows"
                    },
                    treeConf:{
                        treeGrid : true,
                        ExpandColumn : "name",
                        ExpandColClick : false,
                        "loadonce":true,
                        tree_root_level : 0,
                        "treeReader":{
                            "left_field":"lft",
                            "right_field":"rgt",
                            "level_field":"level",
                            "leaf_field":"isLeaf",
                            "expanded_field":"expanded",
                            "loaded":"loaded",
                            "icon_field":"icon"
                        },
                        treeGridModel: 'nested'
                    }
                }
            }]
        });

        return view;
    });
