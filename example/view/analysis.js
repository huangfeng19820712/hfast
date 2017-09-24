/**
 * @author:   * @date: 2016/1/12
 */
define(["core/js/base/BizBaseView",
        "backbone", "core/js/windows/messageBox",
        "core/js/context/ApplicationContext",
        "core/js/utils/ApplicationUtils","lib/md5"],
    function (BizBaseView, Backbone, MessageBox, ApplicationContext,ApplicationUtils,MessageDigest) {
        var View = BizBaseView.extend({
            $INIT:"data.json",
            oninitSuc:function(data){
                if(data){

                }
            },

        });
        return View;
    });
