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
        data:null,
        onrender:function(){
            //初始化
            this.initTable();
            if(this.pageable){
                this.initPagination();
            }
        },
        initPagination:function(){
            var that = this;
            this.$pagination = new Pagination({
                $container:this.$el,
                totalPage:10,
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
                this.clearTbody();
                for(var i=0;i<data.length;i++){
                    var model = data[i];
                    this.addTbody(model);
                }
            }
        },
        /**
         * 根据model生成表单主体
         * @param model
         */
        addTbody:function(model){
            if(!model){
                return ;
            }
            var tbodyTr = this.$tbody.find("tr");
            var tr = $("<tr/>");
            if(_.isArray(model)){
                for(var i in model){
                    this._addTd2Tbody(tr,model[i]);
                }

            }else{
                //如果是对象,则根据colModel去读取
                for(var i in this.colModel){
                    var colM = this.colModel[i];
                    var formatter = colM.formatter;
                    var value  = null;
                    if(formatter&& _.isFunction(formatter)){
                        value = formatter(model);
                    }else{
                        value = model[colM.name];
                        if($.isBank(value)){
                            value = "";
                        }
                    }
                    this._addTd2Tbody(tr,value);
                }
            }
            this.$tbody.append(tr);
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


