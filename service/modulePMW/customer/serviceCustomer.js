define(function () {
    return {
        getIntentionCustomer: function (data, pageSize, pageIndex, orderItem, callBack) {
            http.getList("enterpriseQuery/getCustomerIntentions.action", data, pageSize, pageIndex, orderItem, callBack,true);
        },
        getFavDetail: function (data, callBack)
        {
            http.getJSON("enterpriseQuery/getCustomerIntentionDetails.action", data, callBack);
        },
        getAnalyzeData: function (data, callBack) {
            http.getJSON("enterpriseQuery/getSaleRates.action", data, callBack);
        }
    };
});