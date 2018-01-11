/**
 * @author:   * @date: 2016/1/21
 */
define(["core/js/tree/Tree"],
    function (Tree) {
        var view = Tree.extend({
            createNodeLabel:function(node,title){
                var find = node.find(".label-success");
                if(!find||find.length==0){
                    node.append("<span class='label rounded label-success pull-right'>"+title+"</span>");
                }
            },
            initialize:function(options,triggerEvent){
                var tree = this.getModuleTree("core/js/base/AbstractView");
                this.data=[tree];
                var that = this;
                this.pluginConf = {
                    expand:function(event,data){
                        _.each(data.node.children,function(item,index,list){
                            //$(node.span).append("<span class='label rounded label-success pull-right'>"+node.title+"</span>");
                            that.createNodeLabel($(item.span),item.key);
                        });
                    },
                    init:function(event,data){
                        data.tree.visit(function(node){
                            //$(node.span).append("<span class='label rounded label-success pull-right'>"+node.title+"</span>");
                            that.createNodeLabel($(node.span),node.key);
                            //node.setExpanded(true);
                        });
                    },
                },
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
