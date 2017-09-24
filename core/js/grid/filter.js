/**
 * @author:
 * @date: 15-1-9
 */
define(["jquery", "kendo"], function ($) {

    var grid = {
        run: function () {
            $("#main").kendoGrid({
            	dataSource: {
                    type: "odata",
                    transport: {
                        read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
                    },
                    schema: {
                        model: {
                            fields: {
                                OrderID: { type: "number" },
                                Freight: { type: "number" },
                                ShipName: { type: "string" },
                                OrderDate: { type: "date" },
                                ShipCity: { type: "string" }
                            }
                        }
                    },
                    pageSize: 20,
                    serverPaging: true,
                    serverFiltering: true,
                },
                height: 550,
                filterable: {
                    mode: "row"
                },
                pageable: true,
                columns: 
                [{
                    field: "OrderID",
                    width: 225,
                    filterable: {
                        cell: {
                            showOperators: false
                        }
                    }
                },
                {
                    field: "ShipName",
                    width: 500,
                    title: "Ship Name",
                    filterable: {
                        cell: {
                            operator: "contains"
                        }
                    }
                },{
                    field: "Freight",
                    width: 255,
                    filterable: {
                        cell: {
                            operator: "gte"
                        }
                    }
                },{
                    field: "OrderDate",
                    title: "Order Date",
                    format: "{0:MM/dd/yyyy}"
                }]
            });
        }
    };

    return grid;
});
