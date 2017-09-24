/**
 *
 * @author:
 * @date:
 */
var APP_NAME = "example";
var CONFIG = {
    /**
     * app的上下文
     */
    appName: APP_NAME,
    appCnName: APP_NAME,
    currentModuleName: APP_NAME,
    //depends: "message", //会去META-INF/web-resources/<depend>/conf.js加载平台客户端内部依赖的模块
/*    rop: {
//        serverUrl: "[可选]",
        appKey: "000001",                            //Rop服务所需的应用键，以确认客户端应用的身份
        appSecret: "SEPU!PWO@LVE&045#67$"          //Rop服务所需的应用密钥
    },*/
    entry: {
//        point: "",    //[可选]<默认为core_js/initialize，启动文件，即按照requireJS的规范指定data-main属性值，即requireJS的入口点>
        routerUrl: APP_NAME+"/route/ApplicationRouter",
        routerFilterUrl:APP_NAME+"/routerFilter",
        routerFilter: {
            //requireAuthentication: true,             //该应用是否需要进行权限验证
            escapedAuth: ['#login', "#download", "#register"],    //在该数组中指定不需要登录验证的URL
        }
    },
    ui: {
        login: {
//            type: "<default|custom，如果为custom，那么就需要指定customTemplate；否则就指定其它属性>",
//            customTemplate: "",      //[可选]<整个登录界面替换>
            appLogoImage: "core_style/images/login/logo.png",         //[可选]<带项目名的logo图片>
            links: [{
                text: "关于我们",             //<名称>
                url: ""               //<链接的URL，都以新窗口的方式打开>
            },{
                text: "帮助",             //<名称>
                url: ""               //<链接的URL，都以新窗口的方式打开>
            }],
            banner: [
                {
                    bgColor: "#2a95bb",
                    image1: "core_style/images/login/1-0.jpg",
                    image2: "core_style/images/login/1-1.png"
                },
                {
                    bgColor: "#E8E8E8",
                    image1: "core_style/images/login/2-0.jpg",
                    image2: "core_style/images/login/2-1.png"
                }
            ],                //[必填]幻灯片的多张图片，多个值用逗号分隔
            companyLogoImage: "", //[可选]<带公司名的logo图片>
            copyRight: "Copyright &copy;" //[可选]<版权的文字说明>
        },
        framework: {
            fullScreen: false,//[可选]<框架页是否全屏显示，默认为false>
            home: {
                type: "part",//[可选]<值可为default(默认框架首页)|part（首页指定区域自定义内容）|full（完全自定义首页）>
                url: "",//[可选]<如果type为full或part时，必须指定该值>
                width: ""//[可选]<针对type为part时有效，单位仅为像素>
            },
            layout: "default",    //[可选]<框架布局，例如default>
            layoutSkin: "default",       //[可选]<该框架布局下所使用的皮肤，例如default>
            logoImage: "core_style/images/framework/app-logo.png", //[必填]<如果logonImage中包含了应用名称，那么isDisplayAppName值为false；否则isDisplayAppName值为true>
            isDisplayAppName: true     // [必填，boolean]<当前系统的名称是否要以文字的形式单独显示在logo图片后面>
        },
        project: {
            cssFiles: "",   //[可选]应用额外包含进来的css文件名（全局性的），多个值用逗号分隔
            theme: "default",      //项目主题
            pageMode: "div",    //页面的渲染模式，值可为div|iframe，主要是针对于Tab页的，如果tab页指定的url是内部的，那么就采用div模式；如果tab页指定的url是集成的，那么就采用iframe模式
            spacing: 5              //应用中默认的间隔
        },
        addons: {
            application: "" //[可选]<整个应用级插件，需覆盖ApplicationAddon.js中的方法>
        },
        custom: {

        }
    }
};

CONFIG.cons={
    ROUT_MAIN:"main",
}