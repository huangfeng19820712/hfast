/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/biz/BaseGrid", "core/js/controls/Button",
        "core/js/CommonConstant",
        $Component.TOOLSTRIPITEM.src,
        "core/js/model/BaseModel","core/js/windows/messageBox","core/js/rpc/Action"],
    function (BaseGrid, Button,CommonConstant,ToolStripItem,BaseModel,MessageBox,Action) {

        var ScheduleJobModel = BaseModel.extend({
            nameSpace:"ScheduleJob",
            defaults: {
                id: "1"
            },
            postJob:function(methodName,rowData,successCalback){
                //传送id
                this.post(new Action({nameSpace:this.nameSpace,methodName:methodName}),
                    {id:rowData.id},true,successCalback);
            }
        });

        var view = BaseGrid.extend({
            url: "/ScheduleJob/getScheduleJobs.action",
            editurl: "/rest/sysconf!oper.action?gridPlugin=jqGrid",
            postData: {outorin: 1},
            //设置成skyForm模式
            formModel: $cons.JqGrid.formModel.skyForm,
            model:null,
            initializeHandle:function(){
                var that = this;
                this.colModel = [
                    { label: '任务ID', name: 'id',editable:false ,key:true },
                    { label: '任务名称', name: 'jobName',editable:false ,editrules : {required : true}},
                    { label: '任务状态', name: 'jobStatus', editable:false },
                    { label: '触发器', name: 'cronExpression',editable:true },
                    { label: '备注', name: 'remark',editable:false },
                    { label: '实现类', name: 'jobClass',editable:true },
                    { label: '操作',  search:false,editable:false,width:160,
                        formatterComConf:function(rowData){
                            return {
                                comXtype:$Component.TOOLSTRIP,
                                comConf:{
                                    /*Panel的配置项 start*/
                                    textAlign:$TextAlign.RIGHT,
                                    realClass:"btn-group text-right",
                                    //spacing :CommonConstant.Spacing.DEFAULT,
                                    itemOptions: [{
                                        //themeClass:ToolStripItem.ThemeClass.PRIMARY,
                                        title:"暂停",
                                        iconSkin:"fa-pause",
                                        onclick: $.proxy(that.postJob,that,"pauseJob")
                                    },{
                                        //themeClass:ToolStripItem.ThemeClass.PRIMARY,
                                        title:"继续",
                                        iconSkin:"fa-forward",
                                        onclick: $.proxy(that.postJob,that,"resumeJob")
                                    },{
                                        title:"删除",
                                        iconSkin:"fa-trash-o",
                                        onclick: $.proxy(that.postJob,that,"deleteJob")
                                    },{
                                        title:"立即运行一次",
                                        iconSkin:"fa-play",
                                        onclick: $.proxy(that.postJob,that,"triggerJob")
                                    }]
                                    /*Panel 配置 End*/
                                }
                            };
                        }}
                ];

                //先执行父类
                this._super();

                this.model = new ScheduleJobModel();
                this.model.setAjaxClient(this.ajaxClient);
                this.model.setFetchSuccessFunction(function(){
                    MessageBox.success("操作成功！");
                }, this, this.model);
            },
            postJob:function(methodName,event){
                var rowData = this.getRowDataByClick(event);
                var that = this;
                this.model.postJob(methodName,rowData,function(obj){
                    that.reload();
                });
            },
            /**
             * 获取行数据信息
             * @returns {*}
             */
            getRowDataByClick:function(event){
                var items = $utils.getApplicationUtils().getComponentByXtype($Component.JQGRID);
                var gridid = event.target.getParent().$el.parent().data("gridid");
                var rowid = event.target.getParent().$el.parent().data("rowid");
                var grid = $utils.getApplicationUtils().getComponentById(gridid);
                var rowData = grid.getRowData(rowid);
                return rowData;
            },

            /**
             *
             * @param rules {Object}    校验规则
             *
             */
            addRules: function (rules) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var col = this.colModel[i];
                    var name = col.name;
                    var rule = rules[name];
                    if(rule){
                        col.editrules = rule;
                    }
                }

            },
            /**
             * 添加必输的校验
             * @param colNames  {Array}     列表中name的数组
             */
            addRulesRequired: function (colNames) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var col = this.colModel[i];
                    if (_.indexOf(colNames, col.name) >= 0) {
                        //grid中的colModel是editrules
                        col.editrules = {required: true};
                    }
                }
            }
        });

        return view;
    });