(function () {
    'use strict'; 

    angular.module("MetronicApp")
        .controller("DataSourceController", DataSourceController);

    DataSourceController.$inject = ["$rootScope", '$scope', 'settings','ds'];

    function DataSourceController($rootScope, $scope, settings,ds) {


    //   ds._testDataSource({})
    //   .then(function(rs){
    //      // console.log(rs);
    //       if(rs.data.code==='00001'){
    //         //调用错误
    //       }
    //   })


        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            //   App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = true;
        });

    }


    angular.module("MetronicApp")
        .controller("DataSourceCreateController", DataSourceCreateController);

    DataSourceCreateController.$inject = ["$rootScope", '$scope', 'settings','ds'];

    function DataSourceCreateController($rootScope, $scope, settings,ds) {

        // $scope.dataSourceJson = {
        //     ip:"",
        //     port:"",
        //     dbname:"",
        //     dstype:"",
        //     username:"",
        //     password:""
        // };

        $scope.dataSourceJson={}

        $scope.test = testDataSource;  

        function success(res){
            console.log(res);
        }
        function error(err){
            console.log(err);
        }

        function testDataSource(){ 
         //   console.log($scope.dataSourceJson);
             var url  = ctx+ "/datasoure/testDataSoure"; 
             var data =  App.form2Json("datasource_create_form");

           ds._testDataSource(data)
           .then(function(rs){
               console.log(rs);

           })

        }
 
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
            //   App.initAjax(); 
            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = true;
            $rootScope.settings.layout.pageSidebarClosed = true; 

        });

    }
})();