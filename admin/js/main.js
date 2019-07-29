/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    'dataservice'
]);
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);
//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();

}]);
/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {

    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
       // Layout.init();
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });
}]);
/*Header*/
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);
/* Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);
/* Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);
/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/ds_monitor");
    $httpProvider.defaults.headers['Access-Control-Allow-Origin'] = '*';
    $httpProvider.defaults.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

    $httpProvider.defaults.timeout = 5000;

    $stateProvider
        .state('ds_create', {
            url: "/ds_create",
            templateUrl: "views/ds/ds_create.html",
            data: {pageTitle: '数据源新增'},
            controller: "DataSourceCreateController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           // '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DataSourceController.js',
                        ]
                    });
                }]
            }
        })
        .state('ds_monitor', {
            url: "/ds_monitor",
            templateUrl: "views/ds/ds_monitor.html",
            data: {pageTitle: '数据源监控'},
            controller: "DataSourceCreateController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                           // '../assets/pages/scripts/dashboard.min.js',
                            'js/controllers/DataSourceController.js',
                        ]
                    });
                }]
            }
        })
        .state("meta",{
            abstract:true,
            url:"/meta",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'js/controllers/MetaController.js',
                        ]
                    });
                }]
            },
            ncyBreadcrumb: {
				label: '元数据管理'
			}
        })
        .state("meta.standard",{
            url:"/standard",
            views:{
                "main@":{
                    templateUrl: "views/meta/meta_standard.html",
                    controller: "MetaStandardController",
                }
            },
            ncyBreadcrumb: {
				label: '元数据标准',
                skip:false
			}
        })

        .state("meta.standard.table",{
            url:"/table/{sid}/{sname}",
            views:{
                "main@":{
                    templateUrl: "views/meta/meta_standard_table.html",
                    controller: "MetaStandardTableController",
                }
            },
              ncyBreadcrumb: {
                label: '数据源表'
              }
        })
        .state("meta.standard.table.info",{
            url:"/info/{tid}/{sname}",
            views:{
                "main@":{
                    templateUrl: "views/meta/meta_standard_info.html",
                    controller: "MetaStandardInfoController",
                }
            },
            ncyBreadcrumb: {
                label: '数据源表信息'
              }
        })

        .state("meta.standard1",{
            url:"/standard1",
            views:{
                "main@":{
                    templateUrl: "views/meta/meta_standard1.html",
                    controller: "MetaStandardController1",
                }
            },
            ncyBreadcrumb: {
              label: '元数据标准'
            }
        })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);
