/**
 * @author:   * @date: 2015/12/7
 */
define([$Component.CENTERLAYOUT.src,"lib/md5","core/js/rpc/Action",
        "core/js/utils/ApplicationUtils"],
    function (CenterLayout, MessageDigest,Action,ApplicationUtils) {
        var view = CenterLayout.extend({
            beforeInitializeHandle:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                this.ajaxClient = applicationContext.getAjaxClient();
                this.item = {
                    comXtype:$Component.FORMPANEL,
                    comConf:{
                        title:"修改密码",
                        ajaxClient:this.ajaxClient,
                        isShowHeaderRightRegion:false,
                        //defaultEditorLayoutMode: $cons.EditorLayoutMode.HORIZONTAL,
                        action:new Action({
                            nameSpace:"user",
                            methodName:"updatePassword"}),
                        formEditorConf:{
                            //提交表单前，对参数进行处理
                            parseParameters:function(params){
                                //把所有的字段都进行加密
                                var newParams = _.clone(params);
                                var keys = _.keys(newParams);
                                for(var i=0;i<keys.length;i++){
                                    var key = keys[i];
                                    newParams[key] = MessageDigest.digest(params[key]);
                                }
                                return newParams;
                            }
                        },
                        fields:[{
                            label:"旧密码",
                            name:"oldPassword",
                            editorType:$Component.TEXTEDITOR,
                            rules:{
                                required: true,
                            },
                            textMode:"password"
                        },{
                            label:"新密码",
                            name:"newPassword",
                            rules:{
                                required: true,
                            },
                            editorType:$Component.TEXTEDITOR,
                            textMode:"password"
                        },{
                            label:"确认新密码",
                            rules:{
                                required: true,
                                //使用的是jquery的选择器
                                equalTo:"input[name$='newPassword']"
                            },
                            messages:{
                                equalTo: "两次输入的新密码不一致"
                            },
                            name:"confirmNewPassword",
                            editorType:$Component.TEXTEDITOR,
                            textMode:"password"
                        }]
                    }
                }
            }

        });

        return view;
    });