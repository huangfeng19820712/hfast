/**
 *
 * @author:   * @date: 2017/9/24
 */
define([
        $Component.NAVIGATIONBAR.src,
        $Component.TOOLSTRIPITEM.src,
        $Component.DROPDOWNMENU.src,
        $Component.MENU.src,
        "core/js/utils/ApplicationUtils",
        "core/js/base/BaseViewModel",],
    function (NavigationBar,ToolStripItem,DropDownMenu,Menu,ApplicationUtils,BaseViewModel) {

        var view = BaseViewModel.extend({
            mountContent:function(){
                this.rendNavBar();
            },

            rendNavBar:function(){
                var view = new NavigationBar({
                    $container:this.$el,
                    items:[this.navigationOption(),
                        this.formOption(),
                        this.dropDownMenuOption()
                        ]
                });
            },
            formOption: function () {
              return {
                  comXtype:$Component.NAVFORMEDITOR,
                  //左边浮动
                  className:"pull-left",
                  comConf:{
                      fields:[
                          {
                              isShowLabel:false,
                              placeholder: "文本",
                              name: "text",
                              editorType: $Component.TEXTEDITOR,
                              rules: {
                                  required: true,
                                  maxlength: 20,
                              },
                          },{
                              isShowLabel:false,
                              placeholder:"时间",
                              name:"datetime",
                              editorType:$Component.DATETIMEEDITOR,
                              //className:"col col-md-6 ",
                              colspan:2
                          },{
                              isShowLabel:false,
                              placeholder:"日期",
                              name:"date",
                              editorType:$Component.DATEEDITOR,
                              //className:"col col-6",
                              colspan:4
                          },{
                              isShowLabel:false,
                              placeholder:"选择",
                              name:"select",
                              editorType:$Component.SELECTEDITOR,
                              options:[{
                                  value:"1",
                                  label:"选择一"
                              },{
                                  value:"2",
                                  label:"选择二",
                                  disabled:true
                              },{
                                  value:"3",
                                  label:"选择三"
                              },{
                                  value:"4",
                                  label:"选择四"
                              }],
                              rules: {
                                  required: true,
                              },
                          },{
                              isShowLabel:false,
                              placeholder:"数字",
                              name:"number",
                              editorType:$Component.TOUCHSPINEDITOR,
                              rules: {
                                  required: true,
                              },
                          }
                      ],
                      toolStripConf:{
                          itemOptions: [{
                              //roundedClass:$Rounded.ROUNDED,
                              iconSkin:"fa-search",
                              text: "查询",
                              title:'查询',
                              themeClass:ToolStripItem.ThemeClass.PRIMARY,
                              onclick: function () {
                                  var allFieldValue = this.getParent().getParent().getAllFieldValue();
                                  console.info(allFieldValue)
                                  $.window.alert("值在console中");
                              }
                          }]
                      }
                  }
              };
            },
            /**
             * 菜单配置
             */
            navigationOption:function(){
                return {
                    comXtype:$Component.NAVIGATION,
                    //右边浮动
                    className:"pull-left",
                    comConf:{
                        data:[{
                            label:"操作",
                            subMenu:[{
                                label:"添加",
                                subMenu:[{
                                    label:"添加1",
                                },{
                                    label:"添加2",
                                },{
                                    label:"添加3",
                                }]
                            },{
                                label:"删除",
                            },{
                                label:"修改",
                            },]
                        }]
                    }
                };
            },
            dropDownMenuOption:function(){
                return {
                    comXtype:$Component.DROPDOWNMENU,
                    className:"pull-right",
                    comConf:{
                        layout:DropDownMenu.layout.right,
                        className:"navbar-btn",
                        iconSkin:"fa-bars",
                        menus:[{
                            label:"操作"
                        },Menu.SEPARATOR],
                    }
                };
            },
        });
        return view;
    });
