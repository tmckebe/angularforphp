define(['jquery'],function ($) {
    return {
        login: function (id, name, pwd,callBack) {
            var data = { accountCode: $.trim(id), phoneNo: $.trim(name), password: $.trim(pwd) };
            http.postJSON("enterpriseAccount/login.action", data, callBack);
        }
    };
});