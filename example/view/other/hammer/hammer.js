/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/layout/Panel",
    "muuri",
    "hammerjs",
    "text!"+APP_NAME+"/resources/tmpl/hammer.html",
    "css!"+APP_NAME+"/resources/styles/hammer.css"],
    function (FluidLayout, CommonConstant,Region,Panel,Muuri,Hammer,Template) {

        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_3,
            items: null,
            initItems:function(){
                var data = [{
                    columnSize:4,
                    height:100
                },{
                    columnSize:4,
                    height:200
                },{
                    columnSize:2,
                    height:100
                },{
                    columnSize:2,
                    height:100
                },{
                    columnSize:4,
                    height:100
                },{
                    columnSize:2,
                    height:100
                },{
                    columnSize:2,
                    height:200
                },{
                    columnSize:2,
                    height:100
                },{
                    columnSize:4,
                    height:100
                },{
                    columnSize:2,
                    height:200
                },{
                    columnSize:2,
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
                this.$el.append(Template);
                // Get a reference to an element
                var square = document.querySelector('.square');

// Create a manager to manager the element
                var manager = new Hammer.Manager(square);

// Create a recognizer
                var Swipe = new Hammer.Swipe();

// Add the recognizer to the manager
                manager.add(Swipe);

// Declare global variables to swiped correct distance
                var deltaX = 0;
                var deltaY = 0;

// Subscribe to a desired event
                manager.on('swipe', function(e) {
                    deltaX = deltaX + e.deltaX;
                    var direction = e.offsetDirection;
                    var translate3d = 'translate3d(' + deltaX + 'px, 0, 0)';

                    if (direction === 4 || direction === 2) {
                        e.target.innerText = deltaX;
                        e.target.style.transform = translate3d;
                    }
                });
            }
        });

        return view;
    });

                  ''