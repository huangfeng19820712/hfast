/**
 * @author:   * @date: 15-8-17
 */
define(["core/js/controls/AbstractControlView"],
    function (AbstractControlView) {
        var View = AbstractControlView.extend({
            xtype:$Component.BREADCRUMBS,
            /**
             * 显示的面包屑路径，
             * 从子节点一直到父节点，
             */
            menuDates: null,
            /**
             * 菜单对象
             */
            menuRef:null,
            /**
             * 面包屑的名称
             */
            name:null,
            /**
             * 需要配置模板
             */
            template:null,
            code:null,
            initializeHandle:function(option){
                this.code = this.code||Backbone.history.fragment;
                //this.setBreadcrumbsData(this.menuDates);
                this.setBreadcrumbsByCode(this.code);
            },
            setBreadcrumbs: function (menuDates) {
                this.menuDates = menuDates;
                this.setBreadcrumbsData(menuDates);
                return this;
            },
            /**
             * 设置模板的数据
             * @param menuDates
             */
            setBreadcrumbsData:function(menuDates){
                this.setName();
                this.data = {name:this.name,menuDates:menuDates}
            },
            setName:function(){
                if(_.isArray(this.menuDates)&&this.menuDates.length>0){
                    var menu = this.menuDates[this.menuDates.length-1];
                    this.name = menu.name;
                }
            },
            mountContent:function(){
                this._super();
                /*this.code = this.code||Backbone.history.fragment;
                 this.setBreadcrumbsByCode(this.code);*/
                //this.setBreadcrumbsByCode(this.code);
                if($.isBank(this.code)){
                    //如果没有code，则清空面包屑的内容
                    this.$el.empty();
                }
            },
            /**
             * 根据菜单编码设置面包屑
             * @param code
             */
            setBreadcrumbsByCode: function (code) {
                this.code = code;
                var menuDates = this.menuRef.getMenuDates();
                var menu = _.findWhere(menuDates, {url: code});
                if (_.isObject(menu)) {
                    var result = new Array();
                    result.push(menu);
                    this.getMenuParent(result,menuDates,menu);
                    //反转result
                    this.setBreadcrumbs(result.reverse());
                }
                return this;
            },
            getMenuParent: function (result,menuDates, menu) {
                var newMenu = _.findWhere(menuDates,{id:menu.pid});

                if(_.isObject(newMenu)){
                    result.push(newMenu);
                    this.getMenuParent(result,menuDates, newMenu);
                }
            }

        });
        return View;
    });