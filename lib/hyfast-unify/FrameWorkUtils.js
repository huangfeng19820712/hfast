/**
 * @author:   * @date: 2015/10/5
 */

define(["jquery",
    "underscore",
    "core/js/Class",
    "core/js/utils/Log",
    "core/js/context/ApplicationContext",
],  function($, _, Class, Log,ApplicationContext){
    var Obj = Class.extend({
        updateMoney:function(money){
            var application = ApplicationContext.getApplication();
            if(application){
                var header = application.getHeader();
                if(header){
                    header.updateMoney(money);
                }
            }
        }
    });

    Obj.getInstance = function() {
        var obj = new Obj();

        return obj;
    }

    return Obj.getInstance();
});