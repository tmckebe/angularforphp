define(['servicePMW/customer/serviceCustomer', 'jquery', 'appstart/shell', 'tool'], function (service, jQuery, shell, tool) {
    var x_axis = [];
    var sp = '.';
    function model() {
        var self = this;
        self.interval = ko.observable(1);
        self.topFiveFavorites = ko.observableArray();
        self.topFiveSales = ko.observableArray();
        self.canvasDatas = ko.observableArray();
        self.activate=function() {
            shell.showFooter(false);
            x_axis[1] = tool.latestOneWeekDates(sp);
            x_axis[2] = tool.latestOneMonthDates(sp);
            x_axis[3] = tool.latestThreeMonthDates(sp);
            if (session.checkIsLogged()) {
                self.initData();
            }
        },
        self.compositionComplete = function () {
            Jingle.launch();
            self.initCanvas();
            self.initTop();
        };
        self.initData = function (callBack)
        {
            var data = { employee: session.ticket().id, interval: self.interval(), monthOrDay: false };
            service.getAnalyzeData(data, function (response) {
                if (response.success)
                {
                    var date = new Date();
                    self.canvasDatas(ko.utils.arrayMap(response.data, function (line) {
                        date.setTime(line.createDate);
                        line.createDate = date.getFullYear() + sp + (date.getMonth() + 1) + sp + date.getDate();
                        return line;
                    }));
                    self.topFiveSales(response.parameter.topFiveSales);
                    self.topFiveFavorites(response.parameter.topFiveFavorites);
                    if (typeof callBack == 'function')
                    { callBack(); }
                    else if (jQuery("#line_canvas").length>0)
                    {
                        self.renderLine();
                        self.updateChart();
                    }
                }
            });
        },
        self.calcChartOffset = function(){
            return {
                height : $(document).height() - 44 - 30 -60,
                width : $(document).width()
            }
        }
        self.initTop = function () {
            //滚动显示销售top5的单品
            var slider;
            //$('#sales_analysis article').on('articleshow', function () {
                slider = new J.Slider({
                    selector: '#slider_test',
                    showDots: false,
                    onBeforeSlide: function () {
                        return true;
                    },
                    onAfterSlide: function (i) {
                        $(".control-group:last").find("li").eq(i).addClass("active").siblings().removeClass("active");
                    }
                });
            //});
            $('#slider_prev').tap(function () { slider.prev() });
            $('#slider_next').tap(function () { slider.next() });
        };
        self.initCanvas = function () {
            //重新设置canvas大小
            $chart = $('#line_canvas');
            var wh = self.calcChartOffset();
            $chart.attr('width', wh.width).attr('height', wh.height - 30);

            self.renderLine();
            $('#changeLineType').on('change', function (e, el) {
                self.interval(el.data('type'));
                self.initData(self.updateChart);
            })

        },
        self.renderLine = function () {
            var datas =self.structureData();
            var data = {
                labels: x_axis[self.interval()],
                datasets: [
                    {
                        name: '关注',
                        color: "#72caed",
                        pointColor: "#95A5A6",
                        pointBorderColor: "#fff",
                        data: JSON.stringify(datas.fav).replace(/\"/g, "")
                    },
                    {
                        name: '成交',
                        color: "#a6d854",
                        pointColor: "#95A5A6",
                        pointBorderColor: "#fff",
                        data: JSON.stringify(datas.order).replace(/\"/g, "")
                    }
                ]
            };
            self.line = new JChart.Line(data, {
                id: 'line_canvas',
                smooth: false,
                fill: false,
                datasetGesture: true,
            });
            self.line.on('tap.point', function (d, i, j) {
                J.alert(data.labels[i], d);
            });
            self.line.draw();
        };
        self.structureData=function()
        {
            var result = { fav: [], order: [] };
            $.each(x_axis[self.interval()], function () {
                var date = this;
                var item = $.grep(self.canvasDatas(), function (n) { return n.createDate == date; })[0];
                if (item) {
                    result.fav.push(item.favoritesCnt ? parseInt(item.favoritesCnt) : 0);
                    result.order.push(item.orderCnt ? parseInt(item.orderCnt) : 0);
                }
                else {
                    result.fav.push(0);
                    result.order.push(0);
                }
            });
            return result;
        };
        self.updateChart = function () {
            var datas = self.structureData();
            var data = {
               
                labels: x_axis[self.interval()],
                datasets: [
                    {
                        name: '关注',
                        color: "#72caed",
                        pointColor: "#95A5A6",
                        pointBorderColor: "#fff",
                        data: datas.fav
                    },
                    {
                        name: '成交',
                        color: "#a6d854",
                        pointColor: "#95A5A6",
                        pointBorderColor: "#fff",
                        data: datas.order
                    }
                ]
            };
            self.line.load(data);
            self.line.refresh({
                smooth: false,
                fill: false
            });
        };
        self.callBack = function (){
            router.navigateBack();
        }
    };
    return new model();
});


