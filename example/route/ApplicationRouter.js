/**
 * @author:   * @date: 2015/9/17
 */
define(["underscore",
    "backbone",
    "core/js/base/BaseRouter",
    "core/js/utils/ApplicationUtils",
    "core/js/utils/Utils"

], function (_, Backbone, BaseRouter, ApplicationUtil, Utils) {
    var ApplicationRouter = BaseRouter.extend({
        routes: {
            "/posts/:id": "getPost",
            "/download/*path": "downloadFile",  //对应的链接为<a href="#/download/user/images/hey.gif">download gif</a>
            "/:route/:action": "loadView",      //对应的链接为<a href="#/dashboard/graph">Load Route/Action View</a>
            "*action": "faultAction"
        },
        isActiveResAuthMode:false,
        getPost: function (id) {
            alert(id);
        },
        defaultRoute: function (actions) {
            alert(actions);
        },
        downloadFile: function (path) {
            alert(path); // user/images/hey.gif
        },
        loadView: function (route, action) {
            alert(route + "_" + action); // dashboard_graph
        },
        faultAction: function (actions) {
            var route = null;
            if (arguments.length > 0) {
                route = arguments[arguments.length - 1][0];
            }
            if(this.isActiveResAuthMode){
                if (_.contains(this.getAllValidAction, route)) {
                    this.doAction.apply(this, arguments[arguments.length - 1]);
                } else {
                    this.getMainRegion().showException("无效的请求[" + actions + "]");
                }
            }else{
                this.doAction.apply(this, arguments[arguments.length - 1]);
            }

        },
    });
    return ApplicationRouter;
});
