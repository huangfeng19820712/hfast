/**
 * 集成Backbone的Model
 * @author:   * @date: 2016/4/5
 */
define(["underscore",
    "core/js/rpc/Action",
    "backbone","core/js/windows/messageBox"
], function (_, Action,Backbone,MessageBox) {
    /**
     * @class
     * @extends {Backbone.Model}
     */
    var BaseModel = Backbone.Model.extend({
        /**
         *ajax的发送器,{AjaxClient}
         */
        ajaxClient: null,
        /**
         *是否可以同步服务器的信息，默认是需要同步的,{Boolean}
         */
        syncable: true,
        /**
         * 是否异步请求服务器，默认是异步
         */
        async: true,
        /**
         * 命名空间
         */
        nameSpace:null,
        /**
         * 方法名
         */
        methodName:null,

        METHODNAME_GET:"get",
        METHODNAME_DELETE:"delete",

        getModel:function(id,async){
            var asyncValue = true;
            if(async!=null&&async==false){
                asyncValue = false;
            }
            var action = new Action({
                nameSpace:this.nameSpace,
                methodName:this.METHODNAME_GET
            });

            this.ajax(action.getUrl(),{id:id},async);
        },
        /**
         *
         * @param id
         * @param async
         * @param successCalback
         */
        delete:function(id,async,successCalback){
            var asyncValue = true;
            if(async!=null&&async==false){
                asyncValue = false;
            }
            var action = new Action({
                nameSpace:this.nameSpace,
                methodName:this.METHODNAME_DELETE
            });
            this.ajax(action.getUrl(),{id:id},null,async,function(compositeResponse,options){
                var msg = compositeResponse.getMessage();
                var obj = compositeResponse.getSuccessResponse();
                if (compositeResponse.isSuccessful()) {
                    MessageBox.success(compositeResponse.getSuccessMsg());
                    that.trigger("fetchSuccess");
                    that.trigger('sync', that, obj.result, options);
                } else {
                    $.window.showMessage(msg, {
                        handle: function () {
                            that.trigger('sync', that, obj.result, options);
                        }
                    });
                }

            });
        },
        merge:function(){

        },
        /**
         * 初始化，把本身的属性添加到attributes
         */
        initialize:function(options){
            var keys = _.keys(options);
            for (var i = 0 ; i < keys.length;i++){
                var key = keys[i];
                this[key] = options[key];
            }
        },

        /**
         * 获取Action对象的url
         * @returns {*}
         */
        getActionUrl:function(){
            var actionUrl = null;
            if(this.nameSpace&&this.methodName){
                var action = new Action({
                    nameSpace:this.nameSpace,
                    methodName:this.methodName
                });
                actionUrl = action.getUrl();
            }
            return  actionUrl;
        },

        /**
         * 返回的内容转换成模型中的属性，return 是模型本身
         * @param {Model}  model    模型对象
         * @param {Object} result   返回的结果
         * @param {Object} options  请求的参数
         * @return {Model} 模型本身
         */
        responeToModel:function(model,result,options){
            return model.set(model.parse(result, options), options);
        },
        /**
         * 初始化attributes属性的对象
         * @param object    {Object}
         */
        initAttributes:function(object){
            var keys = _.keys(object);
            for (var i = 0 ; i < keys.length;i++){
                var key = keys[i];
                if(this.get(key)==undefined){
                    this.set(key,object[key]);
                }
            }
        },
        /**
         *  设置ajax的发送器
         * @param {AjaxClient} ajaxClient
         */
        setAjaxClient: function (ajaxClient) {
            //this.set("ajaxClient", ajaxClient);
            this.ajaxClient = ajaxClient;
        },
        /**
         *  获取ajax的发送器
         * @returns {AjaxClient}
         */
        getAjaxClient: function () {
            //return this.get("ajaxClient");
            return this.ajaxClient;
        },

        /**
         *  设置是否可以同步服务器的信息，默认是需要同步的
         * @param {Boolean} syncable
         */
        setSyncable: function (syncable) {
            //this.set("syncable", syncable);
            this.syncable = syncable;
        },
        /**
         *  获取是否可以同步服务器的信息，默认是需要同步的
         * @returns {Boolean}
         */
        getSyncable: function () {
            //return this.get("syncable");
            return this.syncable;
        },
        /**
         * 设置同步请求，还是异步请求
         * @returns {Boolean}
         */
        setAsync:function(async){
            //this.set("async", async);
            this.async = async;
        },
        /**
         *  获取是否同步请求，还是异步请求，默认是异步
         * @returns {Boolean}
         */
        getAsync: function () {
            //return this.get("async");
            return this.async;
        },
        /**
         * 设置fetchSuccess的回调方法
         * @param {function} func      函数
         * @param {Object} context   上下文
         * @param {Anything} additionalArguments    给函数传参的对象
         */
        setFetchSuccessFunction:function(func,context){
            var args = [];
            if(!_.isFunction(func)){
                return ;
            }
            if(arguments.length>2){
                args = args.slice.call(arguments,2);
                //args = arguments.slice(2);
            }
            //$.proxy.apply(func,context,args);
            this.on("fetchSuccess",function(){ return func.apply(context,args)});
        },
        /**
         * 设置fetchSuccess的回调方法,仅执行一次
         * @param {function} func      函数
         * @param {Object} context   上下文
         * @param {Anything} additionalArguments    给函数传参的对象
         */
        setFetchSuccessOnceFunction:function(func,context){
            var args = [];
            if(!_.isFunction(func)){
                return ;
            }
            if(arguments.length>2){
                args = args.slice.call(arguments,2);
                //args = arguments.slice(2);
            }
            //$.proxy.apply(func,context,args);
            this.once("fetchSuccess",function(){ return func.apply(context,args)});
        },
        /*fetch: function(options){
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function (resp) {
                if (!model.set(model.parse(resp, options), options)) return false;
                if (success) success(model, resp, options);
                model.trigger('sync', model, resp, options);
            };
            //wrapError(this, options);
            var ajaxClient = this.getAjaxClient();

            ajaxClient.buildClientRequest(this.url)
                .addParams(postParam)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj&&obj.result) {
                        that.rendForm(obj.result);
                    }
                });

            return this.sync('read', this, options);
        },*/

        sync : function (method, model, options) {
            var type = this.methodMap[method];

            // Default options, unless specified.
            _.defaults(options || (options = {}), {
                emulateHTTP: Backbone.emulateHTTP,
                emulateJSON: Backbone.emulateJSON
            });

            // Default JSON-request options.
            var params = {type: type, dataType: 'json'};

            // Ensure that we have a URL.
            if (!options.url) {
                params.url = this.getActionUrl()||_.result(model, 'url') || urlError();
            }

            // Ensure that we have the appropriate request data.
            if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
                params.contentType = 'application/json';
                params.data = JSON.stringify(options.attrs || model.toJSON(options));
            }

            // For older servers, emulate JSON by encoding the request into an HTML-form.
            if (options.emulateJSON) {
                params.contentType = 'application/x-www-form-urlencoded';
                params.data = params.data ? {model: params.data} : {};
            }

            // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
            // And an `X-HTTP-Method-Override` header.
            if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
                params.type = 'POST';
                if (options.emulateJSON) params.data._method = type;
                var beforeSend = options.beforeSend;
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('X-HTTP-Method-Override', type);
                    if (beforeSend) return beforeSend.apply(this, arguments);
                };
            }

            // Don't process data on a non-GET request.
            if (params.type !== 'GET' && !options.emulateJSON) {
                params.processData = false;
            }

            params = _.extend(params, options);
            var ajaxClient = this.getAjaxClient();
            var that = this;
            ajaxClient.buildClientRequest(params.url)
                .addParams(params.data)
                .post(function (compositeResponse) {
                    var obj = compositeResponse.getSuccessResponse();
                    if (obj&&obj.result) {
                        if (!that.responeToModel(model,obj.result,options)) return false;
                        that.trigger("fetchSuccess");
                        model.trigger('sync', model, obj.result, options);
                    }
                },this.getAsync());

            // If we're sending a `PATCH` request, and we're in an old Internet Explorer
            // that still has ActiveX enabled by default, override jQuery to use that
            // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
            /*if (params.type === 'PATCH' && window.ActiveXObject && !(window.external && window.external.msActiveXFilteringEnabled)) {
                params.xhr = function () {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                };
            }
            // Make the request, allowing the user to override any Ajax options.
            var xhr = options.xhr = Backbone.ajax(_.extend(params, options));*/
            model.trigger('request', model, ajaxClient, options);
            return ajaxClient;
        },
        /**
         * 发送ajax请求
         * @param url
         * @param params
         * @param options
         * @param async
         * @param callback {function(@param compositeResponse,@param options) }
         *
         * @returns {*|AjaxClient}
         */
        ajax:function(url,params,options,async,callback){
            var ajaxClient = this.getAjaxClient();
            var that = this;
            ajaxClient.buildClientRequest(url)
                .addParams(params)
                .post(function (compositeResponse) {
                    if(!callback){
                        var obj = compositeResponse.getSuccessResponse();
                        if (obj&&obj.result) {
                            if (!that.responeToModel(that,obj.result,options)) return false;
                            that.trigger("fetchSuccess");
                        }
                    }else{
                        callback(compositeResponse,options);
                    }
                    that.trigger('sync', that, obj.result, options);

                },async);
            that.trigger('request', that, ajaxClient, options);
            return that;
        },
        methodMap : {
            'create': 'POST',
            'update': 'PUT',
            'patch': 'PATCH',
            'delete': 'DELETE',
            'read': 'GET'
        }
    });
    return BaseModel;
})
