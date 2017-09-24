/**
 * @author:   * @date: 2016/1/18
 */
define(["underscore", "core/js/Class"], function (_, Class) {
    var SscUtils = {
        /**
         * 合并大小与单双
         * @param value
         */
        getBigSmallSingleDouble:function(value){
            return this.getBigSmall(value)+this.getSingleDouble(value);
        },
        /**
         * 返回大小
         * @param value     整数
         */
        getBigSmall:function(value){
            if(value<5){
                return "小";

            }else{
                return "大";
            }
        },
        /**
         * 单双
         * @param value
         * @returns {*}
         */
        getSingleDouble:function(value){
            if (value % 2 == 0) {
                return  "双";
            } else {
                return "单";
            }
        },
        /**
         * 获取组三或者组六
         * 三个数总，有两个是一样的就是组三，否则就是组六
         */
        getGroupSixOrThree:function(value1,value2,value3){
            if(value1==value2||value1==value3||value2==value3){
                return "组三";
            }else{
                return "组六";
            }
        }
    }
    return SscUtils;
});