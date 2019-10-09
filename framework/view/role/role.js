/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/layout/BorderLayout",
        "core/js/windows/Window","core/js/CommonConstant",
        "core/js/view/Region","core/js/controls/ToolStrip",
        "core/js/utils/PathUtils",
        "core/js/controls/ToolStripItem"],
    function (BorderLayout,
              Window,
              CommonConstant,
              Region,ToolStrip,
              PathUtils,
              ToolStripItem,
              ViewUtils
    ) {
        var role = BorderLayout.extend({
            /**
             * 设置底部的参考对象，以便设置容器的高度
             */
            //$bottomReferent:$(".push-sticky-footer").eq(0),
            initItems:function(){
                var that = this;
                var eq = $(".copyright").eq(0);
                if(eq.length>0){
                    this.$bottomReferent =  eq;
                }
                this.items =  [
                    {
                        region: BorderLayout.Region.WEST,    //西
                        padding:0,
                    },
                    {
                        region: BorderLayout.Region.CENTER,  //中间区域
                        padding:0,
                        showOverflowOnHover:false,//鼠标移过显示被隐藏的，只在禁用滚动条时用。
                    }
                ];
            },
            //监听渲染事件
            mountContent: function () {
                this._super();
                var that = this;
                //获取中心区域
                this.getWestRegion().show(PathUtils.getCurrentExecutionScriptDirectory()+"/roleTable", {
                    height:"100%",
                    onshow: function (e) {
                        var roleTable = this;
                        that.resizeRegion(BorderLayout.Region.WEST);
                        //获取数据，并设置roleTab中的roleId
                        var firstRecord = this.getFirstRecord();
                        //var roleTable = this;
                        // 获取左边（西）区域
                        that.getCenterRegion().show(PathUtils.getCurrentExecutionScriptDirectory()+"/roleTab",{
                            height:"100%",
                            roleId:firstRecord.id,
                            roleData:firstRecord,
                            onshow: function (e) {
                                if (this._super) {
                                    this._super(e);
                                }
                                that.resizeRegion(BorderLayout.Region.CENTER);
                                //this.setRoleId(firstRecord.id);
                                // this.resizeCenterRegion();
                            },
                            /**
                             * 提交代码后事件
                             */
                            onsubmitroleform:function(ajaxResponse,formValues){
                                if(ajaxResponse&&ajaxResponse.successful){
                                    //修改roleTable中的值
                                    roleTable.changeRecord(formValues)
                                }
                            }
                        });


                    },
                    onselect: function (event, data) {
                        var id = data.id;
                        this.setRoleTabRoleId(id,data);
                        /*var qryColumnComponent = comRef.getComponentByIndex(2);
                        qryColumnComponent.reloadByPostData({id: id});*/
                    },
                    setRoleTabRoleId: function (roleId,data) {
                        var roleTab = that.getCenterRegion().getComRef();
                        //在tab中设置roleId，尽量减少依赖
                        roleTab.setRoleId(roleId,data);

                    },
                });
            }
        });
        return role;
    });
