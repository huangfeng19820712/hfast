/**
 * @author:
 * @date: 15-1-9
 */
$global = {};
$global.constants = {
    /**
     * 全局的lib路径
     */
    libPath: 'lib/',
    /**
     * core项目的路径
     */
    corePath: 'core/',
    /**
     * require插件的路径
     */
    rqPluginPath: 'lib/require/plugin/',
    /**
     * kendo的样式路径
     */
    kendoCssPath: 'lib/kendo/2014.3.1119/styles/',
    kingadminPath: 'framework/kingadmin/js/',
    kingadminCssPath: 'framework/kingadmin/css/',
    /**
     * js模块的版本
     */
    moduleVersion: {
        jquery: '1.9.1',
        require: '2.1.11',
        kendo: '2014.3.1119',
        artDialog: '6.0.2',
        underscore: '1.8.2',
        URI: '1.14.2',
        bootstrap: '3.3.4',
        backbone: '1.0.0',
        routefilter: '0.2.0',
        flot: '1.1',
        modernizr: '2.6.2',
        'bootstrap-tour': '0.9.1',
        'style-switcher': '1.2',
        'dataTables': '1.9.4',
        'mapael': '0.7.0',
        'easypiechart': '2.1.6',
        'migrate': '1.2.1',
        'smoothScroll': '1.2.1',
        'back-to-top': '1.1',
        'sparkline': '2.1.2',
        'jqGrid': '5.2.0',
        'touchspin': '3.0.1',
        'jquery.validate': '1.14.0',
        'fuelux': '1.0',
        'counterup': '1.0',
        'icheck': '1.0.2',
        'typeahead': '0.11.1',
        'jquery.layout': '1.4.3',
        'jquery-ui': '1.11.0',
        'mCustomScrollbar': '3.1.12',
        'codemirror': '5.22.0',
        'jquery.fileDownload': '1.4.5',
        'spin': '1.3',
        'ladda': '0.9.2',
        'fileinput': '4.3.9',
        'ueditor': '1.4.3.3',
        'fancytree': '2.20.0',
        'flowplayer':'3.2.13'
    },
    /**
     * url传递的要执行的js的路径的参数名称
     */
    jsPathParamName: 'jsPath',
    /**
     * 模式
     */
    model: {
        /**
         * 调试模式
         */
        DEBUG: 0,
        /**
         * 开发模式
         */
        DEVELOP: 1,
        /**
         * 生产模式
         */
        PRODUCTION: 2
    },
    viewModel: {
        DEFAULT: 0,
        EDIT: 1,

    },
    /* xtype:{
     BASEVIEW:"BaseView",
     CARD: "card",     //对应的comSrc：core/js/controls/TabControl.js
     VBOX: "vbox",     //对应的comSrc：core/js/layout/VBoxLayout.js
     HBOX: "hbox",     //对应的comSrc：core/js/layout/HBoxLayout.js
     BORDER: "border",//对应的comSrc：core/js/layout/BorderLayout.js
     VIEW: "view",     //对应的comSrc：core/js/base/BaseView.js
     IFRAME: "iframe",//对应的comSrc：core/js/base/IframeView.js
     FORM: "form",     //对应的comSrc：core/js/view/FormView.js
     GRID: "grid",     //对应的comSrc：core/js/grid/SimpleListView.js
     TREE: "tree",     //对应的comSrc：core/js/tree/Tree.js
     },
     xtypeSrc:{
     CARD: "core/js/controls/TabControl",       //对应的comSrc：core/js/controls/TabControl.js
     VBOX: "core/js/layout/VBoxLayout",         //对应的comSrc：core/js/layout/VBoxLayout.js
     HBOX: "core/js/layout/HBoxLayout",         //对应的comSrc：core/js/layout/HBoxLayout.js
     BORDER: "core/js/layout/BorderLayout",    //对应的comSrc：core/js/layout/BorderLayout.js
     VIEW: "core/js/base/BaseView",             //对应的comSrc：core/js/base/BaseView.js
     IFRAME: "core/js/base/IframeView",        //对应的comSrc：core/js/base/IframeView.js
     FORM: "core/js/form/FormView",             //对应的comSrc：core/js/view/FormView.js
     GRID: "core/js/grid/SimpleListView",      //对应的comSrc：core/js/grid/SimpleListView.js
     TREE: "core/js/tree/Tree",                  //对应的comSrc：core/js/tree/Tree.js
     },*/
    theme: {
        DEFAULT: "default",
        GREEN: "green",
        BLUE: "blue",
        ORANGE: "orange",
        LIGHT_GREEN: "light-green",
    },
    rounded: {
        ROUNDED: "rounded",
        ROUNDED_2X: "rounded-2x",
        ROUNDED_3X: "rounded-3x",
        ROUNDED_4X: "rounded-4x",
    },
    fluidLayoutClassnamePre: "col-md-",
    column: {
        COL_MD_1: "col-md-1",
        COL_MD_2: "col-md-2",
        COL_MD_3: "col-md-3",
        COL_MD_4: "col-md-4",
        COL_MD_5: "col-md-5",
        COL_MD_6: "col-md-6",
        COL_MD_7: "col-md-7",
        COL_MD_8: "col-md-8",
        COL_MD_9: "col-md-9",
        COL_MD_10: "col-md-10",
        COL_MD_11: "col-md-11",
        COL_MD_12: "col-md-12",
    },
    textAlign: {
        CENTER: "text-center",
        LEFT: "text-left",
        RIGHT: "text-right"
    },
    textEditoMode: {
        NORMAL: "normal",
        PASSWORD: "password",
        MULTILINE: "multiline"
    },
    /* tab start*/
    tabPosition: {
        TOP_CENTER: "sky-tabs-pos-top-center",
        TOP_RIGHT: "sky-tabs-pos-top-right",
        TOP_LEFT: "sky-tabs-pos-top-left",
        TOP_JUSTIFY: "sky-tabs-pos-top-justify",
        LEFT: "sky-tabs-pos-left",
        RIGHT: "sky-tabs-pos-right",
    },
    /**
     * tab的显示模式
     */
    tabModel: {
        V1: "tab-v1",
        V2: "tab-v2",
        PILL: "tab-v3",
        V4: "tab-v4",
        V5: "tab-v5"
    },
    /* tab end*/
    float: {
        RIGHT: "pull-right",
        LEFT: "pull-left",
    },
    template: {
        /**
         * 按钮模板
         */
        Button: {
            //DEFAULT: '<button class="btn rounded <%=className%>" type="button"><%=text%></button>',
            DEFAULT: '<button id="<%=data.id%>" <%if(data.title){%>title="<%=data.title%>"<%}%>  <%if(data.isToggle){%>data-toggle="button"<%}%> autocomplete="off" type="button"><i class="fa <%=data.iconSkin%>"></i><span><%=data.text%></span></button>',
        },
        Input: {
            DEFAULT: '<input type="text" class="form-control" /><span class="input-group-addon"><i class="glyphicon glyphicon-th"></i></span>',
            SIMPLE: '<input type="text" class="form-control" />',
            FILE: '<input type="file" class="form-control file" data-preview-file-type="text" />',
            TEXTAREA: '<textarea class="form-control"></textarea>'
        },
        Grid: {
            DEFAULT: '<table><thead/><tbody/></table>',
        },
        List: {
            DEFAULT: '<div href="#" id="<%=data.id%>" class="list-group-item"><%if(data.badge){%><span class="badge"><%=data.badge%></span><%}%><%=data.content%></div>',
        },
        Link: {
            DEFAULT: '<a href="#" <%if(data.title){%>title="<%=data.title%>"<%}%> class="btn-borderless"><i class="fa <%=data.iconSkin%>"></i><%=data.text%></a>',
        },
        Tooltip: {
            //DEFAULT:'<div class="tooltip <%=data.align%>" role=""><div class="tooltip-arrow"></div> <div class="tooltip-inner"> <%=data.text%> </div> </div>'
            //DEFAULT:'<div class="popover <%=data.align%>" style="display: block;"><div class="arrow"></div><div class="popover-content"><%=data.text%></div></div>'
            DEFAULT: '<div class="tooltipLabel <%=data.align%>" style="display: block;"><div class="arrow"></div><div class="tooltipLabel-content"><%=data.text%></div></div>'

        },
        Label: {
            DEFAULT: '<span class="label rounded label-<%=data.theme%>"><%=data.text%></span>'
        },
        Checkbox: {
            DEFAULT: '<label class="checkbox-inline"><input name="<%=data.name%>" type="checkbox" value="<%=data.value%>"/><label class="margin-left-5"><%=data.label%></label></label>'
        }
    },
    groupField: {
        ALL: "all"
    },
    dataPre: "data",
    tooltip: {
        Align: {
            LEFT: "left",
            RIGHT: "right",
            TOP: "top",
            BOTTOM: "bottom"
        }
    },
    checkbox: {
        Model: {
            SQUARE: "Square",
            FLAT: "Flat",
            LINE: "Line",
            MINIMAL: "Minimal",
        }
    },
    mount: {
        Model: {
            append: "append",
            prepend: "prepend"
        }
    },
    /**
     * 主要在浏览器端，区别组件、合成组件、容器、控制器等组件内容
     */
    className: {
        /**
         * 组件的className，所有要显示的组件都要包含此className
         */
        view: "hfast-view",
        container: "hfast-container",
        control: "hfast-control"
    },
    /**
     * {Object}组件类别
     */
    componentType: {
        /**
         * 容器组件
         */
        CONTAINER: {
            name: "container",
            label: "容器"
        },
        /**
         * 表单组件
         */
        FORM: {
            name: "form",
            label: "表单"
        },
        /**
         * 表单组件
         */
        EDITOR: {
            name: "editor",
            label: "编辑器"
        },
        /**
         * grid过滤器
         */
        FILTER: {
            name: "filter",
            label: "过滤器"
        },
        /**
         * 列表组件
         */
        GRID: {
            name: "grid",
            label: "表格"
        },
        /**
         * 数据集组件
         */
        DATASET: {
            name: "dataset",
            label: "数据集"
        },
        /**
         * 其他组件
         */
        OTHER: {
            name: "other",
            label: "其他组件"
        }
    },
    DateEditorMode : {
        INPUT:"Input",
        COMPONENT:"Component",
        INLINE:"inline",
        RANGE:"range"
    },
    playerMode:{
        FLV:"flv",
        RTMP:"rtmp"
    },
};
$cons = $global.constants;
$Component = $cons.component = {
    BASEVIEW: {
        name: "BaseView",
        src: "core/js/base/BaseView"
    },
    REGION: {
        name: "Region",
        src: "core/js/view/Region"
    },
    SKYFORMEDITOR: {
        name: "SkyFormEditor",
        label: "sky表单组件",
        src: "core/js/form/SkyFormEditor",
        type: $cons.componentType.FORM
    },
    CONTAINER:{
        name: "Container",
        src: "core/js/layout/Container"
    },
    CONTROL:{
        name: "Control",
        src: "core/js/controls/Control"
    },
    /*===============grid的过滤器组件===========================*/
    DATEFILTER:{
        name: "DateFilter",
        src: "core/js/grid/filter/DateFilter",
        label: "日期过滤器",
        type: $cons.componentType.FILTER
    },
    DATETIMEFILTER:{
        name: "DatetimeFilter",
        src: "core/js/grid/filter/DatetimeFilter",
        label: "时间过滤器",
        type: $cons.componentType.FILTER
    },
    TOUCHSPINFILTER:{
        name: "TouchSpinFilter",
        src: "core/js/grid/filter/TouchSpinFilter",
        label: "数字过滤器",
        type: $cons.componentType.FILTER
    },
    /*===============编辑器组件==================*/
    TEXTEDITOR: {
        name: "TextEditor",
        src: "core/js/editors/TextEditor",
        label: "文本编辑器",
        type: $cons.componentType.EDITOR
    },
    HTMLEDITOR: {
        name: "HtmlEditor",
        src: "core/js/editors/HtmlEditor",
        label: "文本编辑器",
        type: $cons.componentType.EDITOR
    },
    DATEEDITOR: {
        name: "DateEditor",
        src: "core/js/editors/DateEditor",
        label: "日期编辑器",
        type: $cons.componentType.EDITOR
    },
    DATETIMEEDITOR: {
        name: "DatetimeEditor",
        label: "时间编辑器",
        src: "core/js/editors/DatetimeEditor",
        type: $cons.componentType.EDITOR
    },
    CHECKBOXEDITOR: {
        name: "CheckboxEditor",
        label: "选择编辑器",
        src: "core/js/editors/CheckboxEditor",
        type: $cons.componentType.EDITOR
    },
    TOUCHSPINEDITOR: {
        name: "TouchSpinEditor",
        label: "旋转数字编辑器",
        src: "core/js/editors/TouchSpinEditor",
        type: $cons.componentType.EDITOR
    },
    AUTOCOMPLETEEDITOR: {
        name: "AutoCompleteEditor",
        label: "自完成编辑器",
        src: "core/js/editors/AutoCompleteEditor",
        type: $cons.componentType.EDITOR
    },
    TAGSEDITOR: {
        name: "TagsEditor",
        label: "标签编辑器",
        src: "core/js/editors/TagsEditor",
        type: $cons.componentType.EDITOR
    },
    CODEEDITOR: {
        name: "CodeEditor",
        label: "代码编辑器",
        src: "core/js/editors/CodeEditor",
        type: $cons.componentType.EDITOR
    },
    FILEUPLOADEDITOR: {
        name: "FileUploadEditor",
        label: "上传文件编辑器",
        src: "core/js/editors/FileUploadEditor",
        type: $cons.componentType.EDITOR
    },
    DROPDOWNCONTAINER: {
        name: "DropDownContainer",
        label: "下拉框容器",
        src: "core/js/layout/DropDownContainer",
        type: $cons.componentType.EDITOR
    },
    /*===============容器组件==================*/
    PANEL: {
        name: "Panel",
        label: "面板组件",
        src: "core/js/layout/Panel",
        type: $cons.componentType.CONTAINER
    },
    FIELDSET: {
        name: "Fieldset",
        label: "表单字段组件",
        src: "core/js/layout/Fieldset",
        type: $cons.componentType.CONTAINER
    },
    FORMPANEL: {
        name: "FormPanel",
        label: "表单字段组件",
        src: "core/js/form/FormPanel",
        type: $cons.componentType.CONTAINER
    },
    FLUIDLAYOUT: {
        name: "FluidLayout",
        label: "流布局",
        src: "core/js/layout/FluidLayout",
        type: $cons.componentType.CONTAINER
    },
    BORDERLAYOUT: {
        name: "BorderLayout",
        label: "便捷布局",
        src: "core/js/layout/BorderLayout",
        type: $cons.componentType.CONTAINER
    },
    ACCORDION: {
        name: "Accordion",
        label: "手风琴布局",
        src: "core/js/layout/Accordion",
        type: $cons.componentType.CONTAINER
    },
    TABLAYOUT: {
        name: "TabLayout",
        label: "标签布局",
        src: "core/js/layout/TabLayout",
        type: $cons.componentType.CONTAINER
    },
    PILLLAYOUT: {
        name: "PillLayout",
        label: "药丸布局",
        src: "core/js/layout/PillLayout",
        type: $cons.componentType.CONTAINER
    },
    NAVIGATION: {
        name: "Navigation",
        label: "导航",
        src: "core/js/navigation/Navigation",
        type: $cons.componentType.CONTAINER
    },
    NAVIGATIONBAR: {
        name: "NavigationBar",
        label: "导航条",
        src: "core/js/navigation/NavigationBar",
        type: $cons.componentType.CONTAINER
    },


    /*===============列表组件==================*/
    LIST: {
        name: "List",
        label: "列表组件",
        src: "core/js/list/List",
        type: $cons.componentType.GRID
    },
    BOOTSTRAPGRID: {
        name: "BootstrapGrid",
        label: "bootstrap列表",
        src: "core/js/grid/BootstrapGrid",
        type: $cons.componentType.GRID
    },
    JQGRID:{
        name: "JqGrid",
        label: "jquery列表",
        src: "core/js/grid/JqGrid",
        type: $cons.componentType.GRID
    },
    PAGINATION: {
        name: "Pagination",
        label: "导航条组件",
        src: "core/js/grid/Pagination",
        type: $cons.componentType.GRID
    },

    /*TOOLBAR: {
     name: "Toolbar",
     label:"工具栏组件",
     src: "core/js/controls/ToolBar"
     },*/

    SPINLOADER: {
        name: "SPINLOADER",
        label: "工具栏组件",
        src: "core/js/windows/SpinLoader"
    },
    TOOLSTRIP: {
        name: "TOOLSTRIP",
        label: "工具栏组件",
        src: "core/js/controls/ToolStrip"
    },
    TOOLSTRIPITEM: {
        name: "ToolStripItem",
        label: "工具栏子项",
        src: "core/js/controls/ToolStripItem"
    },
    MENU: {
        name: "Menu",
        label: "菜单",
        src: "core/js/navigation/Menu"
    },
    DROPDOWNMENU: {
        name: "DropDownMenu",
        label: "工具栏子项",
        src: "core/js/navigation/DropDownMenu"
    },
    FILEDOWNLOADITEM: {
        name: "FileDownloadItem",
        label: "工具栏下载项",
        src: "core/js/controls/FileDownloadItem"
    },
    TOOLTIPLABEL: {
        name: "TooltipLabel",
        src: "core/js/controls/TooltipLabel"
    },
    PLAYER: {
        name: "Player",
        label: "图片组件",
        src: "core/js/controls/Player"
    },
    ICON: {
        name: "Icon",
        label: "图片组件",
        src: "core/js/controls/Icon"
    },
    LABEL: {
        name: "Label",
        label: "标签组件",
        src: "core/js/controls/Label"
    },
    EDITWRAP: {
        name: "EditWrap",
        label: "编辑模式包",
        src: "core/js/wrap/EditWrap"
    },
    TREE: {
        name: "Tree",
        label: "树",
        src: "core/js/tree/Tree"
    },
};

