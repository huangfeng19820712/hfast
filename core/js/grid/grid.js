/**
 * @author:
 * @date: 15-1-9
 */
define(["jquery", "kendo","core/js/windows/messageBox"], function ($,kendo,messageBox) {
	var moduleName = "test";
	// 在body中添加提示的span;
	// $(document.body).append('<span id="popupNotification"></span>');
	// var popupNotification =
	// $("#popupNotification").kendoNotification().data("kendoNotification");

    var grid = {
    	options:{
            dataSource: {
            	type:"json",
                transport: {
                    read: {
                    	type : "post",
                    	dataType: "json",
                    	url:$route.getGridPath("page",moduleName)
                    },
                    update: {
                    	type : "post",
                        url: $route.getGridPath("update",moduleName),
                        dataType: "json"
                    },
                    create: {
                    	type : "post",
                        url: $route.getGridPath("add",moduleName),
                        dataType: "json"
                    },
                    destroy: {
                        url: $route.getGridPath("del",moduleName),
                        dataType: "json"
                    },
                    parameterMap: function(data, type) {
                        if (type == "read") {
                        	data['$page']  = "page";
                        	data['$pageSize'] = "pageSize";
                          return data;
                        }else{
                        	return {data: kendo.stringify(data.models)};
                        }
                      }
                },
                batch: true,
                schema:{
                    model:{id:"id"},
                    data: "rows"
                },
                error: function(e) {
                	// TODO 后面需要添加异常处理功能
                	messageBox.error(e.errors);
                    console.log(e.errors); // displays "Invalid query"
                  },
                  //请求结束后的函数
                  requestEnd: function(e) {
                	  var type = e.type;
                	  if(e.type&&e.response&&e.response.suc&&(e.type=="update"||e.type=="create")){
                		  messageBox.success(e.response.suc);
                	  }
                	},
                serverPaging:true,
                pageSize: 10,
                serverFiltering: true,
                serverSorting: true
            },
            filterable: {
                mode: "row"
            },
            sortable: {
            	// 可以多个属性进行排序
                mode: "multiple",
                allowUnsort: true
            },
            batch: true,
            groupable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            toolbar: ["create", "save", "cancel"],
            editable: true,
            columns: []
        },
        run: function () {
        	var that = this;
        	$.ajax({
        		url:$route.getGridPath("index",moduleName),
        		dataType:"json",
        		success:function(result){
        			if(result.columns!=undefined&&result.columns.length>0){
        				$.each(result.columns,function(i,col){
        					var type = null;
        					var format = null;
        					if("currency"==col.type){
        						type = "number";
        						format = "{0:c}";
        					}else if("date"==col.type){
        						type = "date";
        						format = "{0:yyyy'-'MM'-'dd}";
        					}else{
        						type = col.type;
        						format = '';
        					}
        					if(that.options.columns==null){
        						that.options.columns = [];
        					}
        					that.options.columns.push({
        						field: col.name,
        	                    title: col.label,
        	                    format:format,
        	                    width:col.columnWidth||null
        					});
        					if(that.options.dataSource.schema.model.fields==null){
        						that.options.dataSource.schema.model.fields = {};
        					}
        					
        					that.options.dataSource.schema.model.fields[col.name]={ "type": type};
        				});
        				that.options.columns.push({ command: "destroy", title: "&nbsp;", width: 150 });
        				
        			}
        			// 初始化grid
        			var kendoGrid = $("#main").kendoGrid(that.options).data("kendoGrid");

        			// 初始化额外的button
        			/* $(".k-grid-Button2").on("click",function(){
        				 notification.show({
                             title: "Wrong Password",
                             message: "Please enter your password again."
                         }, "error");
        			    });*/
        		}
        	});
        }
    };
    
   

    return grid;
});
