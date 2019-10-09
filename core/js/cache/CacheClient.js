/**
 * @module 本地缓存客户端[CacheClient]
 * @description 本地缓存客户端,本地缓存有数据时,自动从本地缓存获取,否则从远程缓存中获取,同时更新本地缓存的相应内容.
 *
 * @author:
 * @date: 2013-09-10 下午5:03
 */
define(["core/js/Component"], function (Component) {

    var CacheClient = Component.extend({

        /**
         * 主键列的字段名
         * @override
         */
        keyField: "id",

        /**
         * 远程访问的客户端
         */
        ajaxClient: null,

        /**
         * 本地缓存
         */
        localStorage: null,

        /**
         * 该缓存客户端对象的名称
         */
        name: null,

        /**
         * 缓存的数据
         */
        data: null,

        ctor: function (name, localStorage, ajaxClient) {
            this.setLocalStorage(localStorage);
            this.setAjaxClient(ajaxClient);

            this.name = name;
            var storage = this.getLocalStorage().get(this.name);    //根据名称获取本地存储的数据，这些数据是以一个整体存储到本地中
            this.data = storage || {};          //将数据转换成json格式
        },
        /**
         * 根据给定的数据来创建一条记录存储到本地缓存中
         * @param model
         * @return {*}
         */
        add: function (model) {
            if (model == null)
                return model;

            if (!model[this.keyField])
                model[this.keyField] = this.generateId();
            this.data[model[this.keyField]] = model;

            this.save();

            return model;
        },
        /**
         * 根据给定的数据来更新本地缓存
         * @param model
         * @return {*}
         */
        update: function (model) {
            if (model == null)
                return model;
            var id = model[this.keyField];
            if (id == null || id === "")
                return null;

            this.data[id] = model;
            this.save();
            return model;
        },
        /**
         * 先从本地缓存获取,本地缓存不存在,再从远程缓存获取
         *
         * @param id
         */
        get: function (id) {
            var result = this.getFromLocal(id);
            if (result == null) {
                result = this.getFromRemote(id);   //获取服务端的数据
                result = this.parse(result);       //对服务端返回的数据进行解析，转换成指定格式的数据
                if (result != null) {
                    result[this.keyField] = id;
                    this.add(result);              //将数据缓存到客户端
                }
            }

            return result;
        },
        /**
         * 直接从远程缓存获取
         * @param key
         */
        getFromRemote: function (key) {

        },
        /**
         * 对服务端返回的数据进行解析，解析成缓存中指定格式的数据
         * @param data
         * @return {*}
         */
        parse: function (data) {
            return data;
        },
        /**
         * 从本地缓存获取
         * @param id 键值
         */
        getFromLocal: function (id) {
            if (id == null || id === "")
                return null;

            return this.data[id];
        },
        /**
         * 获取该缓存中所有的数据
         * @return {*}
         */
        getAll: function () {
            var result = [];
            var obj = this.data;
            for (var id in obj)
                result.push(obj[id]);
            return result;
        },
        /**
         * 根据ID来删除本地存储的数据
         * @param id
         * @return {*}
         */
        remove: function (id) {
            if (id == null || id === "")
                return;

            delete this.data[id];
            this.save();
        },
        /**
         * 清空该缓存客户端的所有数据
         */
        clear: function () {
            this.getLocalStorage().set(this.name);
            this.data = {};
        },
        /**
         * 保存该缓存客户端的数据到本地缓存中
         */
        save: function () {
            this.getLocalStorage().set(this.name, this.data);
        },
        setAjaxClient: function (ajaxClient) {
            this.ajaxClient = ajaxClient;
        },
        getAjaxClient: function () {
            return this.ajaxClient;
        },
        setLocalStorage: function (localStorage) {
            this.localStorage = localStorage;
        },
        getLocalStorage: function () {
            return this.localStorage;
        },
        /**
         * 创建主键
         *
         * @return {*}
         */
        generateId: function () {
            return guid();
        }
    });

    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };

    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    return CacheClient;
});
