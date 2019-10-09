/**
 * 使用pnotify插件
 * https://github.com/sciactive/pnotify/tree/v3.2
 * @author:
 * @date: 15-1-9
 */
/*define(["kendo",
		'text!/core/js/windows/templates/message.html','css!/core/js/windows/css/messageBox.css' ], 
		function(kendo,template) {
	$(document.body).append('<span id="notification"></span>');
	
	var notification = $("#notification").kendoNotification({
		position : {
			pinned : true,
			top : 30,
			right : 30
		},
		autoHideAfter : 3000,
		stacking : "down",
		templates : [ {
			type : "info",
			template : template
		}, {
			type : "error",
			template : template
		}, {
			type : "warn",
			template : template
		}, {
			type : "success",
			template : template
		}  ]

	}).data("kendoNotification");

	var messageBox = {
	   error:function(msg){
		   notification.show({
	            title: "错误：",
	            message: msg
	        },"error");
	   },
	   info:function(msg){
		   notification.show({
	            title: "信息：",
	            message: msg
	        },"info");
	   },
	   warn:function(msg){
		   notification.show({
	            title: "警告：",
	            message: msg
	        },"warn");
	   },
	   success:function(msg){
		   notification.show({
			   title: "",
			   message: msg
	        },"success");
	   }
	}
	
	return messageBox;
});*/
define(["pnotify",
        'pnotify.nonblock', 'pnotify.desktop'],
    function(PNotify,template) {
        PNotify.desktop.permission();
        PNotify.prototype.options.styling = "bootstrap3";
        PNotify.prototype.options.styling = "fontawesome";

        function create(title,msg,type){
            new PNotify({
                title: title,
                text: msg,
                desktop: {
                    desktop: true
                },
                delay:3000,
                nonblock: {
                    nonblock: true
                },
                type:type
            });
		}
        var messageBox = {
            error:function(msg){
                create("错误：",msg,"error");
            },
            info:function(msg){
                create("信息：",msg,"info");
            },
            warn:function(msg){
                create("警告：",msg,"warn");
            },
            success:function(msg){
                create("信息：",msg,"success");
            },
            message:function(){

            }
        }

        return messageBox;
    });

