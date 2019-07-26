(function () {
    'use strict';

    angular.module("MetronicApp")
        .controller("MetaStandardController", MetaStandardController);

        MetaStandardController.$inject = ["$rootScope", '$scope', 'settings','ds','$state'];
    /*数据源端*/
    function MetaStandardController($rootScope, $scope, settings,ds,$state) {
        $scope.dataList = [];
        ds._queryDBsource({})
        .then(function(res){
            console.log(res);
            if(res.data.code==='00001'){
                return;
             }
             $scope.dataList = JSON.parse(JSON.stringify(res.data.data));
        })

        $scope.routePath =function(ID){
            alert(1)
            $state.go('meta.standard.table',{
                url: 'meta/standard/table',
                params:{
                    id:ID
                }
            })
        }

        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            //   App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });

    }

    /*数据表*/
    angular.module("MetronicApp")
        .controller("MetaStandardTableController", MetaStandardTableController);

        MetaStandardTableController.$inject = ["$rootScope", '$scope', 'settings','ds'];

    function MetaStandardTableController($rootScope, $scope, settings,ds) {
        alert(2)
        $scope.dataList = [];
        ds._queryDBtableById({"dbsource_id":"bed312e9e5e74a5e82c8505be755b64c"})
          .then(function(res){
              console.log(res,'数据表');
              if(res.data.code==='00001'){
                  return;
              }
              $scope.dataList = JSON.parse(JSON.stringify(res.data.data));
          })

        $scope.$on('$viewContentLoaded', function () {

            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });
    }

    /*数据字段*/
    angular.module("MetronicApp")
        .controller("MetaStandardColumnController", MetaStandardColumnController);
        MetaStandardColumnController.$inject = ["$rootScope", '$scope', 'settings','ds'];

    function MetaStandardColumnController($rootScope, $scope, settings,ds) {
        $scope.dataList = [];
        ds._queryDBfieldById({"dbtable_id":"780b2a7fd5ba4174b5833913969b8f96"})
          .then(function(res){
              console.log(res,'0000000000')
              if(res.data.code==='00001'){
                  return;
              }
              $scope.dataList = JSON.parse(JSON.stringify(res.data.data));
          }).catch(err=>{
              console.log(err)
        })

        $scope.$on('$viewContentLoaded', function () {

            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = false;
        });

    }

})();
