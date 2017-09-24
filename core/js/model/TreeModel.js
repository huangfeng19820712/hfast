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
    var TreeModel =  BaseModel.extend({
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
        }
    });
    return PageModel;
})

