/**
 * @module 系统配置存取器[FrameworkConfAccessor]
 * @description 系统配置文件信息的存取器
 * 其中js/conf.js文件中的配置信息说明如下：
 * @example
 * <code>
 *     {
 *          appName: "[必填]<为该应用定义一个全局唯一的名称，例如:dbxt，同时也为上下文>",
 *          appCnName: "[必填]<当前系统名称>",
 *          currentModuleName: "[可选]<针对于平台模块中德配置有效，如果是项目，该值就为空>",
 *          depends: "[可选]<项目一般都依赖于framework，会去resources/META-INF/web-resources/<depend>/conf.js加载平台客户端内部依赖的模块>",
 *          rop: {
 *              serverUrl: "[可选]"
 *              appKey: "[必填]<Rop服务所需的应用键，以确认客户端应用的身份，例如000001>",
 *              appSecret: "[必填]<Rop服务所需的应用密钥,例如SEPU!PWO@LVE&045#67$>"
 *          },
 *          entry: {
 *              point: "[可选]<默认为core_js/initialize，启动文件，即按照requireJS的规范指定data-main属性值，即requireJS的入口点>",
 *              routerUrl: "[可选]<指定该应用统一的路由器入口所在的路径，例如：js/routes/ApplicationRouter>",
 *              routerFilter: {
 *                  requireAuthentication: [可选, boolean]<该应用是否需要进行权限验证，例如true|false>,
 *                  escapedAuth: [可选, Array]<在该数组中指定不需要登录验证的URL，例如['#login', "#download"]>
 *              }
 *          },
 *
 *          //界面的配置信息
 *          ui: {
 *              //登录页的配置信息
 *              login: {
 *                  type: "<default|custom，如果为custom，那么就需要指定customTemplate；否则就指定其它属性>",
 *                  customTemplate: "[可选]<整个登录界面替换>",
 *                  appLogoImage: "[可选]<带项目名的logo图片>",
 *                  links: [可选][{
 *                      text: "<名称>",
 *                      url: "<链接的URL，都以新窗口的方式打开>"
 *                  }]
 *                  banner: [{
 *                      bgColor: "",
 *                      image1: "",
 *                      image2: ""
 *                  }, ...],
 *                  companyLogoImage: "[可选]<带公司名的logo图片>",
 *                  copyRight: "[可选]<版权的文字说明>"
 *              },
 *              //框架页的配置信息
 *              framework: {
 *                  fullScreen: false|true [可选]<框架页是否全屏显示，默认为false>
 *                  layout: "[可选]<框架布局，例如default>",
 *                  layoutSkin: "[可选]<该框架布局下所使用的皮肤，例如default>",
 *                  home: {
 *                      type: "[可选]<值可为default(默认框架首页)|part（首页指定区域自定义内容）|full（完全自定义首页）>"
 *                      url: "[可选]<如果type为full或part时，必须指定该值>",
 *                      width: "[可选]<针对type为part时有效，单位仅为像素>"
 *                  },
 *                 logoImage: "[必填]<如果logonImage中包含了应用名称，那么isDisplayAppName值为false；否则isDisplayAppName值为true>",
 *                 isDisplayAppName: [必填，boolean]<当前系统的名称是否要以文字的形式单独显示在logo图片后面>
 *              },
 *              //工程的配置信息
 *              project: {
 *                  theme: "<项目主题，例如default>",
 *                  spacing: <应用中默认的间隔，例如5>,
 *                  cssFiles: "[可选]应用额外包含进来的css文件名（全局性的），多个值用逗号分隔，例如dbxt,print",
 *                  pageMode: "[可选]<页面的渲染模式，值可为div|iframe，主要是针对于Tab页的，如果tab页指定的url是内部的，那么就采用div模式；如果tab页指定的url是集成的，那么就采用iframe模式>"
 *              }
 *          },
 *          addons: {
 *              layout: "[可选,用来指定项目在框架页中的插件，例如js/addons/layout_conf.js]"
 *          },
 *          custom: {
 *          }
 *      }
 * </code>
 *
 * 其中<映射路径对应的实际路径classpath:/META-INF/web-resources/>/<depends>/conf.js文件中的配置信息说明如下：
 * ["foundation","qform","qformacl","dcresources","log","message"]
 * @author:
 * @date:
 */
