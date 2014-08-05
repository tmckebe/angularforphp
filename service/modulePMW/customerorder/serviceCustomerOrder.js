define(function () {
    var serviceCustomerOrder = {};
    //获取客户订单列表
    serviceCustomerOrder.getCustomerOrderList = function (data, pageSize, pageIndex, orderItem, callBack) {
        http.getListPost("enterpriseQuery/getAllProductOrders.action", data, pageSize, pageIndex, orderItem, callBack,true);
    };
    serviceCustomerOrder.updateOrderState = function (orderId, state, callbackFunc) {
        var updateOrder = { id: orderId, state: state };
        http.postJSON("order/modifyOrder.action", { data: ko.toJSON(updateOrder) }, callbackFunc);
    };
    serviceCustomerOrder.updateOrderTotalAmt = function (orderId, discountAmt,totalAmt, callbackFunc) {
        var updateOrder = { id: orderId, discountAmt: discountAmt, totalAmt: totalAmt };
        http.postJSON("order/modifyOrder.action", { data: ko.toJSON(updateOrder) }, callbackFunc);
    };
    return serviceCustomerOrder;
    ;
});