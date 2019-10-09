/**
 * @author:   * @date: 2016/2/26
 */
define([
    "core/js/editors/Editor",
    $Component.DROPDOWNCONTAINER.src,
    "core/js/CommonConstant",
], function (Editor,DropDownContainer,CommonConstant) {
    var DropDownEditor = Editor.extend({
        xtype: $Component.DROPDOWNEDITOR,
        _dropdownPlugin:null,
        readOnly:true,
        /**
         * 下拉展示的组件
         */
        dropdownItem:null,
        controlGroupClass:"input-group",
        _init$Input: function () {
            //初始化input对象
            if (!this.$input) {
                this.$input = $($Template.Input.SIMPLE);
            }
            this._super();
            //this.$el.addClass("input-group");
        },
        _initWithPlugIn:function(){
            if(this.disabled){
                return ;
            }
            var that = this;
            this._dropdownPlugin = new DropDownContainer({
                $container:this.$controlGroup,
                parent:this,
                className:"input-group-btn",
                mainIconSkin:CommonConstant.Icon.CLOSE,
                layout:DropDownContainer.layout.downRight,
                item:this.dropdownItem,
                mainButtonHandle:function(event){
                    that.setValue();
                }
            });
            //this._initEvents();
        },
        hideDropDown:function(){
            this._dropdownPlugin.hideDropDown()
        }
    });

    return DropDownEditor;
})
