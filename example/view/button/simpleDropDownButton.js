/**
 * @author:   * @date: 2015/12/29
 */
define([ $Component.DROPDOWNBUTTON.src],
    function (  DropDownButton
) {

        var view = DropDownButton.extend({
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


