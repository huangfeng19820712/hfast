/**
 * 路径的工具类
 * @author:   * @date: 2018/1/2
 */
define(["core/js/Class",
    $route.getJs("currentExecutingScript"),
    "core/js/base/PathParser"
], function ( Class,CurrentExecutingScript,PathParser) {
    var PathUtils = Class.extend({
        /**
         * 获取当前
         * @1returns {String}
         */
        getCurrentExecutionScriptModuleName:function(){
            var currentExecutionScript = this.parseScriptPath(this.getCurrentExecutionScript());
            return currentExecutionScript.moduleName;
        },
        /**
         * 获取目录
         * @returns {String}
         */
        getCurrentExecutionScriptDirectory:function(){
            var currentExecutionScript = this.parseScriptPath(this.getCurrentExecutionScript());
            return currentExecutionScript.directory;
        },
        /**
         * 获取文件名
         * @returns {String}
         */
        getCurrentExecutionScriptFileName:function(){
            var currentExecutionScript = this.parseScriptPath(this.getCurrentExecutionScript());
            return currentExecutionScript.fileName;
        },

        /**
         * 解析当前运行的脚本信息
         * @returns {{moduleName: null, directory: null, fileName: null}}
         */
        parseCurrentExecutionScript:function(){
            return this.parseScriptPath(this.getCurrentExecutionScript());
        },
        /**
         * 获取脚本的路径
         * skipStackDepth   异常栈的深度，默认是3，就是获取当前调用者的文件路径
         * @returns {String}
         */
        getCurrentExecutionScript:function(skipStackDepth){
            CurrentExecutingScript.skipStackDepth = skipStackDepth|3;
            var scriptEl = CurrentExecutingScript();
            //var scriptEl2 = CurrentExecutingScript.near();
            var data = $(scriptEl).data();
            var requiremodule = data.requiremodule;
            return requiremodule;
        },
        /**
         * 解析js的路径
         * @param path
         * @returns {{moduleName: null, directory: null, fileName: null}}
         */
        parseScriptPath:function(path){
            var pathParser = new PathParser(path);
            return {
                moduleName:pathParser.moduleName,
                directory:pathParser.directory,
                fileName:pathParser.fileName
            };
        }
    });
    PathUtils.getInstance = function () {
        return new PathUtils();
    }

    return PathUtils.getInstance();
});