$Xtype = $cons.xtype;
//$XtypeSrc = $cons.xtypeSrc;
$TextAlign = $cons.textAlign;
$Column = $cons.column;
$Rounded = $cons.rounded;
$Theme = $cons.theme;
$global.model = $cons.model.DEVELOP;
$cons.cssSubfix = $global.model == $cons.model.DEVELOP ? ".min.css" : ".css";
$Template = $cons.template;
$i18n = {
    "alertLabel": "消息提醒",
    "BTN_CONFIRM": "确定",
    "BTN_CANCEL": "取消",
    "HELP_LABEL": "帮助"
}
$utils = {
    getContextPath: function () {
        // 当前文件在根目录的下面一层目录中，所以需要从尾巴往上找两层
        var pathName = document.location.pathname;

        var result = pathName.substr(0, pathName.lastIndexOf("/"));
        return result;
    },
    /**
     * 获取url中的参数值
     */
    getUrlParam: function (name) {
        if (name != undefined && name != '') {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
        }
        return null;
    },
    /**
     * 根据组建类型获取组建
     * @param componentType 组建类型
     */
    getComponentByComponentType:function(componentType){
        var result = [];
        for(var key in $Component){
            var component = $Component[key];
            if(component.type===componentType){
                result.push(component);
            }
        }
        return result;
    },
    /**
     * 根据组件名称获取组件的信息
     * @param componentName
     * @returns {*}
     */
    getComponentByComponentType:function(componentName){
        var result = [];
        for(var key in $Component){
            var component = $Component[key];
            if(component.name===componentName){
                return component;
            }
        }
    },
    getApplicationUtils:function(){
        return $global.app.getApplicationUtils();
    },
}
$Log = {
    info: function (s) {
        if (typeof console != "undefined") {
            console.log(this.getCurrentDate() + '【信息】页面：' + location.href + "\n" + s);
        }
    },
    debug: function (s) {
        if (typeof console != "undefined") {
            console.log(this.getCurrentDate() + '【调试】页面：' + location.href + "\n" + s);
        }
    },
    error: function (s) {
        if (typeof console != "undefined") {
            console.log(this.getCurrentDate() + '【错误】页面：' + location.href + "\n" + s);
        }
    },
    warn: function (s) {
        if (typeof console != "undefined") {
            console.log(this.getCurrentDate() + '【警告】页面：' + location.href + "\n" + s);
        }
    },
    getCurrentDate: function () {
        var date = new Date();
        var result = [date.getFullYear(), "-", date.getMonth(), "-", date.getDate()];
        result.push(" ");
        result.push(date.getHours());
        result.push(":");
        result.push(date.getMinutes());
        result.push(":");
        result.push(date.getSeconds());
        result.push(",");
        result.push(date.getMilliseconds());
        return result.join("");
    }
};
$route = {
    getCorePath: function (moduleName, funcName) {
        return "/index.php?g=Core&m=" + moduleName + "&a=" + (funcName || "index");
    },
    /**
     * 获取grid的路径
     *
     * @param action
     *            动作
     * @param modelName
     *            数据模型
     */
    getGridPath: function (action, modelName) {
        return "/index.php?g=Core&m=Rest&a=" + action + "&$model=" + modelName;
    },
    getModulePath: function (moduleName) {
        return $cons.libPath + moduleName + "/" + $cons.moduleVersion[moduleName];
    },
    /**
     * 获取js的路径,没有后缀，主要给require中使用
     *
     * @param moduleName
     * @param subModuleName
     *            子模块名
     * @returns {string}
     */
    getJs: function (moduleName, subModeleName) {
        var url = $cons.libPath + moduleName + "/" +
            $cons.moduleVersion[moduleName] + "/" +
            (subModeleName != undefined ? subModeleName : moduleName);
        return url;
    },
    /**
     * 获取js的路径,包含后缀
     *
     * @param moduleName
     * @param version
     * @returns {string}
     */
    getAllJs: function (moduleName, version) {
        return "/" + this.getJs(moduleName, version) + ".js";
    },
    /**
     * 获取require的插件js路径
     *
     * @param moduleName
     */
    getRqPluginJs: function (moduleName) {
        return $cons.rqPluginPath + moduleName + "/" + moduleName;
    },
    getCss: function (moduleName, subModeleName) {
        return "css!" + $cons.libPath + moduleName + "/" + $cons.moduleVersion[moduleName] + "/css/" +
            (subModeleName != undefined ? subModeleName : moduleName) + $cons.cssSubfix;
    },
    getLocale: function (moduleName, subModeleName) {
        return $cons.libPath + moduleName + "/" + $cons.moduleVersion[moduleName] + "/locales/" +
            (subModeleName != undefined ? subModeleName : moduleName) + "." + $global.BaseFramework.locale + ".min";
    },
    getRqKendoCss: function (moduleName) {
        return "css!" + $cons.kendoCssPath + "kendo." + moduleName + $cons.cssSubfix;
    },
    /**
     * 获取kingadmin的路径
     * @param sourcePath
     * @returns {string}
     */
    getKingadminJs: function (sourcePath) {
        return $cons.kingadminPath + sourcePath;
    },
    getKingadminCss: function (sourcePath) {
        return "css!" + $cons.kingadminCssPath + sourcePath + $cons.cssSubfix;
    },
    getTemplate: function () {

    }
}

