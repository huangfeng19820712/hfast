/**
 * @module 字典表缓存客户端[DictCacheClient]
 * @description 业务组件：字典表缓存客户端
 * 字典表的数据做为一个整体，整个是缓存在单实例缓存中，并且以"cache/data/dict"为键
 *
 * @author:
 * @date: 2013-09-11 上午10:21
 */
define(["underscore",
    "core/js/utils/Log",
    "core/js/cache/CacheClient",
    "core/js/cache/SharedInstanceStorage",
    "core/js/context/ApplicationContext"
], function (_, Log, CacheClient, SharedInstanceStorage, ApplicationContext) {
    var DictCacheClient = CacheClient.extend({
        name: "cache/data/dict",

        keyField: "code",

        codeField: "code",

        titleField: "title",

        /**
         * 远程访问的客户端
         */
        ajaxClient: null,

        /**
         * 本地缓存
         */
        localStorage: null,

        ctor: function (localStorage, ajaxClient) {
            this._super(this.name, localStorage, ajaxClient);
        },
        /**
         * 根据编码来获取数据项
         * @param dictCode
         * @param codes     {String}数据项编码，多个值用逗号分隔
         * @param callback  {function}针对异步获取该数据项时，该参数才有效
         * @return {*}
         */
        getItemsByCodes: function(dictCode, codes, callback){
            var isAsync = _.isFunction(callback);  //判断是否是异步请求

            if(dictCode == null || dictCode === "" || codes == null || codes === ""){
                //如果是异步请求，就执行回调函数
                if(isAsync){
                    callback(null);
                }
                return null;
            }

            var props = ["code:", codes].join("");
            return this.getDictItemsFromRemote(dictCode, props, null, null, 1, callback);
        },
        /**
         * 根据编码获取名称，多个值用逗号分隔
         * @param dictCode
         * @param codes
         * @param callback  {function}针对异步请求时，该参数才有效
         * @return {*}
         */
        getTitleByCodes: function (dictCode, codes, callback) {
            var items = this.getItemsByCodes(dictCode, codes, callback),
                isAsync = _.isFunction(callback),
                result = [];  //判断是否是异步请求
            //如果是异步请求，就不再做任何处理
            if(isAsync)
                return;
            if (items == null || items.length == 0)
                return null;
            var result = [],
                codeArray = codes.split(","),
                j, l, item, code;
            for (var i = 0, count = codeArray; i < count; i++) {
                code = codeArray[i];
                for (j = 0, l = items.length; j < l; j++) {
                    item = items[j];
                    if (code == item[this.codeField])
                        result.push(item[this.titleField]);
                }
            }
            return result.join(",");
        },
        /**
         * 根据字典表的dictCode来获取该字典表下的项目项信息
         * @param dictCode
         * @return {*}
         */
        getItems: function (dictCode) {
            var dictMap = this.getDict(dictCode);
            return dictMap ? dictMap["items"] : null;
        },
        /**
         * 根据字典表编码获取字典表信息
         * @param dictCode
         */
        getDict: function (dictCode) {
            var dictCodeArray = this.get(dictCode);
            if (dictCodeArray == null || dictCodeArray.length == 0)
                return null;

            return dictCodeArray[0];
        },
        /**
         * 根据字典表的dictCodes来获取该字典表的信息
         * @param dictCodes
         * @return {Array|null} [{code: "<字典表编码>", items: [{code: "<编码>", title: "<名称>", <扩展字段>: "<扩展字段值>"}]}]
         */
        get: function (dictCodes) {
            if (dictCodes == null || dictCodes === "")
                return null;
            var dictCodeArray = dictCodes.split(","),
                notExistedCodeArray = [],
                result = [],
                dict, dictCode;
//            //从客户端获取已经存在的字典表
//            for (var i = 0, count = dictCodeArray.length; i < count; i++) {
//                dictCode = dictCodeArray[i];
//                dict = this.getFromLocal(dictCode);   //从客户端获取数据
//                if (dict == null)
//                    notExistedCodeArray.push($.trim(dictCode));
//                else
//                    result.push(dict);
//            }
            notExistedCodeArray = dictCodeArray;  //字典表都不走缓存，统一从服务端获取，不然如果是通过插件写的字典表，可能会有问题
            //从服务端获取字典表
            if (notExistedCodeArray.length > 0) {
                var remoteArray = this.getFromRemote(notExistedCodeArray.join(","));
                remoteArray = this.parse(remoteArray);       //对服务端返回的数据进行解析，转换成指定格式的数据
                if (remoteArray != null && remoteArray.length > 0) {
                    for (var i = 0, count = remoteArray.length, dict; i < count; i++) {
                        dict = remoteArray[i];
                        this.add(dict);              //将数据缓存到客户端
                        result.push(dict);
                    }
                }
            }

            return result;
        },
        /**
         * 获取业务字典的数据
         * @param dictCode  [必填]业务字典代码
         * @param props      [可选]额外的过滤字段,格式为prop1:value1;prop2:value2.键为扩展字段的sys_dict表的extfield_conf定义的别名。pid1:01;pid2:20;pid3:23;
         * @param pitemCode  [可选]父字典数据项的代码，默认为下层的节点；
         * @param fields     [可选]返回的列，默认为所有，如果指定后则返回对象的列，列名用逗号分隔。field1,field2：
         * @param descendant [可选]是否包含子孙节点:0：不包括，即仅子层：默认，1：包含所有子孙节点
         * @param callback   [可选]异步请求时有效，回调函数
         * @return {*}
         */
        getDictItemsFromRemote: function(dictCode, props, pitemCode, fields, descendant, callback){
            var isAsync = _.isFunction(callback);  //判断是否是异步请求

            if(dictCode == null || dictCode === ""){
                //如果是异步请求，就执行回调函数
                if(isAsync){
                    callback(null);
                }
                return null;
            }

            var params = {
                    dictCode: dictCode,
                    fields: fields,
                    pitemCode: pitemCode,
                    descendant: descendant,
                    props: props
                },
                result;
            this.ajaxClient.post({
                methodName: "dict.item.list.get",
                methodVersion: "1.0",
                data: params,
                async: isAsync,                       //同步加载,
                complete: function (compositeResponse) {
                    if (!compositeResponse.isSuccessful()) {
                        Log.error(compositeResponse.getErrorResponse());
                    }else{
                        var queryResult = compositeResponse.getSuccessResponse();
                        result = queryResult ? queryResult["items"] : null;

                        //如果是异步请求，就执行回调函数
                        if(isAsync){
                            callback(result);
                        }
                    }
                }
            });

            return result;
        },
        /**
         * 直接从远程缓存获取
         * @param key
         */
        getFromRemote: function (key) {
            if (key == null || key === "")
                return null;

            var result = null;
            this.ajaxClient.post({
                methodName: "dict.list.get",
                methodVersion: "1.0",
                data: {dictCodes: key},
                async: false,                              //同步加载,
                complete: function (compositeResponse) {
                    if (!compositeResponse.isSuccessful()) {
                        Log.error(compositeResponse.getErrorResponse());
                        return;
                    }

                    result = compositeResponse.getSuccessResponse();
                }
            });

            return result;
        },
        /**
         * 对服务端返回的数据进行解析，解析成缓存中指定格式的数据
         * 报文格式:
         * @example
         * <code>
         *     {
         *          rows: [{
         *              code: "<字典表编码>",
         *              items: [{
         *                  code: "<字典表项编码>",
         *                  title: "<字典表项名称>",
         *                  <扩展字段名>: "<扩展字段值>"
         *              }, ...]
         *          }]
         *     }
         * </code>
         * @param data
         * @return {*}
         */
        parse: function (data) {
            if (data == null)
                return null;

            var dictDataInfo = data["rows"];
            if (dictDataInfo == null || dictDataInfo.length == 0)
                return null;

            return dictDataInfo;
        }
    });

    //返回字典表缓存客户端
    DictCacheClient.getInstance = function () {
        return new DictCacheClient(SharedInstanceStorage, ApplicationContext.getRopClient());
    }

    //返回字典表缓存对象
    return DictCacheClient;
});