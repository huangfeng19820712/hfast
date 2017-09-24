/**
 * @author:   * @date: 2017/9/22
 */
define([
    "core/js/CommonConstant",
    $Component.CONTAINER.src,
], function (CommonConstant,Container) {
    var NavigationBar = Container.extend({
        eTag:"<nav />",
        className:"navbar navbar-default",
    });
    return NavigationBar;
});