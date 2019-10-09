/**
 * @author:   * @date: 2016/1/16
 */
define([
    "core/js/grid/AbstractGrid",
    "core/js/utils/Utils",
    "core/js/controls/ComponentFactory",
    $Component.SKYFORMEDITOR.src,
    $Component.TOOLSTRIPITEM.src,
    "core/js/windows/messageBox",
    $Component.WINDOW.src,
    "jquery.jqGrid",
    /*/!*4.5.4版本*!/
    "jquery.jqGrid.fluid",
    */
    $route.getCss("jquery-ui"),
    //"css!lib/jqGrid/5.2.0/css/ui.jqgrid.css",
    "css!lib/jqGrid/5.2.0/css/ui.jqgrid-bootstrap.css",
    //"css!lib/jqGrid/5.2.0/css/ui.jqgrid-bootstrap-ui.css",
    "css!resources/themes/default/jqGrid.css",
], function (AbstractGrid,Utils,ComponentFactory,Skyformeditor,ToolStripItem,MessageBox) {

    //$.jgrid.defaults.styleUI = 'Bootstrap';
    $.jgrid.defaults.responsive = true;
    $.jgrid.defaults.styleUI = 'Bootstrap';
    /**
     *覆盖jgrid的showModal,显示弹窗的方式
     */
    $.jgrid.showModal= function(h) {
        h.w.show();
        var tableSelector = h.c.gbox;
        //查询弹窗
        var indexOf = h.c.gbox.indexOf("_fbox");
        if(indexOf>0){
            tableSelector = h.c.gbox.replace("_fbox","");
        }
        //设置最大宽度与高度
        h.w.css({
            "max-height":$(window).height(),
            "max-width":$(window).width(),
        });
        //设置滚动条
        //h.w.css({"overflow":"auto"});
        //设置弹窗在可是的区域中居中
        h.w.position({
            my: "center",
            of: $(window)
        });


    };
    var TABLEID_SUBFIX = "_table";
    function getGrid(gridObj){
        var attr = $(gridObj).attr("id");
        var id = attr.replace(TABLEID_SUBFIX,"");
        return $utils.getApplicationUtils().getComponentById(id);
    }
    var JqGrid = AbstractGrid.extend({
        xtype:$Component.JQGRID,
        jsonReader:{
            root: "result.records",
            /**
             * 当前页
             */
            page: "result.currentPage",
            /**
             * 总页数
             */
            total: "result.totalPage",
            /**
             * 查询出的记录总数
             */
            records: "result.totalRecords",
            repeatitems: false,
            userdata: "result.userdata",
            id: "result.id"
        },
        rowNum:10,//每页记录数
        rowList: [10, 20,50,100],//每页记录数可选列表
        pageable:true, //是否显示分页
        //是否显示分页工具栏
        pageToolbarable:false,
        /**
         * 分页工具栏的配置参数，可以把某个操作关闭掉
         * {
         *   edit:false,add:false,del:false,search:false,refresh:false
         * }
         */
        pageToolbarOptions:{
            edit:true,add:true,del:true,search:true,refresh:true
        },
        filterable:true,//是否要过滤
        datatype:"json",
        formatterComs:null,
        //必须有此postData，查询才能传递参数
        postData:{},
        /**
         * {Array} 存放查询的编辑器
         */
        filters:null,
        ajaxClient:null,
        formModel:$cons.JqGrid.formModel.default,
        formEditor:null,
        formEditorOptions:null,
        formSubmitLabel:"保存",
        formResetLabel:"重置",
        onformSubmit:null,
        colNames:[],
        /**
         * 是否需要多选框
         */
        multiselect:true,
        sortname:null,
        sortorder:null,
        autoScroll:false,
        /**
         * 是否冻结列
         */
        frozen:false,
        /**
         * 分组
         */
        grouping: false,
        groupingView:null,
        /**
         * grid加载完成后的事件
         */
        ongridComplete:null,
        /**
         * 是否显示序号，默认是true
         */
        rownumbers:true,

        /**
         * 树结构的配置，当此属性有值时，则认为时树结构的表
         * @param treeReader    等价与jqGrid组件#jqGrid.treeReader
         * @param ExpandColumn
         * @param treeGridModel
         * @param loadonce      当使用查询功能是，需要一次性加载所有，然后在客户端实现查询
         * @param ExpandColClick
         * @param tree_root_level
         *
         *
         */
        treeConf:null,

        /**
         * 出发从新加载的事件，不同的grid，重新加载的内容会不一样，参数会不一样,默认调用reload
         */
        onreload:function () {
            this.reload();
        },

        mountContent:function(){
            this.initTable();
            this.initPagination();
            this.initGrid();
        },
        /**
         * 初始化jqgrid的版本为5
         */
        initGrid:function(){

            var gridOptions = this.getGridOptions();
            //pluginConf的配置信息可以覆盖conf中的信息
            if(this.pluginConf){
                gridOptions = _.extend(gridOptions,this.pluginConf);
            }
            /*
             * jgrid没有返回对象，调用方法的格式：
             * jQuery("#grid_id").jqGrid('method', parameter1,...parameterN );
             */
            this.$table.jqGrid(gridOptions);
            var that = this;
            if(this.pageable){
                if(this.pageToolbarable){
                    if(this.formModel == $cons.JqGrid.formModel.default){
                        this.$table.navGrid("#"+this.getPagerId(),{
                                edit: this.pageToolbarOptions.edit,edittext:$i18n.JqGrid.editLabel,
                                add: this.pageToolbarOptions.add,addtext: $i18n.JqGrid.addLabel,
                                del: this.pageToolbarOptions.del,deltext: $i18n.JqGrid.deleteLabel,
                                search: this.pageToolbarOptions.search,searchtext: $i18n.JqGrid.searchLabel,
                                view: this.pageToolbarOptions.view,viewtext: $i18n.JqGrid.detailLabel,
                                refresh: this.pageToolbarOptions.refresh,refreshtext: $i18n.JqGrid.refreshLabel},
                            this.createFormOptions(), //编辑
                            this.createFormOptions(), //添加
                            this.createFormOptions(), //删除
                            {multipleSearch: true,
                                multipleGroup: true,
                                //afterShowForm: $.proxy(that.afterShowForm,that)
                                /* showQuery: true  (nice for debugging) */},//查询
                            this.createFormOptions()//详细
                        );
                    }else if(this.formModel == $cons.JqGrid.formModel.skyForm){
                        this.createSkyFormNav();
                    }
                }else{
                    this.$table.
                        navGrid("#"+this.getPagerId(),{edit:false,add:false,del:false,search:false,refresh:false});
                }


            }
            if(this.filterable){
                this.$table.jqGrid('filterToolbar',{
                    // JSON stringify all data from search, including search toolbar operators
                    stringResult: true,
                    // instuct the grid toolbar to show the search options
                    searchOperators: this.searchOperators
                });
            }
            //设置隐藏水平滚动条
            if(!this.autoScroll){
                this.$table.closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
            }

            if (this.frozen) {
                this.$table.jqGrid('setFrozenColumns');
            }
            /*var w2 = parseInt(this.$el.find('.ui-jqgrid-labels>th:eq(2)').css('width'))-3;
            this.$el.find('.ui-jqgrid-labels>th:eq(2)').css('width',w2);
            this.$el.find('tr').find("td:eq(2)").each(function(){
                $(this).css('width',w2);
            })*/
        },
        /**
         * 创建SkyForm的导航信息
         */
        createSkyFormNav:function(){
            var that = this;
            var nav = this.$table.
            navGrid("#"+this.getPagerId(),{edit:false,add:false,del:false,search:false,refresh:false});
            var options = this.pageToolbarOptions;
            if(options.add){
                //新增
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.addLabel,
                    buttonicon:"glyphicon-plus",
                    onClickButton: $.proxy(this.skyFormAddClick,that),
                    position:"last"
                });
            }
            if(options.edit){
                //编辑
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.editLabel,
                    buttonicon:"glyphicon-edit",
                    onClickButton: $.proxy(this.skyFormEditClick,that),
                    position:"last"
                })

            }
            if(options.del){
                //删除
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.deleteLabel,
                    buttonicon:"glyphicon-trash",
                    onClickButton: $.proxy(this.skyFormDeleteClick,that),
                    position:"last"
                });
            }

            /*if(options.search){
                //查询
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.searchLabel,
                    buttonicon:"glyphicon-trash",
                    onClickButton: $.proxy(this.skyFormDeleteClick,that),
                    position:"last"
                });
            }*/
            if(options.detail){
                //详情
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.searchLabel,
                    buttonicon:"glyphicon-info-sign",
                    onClickButton: $.proxy(this.skyFormDetailClick,that),
                    position:"last"
                })
            }

            if(options.refresh){
                //刷新
                nav.navButtonAdd("#"+this.getPagerId(),{
                    caption:"",
                    title:$i18n.JqGrid.refreshLabel,
                    buttonicon:"glyphicon-refresh",
                    onClickButton: function(){
                        that.trigger("reload");
                    },
                    position:"last"
                })
            }
        },
        /**
         * 添加按钮点击的事件
         */
        skyFormAddClick:function(){
            this.skyFormClick($i18n.JqGrid.addLabel);
        },
        /**
         * 编辑的按钮点击事件
         */
        skyFormEditClick:function(){
            var that =this;
            //Todo 有种情况是需要从服务器中获取
            this._skyFormSelectRow($.proxy(function(activeRecordId){
                var rowData = this.getRowData(activeRecordId);
                this.skyFormClick($i18n.JqGrid.editLabel,rowData);
            },this));
        },
        /**
         * 删除数据
         */
        skyFormDeleteClick:function(){
            //设置删除的id，可以同时选择多个
            this._skyFormSelectRows($.proxy(function(ids){
                var that = this;
                this.ajaxClient.buildClientRequest(this.editurl)
                    .addParams({id:ids.join(","),oper:"del"})
                    .post(function (compositeResponse) {
                        that._deleteCompleteHandle(compositeResponse);
                    });
            },this));
        },
        _deleteCompleteHandle:function(compositeResponse){
            var that = this;
            var msg = compositeResponse.getMessage();
            //Todo 异常
            var obj = compositeResponse.getSuccessResponse();
            if (compositeResponse.isSuccessful()) {
                if(obj.successful){
                    //刷新
                    MessageBox.success(compositeResponse.getSuccessMsg());
                    //成功后，页面提示操作成功，并需要刷新列表
                    that.trigger("reload");
                }else{
                    //请求正常，但是有系统异常
                    $.window.alert(obj.errMsg, {
                        title: $i18n.errorLabel
                    });
                }
            } else {
                //请求的操作就异常，网络异常，
                $.window.alert(msg, {
                    handle: function () {

                    }
                });
            }
        },
        /**
         * 详细信息
         */
        skyFormDetailClick:function(){
            var that =this;
            //Todo 有种情况是需要从服务器中获取
            this._skyFormSelectRow($.proxy(function(activeRecordId){
                var rowData = this.getRowData(activeRecordId);
                this.skyFormClick($i18n.JqGrid.editLabel,rowData,true);
            },this));
        },
        /**
         * 获取选择多行，执行代码
         * @param func  {function}  执行的函数
         * @private
         */
        _skyFormSelectRows:function(func){
            //判断有没有被选中
            var ids = this.getActiveRecordIds();
            if(ids&&ids.length>0){
                func(ids);
            }else{
                $.window.alert($i18n.JqGrid.noneSelectWarn);
            }
        },


        /**
         * 获取最后一个选择的行，执行代码
         * @param func  {function}  执行的函数
         * @private
         */
        _skyFormSelectRow:function(func){
            //判断有没有被选中
            var activeRecordId = this.getActiveRecordId();
            if(activeRecordId){
                func(activeRecordId);
            }else{
                $.window.alert($i18n.JqGrid.noneSelectWarn);
            }
        },
        /**
         * skyform表单的编辑点击操作
         * @param   title   {String}    弹窗的标题
         * @param   values   {Object}    表单的值
         * @param   readOnly    {Boolean}
         */
        skyFormClick:function(title,values,readOnly){
            /*if(!this.formEditor.isRendered()){
                this.formEditor.render();
            }else{
                //需要重置下状态
                this.formEditor.reset();
            }*/
            var skyFormOptions = this.formEditorOptions;

            if(this.formEditorOptions){
                skyFormOptions = _.extend(skyFormOptions,this.getSkyFormOptions());
            }else{
                skyFormOptions = this.getSkyFormOptions();
            }
            if(!this.formEditor){
                skyFormOptions.readOnly = readOnly;
                this.formEditor = new Skyformeditor(skyFormOptions);
            }

            this.formEditor.render();
            if(values){
                this.formEditor.setValues(values);
            }
            var that = this;
            //添加操作成功事件
            this.formEditor.on("submit",function(){
                var modalDialog = $.window.getActive();
                modalDialog.hide();
                that.trigger("formSubmit");
            });
            var buttons = [{
                themeClass: ToolStripItem.ThemeClass.PRIMARY,
                text: this.formSubmitLabel,
                autofocus: true,
                onclick: function(){
                    that.formEditor.submit();
                    /*var validate = that.formEditor.validate();
                    if(validate){
                        that.formEditor.submit();
                    }*/
                }
            }, {
                themeClass: ToolStripItem.ThemeClass.CANCEL,
                text: this.formResetLabel,
                onclick:  function(){
                    /*var modalDialog = $.window.getActive();
                    modalDialog.hide();*/
                    that.formEditor.reset();
                }
            }];
            var that = this;
            $.window.showMessage(this.formEditor.$el, {
                title:title,
                buttons: buttons,
                width:800,
                onhidden:function(){
                    //销毁SkyFormEdtor
                    that.formEditor.destroy();
                    that.formEditor = null;
                }
            });
        },

        /**
         * 根据colModel的信息转换成skyForm的信息
         * 映射管理:
         * JqGrid   ------  SkyForm
         * label            label
         * name             name
         * editable         只有为true的才添加进这个参数
         * key              key
         * editrules        rules
         * formoptions
         */
        getSkyFormOptions:function(){
            var realyColModel = this.getColModel(this.colModel);
            var fields = [];
            for(var i=0;i<realyColModel.length;i++){
                var col = realyColModel[i];
                //只有editable才能添加到options中
                if(!col.editable){
                    continue;
                }
                var formField = {};
                formField.label = col.label;
                formField.name = col.name;
                formField.key = col.key;
                formField.rules = col.editrules;
                if(col.editType=="text"){
                    formField.editorType = $Component.TEXTEDITOR;
                }else if(col.editType=="checkbox"){
                    formField.editorType = $Component.CHECKBOXEDITOR;
                }else if(col.editType == "switch"){
                    formField.editorType = $Component.SWITCHEDITOR;
                }
                if(col.editorType){
                    formField.editorType = col.editorType;
                }
                var editoptions = col.editoptions;
                if(editoptions){
                    formField = _.extend(editoptions,formField);
                }
                fields.push(formField);
            }
            //增加隐藏字段
            fields.push({
                name:"oper",
                hidden:"true"
            });
            return {
                defaultCollapsible:false,
                //提交的url
                submitUrl:this.editurl,
                ajaxClient:this.ajaxClient,
                //totalColumnNum:3,
                fields:fields
            };
        },
        /**
         * 创建
         */
        createFormOptions:function(options){
            var result =  {
                //width:750, //大小
                /*
                 afterShowForm : $.proxy(that.afterShowForm,that)*/
            };
            if($.isPlainObject(options)){
                result = _.extend(result,options);
            }
            return result;
        },

        afterShowForm:function(form){
            form.closest('div.ui-jqdialog').position({
                my: "center",
                of: this.$table
            });
        },
        getGridOptions:function(){
            var realyColModel = this.getColModel(this.colModel);
            var options = {
                url: this.url,
                postData: this.postData,
                jsonReader: this.jsonReader,
                mtype: 'GET',
                datatype: this.datatype,
                colNames:this.colNames,
                colModel: realyColModel,
                height:  'auto' ,
                //minHeight:"150px",
                // autowidth:true,
                //autowidth: true,
                width:this.$container.width()-1,
                // shrinkToFit: false,
                // autoScroll:true,
                altRows: true,//设置为交替行表格,默认为false 效果??
                rowNum: this.rowNum,
                rowList: this.rowList,
                pager: this.pageable?this.getPagerId():null,
                multiSort: true,
                sortname: this.sortname,
                viewrecords: true,
                sortorder: this.sortorder||"asc",
                editurl: this.editurl,
                //列菜单
                colMenu : this.colMenu!=null?this.colMenu:true,
                rownumbers: this.rownumbers, // show row numbers
                hoverrows: true, // true by default, can be switched to false if highlight on hover is not needed
                multiselect: this.multiselect,
                onSelectRow: this.selectRow,
                //loadComplete:this.loadComplete,
                gridComplete: this.gridComplete,//$.proxy(this.gridComplete,this)
                groupingView:this.groupingView,
                grouping:this.grouping
            };
            //设置滚动条
            if(this.autoScroll){
                options = _.extend(options,this.treeConf,{
                    shrinkToFit: false,
                    autoScroll:true,
                });
            }

            if(this.treeConf){
                options = _.extend(options,this.treeConf,{
                    //如果使用tree列表必须设置，这两个为false
                    rownumbers:false,
                    multiSort:false,
                });
            }

            if(this.data){
                options.data = this.data;//如果直接设置，则在为null时会有异常
            }
            return options;
        },
        /**
         * 获取行数据对象
         * @param rowId 行id
         */
        getRowData:function(rowId){
            return this.$table.jqGrid("getRowData",rowId);
        },
        /**
         * 获取列模型
         * @return {Array}  [{
         *      name:{String}[必填]<表格列的名称，所有关键字，保留字都不能作为名称使用包括subgrid, cb and rn.>
         *      label：{String}[选填]<如果colNames为空则用此值来作为列的显示名称，如果都没有设置则使用name 值>
         *      index:{String}[选填]<索引。其和后台交互的参数为sidx,排序时需要用>
         * },]
         */
        getColModel:function(colModel){
            var realyColModel = colModel;
            if(this.formColumnSize){
                realyColModel = this.addFormSize(colModel);
            }
            //创建查询栏
            if(this.searchOperators){
                this.addSearchoptions(colModel);
            }
            this.addFormatter(colModel);
            return realyColModel;
        },
        addFormatter:function(colModel){
            var that = this;
            _.each(colModel,function(element, index, list){
                var formatterComConf = element.formatterComConf;
                //如果有控件的配置，则覆盖colModel中的formatter属性
                if(formatterComConf){
                    that.addFormatterCom(formatterComConf,element.name);
                    element.formatter = that.gridformatter;
                }
            });
        },
        addFormatterCom:function(formatterComConf,name){
            if(this.formatterComs==null){
                this.formatterComs = {};
            }
            this.formatterComs[name] = {
                conf:formatterComConf
            };
            /*formatterComConf.formatterClass = this.getFormatterClass(name);
            this.formatterComs.push(formatterComConf);*/
        },
        /**
         * 使用自身的组件来生成formatter
         * @param cellValue
         * @param options
         * @param cellObject
         * @returns {string}
         */
        gridformatter:function(cellValue, options, cellObject){
            var grid = getGrid(this);
            var id = grid.getId();
            //添加状态属性，识别是否已经添加完组件信息
            return "<div class="+grid.getFormatterClass(options.colModel.name)+" data-gridid="+id+" data-rowid="+cellObject[grid.getPrimaryKeyName()]+" data-comadded="+false+"/>";
        },
        getFormatterClass:function(name){
            return this.getTableId()+name ;
        },
        /*createSearchEditor:function(editorName){
            var component = $utils.getComponentByComponentType(colModel.editor);
            this.searchEditors.push(component);
            return component;
        },*/
        addSearchoptions:function(colModel){
            var that = this;
            if(!that.filters){
                that.filters = [];
            }
            _.each(colModel,function(element, index, list){
                var component = $utils.getComponentByComponentType(element.editor);
                if(!component){
                    return ;
                }
                var filter = ComponentFactory.createFilterByEditor(component, {
                    grid:that,
                });
                if(filter){
                    element.searchoptions = {
                        sopt : filter.sopt,
                        dataInit : $.proxy(filter.dataInit,filter),
                    };
                    that.filters.push(filter);
                }else{
                    //如果是文本过滤器
                    if(!element.searchoptions){
                        element.searchoptions = {
                            sopt:[ "bw", // 开始于 ( LIKE val% )
                                "bn", // 不开始于 ( not like val%)
                                "ew", // 结束于 (LIKE %val )
                                "en", //不结束于(not LIKE %val )
                                "cn", // 包含 (LIKE %val% )
                                "nc"  // 不包含(not LIKE %val% )
                            ]
                        };
                    }
                }
               /* element.searchoptions.dataInit = function(el){
                    var options = {$container: $(el).parent(),
                        mode:$cons.DateEditorMode.INPUT ,
                        $input:$(el)
                    };
                    var editor = ComponentFactory.createComponent(component, options);
                    //el = editor.$input[0];
                    that.searchEditors.push(editor);
                };*/
            });
        },
        /**
         * 调用jqgrid的工具栏的查询
         */
        triggerToolbar:function(){
            //http://blog.csdn.net/gdclx/article/details/9009041
            this.$table[0].triggerToolbar();
        },

        /**
         * 获取jqgrid的列模型
         */
        addFormSize:function(colModel){
            var rowpos = 0;
            var colpos = 0;
            //需要排列的总数
            var sum = 0;
            for(var i=0;i<colModel.length;i++){
                var col = colModel[i];
                if(col.hidden){
                    continue;
                }

                if(sum%this.formColumnSize==0){
                    rowpos++;
                }
                colpos = sum%this.formColumnSize+1;
                col.formoptions = this.createFormoptions(rowpos,colpos);
                sum++;
            }
            return colModel;
        },
        /**
         * 创建字段在配置的formoptioins对象
         */
        createFormoptions:function(rowpos,colpos){
            return {rowpos:rowpos,colpos:colpos};
        },
        initTable:function(){
            this.$table = $("<table/>");
            this.$table.attr("id", this.getTableId());
            this.$table.addClass("table table-striped table-hover");
            this.$el.append(this.$table);
        },
        initPagination:function(){
            this.$pagination = $(this.eTag);
            this.$pagination.attr("id", this.getPagerId());
            this.$el.append(this.$pagination);

        },
        /**
         * 此id与算是grid的jqGridId
         */
        getTableId:function(){
            return this.getId()+TABLEID_SUBFIX;
        },
        /**
         * 获取导航器的html的id
         * @returns {string}
         */
        getPagerId:function(){
            return this.getId()+"_pager";
        },
        selectRow:null,
        gridComplete:function(event){
            var grid = getGrid(this);
            _.mapObject(grid.formatterComs,function(formatterCom,name){
                if(formatterCom){

                    grid.eachTrAddComponent(formatterCom,name);
                }
            });

            grid.trigger("gridComplete");

        },
        /**
         * 获取选中的记录
         */
        getActiveRecordId:function(){
            var recordId = this.$table.jqGrid("getGridParam","selrow");
            return recordId;
        },
        /**
         * 多选时，获取多个行id
         */
        getActiveRecordIds:function(){
            var ids = this.$table.jqGrid("getGridParam","selarrrow");
            return ids;
        },
        /**
         * 给每个tr添加组件
         */
        eachTrAddComponent:function(formatterCom,name){
            var trs = this.$table.find("tbody>tr");
            var that = this;
            _.each(trs,function(element, index, list){
                var id = $(element).attr("id");

                if($.isNotBank(id)){
                    var result;
                    var conf = formatterCom.conf;
                    if(_.isFunction(conf)){
                        var rowData = that.getRowData(id);
                        result = conf(rowData);
                    }else{
                        result = conf;
                    }
                    if(result!=null) {
                        var formatterClass = that.getFormatterClass(name);
                        var comXtype = result.comXtype;
                        // var comConf = result.comConf;
                        //需要clone相关的信息
                        var comConf = $.extend(true, {}, result.comConf);
                        /*var formatterClass = formatterCom.formatterClass;
                         var comXtype = formatterCom.comXtype;
                         var comConf = formatterCom.comConf;*/

                        comConf.$container = $(element).find("." + formatterClass);
                        //判断是否已经添加过组件，解决异步加载行问题
                        var comadded = comConf.$container.data("comadded");
                        if(comadded==false){
                            //引用是个数组，每行都有一个引用
                            if (formatterCom.comRefs == null) {
                                formatterCom.comRefs = {};
                            }
                            formatterCom.comRefs[formatterClass + "_" + comConf.$container.data("rowid")] = ComponentFactory.createComponent(comXtype, comConf);
                            //添加完，改成true
                            comConf.$container.data("comadded",true);
                            //formatterCom.comRef = ComponentFactory.createComponent(comXtype, comConf);
                        }
                    }
                }
            });
        },
        /**
         * 获取colModel中的主键字段信息
         * @returns {String}
         */
        getPrimaryKeyName:function(){
            var keyObj = _.find(this.colModel,{"key":true});
            if(keyObj){
                return keyObj.name;
            }else{
                return "";
            }
        },
        /**
         * 获取数据中的主键信息
         * @param record
         * @returns {*}
         */
        getPrimaryKeyValue:function(record){
            var primaryKeyName = this.getPrimaryKeyName();
            return record[primaryKeyName];
        },
        /**
         * 刷新列表，可以修改grid的配置，然后刷新
         * @param gridParam
         */
        reload:function(gridParam){
            //先清空postData的相关数据
            this.$table.setGridParam({"postData":null}).setGridParam(gridParam).trigger("reloadGrid");
        },
        /**
         * 根据加载数据
         * @param params 要求修改postData
         * @param page
         */
        reloadByPostData:function(params,page){
            //强制修改page为1
            this.reload({"postData":params,page:page||1});
        },
        destroyModal:function(gridId){
            var id = "alertmod_" + gridId;
            var el = $("#"+id);
            el.remove();
        },
        destroyFormatterComs:function(){
            _.mapObject(this.formatterComs,function(formatterCom,name){
                _.mapObject(formatterCom.comRefs,function(comRef,refName){
                    comRef.destroy();
                })
            });
        },
        /**
         * 重新设置grid的大小，根据父dom的长宽重新自适应
         */
        resize:function(){
            this.$table.jqGrid("resizeGrid");
            this.trigger("resize");  //触发布局调整的事件
        },
        destroy:function(){
            jQuery.jgrid.gridDestroy(this.getTableId());
            this.destroyModal(this.getTableId());
            this.destroyFormatterComs();
            if(this.formEditor){
                this.formEditor.destroy();
            }
            this.formEditor = null;
            this._super();
        }
    });
    return JqGrid;
});


