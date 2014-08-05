define(['cookie','jquery','knockout'], function (cookie,$,ko) {
    var shopIdKey = "shopId";
    var ticketName = "pmwTicket";
    var roles = { enterprise: 1, shopManager: 2, employee: 3 };
    var getTicket = function () {
        var myTicket = $.cookie(ticketName);
        if (myTicket != null && myTicket != "") {
            return eval('(' + myTicket + ')');
        }
        else {
            return null;
        }
    };
    var mySession = {
        setTicket: function (ticketObj) {
            ticketObj.role = ticketObj.isSystem ? roles.enterprise : (ticketObj.isManager? roles.shopManager : roles.employee);
            mySession.ticket(ticketObj);
            $.cookie(ticketName, ko.toJSON(ticketObj));
        },
        ticket: ko.observable(),
        setShopId: function (id) {
            mySession.shopId(id);
            $.cookie(shopIdKey, id);
        },
        shopId: ko.observable(),
        install: function () {
            mySession.shopId($.cookie(shopIdKey));
            mySession.ticket(getTicket());
            return mySession;
        },
        checkIsLogged: function () {
            if (mySession.ticket() == null) {
                app.showMessage('您尚未登录，请先登录');
                router.navigate("#login");
                return false;
            }
            return true;
        },
        logout: function () {
            $.removeCookie(ticketName);
            mySession.ticket(null);
        }
    };
    return mySession.install();
});