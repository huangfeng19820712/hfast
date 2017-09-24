/**
 * 工具类
 * @author:   * @date: 2015/10/2
 */

define(["underscore", "core/js/Class"], function (_, Class) {
    /**
     * 判断字符串是否为空“” ，如果是活着是undefine、null、“”，都返回true，
     * 否则返回true
     */
    $.isBank = function (str) {
        if (_.isUndefined(str) || _.isNull(str) || str == "") {
            return true;
        } else {
            return false;
        }

    };
    $.isNotBank = function (str) {
        return !this.isBank(str);
    };

    /**
     * 返回路由简单对象
     * @returns {{route: *, param: *}}
     */
    $.getRouteObject = function () {
        var route, param;
        if (arguments.length > 0) {
            route = arguments[0];
        }
        if (arguments.length > 1) {
            if (_.isArray(arguments[1])) {
                if (arguments[1].length > 0) {
                    param = arguments[1][0];
                }
            } else {
                //如果是对象，则此参数为paramObject
                param = arguments[1];

            }
        }
        return {"route": route, "param": param};
    };
    /**
     * 获取客户端#后面的信息，不包含参数
     */
    $.getClientHash = function () {
        var hash = location.hash;
        if (this.isNotBank(hash)) {
            return hash.substr(1);
        }
        return null;
    }
    /**
     * 把对象设置集合的某个属性中
     * 如：form的fields属性  ,
     * @destObj 源对象
     * @targetArray 目标数据
     * @proName     查找的属性的名称
     * @proValue    设置值得属性的名称
     */
    $.object2Array = function (destObj, targetArray, proName, proValue) {
        for (var name in destObj) {
            var seach = {};
            seach[proName] = name;
            var where = _.find(targetArray, seach);
            if (_.isArray(where)) {
                _.each(where, function (item, i) {
                    item[proValue] = destObj[name];
                });
            } else if (_.isObject(where)) {
                where[proValue] = destObj[name];

            }

        }
    }
    /**
     * 根据属性创建对象
     * @param arrs      属性数组
     * @param value
     */
    $.createObject = function (props, value) {
        var obj = {};
        for (var item in props) {
            obj[props[item]] = value;
        }
        return obj;
    }
    /**
     *创建全局唯一的id
     * @param preStr
     */
    $.createId = function (preStr) {
        if(preStr==undefined){
            return _.uniqueId("_");
        }
        return _.uniqueId(preStr + "_");
    }
    /**
     * Utility function to create a psuedo GUID(32位)
     ```
     var id= $.uuid();
     ```
     * @title $.uuid
     */
    $.uuid = function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
    };

    /**
     * 转义参数中的特殊字符，需转义特殊字符有[:;,~\]
     * @param value
     * @returns {*}
     */
    $.transSpecialChar = function (value) {
        //如果非字符串，就直接返回，不处理 add by 2014.08.05
        if (!_.isString(value))
            return value;

        return value == null ? value : value.replace(/(:|;|~|\\|,)/g, "\\$1");
    };

    /**
     * 获取当前输入框光标的位置
     * @param element
     * @return {*}
     */
    $.getCursorPosition = function (element) {
        var caret,
            selection = element.ownerDocument.selection;

        //IE
        if (selection) {
            caret = Math.abs(selection.createRange().moveStart("character", -element.value.length));
        } else {
            // Firefox / Webkit 系 / Opera

            try{
                caret = element.selectionStart;
            }catch(e){
                console.info(e.message);
            }
        }

        return caret;
    }

    /**
     * 设置当前输入框光标的位置
     * @param element
     * @param pos
     */
    $.setCursorPosition = function (element, pos) {
        if (element.setSelectionRange) {
            try{
                element.setSelectionRange(pos, pos);
            }catch(e){
                console.info(e.message);
            }
        } else if (element.createTextRange) {
            var range = element.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    /**
     * 加法
     * @param arg1
     * @param arg2
     * @returns {number}
     * @constructor
     */
    $.FloatAdd = function(arg1,arg2){
        var r1,r2,m;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        return (arg1*m+arg2*m)/m;
    }

    /**
     * 减法
     * @param arg1
     * @param arg2
     * @returns {string}
     * @constructor
     */
    $.FloatSub = function(arg1,arg2){
        var r1,r2,m,n;
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
        m=Math.pow(10,Math.max(r1,r2));
        //动态控制精度长度
        n=(r1>=r2)?r1:r2;
        return ((arg1*m-arg2*m)/m).toFixed(n);
    }

    /**
     * 乘法
     * @param arg1
     * @param arg2
     * @returns {number}
     * @constructor
     */
    $.FloatMul = function(arg1,arg2)   {
        var m=0,s1=arg1.toString(),s2=arg2.toString();
        try{m+=s1.split(".")[1].length}catch(e){}
        try{m+=s2.split(".")[1].length}catch(e){}
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    }


    /**
     * 除法
     * @param arg1
     * @param arg2
     * @returns {number}
     * @constructor
     */
    $.FloatDiv= function(arg1,arg2){
        var t1=0,t2=0,r1,r2;
        try{t1=arg1.toString().split(".")[1].length}catch(e){}
        try{t2=arg2.toString().split(".")[1].length}catch(e){}
        with(Math){
            r1=Number(arg1.toString().replace(".",""));

            r2=Number(arg2.toString().replace(".",""));
            return (r1/r2)*pow(10,t2-t1);
        }
    }

    /**
     * 返回min与max之间的随机数，（min，max）
     * @param min
     * @param max
     */
    $.randomOpenOpen = function(min,max){
        var minus  = max -min-2;
        return Math.round(Math.random()*minus+min+1);
    };
    /**
     * 返回min与max之间的随机数，[min，max）
     * @param min
     * @param max
     */
    $.randomCloseClose = function(min,max){
        var minus  = max -min;
        var random = Math.random();
        var mul = $.FloatMul(random,minus);
        var add = $.FloatAdd(mul,min);
        var result = Math.round(add);
        return result;
    };
    /**
     * 随机去数组的值
     * @param items
     * @returns {*}
     */
    $.randomArray = function(items){
        var randomCloseClose = $.randomCloseClose(0, items.length-1);
        var item = items[randomCloseClose];
        return  item
    }


    $.isDate = function (value) {
        return _.isDate(value);
    }

    if (!$.Date) {
        $.Date = {
            SECOND: "s",
            MINUTE: "m",
            HOUR: "H",
            DAY: "d",
            MONTH: "M",
            YEAR: "y"
        };
    }

    /**
     * 返回大于等于其数字参数的最小整数。
     * @param value
     * @param format
     * @return {Date}
     */
    $.Date.ceil = function (value, format) {
        return $.Date._parseDate(value, format, true);
    }

    /**
     * 返回小于等于其数值参数的最大整数
     * @param value
     * @param format
     * @return {Date}
     */
    $.Date.floor = function (value, format) {
        return $.Date._parseDate(value, format, false);
    }

    /**
     *
     * @param value
     * @param format
     * @return {Date}
     */
    $.Date.parseDate = function (value, format) {
        return $.Date.floor(value, format);
    }

    /**
     *
     * @param value
     * @param format
     * @param isFillMax   true|false，不足位是否通过最大值进行填充，默认是根据最小值进行填充
     * @return {Date}
     */
    $.Date._parseDate = function (value, format, isFillMax) {
        format = format || "yyyyMMddHHmmss";

        //如果传入的值是日期类型，那么按照指定格式的要求进行设置，其它值都设置成0，保证前后值得一致性 add by 2014.06.26
        if (_.isDate(value)) {
            value = $.Date.formatDate(value, format);
        }

        if (value == null || (_.isString(value) && $.trim(value) == ""))
            return null;

        value = value.replace(/\W+/g, ""); //无格式的字符串
        value = value + "00000000000000";  //这里为了避免值的长度不符合太短，因此用0补足，以便后面进行截取

        var yearFormat = $.trim(format.replace(/[^y]/g, "") || "");
        var monthFormat = $.trim(format.replace(/[^M]/g, "") || "");
        var dayFormat = $.trim(format.replace(/[^d]/g, "") || "");
        var hourFormat = $.trim(format.replace(/[^H]/g, "") || "");
        var minFormat = $.trim(format.replace(/[^m]/g, "") || "");
        var secondFormat = $.trim(format.replace(/[^s]/g, "") || "");

        var startPos = 0,
            year, month, day, hour, min, second;

        var yearLength = yearFormat.length;
        year = yearLength == 0 ? 0 : value.substr(startPos, yearLength);
        year = parseInt(year, 10);
        if (year > 0) {
            (year < 100) && (year += (year > 29) ? 1900 : 2000);
        }
        startPos += yearLength;

        var monthLength = monthFormat.length;
        month = monthLength == 0 ? 0 : value.substr(startPos, monthLength);
        month = parseInt(month, 10);
        if (month == 0) {
            month = isFillMax ? 11 : 0;
        }
        month = month - 1;
        startPos += monthLength;

        var dayLength = dayFormat.length;
        day = dayLength == 0 ? 0 : value.substr(startPos, dayLength);
        day = parseInt(day, 10);
        if (day == 0) {
            day = isFillMax ? $.Date.getDaysInMonth(year, month) : 1;
        }
        startPos += dayLength;

        var hourLength = hourFormat.length;
        hour = hourLength == 0 ? 0 : value.substr(startPos, hourLength);
        hour = parseInt(hour, 10);
        if (hour == 0) {
            hour = isFillMax ? 23 : 0;
        }
        startPos += hourLength;

        var minLength = minFormat.length;
        min = minLength == 0 ? 0 : value.substr(startPos, minLength);
        min = parseInt(min, 10);
        if (min == 0) {
            min = isFillMax ? 59 : 0;
        }
        startPos += minLength;

        var secondLength = secondFormat.length;
        second = secondLength == 0 ? 0 : value.substr(startPos, secondLength);
        second = parseInt(second, 10);
        if (second == 0) {
            second = isFillMax ? 59 : 0;
        }

        var milliseconds = isFillMax ? 999 : 0;   //毫秒数也设置成0

        return new Date(year, month, day, hour, min, second, milliseconds);
    }

    /**
     * 获取指定月份的最大天数
     * @param year
     * @param month
     * @return {Number}
     */
    $.Date.getDaysInMonth = function (year, month) {
        month = parseInt(month, 10) + 1;
        var temp = new Date(year + "/" + month + "/0");
        return temp.getDate();
    }

    /**
     * 根据给定的值及值得格式，获取对应的毫秒数
     * @param value
     * @param valueFormat
     * @return {*|Number}
     */
    $.Date.getMilliseconds = function (value, valueFormat) {
        var date = $.Date.parseDate(value, valueFormat);
        return date ? date.getTime() : null;
    }
    /**
     * 根据给定的值及值得格式，获取当前日期时间
     * @param valueFormat
     * @returns {*}
     */
    $.Date.getCurrDateTime = function (valueFormat) {
        return $.Date.formatDate(new Date(), valueFormat);
    }
    /**
     * 格式化毫秒数：将给定的毫秒数转换成指定的格式
     * @param milliseconds
     * @param format
     * @return {*}
     */
    $.Date.formatMilliseconds = function (milliseconds, format) {
        if (milliseconds == null || milliseconds == "")
            return "";
        var date = new Date();                // 创建 Date 对象。
        date.setTime(milliseconds);    // 设置毫秒数。
        return $.Date.formatDate(date, format);
    }
    /**
     * 格式化14位日期字符串
     * @param dateStr
     * @param format
     * @returns {*}
     */
    $.Date.formatDateTime = function (dateStr, format) {
        if (dateStr == null || dateStr == "")
            return "";
        var date = $.Date.parseDate(dateStr);                // 创建 Date 对象。
        return $.Date.formatDate(date, format);
    }

    /**
     * 格式化14位日期字符串：将给定的毫秒数或字付串转换成指定的格式,针对两日以内的时间显示友好的中文提示
     * @param dateStr
     */
    $.Date.formatDateTimeToFriendly = function (dateStr) {
        if (dateStr == null || dateStr == "")
            return "";
        var date = $.Date._parseDate(dateStr)
        var milliseconds = date.getTime();
        return $.Date.formatMillisecondsToFriendly(milliseconds);
    }
    /**
     * 格式化毫秒数或者14位日期字符串：将给定的毫秒数或字付串转换成指定的格式,针对两日以内的时间显示友好的中文提示
     * @param milliseconds
     * @return {*}
     */
    $.Date.formatMillisecondsToFriendly = function (milliseconds) {
        if (milliseconds == null || milliseconds == "")
            return "";
        var today = new Date();//今日0点0分0秒
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        var todayMilliseconds = today.getTime();
        var format = "yyyy-MM-dd";
        if (milliseconds >= todayMilliseconds) {//今天
            var nowMilliseconds = new Date().getTime(); //当前时间

            if (nowMilliseconds - milliseconds < 5 * 60 * 1000) {
                return "五分钟内";
            } else if (nowMilliseconds - milliseconds < 60 * 60 * 1000) {
                return "一小时内";
            }
            format = "HH:mm";
        } else {
            var yestodayMilliseconds = todayMilliseconds - 24 * 60 * 60 * 1000; //昨日0点0分0秒

            if (milliseconds >= yestodayMilliseconds) {
                return "昨日";
            } else {
                var currYearFirstDay = new Date();//今年1月1日0点0分0秒
                currYearFirstDay.setMonth(0);
                currYearFirstDay.setDate(1);
                currYearFirstDay.setHours(0);
                currYearFirstDay.setMinutes(0);
                currYearFirstDay.setSeconds(0);
                var currYearFirstDayMilliseconds = currYearFirstDay.getTime();

                if (milliseconds >= currYearFirstDayMilliseconds) {
                    format = "M月d日";
                }
            }
        }

        var date = new Date();                // 创建 Date 对象。
        date.setTime(milliseconds);    // 设置毫秒数。
        return $.Date.formatDate(date, format);
    }

    /**
     * 将给定格式的日期字符串转换成指定格式的日期字符串
     *
     * @param str 要格式化的日期
     * @param replaceFormat str相匹配的格式
     * @param withFormat 要转换成的新格式
     */
    $.Date.format = function (str, replaceFormat, withFormat) {

        if (replaceFormat == null || $.trim(replaceFormat) == "" || withFormat == null || $.trim(withFormat) == "") {
            alert("您未指定日期转换前或转换后的格式，无法进行转换！");
            return;
        }

        if (str == null || $.trim(str) == "")
            return "";

        str = str.replace(/\W+/g, ""); //无格式的字符串
        str = str + "00000000000000";  //这里为了避免值的长度不符合太短，因此用0补足，以便后面进行截取

        var result = withFormat;

        var replaceYear = $.trim(replaceFormat.replace(/[^y]/g, "") || "");
        var replaceMonth = $.trim(replaceFormat.replace(/[^M]/g, "") || "");
        var replaceDay = $.trim(replaceFormat.replace(/[^d]/g, "") || "");
        var replaceHour = $.trim(replaceFormat.replace(/[^H]/g, "") || "");
        var replaceMin = $.trim(replaceFormat.replace(/[^m]/g, "") || "");
        var replaceSecond = $.trim(replaceFormat.replace(/[^s]/g, "") || "");

        var withYear = $.trim(withFormat.replace(/[^y]/g, "") || "");
        var withMonth = $.trim(withFormat.replace(/[^M]/g, "") || "");
        var withDay = $.trim(withFormat.replace(/[^d]/g, "") || "");
        var withHour = $.trim(withFormat.replace(/[^H]/g, "") || "");
        var withMin = $.trim(withFormat.replace(/[^m]/g, "") || "");
        var withSecond = $.trim(withFormat.replace(/[^s]/g, "") || "");

        var startPos = 0;
        var zeroStr = "0000";
        var withValue = "";

        var yearLength = replaceYear.length;
        if (withYear != "") {
            withValue = yearLength == 0 ? zeroStr.substring(0, withYear.length) : str.substr(startPos, yearLength);
            result = result.replace(withYear, withValue);
        }
        startPos += yearLength;

        var monthLength = replaceMonth.length;
        if (withMonth != "") {
            withValue = monthLength == 0 ? zeroStr.substring(0, withMonth.length) : str.substr(startPos, monthLength);
            result = result.replace(withMonth, withValue);
        }
        startPos += monthLength;

        var dayLength = replaceDay.length;
        if (withDay != "") {
            withValue = dayLength == 0 ? zeroStr.substring(0, withDay.length) : str.substr(startPos, dayLength);
            result = result.replace(withDay, withValue);
        }
        startPos += dayLength;

        var hourLength = replaceHour.length;
        if (withHour != "") {
            withValue = hourLength == 0 ? zeroStr.substring(0, withHour.length) : str.substr(startPos, hourLength);
            result = result.replace(withHour, withValue);
        }
        startPos += hourLength;

        var minLength = replaceMin.length;
        if (withMin != "") {
            withValue = minLength == 0 ? zeroStr.substring(0, withMin.length) : str.substr(startPos, minLength);
            result = result.replace(withMin, withValue);
        }
        startPos += minLength;

        var secondLength = replaceSecond.length;
        if (withSecond != "") {
            withValue = secondLength == 0 ? zeroStr.substring(0, withSecond.length) : str.substr(startPos, secondLength);
            result = result.replace(withSecond, withValue);
        }

        return result;
    }

    /**
     * 将日期转换成指定格式的字符串
     *
     * @param date 要格式化的日期
     * @param format str要转换成的格式
     */
    $.Date.formatDate = function (date, format) {
        if (date == null)
            return "";

        var result = format ? format : "yyyy-MM-dd HH:mm:ss";
        var weekArray = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");

        var yy = date.getYear();
        var M = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours() % 12;
        var H = date.getHours();
        var m = date.getMinutes();
        var s = date.getSeconds();
        var DDD = date.getDay();

        var yyyy = date.getFullYear();
        var MM = $.Date.lpad(M, 2, "0");
        var dd = $.Date.lpad(d, 2, "0");
        var hh = $.Date.lpad(h, 2, "0");
        var HH = $.Date.lpad(H, 2, "0");
        var mm = $.Date.lpad(m, 2, "0");
        var ss = $.Date.lpad(s, 2, "0");
        result = result.replace("yyyy", yyyy).replace("MM", MM).replace("dd", dd);
        result = result.replace("HH", HH).replace("hh", hh).replace("mm", mm).replace("ss", ss);
        result = result.replace("yy", yy).replace("M", M).replace("d", d);
        result = result.replace("H", H).replace("h", h).replace("m", m).replace("s", s);
        result = result.replace("DDD", weekArray[DDD]);
        return result;
    }

    $.Date.lpad = function (str, length, padStr) {
        str = str + "";
        while (str.length < length) {
            str = padStr + str;
        }
        return str;
    }

    /**
     * 取得指定的日期
     * @param str 要转换的相对时间 字符串型
     * @param interval 要加减的日期
     * @param value    要加减的值
     * @return Date 类型的日期
     */
    $.Date.getDate = function (str, interval, value) {
        if (str == null || $.trim(str) == "")
            return null;

        str = $.trim(str);
        var length = str.length;
        var result = new Date();
        if (length >= 4)
            result.setFullYear(parseInt(str.substr(0, 4), 10));
        if (length >= 6)
            result.setMonth(parseInt(str.substr(4, 2), 10) - 1);
        if (length >= 8)
            result.setDate(parseInt(str.substr(6, 2), 10));
        if (length >= 10)
            result.setHours(parseInt(str.substr(8, 2), 10));
        if (length >= 12)
            result.setMinutes(parseInt(str.substr(10, 2), 10));
        if (length >= 14)
            result.setSeconds(parseInt(str.substr(12, 2), 10));

        result = $.Date.addDate(result, interval, value);

        return result;
    }

    /**
     * 取得指定的日期
     * @param dateObj   要转换的相对时间 Date类型
     * @param interval  要加减的日期
     * @param value
     * @return {*}
     */
    $.Date.addDate = function (dateObj, interval, value) {
        var result = null;
        if (dateObj == null)
            return result;

        value = parseInt(value, 10) || 0;
        result = dateObj;

        if (interval == $.Date.YEAR)
            result.setFullYear(result.getFullYear() + value);
        if (interval == $.Date.MONTH)
            result.setMonth(result.getMonth() + value);
        if (interval == $.Date.DAY)
            result.setDate(result.getDate() + value);
        if (interval == $.Date.HOUR)
            result.setHours(result.getHours() + value);
        if (interval == $.Date.MINUTE)
            result.setMinutes(result.getMinutes() + value);
        if (interval == $.Date.SECOND)
            result.setSeconds(result.getSeconds() + value);

        return result;
    }

    /**
     * 日期加减
     * @param str
     * @param interval
     * @param value
     * @return {String}
     */
    $.Date.add = function (str, interval, value) {

        if (str == null || $.trim(str) == "")
            return "";

        str = $.trim(str);
        var length = str.length;
        var dateObj = $.Date.getDate(str, interval, value);

        var result = "";
        if (length >= 4)
            result = dateObj.getFullYear();
        if (length >= 6) {
            var mo = dateObj.getMonth() + 1;
            if (mo < 10)
                result += "0";
            result += "" + mo;
        }
        if (length >= 8) {
            var d = dateObj.getDate();
            if (d < 10)
                result += "0";
            result += "" + d;
        }
        if (length >= 10) {
            var h = dateObj.getHours();
            if (h < 10)
                result += "0";
            result += "" + h;
        }
        if (length >= 12) {
            var mi = dateObj.getMinutes();
            if (mi < 10)
                result += "0";
            result += "" + mi;
        }
        if (length >= 14) {
            var s = dateObj.getSeconds();
            if (s < 10)
                result += "0";
            result += "" + s;
        }
        return result;
    }
    /**
     * 判断浏览器类型，ie版本针对10以下
     * @type {{version: *, safari: boolean, opera: boolean, msie: boolean, mozilla: boolean}}
     */
    var userAgent = window.navigator.userAgent.toLowerCase();
    $.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    }
})
;