define(["jquery", "underscore", "core/js/rpc/AjaxClient"], function ($, _, AjaxClient) {

    var FrameworkConfAccessor = {

        _dependOnPlatformModuleNames: null,

        /**
         * 获取conf.js中的配置信息
         * @returns {*}
         */
        getJSConfig: function(){
            return $global.BaseFramework.getJSConfig();
        },

        /*---------------------获取项目自定义相关的信息-------------------*/
        getCustomValue: function(propPath){
            propPath = propPath || "";
            var propName = "custom." + propPath;
            return this._getPropValue(propName);
        },

        /*---------------------获取插件相关的信息-------------------*/

        getFoundationAppAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("app");
        },
        getFoundationMenuAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("menu");
        },
        getFoundationDictAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("dict");
        },
        getFoundationSystemAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("system");
        },
        getFoundationBizMgrAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("bizmgr");
        },
        getFoundationRoleAuthAddonConf: function(){
            return this._loadFoundationAddonConfDependOnQFormAcl("roleAuth");
        },
        getFoundationLayoutAddonConf: function(){
            var result = [];
            var addonType = "layout";
            var layoutAddonConf;
            //加载消息中心的插件
            layoutAddonConf = this._loadFoundationAddonConfDependOnMessage(addonType);
            if(layoutAddonConf){
                result = _.union(result, layoutAddonConf);
            }

            //加载foundation的插件
            layoutAddonConf = this._loadFoundationAddonConfDependOnFoundation(addonType);
            if(layoutAddonConf){
                result = _.union(result, layoutAddonConf);
            }

            //todo:加载项目自身的插件，写在application插件中
            layoutAddonConf = this._loadFoundationAddonConfDependOnProject(addonType);
            if(layoutAddonConf){
                result = _.union(result, layoutAddonConf);
            }

            return result;
        },
        getAddonPath: function(addonType){
            addonType = addonType || "";
            var propName = "addons." + addonType;
            return this._getPropValue(propName);
        },

        /*---------------------依赖相关的信息-------------------*/
        /**
         * 获取该应用使用到平台提供路由器对应的模块名
         * @return {*}
         */
        getDependSubRouteDefinitionMapping: function(){
            var result = {};
            if(this.isDependOnFoundation()){
                result["foundation"] = "foundation_js/routes/FoundationRouter";  //业务基础模块
            }
            if(this.isDependOnQFormAcl()){
                result["qformacl"] = "qformacl_js/routes/QFormAclRouter";  //业务模型安全控制模块
            }
            if(this.isDependOnQForm()){
                result["qform"] = "qform_js/routes/QFormRouter";            //业务模型客户端解析引擎
            }
            if(this.isDependOnDCResource()){
                result["dcresources"] = "dcresources_js/routes/DcresourcesRouter";  //公共资源
            }
            if(this.isDependOnMessage()){
                result["message"] = "message_js/routes/MessageRouter";  //消息中心
            }

            return result;
        },
        isDependOnQFormAcl: function(){
            return this._isDependOnModule("qformacl");
        },
        isDependOnQForm: function(){
            return this._isDependOnModule("qform");
        },
        isDependOnMessage: function(){
            return this._isDependOnModule("message");
        },
        isDependOnDCResource: function(){
            return this._isDependOnModule("dcresources");
        },
        isDependOnFoundation: function(){
            return this._isDependOnModule("foundation");
        },

        /*---------------------其它信息-------------------*/
        /**
         * 获取应用的英文名
         * @return {*}
         */
        getAppName: function(){
            return this._getPropValue("appName") || "app";
        },
        /**
         * 获取应用的中文名
         * @return {*}
         */
        getAppCnName: function(){
            return this._getMergePropValue("appCnName");
        },
        /**
         * 获取依赖的模块名
         * @return {*}
         */
        getDepends: function(){
            return this._getPropValue("depends");
        },
        getEntryPoint: function(){
            return this._getPropValue("entry.point");
        },
        getApplicationRouterUrl: function(){
            //todo 当前先固定是Web的路由
            return this._getPropValue("entry.routerUrl") ;
        },
        getApplicationRouterFilterConf:function(){
            return this._getPropValue("entry.routerFilter");
        }
        ,
        getApplicationRouterFilterUrl: function(){
            return this._getPropValue("entry.routerFilterUrl");
        },

        /*---------------------获取ROP相关的信息-------------------*/
        getRopServerUrl: function(){
            return this._getPropValue("rop.serverUrl");
        },
        getRopAppKey: function(){
            return this._getPropValue("rop.appKey");
        },
        getRopAppSecret: function(){
            return this._getPropValue("rop.appSecret");
        },

        /*---------------------获取登录界面相关的信息-------------------*/

        getLoginCustomTemplate: function(){
            if(!this._isCustomLoginType())
                return null;
            return this._getMergePropValue("ui.login.customTemplate");
        },
        getLoginAppLogoImage: function(){
            var requireRelativePath = this._getMergePropValue("ui.login.appLogoImage");
            return this.getAbsolutePath(requireRelativePath);
        },
        getLoginLinks: function(){
            return this._getMergePropValue("ui.login.links");
        },
        getLoginBanner: function(){
            var bannerArray = this._getMergePropValue("ui.login.banner");
            if(!bannerArray)
                return bannerArray;

            var bannerImgObject, img1, img2;
            for(var i= 0, count= bannerArray.length; i<count; i++){
                bannerImgObject = bannerArray[i];
                img1 = bannerImgObject["image1"];
                img2 = bannerImgObject["image2"];
                bannerImgObject["image1"] = img1 ? this.getAbsolutePath(img1) : img1;
                bannerImgObject["image2"] = img2 ? this.getAbsolutePath(img2) : img2;
            }

            return bannerArray;
        },
        getLoginCompanyLogoImage: function(){
            var requireRelativePath = this._getMergePropValue("ui.login.companyLogoImage");
            return this.getAbsolutePath(requireRelativePath);
        },
        getLoginCopyRight: function(){
            return this._getMergePropValue("ui.login.copyRight");
        },
        getAbsolutePath: function(requireRelativePath){
            if(!requireRelativePath)
                return requireRelativePath;
            return require.toUrl(requireRelativePath);
        },
        /*---------------------获取框架页相关的信息-------------------*/
        getFrameworkFullScreen: function(){
            return this._getMergePropValue("ui.framework.fullScreen") || false;
        },
        getFrameworkLayout: function(){
            return this._getMergePropValue("ui.framework.layout") || "default";
        },
        getFrameworkLayoutSkin: function(){
            return this._getMergePropValue("ui.framework.layoutSkin") || "default";
        },
        getFrameworkLayoutLogoImage: function(){
            var requireRelativePath = this._getMergePropValue("ui.framework.logoImage");
            return this.getAbsolutePath(requireRelativePath);
        },
        getFrameworkLayoutLogoText: function(){
            var isDisplayAppName = this._getMergePropValue("ui.framework.isDisplayAppName");
            if(isDisplayAppName === null){
                isDisplayAppName = true;
            }
            if(isDisplayAppName)
                return this.getAppCnName();
        },
        getFrameworkHomeType: function(){
            return this._getMergePropValue("ui.framework.home.type") || "default";
        },
        getFrameworkHomeUrl: function(){
            var homeType = this.getFrameworkHomeType();
            if(homeType == "default")
                return null;
            return this._getMergePropValue("ui.framework.home.url");
        },
        getFrameworkHomeWidth: function(){
            var homeType = this.getFrameworkHomeType();
            if(homeType != "part")
                return 0;
            return this._getMergePropValue("ui.framework.home.width") || 280;
        },
        /*---------------------获取工程页面相关的信息-------------------*/
        getProjectTheme: function(){
            return this._getMergePropValue("ui.project.theme");
        },
        getProjectSpacing: function(){
            return this._getMergePropValue("ui.project.spacing");
        },
        getProjectCssFiles: function(){
            return this._getMergePropValue("ui.project.cssFiles");
        },
        isIFramePageMode: function(){
            return this._getMergePropValue("ui.project.pageMode") == "iframe";
        },

        /*---------------------内部私有方法-------------------*/


        _loadFoundationAddonConfDependOnQFormAcl: function(addonType){
            return this._loadAddonConfDependOnModule("qformacl", addonType);
        },
        _loadFoundationAddonConfDependOnMessage: function(addonType){
            return this._loadAddonConfDependOnModule("message", addonType);
        },
        _loadFoundationAddonConfDependOnFoundation: function(addonType){
            return this._loadAddonConfDependOnModule("foundation", addonType);
        },
        _loadFoundationAddonConfDependOnProject: function(addonType){
            return this._loadAddonConfDependOnModule("js", addonType);
        },
        _loadAddonConfDependOnModule: function(moduleName, addonType){
            var requireJSPath = this._getAddonConfPathDependOnModule(moduleName, addonType);
            if(!requireJSPath)
                return null;
            var jsConfPath = this._getJSConfPath(requireJSPath);
            return this._loadJSConf(jsConfPath);
        },
        _getAddonConfPathDependOnModule: function(moduleName, addonType){
            if(!addonType || !moduleName)
                return null;

            //如果项目级的插件，就根据配置来加载
            if(moduleName == "js"){
                var url = this._getPropValue("addons." + addonType);
                return url;
            }
            if(this._isDependOnModule(moduleName)){
                return moduleName + "_js/addons/" + addonType + "_conf.js";
            }
            return null;
        },
        _isDependOnModule: function(moduleName){
            var dependOnPlatformModuleNames = this._dependOnPlatformModuleNames;
            if(!dependOnPlatformModuleNames || !moduleName)
                return false;
            return _.indexOf(dependOnPlatformModuleNames, moduleName) > -1;
        },
        _loadDependOnPlatformModule: function(){
            var depends = this.getDepends();
            if(!depends)
                return;

            var dependArray = depends.split(","),
                moduleWebRoot = $global.BaseFramework.getMappingPath(),
                dependName, confPath, ajaxClient;
            for(var i= 0, count= dependArray.length; i<count; i++){
                //如果依赖多个模块，那么需要查找每个模块下的conf.js，正常情况下应该只有一个
                dependName = $.trim(dependArray[i]);
                if(!dependName)
                    continue;
                confPath = moduleWebRoot + dependName + "/conf.js";
                var dependOnModuleNames = this._loadJSConf(confPath);
                this._appendDependOnPlatformModuleNames(dependOnModuleNames);
            }
        },
        _loadJSConf: function(jsConfPath){
            var ajaxClient = new AjaxClient(jsConfPath);
            var result = null;
            ajaxClient.get({
                async: false,     //同步加载
                complete: function (compositeResponse) {
                    if (compositeResponse.isSuccessful()) {
                        result =  compositeResponse.getSuccessResponse();
                    }
                }
            });
            return result;
        },
        _getJSConfPath: function(requireJSPath){
            var rootContextPath = requireJSPath.substr(0, requireJSPath.indexOf("/"));
            rootContextPath = this.getAbsolutePath(rootContextPath);

            //目录
            requireJSPath = requireJSPath.substr(requireJSPath.indexOf("/"), requireJSPath.length-1);
            var result = rootContextPath + requireJSPath;
            return result;
        },
        _appendDependOnPlatformModuleNames: function(moduleNames){
            if(!moduleNames)
                return;
            var dependOnModuleNames = this._dependOnPlatformModuleNames || [];
            this._dependOnPlatformModuleNames = _.union(dependOnModuleNames, moduleNames);
        },
        _isCustomLoginType: function(){
            var loginType = this._getMergePropValue("ui.login.type");
            if(!loginType)
                return false;
            return loginType.toLowerCase() == "custom";
        },
        /**
         * 获取合并后的属性值，即如果数据库中有对其进行设置，就获取该值，否则就获取js配置中的值
         * add by 2015.02.04
         * @param propPath
         * @returns {*}
         * @private
         */
        _getMergePropValue: function(propPath){
            var eulerConfig = {};//$global.BaseFramework.getDBEulerConfig() || $global.BaseFramework.getJSConfig();
            return this._getPropValueByPropPath(eulerConfig, propPath);
        },
        /**
         * 获取euler-conf.js中的配置属性值
         * @param propPath
         * @returns {*}
         * @private
         */
        _getPropValue: function(propPath){
            return this._getPropValueByPropPath(this.getJSConfig(), propPath);
        },
        /**
         * 根据给定的属性路径来获取对应的值
         * @param objectConfig
         * @param propPath
         * @return {*}
         * @private
         */
        _getPropValueByPropPath: function(objectConfig, propPath){
            if(!propPath || !objectConfig)
                return null;
            var propNameArray = propPath.split(".");
            var propName = propNameArray[0];
            var propValue = objectConfig[propName];
            if(propNameArray.length > 1){
                propNameArray.shift();  //移除数组中的第一个元素
                return this._getPropValueByPropPath(propValue, propNameArray.join("."));
            }
            return propValue;
        }
    };

    FrameworkConfAccessor._loadDependOnPlatformModule();   //加载平台内部自身依赖的模块名

    return FrameworkConfAccessor;
});