/**
 * @author:   * @date: 2016/2/20
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant", "core/js/view/Region",],
    function (FluidLayout, CommonConstant, Region) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_4,
            initialize:function(){
                this.items = [];
                for(var item in $Theme){
                    var theme = $Theme[item];
                    this.items.push({
                        comXtype:$Component.TABLAYOUT,
                        comConf:{
                            theme:theme,
                            tabs:[{
                                label:"test1",
                                content:'<h1>Nikola Tesla</h1>'
                            },{
                                label:"test2",
                                content:'<h1>Albert Einstein</h1>'
                            }]
                        },
                    });
                };
                this._super();
            }
        });
        return view;
    });
