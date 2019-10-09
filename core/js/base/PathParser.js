/**
 * @module 路径解析器[PathParser]
 * @description 针对#后的路径进行解析
 *
 * @author
 */
define(["core/js/Class", "core/js/Event"], function (Class, MXEvent) {
    var PathParser = Class.extend({
        path:null,
        moduleName:null,
        directory:null,
        fileName:null,
        /**
         * 构造函数
         * @param path
         */
        ctor: function (path) {
            this.path = path;
            this.parse(this.path);
        },
        /**
         * 解析路径,例子：demo/view/button/button
         * 1.demo为模块名称
         * 2.demo/view/button/为目录
         * 3.button为文件名
         * @param path
         */
        parse:function(path){
            this.moduleName = this.parseModuleName(path);
            this.directory = this.parseDirectory(path);
            this.fileName = this.parseFileName(path);
        },
        /**
         * 返回模块的名称
         * @param path
         * @returns {*}
         */
        parseModuleName:function(path){
            var moduleName = null;
            var num = path.indexOf("/");
            var arr1 = path.split("/");
            if(num>1){
                moduleName = arr1[0];
            }else{
                moduleName = arr1[1];
            }
            return moduleName;
        },
        /**
         * 解析目录
         * @param path
         * @returns {string}
         */
        parseDirectory:function(path){
            var num = path.lastIndexOf("/");
            return path.substring(0,num);
        },
        /**
         * 解析文件名
         * @param path
         * @returns {string}
         */
        parseFileName:function(path){
            var num = path.lastIndexOf("/");
            return path.substring(num);
        },
        getModuleName:function(){
            return this.moduleName;
        },
        getDirectory:function(){
            return this.directory;
        },
        getFileName:function(){
            return this.fileName;
        }
    });
    return PathParser;
});