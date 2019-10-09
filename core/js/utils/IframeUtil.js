/**
 * @module iframe工具类[IframeUtil]
 * @description iframe工具类
 *
 * @author:
 * @date: 2013-10-17 下午8:45
 */
define(["core/js/context/ApplicationContext"], function (ApplicationContext) {
    var IFRAME_TEMPLATE = '<iframe id="<%=iframeId%>" name="<%=iframeId%>" src="<%=url%>" frameBorder="0" scrolling="auto" width="100%" height="100%"></iframe>';
    var IframeUtil = {
        clearIframeContent: function (iframeEl) {
            if (iframeEl == null)
                return;
            try {
                this.clearIframeBodyRelatedObject(iframeEl);  //清除iframe主体内容关联，内存回收，避免内存泄露
            } catch(e){

            }
            var iframeBody, iframeContentWindow, doc;
            try {
                var iframeContentWindow = (iframeEl.contentWindow || iframeEl.contentDocument.parentWindow);
                if (iframeContentWindow.document)
                    doc = iframeContentWindow.document;

                iframeBody = doc.body;  //这里必须进行异常捕获，否则如果页面报一些涉及到跨域问题时，就会影响到后续的操作

            } catch (e) {
                // TODO: handle exception
            }

            if (iframeBody != null)
                iframeBody.innerHTML = '';

            if(doc){
                doc.write("");
            }

            iframeContentWindow.close();

            iframeEl.src = "about:blank";
            $(iframeEl).remove();
        },
        /**
         * 清除iframe主体内容关联，内存回收，避免内存泄露
         * @param iframeEl
         */
        clearIframeBodyRelatedObject: function(iframeEl){
            var relatedObject = this.getIframeBodyRelatedObject(iframeEl);  //查看Region中对应的relatedObject
            //如果当前区域显示的内容没有关联的对象，就直接返回
            if (!relatedObject)
                return;

            //销毁关联对象：依次查找关联对象是否有close、destroy、remove方法，先找到先执行
            if(!relatedObject.isDestroied){
                if (relatedObject.close) {
                    relatedObject.close();
                }else {
                    if (relatedObject.destroy) {
                        relatedObject.destroy();
                    }else {
                        if (relatedObject.remove)
                            relatedObject.remove();
                    }
                }
            }
        },
        getIframeBodyRelatedObject: function(iframeEl){
            var contentWindow = iframeEl.contentWindow;
            if(!contentWindow)
                return null;

            var $mainEl = contentWindow.$(ApplicationContext.getMainRegionEl());
            if($mainEl == null || $mainEl.length == 0)
                return null;
            var relatedObject = $mainEl.data("relatedObject");  //查看Region中对应的relatedObject
            return relatedObject;
        },
        /**
         * 根据给定的ID和URL创建Iframe的内容
         * @param iframeId
         * @param url
         * @return {*}
         */
        generateIframeContent: function (iframeId, url) {
            var context = {
                "iframeId": iframeId,
                "url": IframeUtil.getIframeUrl(url)
            }

            return _.template(IFRAME_TEMPLATE, context);
        },
        /**
         *
         * @param prefix
         * @return {string}
         */
        generateIframeId: function (prefix) {
            return prefix + "_iframe_id";
        },
        getIframeUrl: function (url) {
            var result = "about:blank";
            if (url == null || url === "")
                return result;

            if (this.isInnerUrl(url)) {
                //添加时间戳主要是为了修复嵌套的多层iframe，都是通过main.html进行引导，
                // 如果是IE下，第二层的iframe就会显示空白，在chrome上是第三层的iframe出现空白，
                // 所以通过添加时间戳（并且这个时间戳是紧跟在main.html后面，而不能跟在#号之后），每次都请求，避免调用客户端缓存的页面
                // add by 2014.07.08
//                result = "main.html" + "?" + (new Date()).getTime() + url;
                result = "main.html" + "?" + url;
            } else {
                result = url;
            }

            return result;
        },
        isInnerUrl: function(url){
            return url && url.substr(0, 1) == "#"
        },
        getIframeWindow: function(iframeElement){
            if(!iframeElement)
                return null;
            return iframeElement.contentWindow || iframeElement.contentDocument.parentWindow;
        }
    };

    return IframeUtil;
});