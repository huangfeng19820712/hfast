/**
 * @author:
 * @date: 15-1-8
 */
function $globalRequireConfig(webRoot) {

    var result = {
//        "urlArgs": 'rand=' + (new Date()).getTime(), // for development，js文件不缓存，每次都重新加载
        "baseUrl": webRoot||"" + "/",
        //没有效果
        /*packages:[{
            name: "codemirror",
            location: $route.getModulePath("codemirror"),
            main: "lib/codemirror"
        }],*/
        "waitSeconds": 0,                                   //放弃加载脚本前的等待的秒数。 设置为 0 则禁用此功能。默认是 7 秒。
//    enforceDefine: true,
        "paths": {
            "jquery": $route.getJs("jquery"),
            "text": $route.getRqPluginJs("text"),
            "css": $route.getRqPluginJs("css"),
            "require": $route.getJs("require"),
            "kendoUI": $route.getJs("kendo"),
            "kendo":  $route.getJs("kendo","kendoCN"),
            "kendoCN-ext":$route.getJs("kendo","kendoCN-ext"),
            "underscore": $route.getJs("underscore"),
            "backbone": $route.getJs("backbone"),
            "backbone.super": $route.getJs("backbone","backbone-super"),  //实现this._super()的扩展
            "backbone.routefilter": $route.getJs("routefilter","backbone.routefilter"),//添加路由过滤器
            "backbone.queryparams": $route.getJs("backbone","backbone.queryparams"),  //实现对URL中?后面参数的支持
            "backbone.subroute": $route.getJs("backbone","backbone.subroute"),  //引入子路由

            //artDialog组件
            "dialog": "/lib/artDialog/6.0.2/src/dialog-plus",
            "URI":$route.getJs("URI"),
            "bootstrap":$route.getJs("bootstrap"),
            "modernizr":$route.getJs("modernizr"),
            "jquery.flot":$route.getJs("flot","jquery.flot"),
            "jquery.flot.resize":$route.getJs("flot","jquery.flot.resize"),
            "jquery.flot.time":$route.getJs("flot","jquery.flot.time"),
            "jquery.flot.pie":$route.getJs("flot","jquery.flot.pie"),
            "jquery.flot.tooltip":$route.getJs("flot","jquery.flot.tooltip"),

            "jquery.dataTables":$route.getJs("dataTables","jquery.dataTables"),
            "jquery.jqGrid.locale":$route.getJs("jqGrid","grid.locale-cn"),
            "jquery.jqGrid":$route.getJs("jqGrid","jquery.jqGrid"),
            "jquery.jqGrid.fluid":$route.getJs("jqGrid","jquery.jqGrid.fluid"),
            "jquery.mapael":$route.getJs("mapael","jquery.mapael"),
            "jquery.easypiechart":$route.getJs("easypiechart",'jquery.easypiechart'),
            "jquery.sparkline":$route.getJs("sparkline",'jquery.sparkline'),
            "jquery.migrate":$route.getJs("migrate","jquery-migrate"),
            "jquery.validate":$route.getJs("jquery.validate","jquery.validate"),
            "jquery.layout":$route.getJs("jquery.layout"),
            "jquery-ui":$route.getJs("jquery-ui"),
            "jquery.fileDownload":$route.getJs("jquery.fileDownload"),
            "fileinput":$route.getJs("fileinput","zh"),
            "ueditor": "/lib/ueditor/1.4.3/lang/zh-cn/zh-cn", //必须先加载语言包，否则ie下会报错,
            "spin":$route.getJs("spin"),
            "fancytree":$route.getJs("fancytree"),
            "waypoints":$route.getJs("counterup","waypoints"),
            "jquery.counterup":$route.getJs("counterup","jquery.counterup"),
            "jquery.cubeportfolio":$route.getJs("cubeportfolio","jquery.cubeportfolio"),
            "jquery.mCustomScrollbar":$route.getJs("mCustomScrollbar","jquery.mCustomScrollbar.concat"),
            "validate":$route.getJs("jquery.validate","messages_zh"),
            "smoothScroll":$route.getJs("smoothScroll"),
            "back-to-top":$route.getJs("back-to-top"),

            "usa_states":$route.getJs("mapael","usa_states"),


            "bootstrap.touchspin":$route.getJs("touchspin","jquery.bootstrap-touchspin"),
            'bootstrap-tour':$route.getJs("bootstrap-tour"),
            'bootstrap-dataTables':$route.getJs("bootstrap","jquery.dataTables.bootstrap"),
            "bootstrap-datepicker":$route.getJs("bootstrap","bootstrap-datepicker"),
            "bootstrap-datepicker.locale":$route.getLocale("bootstrap","bootstrap-datepicker"),
            "bootstrap-datetimepicker":$route.getJs("bootstrap","bootstrap-datetimepicker"),
            "bootstrap-datetimepicker.locale":$route.getLocale("bootstrap","bootstrap-datetimepicker"),
            "bootstrap-select":$route.getJs("bootstrap-select"),
            "ladda":$route.getJs("ladda"),

            "icheck":$route.getJs("icheck"),
            "fuelux.wizard":$route.getJs("fuelux","wizard"),
            "flowplayer":$route.getJs("flowplayer"),

            'king-common':$route.getKingadminJs("king-common"),
            'king-chart-stat':$route.getKingadminJs("king-chart-stat"),
            'king-table':$route.getKingadminJs("king-table"),
            'king-components':$route.getKingadminJs("king-components"),
            'style-switcher':$route.getJs("style-switcher")
        },
        "shim": {
            "jquery": {
                "exports": "$"
            },
            "underscore": {
                "exports": "_"
            },
            "kendoUI": {
                "deps": [
                    $route.getRqKendoCss("common"),
                    $route.getRqKendoCss("dataviz"),
                    $route.getRqKendoCss("bootstrap"),
                    $route.getRqKendoCss("dataviz.bootstrap")],

                "exports": "kendoUI"
            },
            "kendo": {
                "deps": ["kendoUI","kendoCN-ext"],
                "exports": "kendo"
            },
            bootstrap : {
                deps : [ 'jquery' ],
                exports : 'bootstrap'
            },
            "backbone": {
                "deps": [ "underscore", "jquery" ],
                "exports": "Backbone"  //attaches "Backbone" to the window object
            },
            "backbone.super": {
                "deps": [ "backbone" ]
            },
            "backbone.queryparams": {
                "deps": [ "backbone.super" ]
            },
            "backbone.routefilter": {
                "deps": [ "backbone.queryparams" ]
            },
            "backbone.subroute": {
                "deps": [ "backbone.routefilter" ],
                "exports": "Backbone.SubRoute"  //attaches "Backbone.SubRoute" to the window object
            },
            'jquery.flot':{deps:['jquery'],exports:'$.flot'},
            'jquery.flot.resize':{deps:['jquery','jquery.flot']},
            'jquery.flot.time':{deps:['jquery','jquery.flot']},
            'jquery.flot.pie':{deps:['jquery','jquery.flot']},
            'jquery.flot.tooltip':{deps:['jquery','jquery.flot']},

            "jquery.jqGrid":{deps:['jquery','jquery.dataTables',
                'jquery.jqGrid.locale',
                'bootstrap-datepicker.locale',
                'bootstrap-datetimepicker.locale',"jquery-ui"]},
            "jquery.jqGrid.fluid":{deps:["jquery.jqGrid"]},
            "jquery.dataTables":{deps:['jquery'],exports:'$.fn.dataTable'},
            "jquery.mapael":{deps:['jquery'],exports:'$.fn.mapael'},
            "jquery.easypiechart":{deps:['jquery'],exports:'$.fn.easyPieChart'},
            "jquery.sparkline":{deps:['jquery'],exports:'$.fn.sparkline'},
            "jquery.counterup":{deps:['waypoints']},
            "jquery-ui":{deps:['jquery',$route.getCss("jquery-ui")]},
            "jquery.layout":{deps:['jquery','jquery-ui',$route.getCss("jquery.layout")]},
            "jquery.fileDownload":{deps:['jquery',
                /*'jquery-ui',
                $route.getJs("jquery.fileDownload","shCore"),
                $route.getJs("jquery.fileDownload","shBrushJScript"),
                $route.getJs("jquery.fileDownload","shBrushXml"),
                $route.getJs("jquery.fileDownload","jquery.gritter"),*/
            ]},
            "jquery.cubeportfolio":{deps:['jquery',$route.getCss("cubeportfolio")]},
            "jquery.mCustomScrollbar":{deps:[$route.getCss("mCustomScrollbar","jquery.mCustomScrollbar"),
                $route.getJs("mCustomScrollbar","jquery.mousewheel")],exports:'$.fn.mCustomScrollbar'},
            "fancytree":{deps:['jquery','jquery-ui',$route.getCss("fancytree")]},
            "usa_states":{deps:['jquery','jquery.mapael']},
            'bootstrap-slider': { deps: ['jquery'], exports: '$.fn.slider' },
            'bootstrap-affix': { deps: ['jquery'], exports: '$.fn.affix' },
            'bootstrap-alert': { deps: ['jquery'], exports: '$.fn.alert' },
            'bootstrap-button': { deps: ['jquery'], exports: '$.fn.button' },
            'bootstrap-carousel': { deps: ['jquery'], exports: '$.fn.carousel' },
            'bootstrap-collapse': { deps: ['jquery'], exports: '$.fn.collapse' },
            'bootstrap-dropdown': { deps: ['jquery'], exports: '$.fn.dropdown' },
            'bootstrap-modal': { deps: ['jquery'], exports: '$.fn.modal' },
            'bootstrap-popover': { deps: ['jquery'], exports: '$.fn.popover' },
            'bootstrap-scrollspy': { deps: ['jquery'], exports: '$.fn.scrollspy'},
            'bootstrap-tab': { deps: ['jquery'], exports: '$.fn.tab' },
            'bootstrap-tooltip': { deps: ['jquery'], exports: '$.fn.tooltip' },
            'bootstrap-transition': { deps: ['jquery'], exports: '$.support.transition' },
            'bootstrap-typeahead': { deps: ['jquery'], exports: 'Modernizr'  } ,
            'bootstrap-tour':{deps:['jquery'],exports:'Tour'},
            'bootstrap-dataTables':{deps:['jquery','jquery.dataTables']},
            'bootstrap-datepicker.locale':{deps:[
                "bootstrap-datepicker",
                $route.getCss("bootstrap","bootstrap-datepicker3")
                    ]},
            "bootstrap-datetimepicker.locale":{deps:[
                $route.getCss("bootstrap",
                "bootstrap-datetimepicker"),"bootstrap-datetimepicker"]},
            "bootstrap.touchspin":{deps:["css!lib/touchspin/3.0.1/jquery.bootstrap-touchspin.css"]},
            "bootstrap-select":{deps:['jquery',$route.getCss("bootstrap-select")]},
            "fileinput":{deps:[
                $route.getJs("fileinput","canvas-to-blob"),
                $route.getJs("fileinput","sortable"),
                $route.getJs("fileinput","purify"),
                $route.getJs("fileinput"),
                //$route.getJs("fileinput","theme"),
                "bootstrap",
                $route.getCss("fileinput") ,

            ]},
            "ueditor": {
                "deps": [
                    $route.getJs("ueditor","ueditor.config"),
                    $route.getJs("ueditor","ueditor.all")],
                "exports": "ueditor"
            },
            "ladda":{deps:[
                "bootstrap",
                $route.getCss("ladda",
                    "ladda-themeless")
            ]},
            "icheck":{deps:[$route.getCss("icheck","all")]},
            "fuelux.wizard":{deps:[$route.getKingadminCss("components")]},
            'king-common':{deps:['jquery','jquery.flot.tooltip']},
            'king-chart-stat':{deps:['jquery','jquery.easypiechart']},
            'king-table':{deps:['jquery','jquery.dataTables']},
            'king-components':{deps:['jquery',"usa_states"]},
            'style-switcher':{deps:['jquery','king-common']}
        }
    };
    function add(plugin){
        result.paths[plugin.name]= plugin.path;
        result.shim[plugin.name]= plugin.shim;

    }
    /*add({name:"bloodhound",
        path:$route.getJs("typeahead",null,"bloodhound"),
        shim:{ 'deps': ['jquery'],exports: "Bloodhound"}
    });
    add({name:"typeahead",
        path:$route.getJs("typeahead",null,"typeahead.jquery"),
        shim:{ 'deps': ['jquery','bloodhound',$route.getCss("typeahead")],exports:"typeahead"}
    });*/
    add({name:"bootstrap3-typeahead",
        path:$route.getJs("bootstrap","bootstrap3-typeahead"),
        shim:{ 'deps': ['jquery'],exports:"typeahead"}
    });
    add({name:"bootstrap-tagsinput",
        path:$route.getJs("bootstrap","bootstrap-tagsinput"),
        shim:{ 'deps': ['bootstrap3-typeahead',$route.getCss("bootstrap","bootstrap-tagsinput")]}
    });

    return result;
}

require = $globalRequireConfig();