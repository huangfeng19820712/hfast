/**
 * @author:   * @date: 2016/3/30
 */
define([
    "core/js/controls/Control",
    "core/js/controls/ToolStrip",
    "core/js/controls/ToolStripItem",
    "core/js/editors/TouchSpinEditor"
], function (Control, ToolStrip,
             ToolStripItem,
             TouchSpinEditor) {
    var Pagination = Control.extend({
        xtype: $Component.PAGINATION,
        eTag: "<nav/>",
        /**
         * 可以选择的分页个数，默认是单数
         */
        itemNum: null,
        /**
         * itemNum的默认值
         */
        itemNumDefault:7,
        pageButtons: null,
        pageSize:10,
        currentPage: 1,
        totalPage: null,
        className: "pagination",
        goButton: null,
        textInput:null,
        /**
         * 按钮组
         */
        $buttonGroup:null,
        /**
         * 挂载内容
         */
        mountContent: function (triggerEvent) {
            this.itemNum = this.itemNumDefault;
            if(this.itemNumDefault>this.totalPage){
                this.itemNum = this.totalPage;
            }
            this.initButtonGroup();
            this.$el.append(this.$buttonGroup);

        },
        initButtonGroup:function(){
            this.$buttonGroup = $("<div class='pull-right'/>");
            this.pageButtons = this.createPageButtons(this.createButtonItems());
            this.pageButtons.activeItems([1]);
            this.$buttonGroup.append("<div class='pageLabel'>"+"&nbsp;&nbsp;&nbsp;&nbsp;总共"+this.totalPage+"页&nbsp;&nbsp;到第&nbsp;"+"</div>");
            this.textInput = new TouchSpinEditor({
                $container: this.$buttonGroup,
                size:TouchSpinEditor.size.sm,
                min:1,
                max: this.totalPage,
                displayButtons:true,
                width:30,
                //prefix:"总共"+this.totalPage+"页 "
            });
            this.$buttonGroup.append("<div class='pageLabel'>"+"&nbsp;页&nbsp;&nbsp;"+"</div>");
            var that = this;
            this.goButton = new ToolStripItem({
                $container: this.$buttonGroup,
                text:"确定",
                size:ToolStripItem.size.sm,
                onclick:$.proxy(that.clickGo, that)
            });
        },
        /**
         * 点击按钮确定的时间
         * @param event
         */
        clickGo:function(event){
            var value = this.textInput.getValue();
            if(this.currentPage!=value){
                this.currentPage = value;
                this._setCurrentPage(this.currentPage);
            }
        },
        createPageButtons: function (itemOptions) {
            return new ToolStrip({
                $container: this.$buttonGroup,
                size: ToolStrip.size.sm,
                itemOptions: itemOptions
            });
        },
        createButtonItems: function () {
            var that = this;
            var result = [{
                text: "<上一页",
                onclick: function () {
                    that.prev();
                }
            }];
            var itemNum = this.itemNum;
            /*if(this.itemNum>this.totalPage){
                itemNum = this.totalPage;
            }*/
            for (var i = 1; i <= itemNum; i++) {
                result.push({
                    text: i,
                    onclick: $.proxy(that.clickItem, that)
                });
            }

            if (this.totalPage > this.itemNum) {
                result.push({
                    text: "...",
                    enabled: false
                });

            }

            result.push({
                text: "下一页>",
                onclick: function () {
                    that.next();
                }
            });
            return result;
        },
        clickItem: function (event) {
            this.currentPage = parseInt($(event.jqEvent.target).text());
            this._setCurrentPage(this.currentPage);
        },
        _setCurrentPage: function (currentPage) {
            var itemOptions = this.getNavigationOptions(this.totalPage, this.currentPage, this.itemNum);
            this.updateButtonItems(itemOptions);
            this.trigger("page",currentPage);
        },
        /**
         * 分页事件
         * @param currentPage
         */
        onpage:function(context,currentPage){

        },
        /**
         * 修改分页按钮状态
         * @param itemOptions
         */
        updateButtonItems: function (itemOptions) {
            var items = this.pageButtons.getItems();
            var currentItem = null;
            for (var i = 1; i < items.length; i++) {
                var item = items[i];
                item.setText(itemOptions[i]);
                if (this.currentPage == itemOptions[i]) {
                    currentItem = item;
                }
            }
            this.pageButtons.clearActive();
            if (currentItem) {
                currentItem.setActive(true);
            }
            if (this.currentPage == 1) {
                this.pageButtons.items[0].setEnabled(false);
            } else {
                this.pageButtons.items[0].setEnabled(true);
            }
            if (this.currentPage == this.totalPage) {
                this.pageButtons.items[this.pageButtons.items.length - 1].setEnabled(false);
            } else {
                this.pageButtons.items[this.pageButtons.items.length - 1].setEnabled(true);
            }
        },
        /**
         * 上一页
         */
        prev: function () {
            this.currentPage--;
            this._setCurrentPage(this.currentPage);
        },
        /**
         * 下一页
         */
        next: function () {
            this.currentPage++;
            this._setCurrentPage(this.currentPage);
        },
        /**
         * 获取导航条的参数
         * @param totalPage
         * @param currentPage
         * @param itemNum
         * @returns {Array}
         */
        getNavigationOptions: function (totalPage, currentPage, itemNum) {
            //获取中间数
            var center = Math.round(itemNum / 2);
            //保存按钮对应的页数
            var itemValues = [];
            var start = 1;
            var realItemNum = itemNum;
            if(this.itemNum<this.totalPage){
                //当总页数大于现实的页数时，才需要处理
                //处理总页数小于规定的子项数
                if (totalPage < itemNum) {
                    realItemNum = totalPage;
                }
                //处理
                if (totalPage - center + 1 < currentPage) {
                    start = totalPage - itemNum + 1;
                } else if (currentPage > center) {
                    //当前页面减去中间数
                    start = currentPage - center + 1;
                }
            }
            for (var i = 1; i <= realItemNum; i++, start++) {
                itemValues[i] = start;
            }
            return itemValues;
        }
    });
    return Pagination;
});
