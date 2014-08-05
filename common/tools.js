define(['config'],function (config) {
    var tools = function () {
        var self = this;
        self.convertResourceObj = function (resourceInfo) {
            if (resourceInfo instanceof Array) {
                var resourceList = Array();
                for (var i = 0; i < resourceInfo.length; i++) {
                    resourceList.push(self.getResourceObject(resourceInfo[i]));
                }
                if (resourceInfo.length == 0) {
                    resourceInfo.push(self.getResourceObject(null));
                }
                return resourceList;
            } else {
                return self.getResourceObject(resourceInfo);
            }
        };
        self.getResourceObject = function (resourceInfo) {
            if (resourceInfo != undefined && resourceInfo.path != undefined &&
                resourceInfo.name != undefined && resourceInfo.extension != undefined) {
                if (typeof (resourceInfo.path) == "function") {
                    resourceInfo.path = resourceInfo.path();
                    resourceInfo.name = resourceInfo.name();
                    resourceInfo.extension = resourceInfo.extension();
                }
                return {
                    imgUrl: config.baseImgServerUrl + resourceInfo.path + resourceInfo.name + resourceInfo.extension,
                    smallImgUrl: config.baseImgServerUrl + resourceInfo.path + "s_" + resourceInfo.name + resourceInfo.extension
                };
            } else {
                return {
                    imgUrl: "images/default.jpg",
                    smallImgUrl: "images/s_default.jpg"
                };
            }
        };
        self.latestOneWeekDates = function (sp) {
            if (!sp) {
                sp = '.';
            }
            var dateObj = new Date();
            var date = dateObj.getDate();
            var month = dateObj.getMonth() + 1;
            var year = dateObj.getFullYear();
            var prefix, preMonth, preYear, preMonthLastDate, preYearLastDate, item;
            var result = [];
            // 不跨月
            if (date >= 7) {
                prefix = year + sp + month + sp;
                for (var i = 6; i >= 0; i--) {
                    item = prefix + (date - i);
                    result.push(item);
                }
            }
                // 跨月
            else {
                // 跨月不跨年
                if (month > 1) {
                    preMonth = month - 1;
                    prefix = year + sp;
                    preMonthLastDate = self.calculateDates(year,preMonth);
                    for (var i = 6; i >= 0; i--) {
                        // 上月的部分
                        if ((date - i) < 1) {
                            item = prefix + preMonth + sp + (preMonthLastDate + (date - i));
                        }
                            // 本月的部分
                        else {
                            item = prefix + month + sp + (date - i);
                        }
                        result.push(item);
                    }
                }
                    // 跨月跨年
                else {
                    preYear = year - 1;
                    preMonth = 12;
                    preYearLastDate = self.calculateDates(preYear, preMonth);
                    for (var i = 6; i >= 0; i--) {
                        // 上年的部分
                        if ((date - i) < 1) {
                            item = preYear + sp + preMonth + sp + (preYearLastDate + (date - i));
                        }
                            // 本年的部分
                        else {
                            item = year + sp + month + sp + (date - i);
                        }
                        result.push(item);
                    }
                }

            }
            return result;
        };
        self.latestOneMonthDates = function (sp) {
            if (!sp) {
                sp = '.';
            }
            var dateObj = new Date();
            var date = dateObj.getDate();
            var month = dateObj.getMonth() + 1;
            var year = dateObj.getFullYear();
            var prefix, preMonth, preYear, preMonthLastDate, preYearLastDate, currMonthLastDate, item;
            var result = [];
            // 不跨月
            currMonthLastDate = self.calculateDates(year,month);
            if (date == currMonthLastDate) {
                prefix = year + sp + month + sp;
                for (var i = 1; i <= date; i++) {
                    item = prefix + i;
                    result.push(item);
                }
            }
                // 跨月
            else {
                // 跨月不跨年
                if (month > 1) {
                    preMonth = month - 1;
                    prefix = year + sp;
                    preMonthLastDate = self.calculateDates(year,preMonth);
                    // 上月的部分
                    for (var i = date + 1; i <= preMonthLastDate; i++) {
                        item = prefix + preMonth + sp + i;
                        result.push(item);
                    }
                    // 本月的部分
                    for (var i = 1; i <= date; i++) {
                        item = prefix + month + sp + i;
                        result.push(item);
                    }
                }
                    // 跨月跨年
                else {
                    preYear = year - 1;
                    preMonth = 12;
                    preYearLastDate = self.calculateDates(preYear, preMonth);
                    // 上年的部分
                    for (var i = date + 1; i <= preYearLastDate; i++) {
                        item = preYear + sp + preMonth + sp + i;
                        result.push(item);
                    }
                    // 本年的部分
                    for (var i = 1; i <= date; i++) {
                        item = year + sp + month + sp + i;
                        result.push(item);
                    }
                }

            }
            return result;
        };
        self.latestThreeMonthDates = function (sp) {
            if (!sp) {
                sp = '.';
            }
            var dateObj = new Date();
            var date = dateObj.getDate();
            var month = dateObj.getMonth() + 1;
            var year = dateObj.getFullYear();
            var prefix, preYear, firstMonth, secondMonth, thirdMonth, forthMonth, firstMonthLastDate, secondMonthLastDate, thirdMonthLastDate, forthMonthLastDate, item;
            var result = [];
            forthMonthLastDate = self.calculateDates(year, month);
            // 跨3个月
            if (date == forthMonthLastDate) {
                thirdMonthLastDate = forthMonthLastDate;
                // 不跨年
                if (month >= 3) {
                    prefix = year + sp;
                    firstMonth = month - 2;
                    secondMonth = firstMonth + 1;
                    thirdMonth = secondMonth + 1;
                    forthMonth = thirdMonth + 1;
                    firstMonthLastDate = self.calculateDates(year, firstMonth);
                    secondMonthLastDate = self.calculateDates(year, secondMonth);
                    for (var i = 1; i <= firstMonthLastDate; i++) {
                        item = prefix + firstMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= secondMonthLastDate; i++) {
                        item = prefix + secondMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= thirdMonthLastDate; i++) {
                        item = prefix + thirdMonth + sp + i;
                        result.push(item);
                    }
                }
                    // 跨年
                else {
                    preYear = year - 1;
                    firstMonth = 10 + month;
                    thirdMonth = month;
                    forthMonth = month + 1;
                    secondMonthLastDate = 31;
                    if (month == 1) {
                        // 11 12 1
                        secondMonth = 12;
                        firstMonthLastDate = 30;
                    }
                    else if (month == 2) {
                        // 12 1 2
                        secondMonth = 1;
                        firstMonthLastDate = 31;
                    }
                    for (var i = 1; i <= firstMonthLastDate; i++) {
                        item = preYear + sp + firstMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= secondMonthLastDate; i++) {
                        item = (month == 1 ? preYear : year) + sp + secondMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= thirdMonthLastDate; i++) {
                        item = year + sp + thirdMonth + sp + i;
                        result.push(item);
                    }
                }
            }
                // 跨4个月
            else {

                // 不跨年
                if (month >= 4) {
                    prefix = year + sp;
                    firstMonth = month - 3;
                    secondMonth = firstMonth + 1;
                    thirdMonth = secondMonth + 1;
                    forthMonth = thirdMonth + 1;
                    firstMonthLastDate = self.calculateDates(year, firstMonth);
                    secondMonthLastDate = self.calculateDates(year, secondMonth);
                    thirdMonthLastDate = self.calculateDates(year, thirdMonth);
                    for (var i = date + 1; i <= firstMonthLastDate; i++) {
                        item = prefix + firstMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= secondMonthLastDate; i++) {
                        item = prefix + secondMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= thirdMonthLastDate; i++) {
                        item = prefix + thirdMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= date; i++) {
                        item = prefix + forthMonth + sp + i;
                        result.push(item);
                    }
                }
                    // 跨年
                else {
                    preYear = year - 1;
                    firstMonth = 12 - (3 - month);
                    forthMonth = month;
                    if (month == 1) {
                        // 10 11 12 1
                        secondMonth = 11;
                        thirdMonth = 12;
                        firstMonthLastDate = 31;
                        secondMonthLastDate = 30;
                        thirdMonthLastDate = 31;
                    }
                    else if (month == 2) {
                        // 11 12 1 2
                        secondMonth = 12;
                        thirdMonth = 1;
                        firstMonthLastDate = 30;
                        secondMonthLastDate = 31;
                        thirdMonthLastDate = 31;
                        forthMonthLastDate = self.calculateDates(year, forthMonth);
                    }
                    else if (month == 3) {
                        //  12 1 2 3
                        secondMonth = 1;
                        thirdMonth = 2;
                        firstMonthLastDate = 31;
                        secondMonthLastDate = 31;
                        thirdMonthLastDate = self.calculateDates(year, thirdMonth);
                        forthMonthLastDate = 31;
                    }
                    for (var i = date + 1; i <= firstMonthLastDate; i++) {
                        item = preYear + sp + firstMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= secondMonthLastDate; i++) {
                        item = (month < 3 ? preYear : year) + sp + secondMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= thirdMonthLastDate; i++) {
                        item = (month == 1 ? preYear : year) + sp + thirdMonth + sp + i;
                        result.push(item);
                    }
                    for (var i = 1; i <= date; i++) {
                        item = year + sp + forthMonth + sp + i;
                        result.push(item);
                    }
                }
            }
            return result;
        };

        self.calculateDates = function (year,month)
        {
            var data = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            if (year % 4 == 0 && (year % 100 != 0 || year % 400==0))
            {
                data[2] = 29;
            }
            return data[month];
        }
    };
    return new tools();
});