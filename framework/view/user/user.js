/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        $Component.BASEGRID.src,
        "core/js/model/BaseModel",
        "core/js/controls/Button",
        "core/js/CommonConstant",
        "core/js/utils/ApplicationUtils",
        $Component.TOOLSTRIPITEM.src,
        "ladda","core/js/rpc/Action","core/js/rpc/ResponseHandle",
        "core/js/windows/messageBox","lib/md5",
    $Component.SKYFORMEDITOR.src],
    function ( BaseGrid,BaseModel,Button,CommonConstant,ApplicationUtils,ToolStripItem,Ladda,
               Action,ResponseHandle,MessageBox,MessageDigest,Skyformeditor) {
        var UserModel = BaseModel.extend({
            nameSpace: "user",
            recovery:function(id,async,successCalback){
                var asyncValue = true;
                if(async!=null&&async==false){
                    asyncValue = false;
                }
                var action = new Action({
                    nameSpace:this.nameSpace,
                    methodName:"recovery"
                });
                var that = this;
                this.ajax(action.getUrl(),{id:id},null,async,function(compositeResponse,options){
                    ResponseHandle.successHandle(compositeResponse,function(compositeResponse){
                        MessageBox.success(compositeResponse.getSuccessMsg());
                        if(successCalback){
                            successCalback();
                        }
                    });
                });
            }
        });

        var view = BaseGrid.extend({
            url:"/user/memberPage.action",
            editurl:"/user/save.action",
            formModel:$cons.JqGrid.formModel.skyForm,
            roleId:null,
            pageToolbarable:true,
            pageToolbarOptions:{
                edit:false,add:true,del:false,search:false,refresh:true
            },
            postData: {outorin: 1},
            beforeInitializeHandle:function(options, triggerEvent){
                var that = this;
                this.formEditorOptions = {
                    paramPrefix:"editObj",
                    //提交表单前，对参数进行处理
                    parseParameters:function(params){
                        //把密码的字段都进行加密
                        var newParams = _.clone(params);
                        var key = "editObj.passwd";
                        newParams[key] = MessageDigest.digest(params[key]);
                        key = "editObj.confirmNewPassword";
                        newParams[key] = MessageDigest.digest(params[key]);
                        newParams["roleId"] = that.roleId;
                        return newParams;
                    }
                };
                this.colModel = [
                    { label: 'id', name: 'id'},
                    { label: 'userId', name: 'userId', width: 75, key:true ,hidden:true},
                    { label: '用户名', name: 'userName', width: 90,editable:true,editrules:{required: true}},
                    { label: '密码', name: 'passwd', hidden:true,editable:true,editType:"text",editoptions:{textMode:"password"},
                        editrules:{required: true}},
                    { label: '确认密码', name: 'confirmNewPassword', hidden:true,editable:true,editType:"text",
                        editoptions:{textMode:"password",messages:{
                                equalTo: "两次输入的密码不一致"
                            }},
                        editrules:{required: true,
                            //使用的是jquery的选择器,/是否是表单内的上下文
                            equalTo:{formContext:true,
                                value:"input[name$='passwd']"}
                            }},
                    { label: '是否是管理员', name: 'admined', hidden:true,editable:true,editType:"switch",hidden:true,
                        editoptions:{
                            onText:"是",
                            offText:"否"
                        },
                        editrules:{required: true}},
                    { label: '登陆时间', name: 'loginDatetime' },
                    { label: '登陆IP', name: 'loginIp' },
                    { label: '上次登陆时间', name: 'lastLoginDatetime'},
                    { label: '上次登陆ip', name: 'lastLoginIp'},
                    { label: '是否删除', name: 'delFlag',formatter:"select",editoptions:{value:"0:否;1:是"},stype: "select",searchoptions: {value:":全部;0:否;1:是"}},
                    { label: '操作', name: 'opertion', search:false,editable:false,
                        formatterComConf:function(rowData){
                            var delFlag = rowData.delFlag;
                            var toggleDeleteText = null;
                            if(delFlag=="1"){
                                toggleDeleteText = "恢复";
                            }else{
                                toggleDeleteText = "删除";
                            }
                            return {
                                comXtype:$Component.TOOLSTRIP,
                                comConf:{
                                    /*Panel的配置项 start*/
                                    textAlign:$TextAlign.RIGHT,
                                    realClass:"btn-group text-right",
                                    spacing :CommonConstant.Spacing.DEFAULT,
                                    itemOptions: [{
                                        text:"修改密码",
                                        onclick: function (event) {
                                            var gridid = this.getParent().$el.parent().data("gridid");
                                            var grid = $utils.getApplicationUtils().getComponentById(gridid);
                                            var rowid = this.getParent().$el.parent().data("rowid");
                                            // var rowData = grid.getRowData(rowid);
                                            var editor = that.updatePasswordForm(rowid);
                                            //添加操作成功事件
                                            editor.on("submit",function(){
                                                var modalDialog = $.window.getActive();
                                                modalDialog.hide();
                                            });
                                            var buttons = [{
                                                themeClass: ToolStripItem.ThemeClass.PRIMARY,
                                                text: "修改",
                                                autofocus: true,
                                                onclick: function(){
                                                    editor.submit();
                                                }
                                            }, {
                                                themeClass: ToolStripItem.ThemeClass.CANCEL,
                                                text: "重置",
                                                onclick:  function(){
                                                    /*var modalDialog = $.window.getActive();
                                                    modalDialog.hide();*/
                                                    editor.reset();
                                                }
                                            }];

                                            $.window.showMessage(editor.$el, {
                                                title:"修改密码",
                                                buttons: buttons,
                                                width:800
                                            });
                                        }
                                    },{
                                        text: toggleDeleteText,
                                        mode:ToolStripItem.Mode.LADDA,
                                        onclick: function (event) {
                                            var l = Ladda.create(event.jqEvent.currentTarget);
                                            l.start();
                                            var rowid = this.getParent().$el.parent().data("rowid");
                                            var userModel = new UserModel();
                                            var applicationContext = ApplicationUtils.getApplicationContext();
                                            this.ajaxClient = applicationContext.getAjaxClient();
                                            userModel.setAjaxClient(this.ajaxClient);
                                            var gridid = this.getParent().$el.parent().data("gridid");
                                            var grid = $utils.getApplicationUtils().getComponentById(gridid);
                                            var callBack = function(){
                                                //修改label信息
                                                // event.target.setText("恢复");
                                                grid.reloadGrid();
                                            };
                                            if(delFlag=="1"){
                                                userModel.recovery(rowid,true,callBack);
                                            }else{
                                                userModel.delete(rowid,true,callBack);
                                            }
                                            //无论对错，都执行
                                            userModel.setFetchAlwaysFunction(function(){
                                                l.stop();
                                            });

                                        }
                                    }]
                                    /*Panel 配置 End*/
                                }
                            }
                        }},
                ];
            },
            /**
             * 修改密码
             * @param id
             * @returns {*}
             */
            updatePasswordForm:function(id){
                var editor = new Skyformeditor({
                    submitUrl:"/user/updateUserPassword.action",
                    defaultCollapsible: false,
                    ajaxClient: this.ajaxClient,

                    fields: [ {
                        label:"旧密码",
                        name:"oldPassword",
                        editorType:$Component.TEXTEDITOR,
                        rules:{
                            required: true,
                        },
                        textMode:"password"
                    }, {
                        label:"id",
                        name:"id",
                        hidden:true,
                        value:id
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
                    }],
                    //提交表单前，对参数进行处理
                    parseParameters:function(params){
                        //把所有的字段都进行加密
                        var newParams = _.clone(params);
                        var keys = _.keys(newParams);
                        for(var i=0;i<keys.length;i++){
                            var key = keys[i];
                            newParams[key] = MessageDigest.digest(params[key]);
                        }
                        newParams.id = params.id;
                        return newParams;
                    }
                });
                editor.render();
                return editor;
            },
            onreload:function(){
                this.reloadGrid();
            },
            selectRow: function (rowid) {
                that.$("#" + rowid + "_invdate").datetimepicker({dateFormat: 'yyyy-mm-dd hh:ii:ss'})
                    .on('changeDate', function () {
                        $(this).datetimepicker('hide'); // force close the calendar
                    });
            },
            onformSubmit:function(){
                this.reloadGrid();
            },
            reloadGrid:function(){
                this.reloadByPostData({roleId:this.roleId});
            },
            /**
             * 设置角色id
             */
            setRoleId:function(roleId){
                this.roleId = roleId ;
                this.reloadByPostData({roleId:roleId});
            }
        });

        return view;
    });