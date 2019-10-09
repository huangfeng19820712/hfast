/**
 * @author:   * @date: 2016/3/25
 */
define([
    "core/js/CommonConstant",
    "core/js/editors/Editor",
    "icheck"
], function (CommonConstant, Editor) {
    var CheckboxEditor = Editor.extend({
        xtype:$Component.CHECKBOXEDITOR,
        /**
         * 对象或者是数组
         * [{
         *      label:[选项的标题]<必选>
         *      value：[选择的值,提交到服务器的值]<可选>
         * }...]
         */
        items:null,
        dataPre:$cons.dataPre,
        template:$Template.Checkbox.DEFAULT,
        model: $cons.checkbox.Model.SQUARE,
        /**
         * key为checkbox的value，value的值为$controlGroup
         */
        _controlGroupMap:null,
        /**
         * 函数的输入参event
         * event.jqEvent    为jquery的事件对象
         * event.target     为此对象
         * event.type       "checked"
         */
        onchecked:null,
        /**
         * 函数的输入参event
         * event.jqEvent    为jquery的事件对象
         * event.target     为此对象
         * event.type       "unchecked"
         */
        onunchecked:null,
        _init$Input:function(){
            //this.$controlGroup = $(this.controlGroupEl||this.eTag);

            if(this.isShowLabel){
                this._init$Label();
                this.$el.append(this.$label);   //添加输入框
            }
            this.init$controlGroup();
            this.initItems(this.$controlGroup);
            //this.$el.append(this.$controlGroup);
        },
        /**
         * 初始化输入框
         * @param container 容器的jquery对象
         */
        initItems:function(container){
            var that = this;
            _.each(this.items,function(item,key){
                container.append(that.createCheckboxContent(item));
            });
        },
        createCheckboxContent:function(item){
            var context = _.extend({},item,{
                name:this.name,
                displayValue:item.displayValue==null?item.value:item.displayValue
            });
            return _.template(this.template,{variable: this.dataPre})( context);
        },
        _initWithPlugIn:function(){
            var theme = this.theme;
            if(this.theme==null||this.theme== $Theme.DEFAULT){
                theme = $Theme.GREEN;
            }
            var checkboxClass = 'icheckbox_'+this.model.toLowerCase()+"-"+theme;
            var radioClass = 'iradio_'+this.model.toLowerCase()+"-"+theme;
            var that = this;
            if(this.model== $cons.checkbox.Model.LINE){
                this.$("input").each(function(){
                    var self = $(this),
                        label = self.next(),
                        label_text = label.text();
                    label.remove();

                    self.on("ifChecked",function(event){
                        that.trigger("checked",event);    //触发打击操作
                    }).on("ifUnchecked",function(event){
                        that.trigger("unchecked",event);    //触发打击操作
                    }).iCheck({
                        checkboxClass: checkboxClass,
                        radioClass: radioClass,
                        insert: '<div class="icheck_line-icon"></div>' + label_text,

                    });
                });
            }else{
                this.$("input").on("ifChecked",function(event){
                    that.trigger("checked",event);    //触发打击操作
                }).on("ifUnchecked",function(event){
                    that.trigger("unchecked",event);    //触发打击操作
                }).iCheck({
                    checkboxClass: checkboxClass,
                    radioClass: radioClass,
                    increaseArea: '20%' // optional
                });
            }

        },
        _setValueAndDisplayValue:function(value, displayValue, needTranslate, triggerEvent){
            this._super(value, displayValue, needTranslate,false);
            //把所有的的checkbox状态设置成uncheck
            this.seAllUnchecked();
            if(value!=null){
                if(value.indexOf(",")>=0){
                    var values = value.split(",");
                    for(var i in values){
                        this.$("[value='"+values[i]+"']").iCheck('check');
                    }
                }else{
                    this.$("[value='"+value+"']").iCheck('check');
                }
            }
        },
        /**
         * 设置为都未选中的状态
         */
        seAllUnchecked:function(){
            this.$("input").iCheck('uncheck');
        },

        getValue:function(){
            var checkboxes = this.$(".checked>input");
            var values = [];
            for(var i=0;i<checkboxes.length;i++){
                var checkbox = checkboxes[i];
                values.push(checkbox.value);
            }
            return values.join(",");
        },
        destroy:function(){
            this.$("input").iCheck('destroy');
            this._super();
        }
    });
    return CheckboxEditor;
});



