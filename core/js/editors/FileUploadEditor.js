/**
 * @author:   * @date: 2016/2/26
 * 插件地址
 * http://plugins.krajee.com/file-input/plugin-events#filesuccessremove
 */
define([
    "core/js/editors/Editor",
    "core/js/interval/Interval",
    "core/js/utils/ApplicationUtils",
    "bootstrap",
    "fileinput",
], function (Editor,Interval,ApplicationUtil) {
    var FileUploadEditor = Editor.extend({
        xtype: $Component.FILEUPLOADEDITOR,
        /**
         * 是否支持多个文件上传
         */
        isMultiple:true,
        uploadUrl:null,
        progressUrl:null,
        name:"file",
        /**
         * 是否需要精确进度条，需要轮询服务器
         */
        isExactProgress:false,
        /**
         * 插件的配置信息
         * @property {Object}
         */
        pluginConf:null,
        /**
         * 查看进度
         * @private
         */
        _progressInterval:null,
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.FILE);
                if(this.isMultiple){
                    this.$input.attr("multiple","true");
                }
            }
            this._super();
        },
        /**
         * 初始化组件
         * @private
         */
        mountContent: function () {
            this._super();
            var gridOptions = this.getGridOptions();
            //pluginConf的配置信息可以覆盖conf中的信息
            if(this.pluginConf){
                gridOptions = _.extend(gridOptions,this.pluginConf);
            }

            this.$input.fileinput(gridOptions);
            //this.registerEvent();

        },
        getGridOptions:function(){
            return {
                language:"zh",
                uploadUrl: this.uploadUrl,
            };
        },
        /**
         * 注册插件的事件
         */
        registerEvent:function(){
            this.$input.on('fileuploaded', $.proxy(this.fileuploaded,this));
            this.$input.on('filepreupload', $.proxy(this.filepreupload,this));
        },
        /**
         * 文件上传前触发的
         */
        filepreupload:function(event, file, previewId, index, reader){
            /*if(this.isExactProgress){
                this._progressInterval= new Interval();
                this._progressInterval.addCallBack({
                    id:$Component.FILEUPLOADEDITOR.name,
                    fun:options.fun,
                    context:this
                });
            }*/
        },
        fileuploaded:function(event, file, previewId, index, reader){
            //this.destroyInterval();
        },
        destroyInterval:function(){
            if(this.isExactProgress){
                this._progressInterval.destroy();
                this._progressInterval = null;
            }
        },
        /**
         * 从服务器获取进度信息
         */
        getPregrossInfo:function(){
            var ajaxClient = ApplicationUtil.getApplicationContext.getAjaxClient();
            var that = this;
            ajaxClient.buildClientRequest(this.progressUrl)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj) {
                        //Todo 解析
                        that.updatePregross(obj);
                    }
                });
        },
        /**
         *
         * @param obj
         */
        updatePregross:function(obj){

        },
        destroy: function () {
            this.plugin = null;
            this.destroyInterval();
            this._super();
        }
    });

    return FileUploadEditor;
})
