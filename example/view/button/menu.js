/**
 * @author:   * @date: 2015/12/29
 */
define([ $Component.DROPDOWNMENU.src],
    function (DropDownMenu) {
        var menu = DropDownMenu.extend({
            menus:[{
                label:"操作",
                subMenu:[{
                    label:"添加",
                },{
                    label:"删除",
                },{
                    label:"修改",
                },]
            }],

        });
        return menu;
    });
