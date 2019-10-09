/**
 * @author:   * @date: 2016/4/7
 */
define(["core/js/model/BaseModel"
], function (BaseModel) {
    /**
     * @class
     * @extends {BaseModel}
     */
    var PageModel =  BaseModel.extend({
        xtype:$Component.PAGEMODEL,
        /**
         * 新增一条数据的事件,有两个输入参数，一个是record，一个是序号
         */
        onaddedrecord:null,
        /**
         * 修改一条数据的事件
         */
        onchangedrecord:null,
        /**
         * 删除一条数据的事件
         */
        ondeletedrecord:null,
        /**
         * 更新整个数据的事件
         */
        onrefresh:null,
        /**
         * 默认的，每次请求都上传的参数
          */
        defaultPostData:null,

        /**
         * 结束的rownumber，只有在新增的是才有此值
         */
        endRowNumber:null,

        initialize:function(options){
            this._super(options);
            this.initAttributes({
                /**
                 *记录的集合,{Array.<Object>}
                 */
                records:null,
                /**
                 *当前的页数,{Number}
                 */
                currentPage:null,
                /**
                 *总共页数,{Number}
                 */
                totalPage:null,
                /**
                 *所有的集合数,{Number}
                 */
                totalRecords:null,
                /**
                 *一页的集合大小，默认值是10,{Number}
                 */
                pageSize:10,});
        },
        /**
         *  设置记录的集合
         * @param {Array.<Object>} records
         */
        setRecords:function(records){
            this.set("records" , records);
        },
        /**
         *  获取记录的集合
         * @returns {Array.<Object>}
         */
        getRecords:function(){
            return this.get("records");
        },

        /**
         *  设置当前的页数
         * @param {Number} currentPage
         */
        setCurrentPage:function(currentPage){
            this.set("currentPage",currentPage);
        },
        /**
         *  获取当前的页数
         * @returns {Number}
         */
        getCurrentPage:function(){
            return this.get("currentPage");
        },

        /**
         *  设置总共页数
         * @param {Number} totalPage   
         */
        setTotalPage:function(totalPage){
            this.set("totalPage",totalPage);
        },
        /**
         *  获取总共页数
         * @returns {Number} 
         */
        getTotalPage:function(){
            var totalPage = this.get("totalPage");
            if(totalPage==null){
                var records = this.getRecords();
                if(records&&records.length>0){
                    totalPage = 1;
                }else{
                    totalPage = 0;
                }
            }
            return totalPage;
        },

        /**
         *  设置所有的集合数
         * @param {Number} totalRecords   
         */
        setTotalRecords:function(totalRecords){
            this.set("totalRecords" , totalRecords);    
        },
        /**
         *  获取所有的集合数
         * @returns {Number} 
         */
        getTotalRecords:function(){
            return this.get("totalRecords");
        },

        /**
         *  设置一页的集合大小，默认值是10
         * @param {Number} pageSize
         */
        setPageSize:function(pageSize){
            this.set("pageSize" , pageSize);    
        },
        /**
         *  获取一页的集合大小，默认值是10
         * @returns {Number}
         */
        getPageSize:function(){
            return this.get("pageSize");
        },
        /**
         * 获取分页相关的请求，主要是一页的数据条数，与当前页,注意请求的参数默认兼容jqgrid的参数
         * @param {Number} currentPage  当前的页数
         * @param {Object} postData     post传递到服务端的数据
         * @resturn {Object}
         */
        getPageParam:function(currentPage,postData){
            var postDataStr = null;
            if(postData){
                postDataStr = JSON.stringify(postData);
            }
            return _.extend({},this.defaultPostData,{
                "page": currentPage||this.getCurrentPage(),
                "rows": this.getPageSize(),
                "filters": postDataStr
            });
        },
        setDefaultPostData:function(defaultPostData){
            this.defaultPostData = defaultPostData;
        },
        /**
         * 从服务器获取分页的数据
         * @param {Number} currentPage  当前的页数
         */
        pageFetch:function(currentPage,postData){
            this.fetch({data:this.getPageParam(currentPage,postData)});
        },
        /**
         *  获取分页的数据
         * @param currentPage   {Number}    当前的页数
         * @returns {null}
         */
        getCurrentRecords:function(currentPage){
            this.setCurrentPage(currentPage);
            var currentRecords = null;
            if(this.getSyncable()){
                //发送请求
                this.pageFetch(currentPage);
                currentRecords = this.getRecords();
            }else{
                if(this.getRecords()&&this.getPageSize()>this.getRecords().length){
                    var currentRecords = this.getRecords();
                }else{
                    var start = this.getStart(currentPage);
                    var end = this.getEnd(currentPage);
                    var currentRecords = this.getRecords().slice(start, end);
                }
            }
            //设置当前的结束序号
            if(currentRecords){
                this.endRowNumber = this.getStart(currentPage) + currentRecords.length;
            }else{
                this.endRowNumber = this.getStart(currentPage);
            }
            return  currentRecords;
        },
        /**
         * 获取数据的开始坐标
         * @param currentPage
         * @returns {number}
         */
        getStart:function(page){
            return ((page|this.getCurrentPage())-1)*this.getPageSize();
        },
        /**
         * 获取数据的结束的坐标
         * @param page
         * @returns {number}
         */
        getEnd:function(page){
            return (page|this.getCurrentPage())*this.getPageSize();
        },
        /**
         * 新增一条数据
         */
        addRecord:function(record){
            var records = this.getRecords();
            if(records==null){
                records = [];
            }
            records.push(record);
            //只有在新增的时候，才需要设置，新增多次，累计多个序号
            //this.endRowNumber++;
            this.trigger("addedrecord",record,++this.endRowNumber);
        },
        /**
         * 修改记录，通过underscore查找出一条进来，然后用新的额记录代替
         * @param where
         * @param record
         */
        changeRecord:function(where,record){
            var oldRecord = _.findWhere(where);
            if(oldRecord){
                //覆盖属性值，只包含有的，没有的则不覆盖
                _.extendOwn(oldRecord,record);
                this.trigger("changedrecord",record)
            }
        },
    });
    return PageModel;
})

