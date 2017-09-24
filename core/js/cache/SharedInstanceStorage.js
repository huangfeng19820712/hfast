/**
 * @module 系统中共享实例的本地存储[SharedInstanceStorage]
 * @description 系统中共享实例（单例）本地存储，为了保证这些实例在整个系统中的唯一性。
 * 存储的地方是框架页（@link framework.js）中的$global变量，保证全局的唯一性。
 * 该实例也是全局唯一的
 * //注意：存储在该共享实例中的对象，都需要在启动的时候就加载，否则如果在嵌套的iframe中先加载该对象，那么在IE下就会出现“不能执行已释放Script的代码”的错误，因为该对象将随iframe窗口销毁，也一起销毁 add by 2014.06.21
 *
 * @author:
 * @date: 2013-09-10 下午10:52
 */
define(["core/js/cache/LocalStorage"], function (LocalStorage) {
    var SharedInstanceStorage = LocalStorage.extend({
        sharedStorage: null,   //获取本地存储区域

        ctor: function (sharedStorage) {
            this.sharedStorage = sharedStorage;
        },
        set: function (key, value) {
            if (value == null)
                this.remove(key);

            this.sharedStorage[key] = value;
        },
        get: function (key) {
            return this.sharedStorage[key];
        },
        remove: function (key) {
            delete this.sharedStorage[key];
        },
        clear: function () {
            this.sharedStorage = {};
        },
        getAll: function () {
            var result = [];
            var obj = this.sharedStorage;
            for (var key in obj)
                result.push(obj[key]);
            return result;
        }
    });

    //获取本地共享实例的存储区域
    SharedInstanceStorage._getStorage = function () {
        var result;
        try {
            result = eval("$global.sharedInstance");    //获取应用全局的共享实例对象
        } catch (e) {
            alert("请引入底层框架页，否则有些客户端方法将无法运行！");
        }

        return result;
    }

    SharedInstanceStorage.getInstance = function () {
        var sharedStorage = SharedInstanceStorage._getStorage();
        var result = sharedStorage["sharedInstanceStorage"];
        if (result == null) {
            result = new SharedInstanceStorage(sharedStorage);
            sharedStorage["sharedInstanceStorage"] = result;
        }

        return result;
    }

    return SharedInstanceStorage.getInstance();
});