/**
 * @author:   * @date: 2016/1/7
 */
define([
    "core/js/CommonConstant",
    "core/js/layout/Container",
    "core/js/view/Region","core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem",
    "core/js/controls/HelpLink",
     "core/js/utils/Utils"
], function ( CommonConstant, Container,
             Region,ToolStrip,ToolStripItem,HelpLink,Utils) {
    var DropDownContainer = Container.extend({
        xtype:$Component.DROPDOWNCONTAINER,
        item:null,
        text:null,
        className:"btn-group",
        btnTheme:ToolStripItem.ThemeClass.DEFAULT,
        dropdownButton:null,
        mainButton:null,
        mainButtonConf:null,
        mainIconSkin:null,
        dropDownRegionId:null,
        dropDownWidth:null,
        dropDownHeight:null,
        layout:null,
        /**
         * 主要按钮的处理事件
         */
        mainButtonHandle:null,
        /**
         * 判断是否显示，默认是不显示
         */
        isShown:false,
        mountContent:function(){
            // this._super();
            //清理Layout父类中的模板内容
            this.$el.empty();
            //在按钮后面添加下拉框的内容,主要是是对this.$el进行操作
            var that = this;
            if(!this.mainButton){
                if(!this.mainButtonConf){
                    this.mainButtonConf = {
                        text:this.text,
                        iconSkin:this.mainIconSkin,
                        $container:this.$el,
                        parent:this,
                        themeClass:this.btnTheme,
                        onclick:$.proxy(this.mainButtonHandle,that),
                    };
                }
                this.mainButton = new ToolStripItem(this.mainButtonConf);
            }
            this.dropdownButton = new ToolStripItem({
                text:null,
                parent:this,
                $container:this.$el,
                iconSkin:CommonConstant.Icon.CARET_DOWN,
                themeClass:[this.btnTheme,"dropdown-toggle"].join(" "),
                onclick: $.proxy(that.showDropDownRegion,that),
            });
            /*this.dropdownButton.$el.append('<span class="caret"></span>')
                .append('<span class="sr-only">Toggle Dropdown</span>');*/
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

            if(this.layout){
                dropDownEl.addClass(this.layout);
            }
            return dropDownEl;
        },

        showDropDownRegion:function(e){
            e.jqEvent.stopPropagation();
            var rotateClassName = "fa-rotate-180";
            if(!this.isShown){
                this.isShown = true;
                //添加class
                e.target.$el.find("i").addClass(rotateClassName);
            }else{
                this.hideDropDown();
                return ;
            }
            var that = this;
            var eventName= "mousedown.close-drop-down."+that.getDropDownRegionId();
            $("body").one(eventName, function (bodyEvent) {
                //关闭的事件
                if($(bodyEvent.target).closest("#"+that.getDropDownRegionId()).length === 0){
                    //如果是点击按钮，则不修改isShown属性
                    var isContain = $.contains(e.target.$el[0], bodyEvent.target );
                    //默认是不要设置isShown属性
                    var notSetShow = true;
                    if(bodyEvent.target.id!=e.target.getId()&&!isContain){
                        //that.isShown = false;
                        //不点击按钮，才设置
                        notSetShow = false;
                        //that.isShown = false;
                        //console.info(bodyEvent.target.id+">>"+that.getDropDownRegionId()+">>"+isContain+">>>"+bodyEvent.target+":"+that.isShown);
                    }
                    that.hideDropDown(notSetShow);
                    $("body").off(eventName);
                }
            });
            var dropDownDiv = this.$("#"+this.getDropDownRegionId());
            dropDownDiv.show();
        },
        /**
         * 隐藏下拉框内容
         */
        hideDropDown:function(notSetShow){
            var rotateClassName = "fa-rotate-180";
            this.getDropDownRegion$el().hide();
            //默认是设置的，只有明确说不设置，才不设置
            if(!notSetShow){
                this.isShown = false;
            }
            this.$el.find("i").removeClass(rotateClassName);
        },
        getDropDownRegion$el:function(){
            return this.$("#"+this.getDropDownRegionId());
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

    DropDownContainer.layout = {
        downLeft:"",
        downRight:"dropdowncontainer-down-right",
        upLeft:"",
        upRight:"",
    }
    return DropDownContainer;
});