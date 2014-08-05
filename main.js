requirejs.config({
    paths: {
        'text': 'library/require/text',
        'durandal': 'library/durandal/js',
        'plugins': 'library/durandal/js/plugins',
        'transitions': 'library/durandal/js/transitions',
        'knockout': [
                     'library/knockout/knockout-3.1.0'
                    ],
        'bootstrap': 'library/bootstrap/js/bootstrap.min',
        'jquery': [
                    'library/jquery/jquery-1.9.1.min'
                  ],
        'cookie': 'library/cookie/jquery.cookie',
        'base': 'common/base',
        'config': 'common/config',
        'tool':'common/tools',
        'session': 'common/mySession',
        'servicePMW': 'service/modulePMW',
        'modelPMW': 'model/modulePMW',
        'mapping': [
                    'library/knockout/mapping/knockout.mapping-latest'
        ],
        'zepto': 'library/jingle/js/zepto',
        'iscroll': 'library/jingle/js/iscroll',
        'template': 'library/jingle/js/template.min',
        'Jingle': 'library/jingle/js/Jingle.debug',
        'JChart': 'library/jingle/js/JChart.debug',
        'touch2mouse':'library/jingle/js/zepto.touch2mouse',
    },
    shim: {
    }
});
define(['durandal/system','base', 'durandal/app', 'durandal/viewLocator', 'zepto', 'plugins/router', 'knockout', 'mapping', 'plugins/http',
     'plugins/router', 'session', 'iscroll', 'template', 'Jingle', 'JChart', 'touch2mouse'],
    function (system, base, app, viewLocator, zepto, router, ko, mapping, http, router, session, iscroll, template, Jingle, JChart, touch2mouse) {
    window.ko = ko;
    window.mapping = mapping;
    window.app = app;
    window.http = http;
    window.session = session;
    window.router = router;
    app.title = 'PMW';
    app.configurePlugins({
        router: true,
        dialog: true,
        widget: true
        //,moment: true
    });
    router.guardRoute = function (instance, instruction) {
        if (instruction.config.ar) {
            if (!session.ticket()) {
                return "#login";
            }
        }
        return true;
    };
    app.start().then(function () {
        viewLocator.useConvention('controller', 'view');
        app.setRoot('appstart/shell', 'entrance');
    });
});
