/**
 *
 * @author:   * @date: 2017/2/6
 */
define([
        "core/js/biz/BaseGrid", "core/js/controls/Button"],
    function (BaseGrid, Button) {
        var view = BaseGrid.extend({
            url: "/rest/sysconf!page.action",
            columnsUrl: "/query/getColumns.action?shortName=sysconf",
            editurl: "/rest/sysconf!oper.action?gridPlugin=jqGrid",
            postData: {outorin: 1},
            //设置成skyForm模式
            formModel: $cons.JqGrid.formModel.skyForm,
            /**
             *  添加设置校验
             *  @param  data {Array}    返回的列信息数组
             */
            initColumns: function (data) {
                //先执行父类
                this._super(data);
                //this.addRulesRequired(["id","value"]);
                this.addRules({
                    "id": {
                        required: true,
                        maxlength: 32
                    },
                    "value": {
                        required: true,
                        maxlength: 256
                    },
                    "name": {
                        maxlength: 256
                    }
                });
            },
            /**
             *
             * @param rules {Object}    校验规则
             *
             */
            addRules: function (rules) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var col = this.colModel[i];
                    var name = col.name;
                    var rule = rules[name];
                    if(rule){
                        col.editrules = rule;
                    }
                }

            },
            /**
             * 添加必输的校验
             * @param colNames  {Array}     列表中name的数组
             */
            addRulesRequired: function (colNames) {
                for (var i = 0; i < this.colModel.length; i++) {
                    var col = this.colModel[i];
                    if (_.indexOf(colNames, col.name) >= 0) {
                        //grid中的colModel是editrules
                        col.editrules = {required: true};
                    }
                }
            }
        });

        return view;
    });