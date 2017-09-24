/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/tree/Tree"],
    function (Tree) {
        var view = Tree.extend({
            initialize:function(options,triggerEvent){
                var tree = this.getModuleTree("core/js/base/AbstractView");
                this.data=[tree];
                this._super(options,triggerEvent);
            },
            getModuleTree:function(moduleName,arr){
                var va = window.rtree.tree[moduleName];
                var tree = {title: moduleName};
                if(!arr){
                    arr = [];
                }else{
                    if(_.contains(arr,moduleName)){
                        return false;
                    }
                }
                arr.push(moduleName);
                if(va&&va.deps&&va.deps.length>0){
                    tree.children = [];
                    tree.folder=true;
                    for(var i=0;i<va.deps.length;i++){
                        var newTree = this.getModuleTree(va.deps[i],arr);
                        if(newTree){
                            tree.children.push(newTree);
                        }else{
                            if(!tree.count){
                                tree.count = 0;
                            }
                            tree.count++;
                        }
                    }
                }
                return tree;
            },


        });
        return view;
    });
