/**
 * @author:   * @date: 2016/1/16
 */
define([
    "core/js/grid/AbstractGrid",
    "core/js/grid/Pagination",
    $Component.TOOLSTRIP.src,
    "core/js/model/PageModel",
    "core/js/controls/ComponentFactory"
], function ( AbstractGrid,Pagination,ToolStrip,PageModel,ComponentFactory) {

    var BootstrapGrid = AbstractGrid.extend({
        xtype:$Component.BOOTSTRAPGRID,
        className:"bootstrapGrid table-responsive",
        $thead:null,
        $tbody:null,
        $toolbar:null,
        toolbarable:true,
        toolbarItemOptions:null,
        ajaxClient:null,
        //show row numbers
        rownumbers:true,
        TABLEID_SUBFIX : "_table",

        /**
         * 模式，应用$cons.PaginationMode中的模式
         */
        paginationMode:$cons.PaginationMode.FULL,
        /**
         * 存放当前列表的记录
         */
        _records:null,
        /**
         * 行被选择的事件，是function
         * @param  event    jq的对象
         * @param   data    被选择行对应的数据
         */
        onselect:null,

        /**
         * 命名空间
         */
        nameSpace:null,
        /**
         * 方法名
         */
        methodName:null,
        /**
         * 默认的，每次请求都上传的参数
         */
        defaultPostData:null,
        /**
         * 页数
         */
        pageSize:10,
        formatterComs:null,

        initializeHandle: function () {
            //初始化data
            var that = this;
            //只有有路径的时候，才回执行
            if(this.url||(this.nameSpace&&this.methodName)){
                if(this.model==null){
                    this.model = new PageModel({
                        url:this.url,
                        nameSpace:this.nameSpace,
                        methodName:this.methodName,
                        async:false,
                        pageSize:this.pageSize
                    });
                }
                if(!this.ajaxClient){
                    var applicationContext = $utils.getApplicationUtils().getApplicationContext();
                    this.ajaxClient = applicationContext.getAjaxClient();
                }
                if(this.defaultPostData) {
                    this.model.defaultPostData = this.defaultPostData;
                }
                this.model.setAjaxClient(this.ajaxClient);
                //this.model.setFetchSuccessOnceFunction(this.renderView,this);
                // this.model.pageFetch();
            }
        },

        mountContent:function(){
            this.initToolbar();
            this.initFormatterComConf();
            //初始化
            this.initTable();
            if(this.pageable){
                var totalPage = 0;
                if(this.model){
                    totalPage = this.model.getTotalPage();
                    this.model.on("addedrecord", $.proxy(this._addedRecord,this));
                    this.model.on("changedrecord", $.proxy(this._changedrecord,this));
                    //this.model.on("addedrecord", $.proxy(this._addedRecord,this));
                }else{
                    //当data里面有数据时，总页数是1
                    if(this.data&&this.data.length>0){
                        totalPage = 1;
                    }
                }
                this.initPagination(totalPage);
            }
        },
        /**
         * 初始化工具栏
         */
        initToolbar:function(){
            if(!this.toolbarable||this.toolbarItemOptions==null){
                return ;
            }
            var that = this;
            this.$toolbar = new ToolStrip({
                $container: this.$el,
                parent:that,
                itemOptions:this.toolbarItemOptions
            });
        },

        initPagination:function(totalPage){
            var that = this;
            this.$pagination = new Pagination({
                $container:this.$el,
                parent:that,
                totalPage:totalPage,
                mode:this.paginationMode,
                onpage:function(currentPage){
                    that.createTbody(currentPage);
                    //that.registerEvent();
                }
            });
        },
        /**
         * 初始化表格
         */
        initTable:function(){
            this.$table = $($Template.Grid.DEFAULT);
            this.$table.addClass("table table-hover table-striped table-responsive table-bordered");
            this.$table.attr("id", this.getTableId());
            this.$thead = this.$table.find("thead");
            this.$thead.append("<tr/>");
            this.$tbody = this.$table.find("tbody");

            this.createThead();
            this.createTbody(1);
            this.$el.append(this.$table);
            //this.registerEvent();
        },
       /* registerEvent:function(){
            var that = this;
            //添加点击事件
            this.$el.find("tbody>tr").on("click",function(e){
                $(e.target).parent().siblings().removeClass("active");
                $(e.target).parent().addClass("active");
                var id = $(e.currentTarget).data(that.getPrimaryKeyName());
                that.trigger("select",e,that.getRecordById(that._records,id));
            });
        },*/
        /**
         * 创建thead
         */
        createThead:function(){
            if(this.colModel){
                //显示行数
                if(this.rownumbers){
                    this.addThead({
                        label:$i18n.BootstrapGrid.showNumberLabel
                    });
                }
                for(var i =0;i<this.colModel.length;i++){
                    var model = this.colModel[i];
                    if(model.hidden){
                        //如果隐藏，则跳过
                        continue;
                    }
                    this.addThead(model);
                }

            }
        },
        /**
         * 添加表头
         * @param model
         */
        addThead:function(model){
            var theadTr = this.$thead.find("tr");
            var $th = $("<th/>");
            if(model.width){
                $th.css("width",model.width);
            }
            $th.text(model.label);
            theadTr.append($th);
        },
        /**
         * 创建表单的主体
         * @param currentPage   {Number}
         */
        createTbody:function(currentPage){
            var data = null;
            if(this.model){
                data = this.model.getCurrentRecords(currentPage);
            }else if(this.data){
                data = this.data;
            }
            if(data&& _.isArray(data)){
                //如果每行数据都是数组，需要转换成对象
                if(_.isArray(data[0])){
                    this._records = [];
                    for(var i=0;i<data.length;i++){
                        var obj = this.array2Object(data[i], this.colModel);
                        this._records.push(obj);
                    }
                }else{
                    this._records = data;
                }
                this.clearTbody();
                //设置开始的序号
                var start = 0;
                if(this.model){
                    start = this.model.getStart();
                }

                for(var i=0;i<this._records.length;i++){
                    var record = this._records[i];
                    this.addTbody(this.createTr(record,start+i+1));
                }
            }

        },
        array2Object:function(record,colModel){
            var obj = {};
            for(var i=0;i<record.length;i++){
                var col = colModel[i];
                obj[col.name] = record[i];
            }
            return obj
        },
        /**
         * 根据model生成表单主体
         * @param record
         * @param rownumber    行的序号
         */
        addTbody:function(tr){
            this.$tbody.append(tr);
            //添加事件:
            var that = this;
            tr.on("click",function(e){
                $(e.target).parent().siblings().removeClass("active");
                $(e.target).parent().addClass("active");
                var id = $(e.currentTarget).data(that.getPrimaryKeyName());
                that.trigger("select",e,that.getRecordById(that._records,id));
            });
        },
        /**
         * 根据model生成表单的tr
         * @param record
         * @param rownumber    行的序号
         */
        createTr:function(record,rownumber){
            if(!record){
                return ;
            }
            var tbodyTr = this.$tbody.find("tr");
            var tr = $("<tr/>");
            var trId = null;
            if(_.isArray(record)){
                var findIndex = _.findIndex(this.colModel, {"key": true});
                trId = record[findIndex];
            }else{
                trId = this.getPrimaryKeyValue(record);
            }
            tr.data(this.getPrimaryKeyName(),trId);
            tr.attr("id",this.getTrId(trId));
            this.createTds(tr, record, rownumber);
            return tr;
        },
        /**
         * 删除tr
         * @param id
         */
        deleteTr:function(id){
            var tr = this.$tbody.find("#" + this.getTrId(id));
            tr.remove();
        },
        /**
         * 创建td
         * @param record
         * @param rownumber   行的序号
         */
        createTds:function(tr,record,rownumber){
            if(this.rownumbers){
                this._addTd2Tbody(tr,"rownumber",rownumber);
                tr.data("rownumber",rownumber);
            }
            //把需要隐藏的列去掉
            var colModel = _.reject(this.colModel,function(col){
                return col.hidden;
            });
            var recordObj = record;
            if(_.isArray(record)){
                recordObj = {};
                //需要根据this.colModel,进行处理，而不是过滤掉隐藏的 colModel
                for(var i in record){
                    if(this.colModel[i]){
                        recordObj[this.colModel[i].name] =record[i]
                    }
                }
            }
            //如果是对象,则根据colModel去读取
            for(var i in colModel){
                var colM = colModel[i];
                var value  = recordObj[colM.name];
                this.createTd(tr,recordObj,colM,value,rownumber);
            }

        },
        /**
         * @param tr       行信息
         * @param record    记录信息
         * @param colM      列信息
         * @param value     值
         * @param rownumber     行数
         */
        createTd:function(tr,record,colM,value,rownumber){
            var formatter = colM.formatter;
            var formatoptions = colM.formatoptions;
            var formatterComConf = colM.formatterComConf;

            if(formatter&&_.isFunction(formatter)){
                value = formatter(record,value);
            }else if(formatter||formatoptions){
                value = this._defaultFormatterHandler(formatter,formatoptions,value,record);
            }else if(formatterComConf!=null){
                //添加组件的容器
                value = this.createformatterContainer(colM.name,this.getPrimaryKeyValue(record),rownumber);

            }
            if($.isBank(value)){
                value =  (formatoptions!=null&&$.isBank(formatoptions.defaultValue))?formatoptions.defaultValue : "&#160;";
            }
            this._addTd2Tbody(tr,colM.name,value);
            if(formatterComConf!=null){
                var cell = tr.find("." + this.getFormatterClass(colM.name));
                //挂载组件
                this.createFormatterCom(cell,formatterComConf,colM.name,record);
            }
        },

        /**
         * 获取tr的id属性
         */
        getTrId:function(id){
            return  this.getId()+"_"+id;
        },
        /**
         * 本省默认提供的格式化器
         * @param formatter 本类提供的格式化器
         * @param formatoptions 提供给formatter的参数
         * @param cellval     本cell的提供的值
         * @param record    本行的数据
         * @private
         */
        _defaultFormatterHandler:function(formatter,formatoptions,cellval,record){
            //Todo 需要添加各种默认的格式化器
            switch(formatter) {
                case "date":
                    break;
                case "number":
                    break;
                case "currency":
                    break;
                case "email":
                    break;
                case "showlink":
                    break;
                case "checkbox":
                    break;
                case "select":
                    break;
                default :
                    //默认是的text格式
                    /**
                     * 限制的长度，如果操作则用...代替
                     */
                    if(formatoptions.maxLength&&formatoptions.maxLength>0&&
                        cellval.length>formatoptions.maxLength){
                        return cellval.substring(0,formatoptions.maxLength).concat("...");
                    }
                    return cellval;
                    break;
            }

        },

        /**
         * 添加记录,并插入表达的最后,主要绑定model的addedRecord方式调用
         * @param record
         * @private
         */
        _addedRecord:function(record,rownumber){
            //添加到临时记录汇总
            this._records.push(record);
            this.addTbody(this.createTr(record,rownumber));
        },
        _changedrecord:function(record){
            //修改本省的record与现实中对应的内容
            var where = {};
            var keyValue = this.getPrimaryKeyValue(record);
            where[this.getPrimaryKeyName()] = keyValue;
            var oldRecord = _.findWhere(this._records,where );
            if(oldRecord){
                //覆盖属性值，只包含有的，没有的则不覆盖
                _.extendOwn(oldRecord,record);
            }
            var tr = this.$tbody.find("#" + this.getTrId(keyValue));
            var rownumber = tr.data("rownumber");
            tr.empty();
            this.createTds(tr,record,rownumber);
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
         * 获取行数据对象
         * @param rowId 行id
         */
        getRowData:function(id){
            return this.getRecordById(this._records,id);
        },
        /**
         * 根据id获取记录信息
         * @return {Object}
         */
        getRecordById:function(data,id){
            var obj = {};
            obj[this.getPrimaryKeyName()] = id;
            return _.find(data,obj);
        },

        /**
         * 获取第一条数据
         * @returns {*}
         */
        getFirstRecord:function(){
            if (this._records && this._records.length > 0) {
                return this._records[0];
            }
            return null;
        },
        /**
         * 获取数据信息
         * @returns {null}
         */
        getRecords:function(){
           return this._records
        },

        /**
         * 创建一个td到tr中
         * @param tr
         * @param name
         * @param value
         * @private
         */
        _addTd2Tbody:function(tr,name,value){
            var $td = $("<td>" + value + "</td>");
            var trId = tr.attr("id");
            $td.attr("id",this.getTdId(trId,name));
            tr.append($td);
        },
        getTdId:function(trId,name){
            return trId+"_"+name;
        },
        /**
         * 晴空Tbody
         */
        clearTbody:function(){
            this.$tbody.empty();
        },
        /**
         *
         */
        activeFirstTr:function(){
            var firstRecord = this.getFirstRecord();
            var tr = this.$tbody.find("#" + this.getTrId(this.getPrimaryKeyValue(firstRecord)));
            tr.click();
            var find = this.$tbody.find("active");
            find.removeClass("active");
            tr.addClass("active");

        },
        /**
         * 获取选中的记录
         */
        getActiveRecordId:function(){
            var tr = this.$tbody.find("tr.active");
            return tr.data("id");
        },

        /**
         * 使用自身的组件来生成formatter
         * @param name      列的名称
         * @param rowId     行id
         * @returns {string}
         */
        createformatterContainer:function( name,rowId,rowNumber){
            var id = this.getId();
            var clazz = this.getFormatterClass(name);
            return "<div class="+clazz+" data-gridid="+id+" data-rowid="+rowId+" data-rownumber="+rowNumber+"/>";
        },
        getFormatterClass:function(name){
            return this.getTableId()+name ;
        },
        /**
         * 此id与算是grid的jqGridId
         */
        getTableId:function(){
            return this.getId()+this.TABLEID_SUBFIX;
        },
        /**
         * 根据格式化配置创建组件
         * @param $container    容器
         * @param formatterComConf
         * @param name      名称
         * @param record    行记录
         */
        createFormatterCom:function($container,formatterComConf,name,record){

            var formatterCom = this.formatterComs[name];
            if(formatterCom==null){
                formatterCom = {
                    conf:formatterComConf
                }
            }

            if(_.isFunction(formatterComConf)){
                result = formatterComConf(record);
            }else{
                result = formatterComConf;
            }
            if(result){
                if(_.isArray(result)){
                    for(var i=0;i<result.length;i++){
                        this.createComponentHandle(formatterCom,$container,result[i],i);
                    }
                }else{
                    this.createComponentHandle(formatterCom,$container,result);
                }
            }
        },
        /**
         * 创建组件
         * @param   formatterCom
         * @param $container
         * @param conf
         * @param i
         */
        createComponentHandle:function(formatterCom,$container,conf,i){
            var comXtype = conf.comXtype;
            //需要clone相关的信息
            var comConf = $.extend(true, {}, conf.comConf);
            comConf.$container = $container;

            //引用是个数组，每行都有一个引用
            if(formatterCom.comRefs  == null){
                formatterCom.comRefs = {};
            }
            var refKey = this.getComRefKey($container,i);

            formatterCom.comRefs[refKey] = ComponentFactory.createComponent(comXtype, comConf);
        },

        /**
         * 根据容器获取，放在this.formatterCom.comRefs中的key值
         * @param $container
         * @param i
         * @returns {string}
         */
        getComRefKey:function($container,i){
            var formatterClass = $container.attr("class");
            var refKey = formatterClass+"_"+$container.data("rowid");
            if(i){
                refKey+="_"+i;
            }else{
                refKey+="_"+0;
            }
            return refKey;
        },

        /**
         * 初始化colModel中的FormatterComConf属性
         *
         */
        initFormatterComConf:function(){
            var that = this;
            _.each(this.colModel,function(element, index, list){
                //把没有name属性的，添加默认属性
                if(element.name==null||element.name==''){
                    element.name = "_"+index;
                }
                var formatterComConf = element.formatterComConf;
                //如果有控件的配置，则覆盖colModel中的formatter属性
                if(formatterComConf){
                    that.addFormatterCom(formatterComConf,element.name);
                }


            });
        },
        /**
         * 获取cell的El
         * @param id
         * @param name
         * @returns {*|jQuery|HTMLElement}
         */
        getCellEl:function(id,name){
            var trId = this.getTrId(id);
            var tdId = this.getTdId(trId,name);
            return $("#" + tdId);
        },
        /**
         * 替换组件
         * @param name          列信息
         * @param $el           表格中cell的El，可以从getCellEl中获取
         * @param newComConf    新的组件配置
         * @param index         第几个组件
         */
        replaceCellCom:function(name,$el,newComConf,index){
            var $container = $($el.children("div"));
            var refKey =  this.getComRefKey($container,index);
            var oldCom = this.formatterComs[name].comRefs[refKey];
            var comXtype = newComConf.comXtype;
            var comConf = newComConf.comConf;
            comConf.$container = $container;
            oldCom.destroy();
            this.formatterComs[name].comRefs[refKey] = ComponentFactory.createComponent(comXtype, comConf);
        },

        /**
         * 添加列的组件
         * @param formatterComConf
         * @param name
         */
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
         * 销毁列的组件
         */
        destroyFormatterComs:function(){
            _.mapObject(this.formatterComs,function(formatterCom,name){
                if(formatterCom.comRefs&&formatterCom.comRefs.length>0){
                    for(var i=0;i<formatterCom.comRefs.length;i++){
                        var comRef = formatterCom.comRefs[i];
                        if(comRef!=null&&comRef.destroy){
                            comRef.destroy();
                        }
                    }
                }
            });
        },

        setDefaultPostData:function(defaultPostData){
            this.defaultPostData = defaultPostData;
            this.model.defaultPostData = defaultPostData;
        },
        /**
         * 刷新列表，可以修改grid的配置，然后刷新
         * @param gridParam
         */
        reload:function(gridParam){
            //刷新tbody
            this.createTbody(this.model.getCurrentPage());
            this.$pagination.reload({
                currentPage: this.model.getCurrentPage(),
                totalPage: this.model.getTotalPage(),
                pageSize: this.model.getPageSize(),
            });
            //刷新分页组件
            // this.$pagination.
        },
        /**
         * //Todo 暂不支持，根据加载数据
         * @param params 要求修改postData
         * @param page
         */
        reloadByPostData:function(params,page){
            //强制修改page为1
            this.reload({"postData":params,page:page||1});
        },
        destroy:function(){
            this._super();
            this.destroyFormatterComs();
        }
    });
    return BootstrapGrid;
});


