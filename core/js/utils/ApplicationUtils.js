/**
 * @author:   * @date: 2015/9/12
 */

define([ "core/js/context/ApplicationContext"],
    function (ApplicationContext) {
        var ApplicationUtil = {
            /**
             * 临时存储当前请求要显示的区域：最终内容要显示在界面上，都会跟区域有关，URL的重定向应该是针对区域而言的
             */
            _urlRelatedRegion: null,

            /**
             * 整个应用的路由器
             */
            _applicationRouter: null,

            /**
             * 主要的区域对象
             */
            _mainRegion:null,

            /**
             * 循环依赖的时候，ApplicationContext会为null
             * @returns {*}
             */
            getApplicationContext: function () {
                if (!ApplicationContext)
                    ApplicationContext = require("core/js/context/ApplicationContext");
                return ApplicationContext;
            },
            /**
             * 设置该URL链接相关的显示区域
             * @param urlRelatedRegion    该URL链接相关的显示区域
             */
            setUrlRelatedRegion: function (urlRelatedRegion) {
                this._urlRelatedRegion = urlRelatedRegion;
            },
            getUrlRelatedRegion: function () {
                return this._urlRelatedRegion;
            },
            clearUrlRelatedRegion: function () {
                this._urlRelatedRegion = null;
            },
            /**
             * 根据requireJS中的相对路径，获取真实的路径
             *
             * @param requireRelativePath
             * @return {*}
             */
            getRealPath: function (requireRelativePath) {
                return require.toUrl(requireRelativePath);
            },
            /**
             * 加载某个页面的URL，该URL地址不会体现在浏览器上
             * @param url
             */
            loadUrl: function (url) {
                //如果是以#开头的话，说明是系统内的URL，那么就需要先将#去掉，然后再重定向
                if (url != null && url.indexOf("#") == 0) {
                    var applicationRouter = this.getApplicationContext().getApplicationRouter();
                    applicationRouter.loadUrl(url);
                } else {
                    //在iframe页面中显示
                    var urlRelatedRegion = this.getUrlRelatedRegion();
                    this.getMainRegion(urlRelatedRegion).show("core/js/base/IframeView", {url: url});
                }
                this.clearUrlRelatedRegion();  //清除URL关联的区域
            },
            /**
             * 重定向到某个页面，浏览器的URL地址会发生改变
             * @param url
             */
            redirect: function (url, isReplaceHistory) {
                //如果是以#开头的话，说明是系统内的URL，那么就需要先将#去掉，然后再重定向
                if (url != null && url.indexOf("#") == 0) {
                    url = url.substr(1);
                    var currentUrl = Backbone.history.fragment;

                    /**
                     * 原因：BackboneJS对页面的URL进行监听，如果没有改变URL的hash值，backbone就不会触发任何事件
                     * 解决办法：首先找到要触发路由的操作，在执行操作之前，先强制将路由指向一个不存在的路由地址，这样就能触发了
                     */
                    if (url == currentUrl) {
                        Backbone.history.navigate(url + (new Date).getTime());
                    }

                    Backbone.history.navigate(url, {trigger: true});
                } else {
                    //在iframe页面中显示
                    var urlRelatedRegion = this.getUrlRelatedRegion();
                    this.getMainRegion(urlRelatedRegion).show("core/js/base/IframeView", {url: url});
                }
                this.clearUrlRelatedRegion();
            },
            /**
             * 根据上下文环境，获取主工作区
             * @param regionName    区域的名称
             * @return {*}
             */
            getMainRegion: function (regionName) {
                /*if(!mainRegion && $.window){
                 mainRegion = $.window.getMainRegion();
                 }*/
                if(regionName){
                    //先获取组件，并判断是否是操作系统组件
                    var component = this.getComponentById(regionName);
                    var region = null;
                    //如果有组件，则组件必须是操作系统组件
                    if(component&&component.getMainRegion){
                        region = component.getMainRegion();
                    }else{
                        //regionName,可以
                        var el = "#"+regionName;
                        region = $(el).data("control");
                        if(!region){
                            region = ApplicationContext.buildRegion(el);
                        }
                    }
                    return region;
                }else{
                    //先区域有没有设置主区域对象
                    if(this._mainRegion){
                        return this._mainRegion;

                    }else{
                        //没有区域名称，则去应用上下文的主区域
                        return this.getApplicationContext().getMainRegion();
                    }
                }
            },
            /**
             * 设置主区域对象
             * @param mainRegion
             */
            setMainRegion:function(mainRegion){
                this.getApplicationContext().setMainRegion(mainRegion);
            },

            /**
             * 根据上下文环境，获取整个应用工作区
             * @param applicationRegion
             * @return {*}
             */
            getApplicationRegion: function (regionName) {
                if(regionName){
                    //Todo 根据名称获取区域信息
                }else{
                    //没有区域名称，则去应用上下文的主区域
                    return this.getApplicationContext().getApplicationRegion();
                }
            },
            /**
             * 根据id，获取组建
             * @param id
             * @returns {*}
             */
            getComponentById:function(id){
                var componentManager = this.getApplicationContext().getComponentManager();
                if(componentManager){
                    return componentManager.getComponentById(id);
                }
                return null;
            },
            getComponentByXtype:function(xtype){
                return this.getApplicationContext().getComponentManager().getComponentByXtype(xtype);
            },
            addComponent:function(id,component){
                var componentManager = this.getApplicationContext().getComponentManager();
                if(componentManager){
                    componentManager.addComponent(id,component);
                }
            },
            removeComponent:function(id){
                var componentManager = this.getApplicationContext().getComponentManager();
                if(componentManager){
                    componentManager.removeComponent(id);
                }
            },
            /**
             * 获取所有的组件信息
             * @returns {*}
             */
            getAllComponent:function(){
                var componentManager = this.getApplicationContext().getComponentManager();
                if(componentManager){
                    return componentManager.getComponents();
                }
            },
            /**
             * 获取子组件
             * @param component
             * @param xtype
             * @returns {Array}
             */
            getChildrenComponent:function(component,xtype){
                var childrenComponent = this.getApplicationContext().getComponentManager().getChildrenComponent(component, xtype);
                return childrenComponent;
            },
            /**
             * 页面跳转
             */
            nav: function (path) {
                Backbone.history.navigate(path, {trigger: true});
            },
            /**
             * 根据当前路由情况获取对应的模板
             * @returns {string} 格式如："text!web/tmpl/login.html"
             */
            getTemplateByRoute:function(){

                return "text!"+
                    $global.BaseFramework.getCurrentParentPath().substring(1)+
                    "/tmpl/"+this.getApplicationContext().getCurrentRoute()+".html";
            },
            /**
             * 由于Container是close销毁，而Control是用destory销毁
             * 统一调用此方法来销毁组件
             * @Deprecated
             */
            destroyCom:function(component){
                if(component.close){
                    component.close();
                }
                if(component.destroy){
                    component.destroy
                }
            },
            /**
             * 销毁requirejs中的css模块，css!XXX.css
             * @param url
             */
            undefCss:function(url){
                var id,linkUrl;
                if(url){
                    id = url.replace(".css","");
                    linkUrl = url.replace("css!", "");
                    if($global.appConf.requireUrlArgs!=null){
                        linkUrl+="?"+$global.appConf.requireUrlArgs;
                    }
                }
                requirejs.undef(id);
                //销毁style标签
                this.destroyLink(linkUrl);
            },
            /**
             * 销毁requirejs中的css模块
             * @param array 样式路径的集合
             */
            undefCsses:function(array){
                for(var i = 0;i<array.length;i++){
                    this.undefCss(array[i]);
                }
            },
            /**
             * 销毁Link，css样式
             * @param url   {String}
             */
            destroyLink:function(url){
                $("link[href='"+url+"']").remove();
            },
            /**
             * 销毁link集合
             * @param links  {Array}
             */
            destroyLinks:function(links){
                var that = this;
                _.each(links,function(item,idx,list){
                    that.destroyLink(item);
                });
            }
        };

        return ApplicationUtil;
    });