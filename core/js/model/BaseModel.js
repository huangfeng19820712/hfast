/**
 * 集成Backbone的Model
 * @author:   * @date: 2016/4/5
 */
define(["underscore",
    "backbone"
], function (_, Backbone) {
    /**
     * @class
     * @extends {Backbone.Model}
     */
    var BaseModel = Backbone.Model.extend({
        /**
         * 初始化，把本身的属性添加到attributes
         */
        initialize:function(options){
            this.initAttributes({
                /**
                 *ajax的发送器,{AjaxClient}
                 */
                ajaxClient: null,
                /**
                 *是否可以同步服务器的信息，默认是需要同步的,{Boolean}
                 */
                syncable: true,});
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
            this.set("ajaxClient", ajaxClient);
        },
        /**
         *  获取ajax的发送器
         * @returns {AjaxClient}
         */
        getAjaxClient: function () {
            return this.get("ajaxClient");
        },

        /**
         *  设置是否可以同步服务器的信息，默认是需要同步的
         * @param {Boolean} syncable
         */
        setSyncable: function (syncable) {
            this.set("syncable", syncable);
        },
        /**
         *  获取是否可以同步服务器的信息，默认是需要同步的
         * @returns {Boolean}
         */
        getSyncable: function () {
            return this.get("syncable");
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
                params.url = _.result(model, 'url') || urlError();
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
                        if (!model.set(model.parse(obj.result, options), options)) return false;
                        that.trigger("fetchSuccess");
                        model.trigger('sync', model, obj.result, options);
                    }
                });

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
