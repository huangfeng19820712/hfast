/**
 * @author:   * @date: 2016/1/16
 */
define(["jquery",
    "underscore",
    "core/js/controls/Control",
    "core/js/grid/Pagination",
    "core/js/model/PageModel",
    "core/js/utils/Utils"
], function ($, _, Control,Pagination,PageModel) {

    var BootstrapGrid = Control.extend({
        xtype:$Component.BOOTSTRAPGRID,
        className:"bootstrapGrid table-responsive",
        $table:null,
        $thead:null,
        $tbody:null,
        $url:null,
        $pagination:null,
        model:null,//new PageModel(),
        /**
         * [{
         *      name:null   //字段的唯一表示
         *      label：null      //显示的列标题
         *
         * }
         * ]
         */
        colModel:null,
        /**
         * json的解析器
         * {
         *      currentPage：[选填]<当前页面，默认值是1>
         *
         * }
         */
        jsonReader:null,
        /**
         * 是否可分页，默认值是ture
         */
        pageable:true,
        /**
         * 模式，应用$cons.PaginationMode中的模式
         */
        paginationMode:$cons.PaginationMode.FULL,
        data:null,
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
        mountContent:function(){
            //初始化
            this.initTable();
            if(this.pageable){
                var totalPage = 10;
                if(this.model){
                    totalPage = this.model.getTotalPage();
                }
                this.initPagination(totalPage);
            }
        },
        initPagination:function(totalPage){
            var that = this;
            this.$pagination = new Pagination({
                $container:this.$el,
                totalPage:totalPage,
                mode:this.paginationMode,
                onpage:function(context,currentPage){
                    that.createTbody(currentPage);
                }
            });
        },
        /**
         * 初始化表格
         */
        initTable:function(){
            this.$table = $($Template.Grid.DEFAULT);
            this.$table.addClass("table table-hover table-striped table-responsive table-bordered");
            this.$thead = this.$table.find("thead");
            this.$thead.append("<tr/>");
            this.$tbody = this.$table.find("tbody");
            this.createThead();
            this.createTbody(1);
            this.$el.append(this.$table);

            var that = this;
            //添加点击事件
            this.$el.find("tbody>tr").on("click",function(e){
                $(e.target).parent().siblings().removeClass("active");
                $(e.target).parent().addClass("active");
                var id = $(e.currentTarget).data(that.getPrimaryKeyName());
                that.trigger("select",e,that.getRecordById(that._records,id));
            });

        },
        /**
         * 创建thead
         */
        createThead:function(){
            if(this.colModel){
                for(var i =0;i<this.colModel.length;i++){
                    var model = this.colModel[i];
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
            theadTr.append("<th>"+model.label+"</th>");
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
            if(data){
                this._records = data;
                this.clearTbody();
                for(var i=0;i<data.length;i++){
                    var record = data[i];
                    this.addTbody(record);
                }
            }
        },
        /**
         * 根据model生成表单主体
         * @param record
         */
        addTbody:function(record){
            if(!record){
                return ;
            }
            var tbodyTr = this.$tbody.find("tr");
            var tr = $("<tr/>");

            if(_.isArray(record)){
                var findIndex = _.findIndex(this.colModel, {"key": true});
                tr.data(this.getPrimaryKeyName(),record[findIndex]);
                for(var i in record){
                    this._addTd2Tbody(tr,record[i]);
                }

            }else{
                tr.data(this.getPrimaryKeyName(),this.getPrimaryKeyValue(record));
                //如果是对象,则根据colModel去读取
                for(var i in this.colModel){
                    var colM = this.colModel[i];
                    var formatter = colM.formatter;
                    var value  = null;
                    if(formatter&& _.isFunction(formatter)){
                        value = formatter(record);
                    }else{
                        value = record[colM.name];
                        if($.isBank(value)){
                            value = "";
                        }
                    }
                    this._addTd2Tbody(tr,value);
                }
            }

            this.$tbody.append(tr);
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
         * 根据id获取记录信息
         * @return {Object}
         */
        getRecordById:function(data,id){
            var obj = {};
            obj[this.getPrimaryKeyName()] = id;
            return _.find(data,obj);
        },

        _addTd2Tbody:function(tr,value){
            tr.append("<td>"+value+"</td>");
        },
        /**
         * 晴空Tbody
         */
        clearTbody:function(){
            this.$tbody.empty();
        },
        destroy:function(){
            this.model = null;
            this._super();
        }
    });
    return BootstrapGrid;
});


