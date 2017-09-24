/**
 * 间隔一段时间执行一次方式，如轮询
 * @author:   * @date: 2015/9/28
 */
define(["underscore","core/js/Class"], function (_,Class) {

    var Interval = Class.extend({
        /**
         * callBacks的集合
         * callBack的属性：
         * id:
         * fun:
         * context:
         */
        callBacks:null,
        isRun:false,
        intervalId:null,
        /**
         * 间隔时间
         */
        intervalSecond:3*60,

        ctor: function (options) {

        },
        /**
         * 新增回调函数
         * callBack的属性：
         * id:
         * fun:
         * context:
         */
        addCallBack:function(options){
            if(!this.callBacks){
                this.callBacks ={};
            }
            this.callBacks[options.id]={
                fun:options.fun,
                context:options.context
            }
            this.run();

        },
        removeCallBack:function(prop){
            delete this.callBacks.prop;
            if( _.keys(callBacks)==0){
                this.destroy();
            }
        },
        run:function(){
            var that = this;
            //如果回调函数大于1则启动
            if(this.callBacks&& _.keys(this.callBacks).length>0){
                this.intervalId = setInterval(function () {
                    _.each(_.keys(that.callBacks),function(item,j){
                        var obj = that.callBacks[item];
                        if(obj){
                            obj.fun.apply(obj.context);
                        }
                    });
                }, this.intervalSecond  * 1000);
                this.isRun =true;
            }
        },

        /**
         * 组件销毁
         */
        destroy: function () {
            window.clearInterval(this.intervalId);
            this.isRun =false;
        }
    });

    return Interval;
});
