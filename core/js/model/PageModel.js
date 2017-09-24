/**
 * @author:   * @date: 2016/4/7
 */
define(["underscore",
    "backbone","core/js/model/BaseModel"
], function (_, Backbone,BaseModel) {
    /**
     * @class
     * @extends {BaseModel}
     */
    var PageModel =  BaseModel.extend({
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
            return this.get("totalPage");
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
         *  获取分页的数据
         * @param currentPage   {Number}    当前的页数
         * @returns {null}
         */
        getCurrentRecords:function(currentPage){
            if(this.getSyncable()){
                //发送请求
            }else{
                if(this.getRecords()&&this.getPageSize()>this.getRecords().length){
                    return this.getRecords();
                }else{
                    var start = (currentPage-1)*this.getPageSize();
                    var end = (currentPage)*this.getPageSize();
                    return this.getRecords().slice(start, end);
                }
            }
        },
    });
    return PageModel;
})

