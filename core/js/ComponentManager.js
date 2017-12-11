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
        /**
         * 获取所有的组件
         * @returns {null}
         */
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
         * 获取子组件
         * @param component
         * @param xtype
         * @returns {Array}
         */
        getChildrenComponent:function(component,xtype){
            var result = [];
            var className =  ".hfast-view";
            if(xtype){
                className+="."+ xtype.name.toLowerCase();
            }
            var compoents = component.$el.find(className);
            _.each(compoents,function(item,index,list){
                result.push($(item).data("control"));
            });
            return result;
        }

    });

    return ComponentManager;
});