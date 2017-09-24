/**
 * @author:   * @date: 2016/1/7
 */
define(["jquery",
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "core/js/view/Region","core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem",
    "core/js/controls/HelpLink",
     "core/js/utils/Utils"
], function ($, CommonConstant, Container,
             Region,ToolStrip,ToolStripItem,HelpLink,Utils) {
    var DropDownContainer = Container.extend({
        xtype:$Component.DROPDOWNCONTAINER,
        item:null,
        text:null,
        className:"btn-group",
        btnTheme:ToolStripItem.ThemeClass.DEFAULT,
        dropdownButton:null,
        mainButton:null,
        dropDownRegionId:null,
        dropDownWidth:null,
        dropDownHeight:null,
        mountContent:function(){
            // this._super();
            //清理Layout父类中的模板内容
            this.$el.empty();
            //在按钮后面添加下拉框的内容,主要是是对this.$el进行操作
            var that = this;
            this.mainButton = new ToolStripItem({
                text:this.text,
                $container:this.$el,
                themeClass:this.btnTheme,
            });
            this.dropdownButton = new ToolStripItem({
                text:null,
                $container:this.$el,
                themeClass:[this.btnTheme,"dropdown-toggle"].join(" "),
                onclick: $.proxy(that.showDropDownRegion,that),
            });
            this.dropdownButton.$el.append('<span class="caret"></span>')
                .append('<span class="sr-only">Toggle Dropdown</span>');
            this.$el.append(this.initDropDownEL());
            this.regionsRender();
        },
        initDropDownEL:function(){
            var dropDownEl = $('<div id="'+this.getDropDownRegionId()+'" class="dropdown-menu" role="menu"/>');
            if(this.dropDownWidth){
                dropDownEl.css("width", this.dropDownWidth);
                dropDownEl.css("min-width", 0);
            }
            if(this.dropDownHeight){
                dropDownEl.css("height", this.dropDownHeight);
            }
            return dropDownEl;
        },
        showDropDownRegion:function(e){
            e.jqEvent.stopPropagation();
            var that = this;
            var eventName= "mousedown.close-drop-down."+that.getDropDownRegionId();
            $("body").on(eventName, function (bodyEvent) {
                //关闭的事件
                if($(bodyEvent.target).closest("#"+that.getDropDownRegionId()).length === 0){
                    var dropDownDiv = that.$("#"+that.getDropDownRegionId());
                    dropDownDiv.hide();
                    $("body").off(eventName);
                }
            });
            var dropDownDiv = this.$("#"+this.getDropDownRegionId());
            dropDownDiv.show();
        },
        initItems:function(){
            if(this.item){
                this.item['id']=this.getDropDownRegionId();
                this.items=[this.item];
            }
        },
        getDropDownRegionId:function(){
            if(!this.dropDownRegionId){
                this.dropDownRegionId = $.createId("dropDownRegion");
            }
            return this.dropDownRegionId;
        }
    });
    return DropDownContainer;
});