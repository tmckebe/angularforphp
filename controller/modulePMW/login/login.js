define(['servicePMW/account/serviceAccount','jquery','appstart/shell'], function (service,$,shell) {
    var $id,$name,$pwd,$login;
    var m = {
        activate:function() {
            shell.showFooter(false);
        },
        login: function () {
            var id = $id.val();
            var name = $name.val();
            var pwd = $pwd.val();
            if (id && name && pwd) {
                service.login(id, name, pwd, function (response) {
                    if (response.success) {
                        session.setTicket(response.data);
                        $.cookie('accountInfo', session.ticket().platformUser.code + ',' + session.ticket().code + ',');
                        $("#loginName").val(session.ticket().platformUser);
                        shell.showFooter(true);
                        router.navigate("#intention_customer");
                    }
                    else {
                        J.showToast('用户名密码不匹配', 'error', 1000);
                    }
                });
            }
            else {
                J.showToast((id ? '' : 'ID ') + (name ? '' : '用户名 ') + (pwd ? '' : '密码 ') + '不能为空', 'error', 500);
            }
        },
        compositionComplete: function () {
            Jingle.launch();
            $id=$("#input-id");
            $name=$("#input-name");
            $pwd = $("#input-pwd");
            $login = $('#btn-login');
            $login.click(m.login);
            var accountInfo = $.cookie('accountInfo');
            if (accountInfo)
            {
                accountInfo = accountInfo.split(',');
                $id.val(accountInfo[0]);
                $name.val(accountInfo[1]);
                $pwd.val('');
            }
        }
    };
    return m;
});