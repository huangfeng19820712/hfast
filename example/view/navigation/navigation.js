/**
 *
 * @author:   * @date: 2017/9/24
 */
define([
        $Component.NAVIGATION.src],
    function (Navigation) {
        var view = Navigation.extend({
            data:[{
                label:"操作",
                subMenu:[{
                    label:"添加",
                    subMenu:[{
                        label:"添加1",
                    },{
                        label:"添加2",
                    },{
                        label:"添加3",
                    }]
                },{
                    label:"删除",
                },{
                    label:"修改",
                },]
            },{
               label:"按钮类"
            }]
        });

        return view;
    });
