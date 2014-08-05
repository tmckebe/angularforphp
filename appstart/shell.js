define(function () {
    var pmwControPath = "controller/modulePMW/";
    return {
        showFooter:ko.observable(true),
        activate: function () {
            router.map([
				{ route: ['','login'], title: '顾客登录', moduleId: pmwControPath + 'login/login' },
                { route: ['intention_customer'], title: '意向客户', moduleId: pmwControPath + 'intentioncustomer/intention_customer', ar: true, id:1 },
                { route: ['deal_customer'], title: '成交客户', moduleId: pmwControPath + 'dealcustomer/deal_customer', ar: true, id: 2 },
                { route: ['customer_order'], title: '客户订单', moduleId: pmwControPath + 'customerorder/customer_order', ar: true, id: 3 },
                { route: ['sales_analysis'], title: '销售分析', moduleId: pmwControPath + 'salesanalysis/sales_analysis', ar: true, id: 4 },
            ]).buildNavigationModel();
            return router.activate();
        },
        compositionComplete: function () {
            Jingle.launch({
                appType: 'muti',
                showWelcome: false,
                basePagePath: "demo/html/"
            });
            $('#btn_from_tpl').tap(function () {
                J.Popup.actionsheet([{
                    text: session.ticket() != null ? session.ticket().name : "暂时没登录",
                }, {
                    text: '退出登录',
                    handler: function () {
                        session.logout();
                        J.showToast('退出成功！');
                        router.navigate("#login");
                    }
                }
                ]);
            }); 
        }
    };
});
