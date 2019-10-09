/**
 * @author:   * @date: 2015/12/29
 */
define([$Component.DROPDOWNCONTAINER.src],
    function (DropDownContainer) {

        var view = DropDownContainer.extend({
            text:"test",
            item:{
                comXtype:$Component.TOOLSTRIP,
                comConf:{
                    className: "btn-group",
                    itemOptions: [{
                        roundedClass:$Rounded.ROUNDED,
                        text:"bt",
                    }]
                }
            }
        });
        return view;
    });

