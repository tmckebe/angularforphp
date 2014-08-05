define([], function () {
    var install = function () {
        ko.bindingHandlers.textDate = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
                var dt = new Date(parseInt(valueUnwrapped.replace(/(^.*\()|([+-].*$)/g, '')));// moment(valueUnwrapped).format("YYYY-MM-DD HH:mm:ss");
                var textContent = dt.getFullYear() + "-" + (dt.getMonth()+1) + "-" + dt.getDate()
                    + " " + dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                ko.bindingHandlers.text.update(element, function () { return textContent; });
            }
        };
        //true、false转换为男女；
        ko.bindingHandlers.sexcn = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
                var textContent = null;
                if (valueUnwrapped == true) {
                    textContent = "男";
                } else {
                    textContent = "女";
                }

                ko.bindingHandlers.text.update(element, function () { return textContent; });
            }
        };
        //订单的数字状态转换为文字；
        ko.bindingHandlers.orderStateCn = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
                valueUnwrapped = parseInt(valueUnwrapped);
                var textContent = null;
                switch (valueUnwrapped) {
                    case 1:
                        textContent = "待确认";
                        break;
                    case 2:
                        textContent = "已确认";
                        break;
                    case 3:
                        textContent = "已取消";
                        break;
                    default:
                        break;
                }
                ko.bindingHandlers.text.update(element, function () { return textContent; });
            }
        };
        ko.bindingHandlers.addStateColor = {
            update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var valueUnwrapped = ko.utils.unwrapObservable(valueAccessor());
                valueUnwrapped = parseInt(valueUnwrapped);
                var stateColor = null;
                switch (valueUnwrapped) {
                    case 1:
                        stateColor = "red";
                        break;
                    case 2:
                        stateColor = "green";
                        break;
                    case 3:
                        stateColor = "through";
                        break;
                    default:
                        break;
                }
                ko.bindingHandlers.css.update(element, function () { return stateColor; });
            }

        }
    };
	

	return {
		install : install()
	};
}); 