/**
 * 组件管理器，统一管理所以组件的引用
 * @author:   * @date: 2016/2/27
 */

define(["underscore", "core/js/Class"], function (_, Class) {
    var ComponentManager = Class.extend({
        components:null,
        /**
         * 添加组件
         */
        addComponent:function(id,component){
            if(!id||!component){
                return ;
            }
            this.getComponents()[id] = component;
        },
        getComponents:function(){
            if(!this.components){
                this.components = {};
            }
            return this.components;
        },
        /**
         * 获取组件对象
         * @param id
         * @returns {*}
         */
        getComponentById:function(id){
            if(!id){
                return ;
            }
            return this.getComponents()[id]
        },
        /**
         * 根据xtype类型获取所有的组件
         * @param xtype
         * @Array
         */
        getComponentByXtype:function(xtype){
            var result = [];
            _.each(this.getComponents(),function(item,index,list){
                if(xtype===item.xtype){
                    result.push(item);
                }
            });
            return result;
        },
        /**
         * 删除组件
         * @param id
         */
        removeComponent:function(id){
            this.getComponents()[id] = null;
            delete this.getComponents()[id];
        },
        /**
         * 获取所有的
         */
        getAllComponent:function(){
            return this.components;
        }

    });

    return ComponentManager;
});