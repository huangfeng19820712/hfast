/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
    "muuri",
    "hammerjs",
    "text!"+APP_NAME+"/resources/tmpl/mosaic.html",
    "css!"+APP_NAME+"/resources/styles/mosaic.css"],
    function (FluidLayout, CommonConstant,Region,Panel,Muuri,Hammer,Template) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_3,
            items: null,
            initItems:function(){
                var data = [{
                    columnSize:4,
                    //padding:"15px 15px 0 15px",
                    height:100
                },{
                    columnSize:4,
                    height:200
                },{
                    columnSize:4,
                    height:100
                },{
                    columnSize:3,
                    height:100
                },{
                    columnSize:4,
                    height:100
                },{
                    columnSize:3,
                    height:100
                },{
                    columnSize:3,
                    height:200
                },{
                    columnSize:3,
                    height:100
                },{
                    columnSize:4,
                    height:100
                },{
                    columnSize:3,
                    height:200
                },{
                    columnSize:3,
                    height:100
                }];
                this.items = [];
                var that = this;
                _.each(data,function(item,index,list){
                    that.items.push(that.createItem(item.columnSize,item.height));
                });
            },
            createItem:function(columnSize,height){
                var pre = $cons.fluidLayoutClassnamePre;
                return {
                    comXtype:$Component.PANEL,
                    columnSize: pre+columnSize,
                    comConf:{
                        height:height,
                        //isShowHeader:false,
                        title: "定义的矩形",
                        theme: $Theme.BLUE,
                        mainRegion: {
                            content:">"+columnSize+">"+                   height,
                        }
                    }
                };
            },
            mountContent:function(){
                this._super();

                this.$el.sortable({
                    //通过时间延迟和距离延迟来防止意外的排序。
                    delay: 300,
                    //cursor: "move",
                    //placeholder: "portlet-placeholder" ,
                    items:">.region.hfast-container",
                    opacity :"0.6",
                    change:function(event,ui){
                        ui.placeholder.height(ui.item.height());
                        ui.placeholder.css("visibility","visible")

                    },
                    beforeStop:function(event,ui){
                        console.info("change>>");
                    },
                    stop: function(event, ui) {
                        console.info("change>>");
                    }
                }).disableSelection(); //禁用选择匹配的元素集合内的文本内容。
            }
        });

        return view;
    });

                  ''