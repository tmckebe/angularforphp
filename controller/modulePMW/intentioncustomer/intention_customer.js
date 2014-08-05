define(['servicePMW/customer/serviceCustomer', 'jquery', 'appstart/shell'], function (service, jQuery,shell) {
    var productDetail = ['<div class="list_center">',
                               '<div class="scrollWrapper" data-scroll=true>',
                                    '<ul class="list">',
                                        '<!-- ko foreach:products-->',
                                                '<li>',
                                            '<strong  data-bind="text:name"></strong>',
                                            '<p data-bind="text:description"></p>',
                                        '</li>',
                                        '<!-- /ko -->',
                                        '<li data-bind="visible: products().length == 0">',
                                             '<p class="red">暂无收藏</p>',
                                        '</li>',
                                    '</ul>',
                                '</div>',
                            '</div>'];
    var solutionDetail = ['<div class="list_center">',
                                '<div class="scrollWrapper" data-scroll=true>',
                                    '<ul class="list">',
                                    '<!-- ko foreach:designSolutions-->',
                                        '<li>',
                                            '<strong  data-bind="text:name"></strong>',
                                            '<p data-bind="text:description"></p>',
                                        '</li>',
                                    '<!-- /ko -->',
                                     '<li data-bind="visible: designSolutions().length == 0">',
                                             '<p class="red">暂无收藏</p>',
                                        '</li>',
                                    '</ul>',
                                '</div>',
                            '</div>'];


    var date = new Date();
    var m = {
        customers: ko.observableArray(),
        pageSize: 5,
        pageIndex: ko.observable(1),
        interval: ko.observable(1),
        totalCount:ko.observable(0),
        activate: function () {
            shell.showFooter(true);
            if (session.ticket()) {
                m.initData();
            }
        },
        initData: function ()
        {
            m.customers.removeAll();
            var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
            service.getIntentionCustomer(data, m.pageSize, m.pageIndex(), 'createdate.desc', function (response) {
                if (response.success)
                {
                    if (response.parameter)
                    {
                        m.totalCount(response.parameter.totalCount);
                    }
                    m.customers(ko.utils.arrayMap(response.data, function (line) {
                        date.setTime(line.createDate);
                        line.createDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                        return line;
                    }));
                }
            });
        },
        compositionComplete: function () {
            Jingle.launch();
            J.Refresh({
                selector: '#up_refresh_article', type: 'pullUp', pullText: "下拉加载更多", callback: function () {
                    var scroll = this;
                    if (!session.ticket())
                        return;
                    m.pageIndex(m.pageIndex() + 1);
                    var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
                    service.getIntentionCustomer(data, m.pageSize, m.pageIndex(), 'createdate.desc', function (response) {
                        if (response.success) {
                            if (response.parameter) {
                                m.totalCount(response.parameter.totalCount);
                            }
                            jQuery.each(response.data, function () {
                                date.setTime(this.createDate);
                                this.createDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                                m.customers.push(this);
                            });
                            Jingle.launch();
                            scroll.refresh();
                            J.showToast(response.data.length == 0 ? '木有了' : '加载完成', response.data.length == 0 ? 'info' : 'success', 500);
                        }
                    });

                }
            })
        },
        showProducts: function () {
            var line = arguments[0];
            var parameters = { createDate: line.createDate, customer: line.customer.id, employee: session.ticket().id, type: 0 };
            service.getFavDetail(parameters, function (response) {
                if(response.success)
                {
                    var data = { products: ko.observableArray(response.data) };
                    J.popover('<article class="active" data-scroll="true" id="productsDetail">' + productDetail.join('') + '</article>', { top: '50px', left: '10%', right: '10%', 'min-height': '400px' }, 'top', function () {
                        ko.applyBindings(data, jQuery('#productsDetail')[0]);
                        Jingle.launch();
                    });
                }
            });
        },
        showSolutions: function () {
            var line = arguments[0];
            var parameters = { createDate: line.createDate, customer: line.customer.id, employee: session.ticket().id, type: 1 };
            service.getFavDetail(parameters, function (response) {
                if (response.success) {
                    var data = { designSolutions: ko.observableArray(response.data) };
                    J.popover('<article class="active" data-scroll="true" id="solutionsDetail">' + solutionDetail.join('') + '</article>', { top: '50px', left: '10%', right: '10%', 'min-height': '400px' }, 'top', function () {
                        ko.applyBindings(data, jQuery('#solutionsDetail')[0]);
                        Jingle.launch();
                    });
                }
            });
        },
        setTime: function (value) {
            m.interval(value);
            m.pageIndex(1);
            m.initData();
            J.Scroll("article");
        },
        callBack: function () {
            router.navigateBack();
        }
    };
    return m;
});