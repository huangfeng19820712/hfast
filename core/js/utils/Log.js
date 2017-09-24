/**
 * @module 日志工具类[Log]
 * @description 日志工具类
 *
 * @author
 * @version 1.0 @Date: 2013-05-29 上午10:42
 */
define(function () {
    var Log = {
        info: function (s) {
            if (typeof console != "undefined"){
                console.log(this.getCurrentDate() + '【信息】页面：' + location.href + "\n" + s);
            }
        },
        debug: function (s) {
            if (typeof console != "undefined"){
                console.log(this.getCurrentDate() + '【调试】页面：' + location.href + "\n" + s);
            }
        },
        error: function (s) {
            if (typeof console != "undefined"){
                console.log(this.getCurrentDate() + '【错误】页面：' + location.href + "\n" + s);
            }
        },
        warn: function (s) {
            if (typeof console != "undefined"){
                console.log(this.getCurrentDate() + '【警告】页面：' + location.href + "\n" + s);
            }
        },
        getCurrentDate: function(){
            var date = new Date();
            var result = [date.getFullYear(), "-", date.getMonth(), "-", date.getDate()];
                result.push(" ");
                result.push(date.getHours());
                result.push(":");
                result.push(date.getMinutes());
                result.push(":");
                result.push(date.getSeconds());
                result.push(",");
                result.push(date.getMilliseconds());
            return result.join("");
        }
    }

    return Log;
});