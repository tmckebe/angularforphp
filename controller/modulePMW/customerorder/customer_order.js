define(['servicePMW/customerorder/serviceCustomerOrder', 'jquery', 'appstart/shell', 'plugins/koext'], function (service, jQuery, shell, koext) {
    var template = ['<div class="list_center" >',
                                '<div class="scrollWrapper" data-scroll=true>',
                                    '<ul class="list">',
                                        '<li>',
                                            '<div class="tag" data-bind="text:createDateFormat"></div>',
                                            '<p>订单编号：<span data-bind="text:orderNo"></span></p>',
                                            '<p>订单ID：<span data-bind="text:id"></span></p>',
                                            '<p>原始金额：<span data-bind="text:orderAmt" class="danger"></span></p>',
                                            '<p>实付金额：<span data-bind="text:totalAmt" class="danger"></span></p>',
                                            '<p>折扣金额：<input type="text" data-bind="value:discountAmt,event:{blur:$root.changeAmt},disable:state()!=1" /></p>',
                                            '<button class="btn" data-bind="click:$root.updateTotalAmt,disable:state()!=1" >保存</button>',
                                        '</li>',
                                        '<li class="active">',
                                            '订单明细',
                                        '</li>',
                                        '<li class="divider">',
                                            '<div class="grid demo-grid">',
                                                '<div class="col-2">产品名称</div>',
                                                '<div class="col-3">产品介绍</div>',
                                                '<div class="col-0">产品单价</div>',
                                            '</div>',
                                        '</li>',
                                        '<!-- ko foreach:productOrderDetails  -->',
                                        '<li>',
                                           '<div class="grid demo-grid">',
                                                '<div class="col-2"data-bind="text:product.name"></div>',
                                                '<div class="col-3" data-bind="text:product.description"></div>',
                                                '<div class="col-0" data-bind="text:product.price"></div>',
                                           '</div>',
                                        '</li>',
                                        '<!-- /ko -->',
                                    '</ul>',
                                '</div>',
                            '</div>'];
    var date = new Date();
    var m = {
        customersorder: ko.observableArray(),
        pageSize: 5,
        pageIndex: ko.observable(1),
        interval: ko.observable(1),
        totalCount: ko.observable(0),
        activate: function () {
            shell.showFooter(true);
            if (session.ticket()) {
                m.initData();
            }
        },
        initData: function ()
        {
            m.customersorder([]);
            var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
            service.getCustomerOrderList(data, m.pageSize, m.pageIndex(), 'createdate.desc', function (response) {
                if (response.success)
                {
                    if (response.parameter) {
                        m.totalCount(response.parameter.totalCount);
                    }
                    m.customersorder(ko.utils.arrayMap(response.data, function (line) {
                        var obj = {};
                        date.setTime(line.createDate);
                        obj.createDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                        var order = mapping.fromJS(line, {}, obj);
                        order.changeAmt = function (order)
                        {
                            if (parseInt(order.discountAmt()) > parseInt(order.orderAmt())) {
                                order.discountAmt(parseFloat(order.orderAmt() - order.totalAmt()).toFixed(2));
                                J.showToast('折扣金额不能大于原始金额', 'error', 1500);
                            }
                            else if (!isNaN(order.discountAmt())) {
                                order.totalAmt((parseFloat(order.orderAmt()) - parseFloat(order.discountAmt())).toFixed(2));
                            }
                            
                            else {
                                order.discountAmt(parseFloat(order.orderAmt()-order.totalAmt()).toFixed(2));
                                J.showToast('数据填写错误', 'error', 1500);
                            }
                        };
                        order.updateTotalAmt = function (order) {
                            service.updateOrderTotalAmt(order.id(), order.discountAmt(),order.totalAmt(), function (response) {
                                if (response.success) {
                                    J.showToast('修改成功', 'success', 500);
                                }
                            })
                        };
                        return order;
                    }));
                }
            });
            Jingle.launch();
        },
        compositionComplete : function () {
            Jingle.launch();
            J.Refresh({
                selector: '#up_refresh_article', type: 'pullUp', pullText: "下拉加载更多", callback: function () {
                    var scroll = this;
                    setTimeout(function () {
                        m.pageIndex((m.pageIndex() + 1));
                        var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
                        service.getCustomerOrderList
                            (data, m.pageSize, m.pageIndex, 'createdate.desc', function (response) {
                                if (response.success) {
                                    if (response.parameter) {
                                        m.totalCount(response.parameter.totalCount);
                                    }
                                    jQuery.each(response.data, function () {
                                        date.setTime(this.createDate);
                                        var obj = {};
                                        obj.createDateFormat = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                                        var order = mapping.fromJS(this, {}, obj);
                                        order.changeAmt = function (order) {
                                            order.totalAmt((parseFloat(order.orderAmt()) - parseFloat(order.discountAmt())).toFixed(2));
                                        };
                                        order.updateTotalAmt = function (order) {
                                            service.updateOrderTotalAmt(order.id(), order.discountAmt(),order.totalAmt(), function (response) {
                                                if (response.success) {
                                                    J.showToast('修改成功', 'success', 500);
                                                }
                                            })
                                        };
                                        m.customersorder.push(order);
                                    });
                                    Jingle.launch();
                                    scroll.refresh();
                                    J.showToast(response.data.length == 0 ? '木有了' : '加载完成', response.data.length == 0 ? 'info' : 'success', 500);

                                }
                            });
                        scroll.refresh();
                    }, 500);
                }
            });
        },
        updateInterval: function (val) {
            m.interval(val);
            m.pageIndex(1);
            m.initData();
            J.Scroll("article");
        },
        cancelOrder: function (order) {
            service.updateOrderState(order.id(), 3, function (response) {
                if (response.success) {
                   var item = jQuery.grep(m.customersorder(),function(n){
                        return n.id() == order.id();
                   })[0];
                   if (item)
                   {
                       item.state(3);
                   }
                } else {
                    J.showToast('修改订单失败', 'info', 500);
                }
            });
        },
        comfirmOrder:function(order){
            service.updateOrderState(order.id(), 2,function (response) {
                if (response.success) {
                    var item = jQuery.grep(m.customersorder(),function(n){
                        return n.id() == order.id();
                    })[0];
                    if (item)
                    {
                        item.state(2);
                    }
                } else {
                    J.showToast('修改订单失败', 'info', 500);
                }
            });
        },
        showDetail:function(obj){
            J.popover('<article class="active" data-scroll="true"  id="showDetail">' + template.join('') + '</article>', { top: '50px', left: '10%', right: '10%', 'min-height': '400px' }, 'top', function () {
                ko.applyBindings(obj, $("#showDetail")[0]);
            });
        },
        callBack: function () {
            router.navigateBack();
        }
    };
    return  m;
});


