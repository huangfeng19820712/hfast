/**
 *
 * @author:   * @date: 2017/9/24
 */
define([
        $Component.NAVIGATIONBAR.src,
        "core/js/utils/ApplicationUtils",
        "core/js/base/BaseViewModel",],
    function (NavigationBar,ApplicationUtils,BaseViewModel) {

        var view = BaseViewModel.extend({
            $INIT: "/"+ CONFIG.appName+"/menu.json",
            mountContent:function(){
                var applicationContext = ApplicationUtils.getApplicationContext();
                var ajaxClient = applicationContext.getAjaxClient();
                var defaultMenuDates, menuDates ;
                var that = this;
                ajaxClient.buildClientRequest(this.$INIT)
                    .post(function (compositeResponse) {
                        var obj = compositeResponse.getSuccessResponse();
                        if (obj) {
                            defaultMenuDates = obj.menus;
                            menuDates = obj.menus;
                            var menus = that.getMenus(menuDates);
                            that.rendNavBar(menus);
                        }
                    }, false);
                /*var that = this;
                 ajaxClient.buildClientRequest(fieldUrl)
                 .addParams(postParam)
                 .post(function (compositeResponse) {
                 var obj = compositeResponse.getSuccessResponse();
                 if (obj&&obj.result) {
                 that.rendForm(obj.result);
                 }
                 });*/
            },

            rendNavBar:function(data){
                var view = new NavigationBar({
                    $container:this.$el,
                    parent:this,
                    items:[{
                        comXtype:$Component.NAVIGATION,
                        comConf:{
                            data:data
                        }
                    }]
                });
            },
            /**
             *
             * @param menuDates
             * @returns {Array}
             * <code>
             * [{
             *      code:"<必选>[唯一编码，单应用中的路由使用]"，
             *      id:"<必选>[唯一编码]"，
             *      name:"<必选>[显示的名称]"，
             *      order:"<可选>[排序使用]"，
             *      subMenu:"<可选>[子菜单]"，
             *      type:"<必选>[菜单的类型]"，
             *      url:"<可选>[菜单路径]"，
             *      visiable:"<可选>[是否要显示]"
             * },...]
             * </code>
             */
            getMenus: function (menuDates) {
                //过滤掉不可见的菜单
                menuDates = _.where(menuDates,{visible:'1'});

                var menus = {};
                var noDealIds = new Array();
                _.each(menuDates, function (menuDate, key, list) {
                    menus[menuDate.id] = menuDate;
                    menus[menuDate.id].subMenu = null;
                    //设置label的值
                    menus[menuDate.id].label = menus[menuDate.id].name;
                    if (menuDate.pid != null) {
                        var menu = menus[menuDate.pid];
                        if (menu != null) {
                            if(menu.subMenu==null){

                                menu.subMenu = new Array();
                            }
                            menu.subMenu.push(menus[menuDate.id]);
                        } else {
                            noDealIds.push(menuDate.id);
                        }
                    }
                });
                /**
                 * 处理之前未处理的菜单数据
                 */
                for (var i = 0; i < noDealIds.length; i++) {
                    var id = noDealIds[i];
                    var pid = menus[id].pid;
                    if($.isNotBank(pid)&&menus[pid]){
                        //pid非空
                        if (!menus[pid].subMenu) {
                            menus[pid].subMenu = new Array();
                        }
                        menus[pid].subMenu.push(menus[id]);
                    }
                }
                /**
                 * 获取，pid为空的菜单
                 */
                var doneMenus = new Array();
                for (var i in menus) {
                    if (!menus[i].pid) {
                        doneMenus.push(menus[i]);
                    }
                }
                return doneMenus;
            },
            onshow:function(){
                console.info(">>>")
            },
            onrender:function(){
                console.info(">>>")
            }
        });




        return view;
    });
