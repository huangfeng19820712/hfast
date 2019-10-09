/**
 * @author:   * @date: 2015/12/7
 */
define(["core/js/layout/FluidLayout",
       ],
    function (FluidLayout) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            initItems:function(){
                var theme = "";
                this.items = [ {
                    comXtype:$Component.CHATBOX,
                    comConf:{
                        data:{
                            name:"张三",
                            content:"你好吗？" ,
                            sendTime:new Date()
                        }
                    }
                },{
                    comXtype:$Component.CHATBOX,
                    comConf:{
                        floatMode:$Component.CHATBOX.floatMode.right,
                        data:{
                            name:" 李四",
                            content:"我很好啊！" ,
                            sendTime:new Date()
                        }
                    }
                }];
            },
        });

        return view;
    });
