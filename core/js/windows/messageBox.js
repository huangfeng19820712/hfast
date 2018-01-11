/**
 * @author:
 * @date: 15-1-9
 */
define([ "jquery", "kendo", "dialog",
		'text!/core/js/windows/templates/message.html','css!/core/js/windows/css/messageBox.css' ], 
		function($,kendo,dialog,template) {
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
});
