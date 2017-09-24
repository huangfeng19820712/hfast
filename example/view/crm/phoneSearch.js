/**
 * @author:   * @date: 2016/2/29
 */
define([
        $Component.FLUIDLAYOUT.src,
        $Component.TOOLSTRIPITEM.src,
        $Component.TEXTEDITOR.src,
        "ladda",
        "core/js/context/ApplicationContext",
        "core/js/windows/messageBox"],
    function ( FluidLayout,ToolStripItem,TextEditor,Ladda,
               ApplicationContext,
               MessageBox) {

        var phoneSearch = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            items: null,

            oninitialized:function(){
                var that = this;
                this.items = [{
                },{
                    comXtype:$Component.TEXTEDITOR,
                    comConf:{
                        placeholder:"手机号",
                        buttons:[{
                            mode:ToolStripItem.Mode.LADDA,
                            text:"查询",
                            themeClass:ToolStripItem.ThemeClass.PRIMARY,
                            onclick:function(event){
                                var l = Ladda.create(event.jqEvent.currentTarget);
                                l.start();
                                var parent = this.getParent($Component.TEXTEDITOR);
                                var phone = parent.getValue();
                                that.isContain(phone);

                                l.stop();
                            }
                        }]
                    }
                },{
                }];
            },
            isContain:function(phone){
                var ajaxClient = ApplicationContext.getAjaxClient();
                var that = this;
                var url = "/customerInfo/containPhone.action";
                ajaxClient.buildClientRequest(url)
                    .addParams({"phone": phone})
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if (obj==undefined) {
                            MessageBox.info("没有找到手机号！");
                        }else{
                            MessageBox.info("有此手机号！"+'<a id="search_pass" href="#">通过</a>');
                            $("#search_pass").on("click",function(){
                                var proxy = $.proxy(that,that.pass);
                                proxy(phone);
                                that.pass(phone,that);
                            });
                        }
                    });
            },
            pass:function(phone,context){
                var ajaxClient = ApplicationContext.getAjaxClient();
                var that = this;
                var url = "/customerInfo/pass.action";
                ajaxClient.buildClientRequest(url)
                    .addParams({"phone": phone})
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if (obj!=undefined) {
                            MessageBox.info("审批失败！");
                        }else{
                            MessageBox.info("审批成功！");
                        }
                    });

            },
        });

        /*var phoneSearch = BaseView.extend({
            onrender: function () {
                var phoneEditor = new TextEditor({
                    $container: this.$el,
                    buttons:[{
                        mode:ToolStripItem.Mode.LADDA,
                        text:"查询",
                        themeClass:ToolStripItem.ThemeClass.PRIMARY,
                        onclick:function(event){

                        }
                    }]
                });
            }
        });*/
        return phoneSearch;
    });

