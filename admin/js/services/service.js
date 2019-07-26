
(function(){
	'use strict';


	angular.module('dataservice',[]).factory('ds', dataservice);

	dataservice.$inject = ['$http'];

	function dataservice($http) {
		return {
		//	_test: _test,
			_testDataSource: __testDataSource ,
			_insertDataSourceInfo:__insertDataSourceInfo,
			_queryDBsource:__queryDBsource,
			_queryDBtableById:__queryDBtableById,
			_queryDBfieldById:__queryDBfieldById
	    };

		function __httpPost(url, data){
			//统一加密
		     return $http.post(url ,data);
		}

	    function __testDataSource(data){
			return __httpPost(ctx+"/datasoure/testDataSource",data)
		}


		function __insertDataSourceInfo(data){
			return __httpPost(ctx+"/datasoure/insertDataSourceInfo",data)
		}
			/*数据源端*/
		function __queryDBsource(data){
			return __httpPost(ctx+"/metadata/queryDBsource",data)
		}
		/*数据表*/
		function __queryDBtableById(data){
			return __httpPost(ctx+"/metadata/queryDBtableById",data)
		}
			/*数据字段*/
		function __queryDBfieldById(data){
			return __httpPost(ctx+"/metadata/queryDBfieldById",data)
		}


	}


})();
