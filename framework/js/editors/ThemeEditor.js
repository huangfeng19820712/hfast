/**
 * @author:   * @date: 2016/2/26
 */
define([
    "core/js/editors/DropDownEditor",
    $Component.DROPDOWNCONTAINER.src,
    "core/js/CommonConstant",
], function (DropDownEditor,DropDownContainer,CommonConstant) {
    var ThemeEditor = DropDownEditor.extend({
        xtype: $Component.THEMEEDITOR,
        placeholder:"组件主题",
        _init$Input:function(){
            this._super();
            var that = this;
            this.dropdownItem= {
                comXtype:$Component.CONTROLTHEME,
                    comConf:{
                        value:this.value,
                        onthemeSelect:function(e){
                            var skin = $(e.jqEvent.target).data("skin");
                            that.setValue(skin);
                            that.hideDropDown();
                        }
                }
            };
        }
    });

    return ThemeEditor;
})
