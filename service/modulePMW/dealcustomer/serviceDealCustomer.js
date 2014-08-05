define(function () {
    var serviceDealCustomer = {};
    //获取产品列表
    serviceDealCustomer.getDealCustomerList = function (data, pageSize, pageIndex, orderItem, callBack) {
        http.getListPost("enterpriseQuery/getDealCustomers.action", data, pageSize, pageIndex, orderItem, callBack,true);
    };
    return serviceDealCustomer;
    ;
});