/**
 * @author:   * @date: 2017/9/27
 */

define([$Component.PORTFOLIOBOX.src],
    function (Portfolio) {
        var data = [{
            title:"Project One",
            imgUrl:"/"+APP_NAME+"/resources/images/img18.jpg",
            content:"Donec id elit non mi porta gravida at eget metus. Fusce dapibus, justo sit amet risus etiam porta sem."
        }];
        var portfolio = Portfolio.extend({
            data:data
        });
        return portfolio;
    })
