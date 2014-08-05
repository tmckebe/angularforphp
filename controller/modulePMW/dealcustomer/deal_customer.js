define(['servicePMW/dealcustomer/serviceDealCustomer', 'jquery', 'appstart/shell'], function (service, jQuery, shell) {
    var template = ['<div class="list_center" >',
                             '<div class="scrollWrapper" data-scroll=true>',
                                 '<ul class="list">',
                                         '<li class="grid">',
                                                '<div style="margin-right:4px;">',
                                                    '<img src="http://www.eoeandroid.com/uc_server/avatar.php?uid=2534547&amp;size=small" width="48" height="48">',
                                                    '<p class="ellipsis"></p>',
                                                '</div>',
                                                '<div class="one-part">',
                                                    '<p>订单ID:<span data-bind="text:id"></span></p>',
                                                    '<p>订单编号:<span data-bind="text:orderNo"></span></p>',
                                                    '<p>总金额：<span data-bind="text:totalAmt" class="label"></span></p>',
                                                '</div>',
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
        customers: ko.observableArray(),
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
            m.customers([]);
            var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
            service.getDealCustomerList(data, m.pageSize, m.pageIndex(), 'createdate.desc', function (response) {
                if (response.success)
                {
                    if (response.parameter) {
                        m.totalCount(response.parameter.totalCount);
                    }
                    m.customers(ko.utils.arrayMap(response.data, function (line) {
                        date.setTime(line.createDate);
                        line.createDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                        return line;
                    }));
                    Jingle.launch();
                }
            });
            
        },
        compositionComplete : function () {
            Jingle.launch();
            $("header").append('<nav class="right"><a href="#search_memu" data-target="menu" data-icon="search" style="font-size:.9em;"><i class="icon search"></i>查询</a></nav>');
            $("#aside_container").append('<aside id="search_memu"data-position="right"data-transition="push"><div class="header"style="font-size: 1em;">查询</div><div class="center"style="padding: 20px 15px;;"><div style="position:relative;"><input type="text" id="menu_search_value" placeholder="请输入关键字"><button class="carrot block"data-icon="search"style="margin-top:20px;"id="btn_menu_search">查询</button></div></aside>');
            J.Refresh({
                selector: '#up_refresh_article', type: 'pullUp', pullText: "下拉加载更多", callback: function () {
                    var scroll = this;
                    setTimeout(function () {
                        m.pageIndex((m.pageIndex() + 1));
                        var data = { employee: session.ticket().id, interval: m.interval(), monthOrDay: false };
                        service.getDealCustomerList(data, m.pageSize, m.pageIndex, 'createdate.desc', function (response) {
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
                    }, 500);
                }
            });
        },
        getLocalTime:function(nS){
            return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " "); 
        },
        updateInterval: function (val){
            m.interval(val);
            m.pageIndex(1);
            m.initData();
            J.Scroll("article");
        },
        showDetail: function (obj) {
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


