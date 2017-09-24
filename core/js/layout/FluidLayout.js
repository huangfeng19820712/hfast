/**
 * @module 瀑布流布局[FluidLayout]
 *
 *
 * @author:   * @date: 2015/12/15
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
], function ($, CommonConstant, Container) {
    var FluidLayout = Container.extend({
        xtype:$Component.FLUIDLAYOUT,
        /**
         * 容器中分的列数，系统会自动分为最多12列,所有次数最好能被12整除，
         * 如果defaultColumnSize为null，则整除totalColumnNum后的栏位大小会设置会修改defaultColumnSize的值
         */
        totalColumnNum:null,
        /**
         * 默认的栏位大小
         */
        defaultColumnSize:null,
        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        beforeInitializeHandle:function(options, triggerEvent){
            this._super();
            if(this.defaultColumnSize!=null){
                this._defaultRegionClassName = this.defaultColumnSize;
            }else{
                if(this.totalColumnNum){
                    this._defaultRegionClassName = $cons.fluidLayoutClassnamePre+Math.floor(12 / this.totalColumnNum);
                }else{
                    this._defaultRegionClassName = $Column.COL_MD_12;
                }
            }

        },

        /*-------------------------------  初始化及私有方法 start ---------------------------------------------------*/
        /**
         * 根据id，返回流布局中的对象
         * @param id
         * @returns {*}
         */
        getComponent:function(id){
            var region = this.getRegion(id);
            if(region){
                return region.getComRef();
            }else{
                return null;
            }
        },
        /**
         * 根据数组的下标找到组件
         */
        getComponentByIndex:function(index){
            var allRegions = this.getAllRegions();
            if(allRegions){

                var values = _.values(allRegions);
                if(values&&values[index]&&values[index].getComRef()){
                    return values[index].getComRef();
                }
            }
            return null;
        }
    });
    return FluidLayout;
});
