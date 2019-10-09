/**
 * @author:   * @date: 2016/2/26
 */
define([$Component.PANEL.src,
        $Component.TOOLSTRIPITEM.src,
        "core/js/CommonConstant"],
    function (Panel,ToolStripItem,CommonConstant) {
        var view = Panel.extend({
            /*Panel的配置项 start*/
            title:"表单-",
            help:"内容",
            brief:"摘要",
            /*Panel 配置 End*/
            beforeInitializeHandle:function(){
                var items = [];
                var that = this;
                for(var i=0;i<=9;i++){
                    items.push({
                        roundedClass:$Rounded.ROUNDED,
                        text:i.toString(),
                        onclick:function(){
                            var editor = that.getEditor();
                            editor.setValue(this.text);
                            editor.hideDropDown();
                        }
                    })
                }
                this.mainRegion={
                    comXtype:$Component.DROPDOWNEDITOR,
                    comConf:{
                        placeholder:"查询",
                        dropdownItem:{
                            comXtype:$Component.TOOLSTRIP,
                            comConf:{
                                spacing: CommonConstant.Spacing.DEFAULT,
                                className: "btn-group",
                                itemOptions: items
                            }
                        }
                    }
                };
            },
            getEditor:function(){
                return this.getMainRegionRef().getComRef();
            }
        });

        return view;
    });