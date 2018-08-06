/**
 * @author:   * @date: 2016/1/16
 */
define([
    "core/js/grid/AbstractGrid",
    "core/js/utils/Utils",
    "core/js/controls/ComponentFactory",
    "jquery.jqGrid",
    /*/!*4.5.4版本*!/
    "jquery.jqGrid.fluid",
    */
    $route.getCss("jquery-ui"),
    //"css!lib/jqGrid/5.2.0/css/ui.jqgrid.css",
    "css!lib/jqGrid/5.2.0/css/ui.jqgrid-bootstrap.css",
    //"css!lib/jqGrid/5.2.0/css/ui.jqgrid-bootstrap-ui.css",
    "css!resources/themes/default/jqGrid.css",
], function (AbstractGrid,Utils,ComponentFactory) {

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
            id: "id"
        },
        rowNum:10,//每页记录数
        rowList: [10, 20,50,100],//每页记录数可选列表
        pageable:true, //是否显示分页
        filterable:true,//是否要过滤
        datatype:"json",
        formatterComs:null,
        /**
         * {Array} 存放查询的编辑器
         */
        filters:null,
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
                this.$table.navGrid("#"+this.getPagerId(),{
                        edit: true,edittext: "编辑",
                        add: true,addtext: "添加",
                        del: true,deltext: "删除",
                        search: true,searchtext: "查询",
                        view: true,viewtext: "详情",
                        refresh: true,refreshtext: "刷新",},
                    this.createFormOptions(), //编辑
                    this.createFormOptions(), //添加
                    this.createFormOptions(), //删除
                    {multipleSearch: true,
                        multipleGroup: true,
                        //afterShowForm: $.proxy(that.afterShowForm,that)
                    /* showQuery: true  (nice for debugging) */},//查询
                    this.createFormOptions()//详细
                );
            }
            if(this.filterable){
                this.$table.jqGrid('filterToolbar',{
                    // JSON stringify all data from search, including search toolbar operators
                    stringResult: true,
                    // instuct the grid toolbar to show the search options
                    searchOperators: this.searchOperators
                });
            }
            this.$table.closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" });
            /*var w2 = parseInt(this.$el.find('.ui-jqgrid-labels>th:eq(2)').css('width'))-3;
            this.$el.find('.ui-jqgrid-labels>th:eq(2)').css('width',w2);
            this.$el.find('tr').find("td:eq(2)").each(function(){
                $(this).css('width',w2);
            })*/
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
                //colNames: [' ', 'id', '期数', '创建日期', '结果', '状态'],
                colModel: realyColModel,
                height:  'auto' ,
                //minHeight:"150px",
                //autowidth:true,
                //autowidth: true,
                width:this.$container.width()-1,
                //shrinkToFit: true,
                altRows: true,//设置为交替行表格,默认为false 效果??
                rowNum: this.rowNum,
                rowList: this.rowList,
                pager: this.pageable?this.getPagerId():null,
                multiSort: true,
                //sortname: 'invid',
                viewrecords: true,
                //sortorder: "asc",
                editurl: this.editurl,
                //列菜单
                colMenu : this.colMenu!=null?this.colMenu:true,
                rownumbers: true, // show row numbers
                hoverrows: true, // true by default, can be switched to false if highlight on hover is not needed
                multiselect: true,
                onSelectRow: this.selectRow,
                //loadComplete:this.loadComplete,
                gridComplete: this.gridComplete//$.proxy(this.gridComplete,this)
            };
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
            return "<div class="+grid.getFormatterClass(options.colModel.name)+" data-gridid="+id+" data-rowid="+cellObject.id+"/>";
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
        /**
         * @deprecated
         */
        initGrid4:function(){
            this.$table.jqGrid({
                url: this.url,
                postData: this.postData,
                jsonReader: this.jsonReader,
                mtype: 'GET',
                datatype: 'json',
                //colNames: [' ', 'id', '期数', '创建日期', '结果', '状态'],
                colModel: this.colModel,
                //height: 400,
                autowidth:true,
                rowNum: this.rowNum,
                rowList: this.rowList,
                pager: this.getPagerId(),
                sortname: 'invid',
                viewrecords: true,
                sortorder: "asc",
                //editurl: this.$EDIT,
                rownumbers: true, // show row numbers
                hoverrows: true, // true by default, can be switched to false if highlight on hover is not needed
                multiselect: true,
                onSelectRow: this.selectRow,
                gridComplete: this.gridComplete
            }).navGrid("#"+this.getPagerId(),{add: true,addtext: "添加",
                    edit: true,edittext: "编辑",
                    view: true,viewtext: "详情",
                    del: true,deltext: "删除",
                    search: true,searchtext: "查询",
                    refresh: true,refreshtext: "刷新",},{}, {}, {},
                {multipleSearch: true, multipleGroup: true, /* showQuery: true  (nice for debugging) */});
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
        gridComplete:function(){
            var grid = getGrid(this);
            _.mapObject(grid.formatterComs,function(formatterCom,name){
                if(formatterCom){

                    grid.eachTrAddComponent(formatterCom,name);
                }
            });

        },
        /**
         * 给每个tr添加组件
         */
        eachTrAddComponent:function(formatterCom,name){
            var trs = this.$("tbody>tr");
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
                    var formatterClass = that.getFormatterClass(name);
                    var comXtype = result.comXtype;
                    var comConf = result.comConf;
                    /*var formatterClass = formatterCom.formatterClass;
                    var comXtype = formatterCom.comXtype;
                    var comConf = formatterCom.comConf;*/

                    comConf.$container = $(element).find("."+formatterClass);
                    formatterCom.comRef = ComponentFactory.createComponent(comXtype, comConf);
                }
            });
        },
        /**
         * 刷新列表，可以修改grid的配置，然后刷新
         * @param gridParam
         */
        reload:function(gridParam){
            this.$table.setGridParam(gridParam).trigger("reloadGrid");
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
                var comRef = formatterCom.comRef;
                if(comRef!=null&&comRef.destroy){
                    comRef.destroy();
                }

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
            this._super();
        }
    });
    return JqGrid;
});


