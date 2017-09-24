/**
 * @module JSON格式数据的本地存储[JsonStorage]
 * @description JSON格式数据的本地存储：基于浏览器的localstorage或者userdata进行存储的，由于该本地存储仅限于json格式的数据，不能是其它的格式的对象（如函数）
 * 注意性能：这里value值不能过大，因为每次需要转换成字符串，才能存储到浏览器的localstorage或者userdata
 *
 * @author:
 * @date: 2013-09-10 下午10:30
 */
define(["core/js/cache/LocalStorage", "store"], function (LocalStorage, store) {
    var JsonStorage = LocalStorage.extend({
        ctor: function () {
            this.removeExpiredData();   //只要一创建该对象，就先删除过期的缓存
        },
        set: function (key, value, seconds) {
            var v = value;
            if (value != null && seconds) {
                v = [];
                //Last-Modified:最后访问时间    Sliding-Expiration:一段时间间隔，表示缓存参数将在多长时间以后被删除，单位为秒
                v.push({"Last-Modified": new Date().getTime(), "Sliding-Expiration": seconds * 1000});        //最后访问时间
                v.push(value);
            }

            return store.set(key, v);
        },
        get: function (key) {
            var v = store.get(key);
            if (!v)
                return null;
            if (typeof v != 'object')
                return v;
            //If the first element is an object with "expires" property, it may be an expiring date(number at least 13 digits) of the current data.
            var expiresInfo = v[0];
            //不包含过期时间，就直接返回
            if (!this.hasExpiredTime(expiresInfo))
                return v;
            var isExpired = this.isExpired(expiresInfo);
            if (isExpired) {
                this.remove(key);  //如果已经过期了，那么就直接从缓存中删除
                return null;
            } else {
                var expires = typeof expiresInfo == "object" ? expiresInfo["Last-Modified"] : null;
                if (expires) {
                    v[0]["Last-Modified"] = new Date().getTime();  //更新最后访问时间
                    store.set(key, v);
                }

                v.shift();   //移除数组中的过期时间并返回该元素
            }

            return v[0];  //仅返回第一个元素
        },
        /**
         * 判断是否设置了过期时间
         * @param expires
         * @return {*}
         */
        hasExpiredTime: function (expires) {
            if (typeof expires != 'object')
                return false;
            var lastModified = expires["Last-Modified"];
            var slidingExpiration = expires["Sliding-Expiration"];

            return lastModified && slidingExpiration && /^\d{13,}$/.test(lastModified);
        },
        /**
         * 判断是否过期
         * @param expires
         * @return {boolean}
         */
        isExpired: function (expires) {
            if (typeof expires != 'object')
                return false;
            var lastModified = expires["Last-Modified"];
            var slidingExpiration = expires["Sliding-Expiration"];
            if (!(lastModified && slidingExpiration && /^\d{13,}$/.test(lastModified)))
                return false;

            var expiresTime = lastModified + slidingExpiration;
            var d = new Date().getTime();

            return expiresTime <= d;
        },
        remove: function (key) {
            store.remove(key);
        },
        clear: function () {
            store.clear();
        },
        getAll: function () {
            return store.getAll();
        },
        removeExpiredData: function () {
            //清除过期的数据
            var d = new Date().getTime();
            var localStorage = this.getAll();
            var v = null;
            for (var key in localStorage) {
                v = localStorage[key];
                if (v == null || typeof v != 'object')
                    continue;
                if (!this.isExpired(v[0]))
                    continue;
                this.remove(key);  //如果已经过期了，那么就直接从缓存中删除
            }
        }
    });

    return JsonStorage;
});