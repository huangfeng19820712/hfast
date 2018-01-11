
/**
 * @author:   * @date: 15-8-17
 */
define(["core/js/base/BaseView",
        "backbone",
        "core/js/utils/ApplicationUtils",
        "text!lib/hyfast-unify/tmpl/breadcrumbs.html"],
    function (BaseView, Backbone, ApplicationUtils, temple) {
        var View = BaseView.extend({
            /**
             * 显示的面包屑路径，
             * 从子节点一直到父节点，
             */
            menuDates: null,
            /**
             * 面包屑的名称
             */
            name:null,
            render: function (container, triggerEvent) {
                this.initClass();
                if(_.isArray(this.menuDates)&&this.menuDates.length>0){
                    var menu = this.menuDates[this.menuDates.length-1];
                    this.name = menu.name;
                }
                var content = _.template(temple,{variable: 'data'})({name:this.name,menuDates:this.menuDates});
                this.$el.html(content);
                this.$(".refresh").on("click",this.refreshContent);
            },
            /**
             * 刷新内容
             * @param event
             */
            refreshContent:function(event){
                var applicationRouter = ApplicationUtils.getApplicationContext().getApplicationRouter();
                applicationRouter.refresh();
                /*
                var region = ApplicationUtils.getMainRegion();
                region.refresh();*/
            },
            setBreadcrumbs: function (menuDates) {
                this.menuDates = menuDates;
                this.render();
            },
            /**
             * 根据菜单编码设置面包屑
             * @param code
             */
            setBreadcrumbsByCode: function (code) {
                var applicationContext = ApplicationUtils.getApplicationContext();
                var application = applicationContext.getApplication();
                var menuObj = application.getMenu();
                var menuDates = menuObj.getMenuDates();
                var menu = _.findWhere(menuDates, {url: code});
                if (_.isObject(menu)) {
                    var result = new Array();
                    result.push(menu);
                    this.getParent(result,menuDates,menu);
                    //反转result
                    this.setBreadcrumbs(result.reverse());
                }else{
                    //如果没有code，则清楚面包屑的内容
                    this.$el.empty();
                }
            },
            getParent: function (result,menuDates, menu) {
                var newMenu = _.findWhere(menuDates,{id:menu.pid});

                if(_.isObject(newMenu)){
                    result.push(newMenu);
                    this.getParent(result,menuDates, newMenu);
                }
            }

        });
        return View;
    });