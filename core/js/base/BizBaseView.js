/**
 * 模板默认去当前js的./tmpl路径的同名html文件
 * @author:   * @date: 2015/10/18
 */
define(["core/js/base/BaseView",
        "backbone","core/js/context/ApplicationContext","core/js/windows/messageBox",
        "core/js/utils/ApplicationUtils"],
    function (BaseView, Backbone,ApplicationContext,MessageBox,ApplicationUtils) {
        var View = BaseView.extend({
            /**
             * 全量请求
             */
            $INIT: null,
            /**
             * 开启延迟加载模板功能，即在默认的时候动态加载与
             */
            lazyLoadTemplate:true,
            initParams:null,
            ajaxClient: null,
            oninitSuc:null,
            initialize: function (options, triggerEvent) {
                this._super(options, triggerEvent);
                //初始化ajaxClient
                this.ajaxClient = ApplicationContext.getAjaxClient();
                if(this.$INIT){

                    var request = this.ajaxClient.buildClientRequest(this.$INIT);
                    if(this.initParams){
                        request.addParams(this.initParams);

                    }
                    var that = this;
                    //同步请求
                    request.post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if(obj){
                            that.trigger("initSuc",obj);
                        }

                    },false);
                }
                //this.template = require(ApplicationUtils.getTemplateByRoute());
            },
            showSucMsg:function(msg){
                var m = msg||"操作成功";
                MessageBox.success(m);
            }
        });
        return View;
    });