$global.BaseFramework = {
    /**
     * 获取框架的国际化信息。
     *
     * @default zh-CN
     */
    locale: "zh-CN",

    layout: "",

    layoutSkin: "",

    /**
     * 获取框架的主题库名称。
     *
     * @default
     */
    theme: "",
    jsConfig: null,

    init: function () {
        /*document.write("<script type='text/javascript' data-main='" +
         "/core/js/routeJs.js" + "'  src='" + $route.getAllJs("require") + "'></" + "script>");*/
        var mappingPath = "";
        var that = this;
        this._loadScript(mappingPath + "/core/js/require-config.js", null, function () {   //加载require的配置信息
            that._loadConf();   //加载平台配置文件
        })
    },
    /**
     * 加载配置信息
     * @private
     */
    _loadConf: function () {

        //如果已经存在该对象，就直接返回（支持多个配置文件，允许覆盖）
        if (typeof CONFIG == "object") {
            $global.BaseFramework._loadConfCallBack(true);
            return;
        }


        this._loadScript(this._getConfPath(), null, function () {
            $global.BaseFramework._loadConfCallBack(true)
        }, function () {
            $global.BaseFramework._loadConfCallBack(false)
        });
    },
    /**
     *  获取配置文件的路径
     * @returns {string}
     * @private
     */
    _getConfPath: function () {
        var result = [this.getCurrentParentPath()];
        /* var projectVersion = this.projectVersion;
         if(projectVersion){
         result.push(projectVersion);
         }*/
        //默认
        result.push("conf.js");

        return result.join("/");
    },
    /**
     * 默认情况下conf文件都在请求文件的同一个目录下
     * @returns {string|*}
     */
    getCurrentParentPath: function () {
        var jsArray = document.getElementsByTagName("script");
        result = window.location.pathname
        result = result.substring(0, result.lastIndexOf("/"));  //然后往上退一层，因为framework.js的路径是<应用上下文>/core_js/framework.js
        return result;
    },
    /**
     * 加载应用的配置数据，可以从数据库加载
     * @param isSuccessful
     * @private
     */
    _loadConfCallBack: function (isSuccessful) {
        if (!isSuccessful || typeof CONFIG == "undefined") {
            alert("请确定工程中存在conf.js文件，否则系统无法使用！");
            return;
        }
        var jsConfig = CONFIG;  //设置euler-conf.js中的配置值
        this.jsConfig = jsConfig;

        var config = jsConfig;//this.dbEulerConfig || jsEulerConfig;  //如果有数据库中有配置，那么就取数据库；否则就取js中的配置
        var uiConfig = config["ui"];

        var currentModuleName = jsConfig["currentModuleName"],
            appCnName = config["appCnName"],
            theme = uiConfig["project"]["theme"] || "default",
            layout = uiConfig["framework"]["layout"] || "default",
            layoutSkin = uiConfig["framework"]["layoutSkin"] || "default";

        //如果非平台的模块，而是工程的项目，又没有指定工程版本，就报错
        if (!currentModuleName && !this.projectVersion) {
            alert("请在工程配置文件[conf/euler-conf.properties,spring/<projectName>-web.xml]中指定工程的版本号[project.version]，否则系统无法使用！");
            return;
        }

        this.theme = theme;
        this.layout = layout;
        this.layoutSkin = layoutSkin;

        //针对于弹窗（不包含框架页），需要额外添加框架页的一些样式
        var pathName = document.location.pathname;
        var isMainPage = pathName.indexOf("/main.html") > -1;
        /*if (isMainPage) {
         var mappingPath = this.getMappingPath();  //映射路径;
         this._loadCss(mappingPath + "core/resources/themes/" + theme + "/global.css");
         this._loadCss(mappingPath + "core/resources/themes/" + theme + "/css3-hsui.css");
         this._loadCss(mappingPath + "dcresources/themes/" + theme + "/icon-action.css");
         this._loadCss(mappingPath + "dcresources/themes/" + theme + "/icon-other.css");
         }

         this._initRequireConfig(currentModuleName, theme, layout, layoutSkin);*/

        //启动requireJS的入口文件
        var entryPoint = jsConfig["entry"]["point"] || "/core/js/routeJs.js";  //启动文件，即按照requireJS的规范指定data-main属性值，即requireJS的入口点
        document.title = appCnName;
        this._loadScript($route.getAllJs("require"), {"data-main": entryPoint});

    },
    _loadCss: function (cssSrc) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = cssSrc;
        head.appendChild(link);
    },
    _loadScript: function (scriptSrc, attrMap, loadCallback, errorCallback) {
        var head = document.head || document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = scriptSrc;
        script.type = "text/javascript";
        if (attrMap) {
            for (var key in attrMap) {
                var att = document.createAttribute(key);
                att.value = attrMap[key];
                script.setAttributeNode(att);
            }
        }
        if (loadCallback && typeof(loadCallback) == "function") {

            var userAgent = window.navigator.userAgent.toLowerCase();
            var browser = {
                version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
                safari: /webkit/.test(userAgent),
                opera: /opera/.test(userAgent),
                msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
                mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
            }
            if (browser.msie) {
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded") {
                        loadCallback();
                    }
                }
            } else {
                script.onload = function () {
                    loadCallback();
                }
            }

        }
        if (errorCallback && typeof(errorCallback) == "function") {
            script.onerror = function () {
                errorCallback();
            }
        }
        head.appendChild(script);
    },
    getJSConfig: function () {
        return this.jsConfig;
    }
}
$global.BaseFramework.init();
/**
 * 执行的app，在全局中的引用
 * @type {null}
 */
$global.app = null;

