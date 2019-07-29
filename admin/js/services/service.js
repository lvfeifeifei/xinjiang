(function(){
	'use strict';

	angular.module('dataservice',[]).factory('ds', dataservice);
	dataservice.$inject = ['$http'];
	function dataservice($http) {
		return {
			_testDataSource: _testDataSource ,
			_insertDataSourceInfo: _insertDataSourceInfo,

			/* 元数据管理 */
			_metadataQueryDBsource: _metadataQueryDBsource,
			_metadataQueryDBtable: _metadataQueryDBtable,
			_metadataQueryDBfield: _metadataQueryDBfield,
			_metadataQueryDBtableInfo: _metadataQueryDBtableInfo,
			_metadataUpdateDBtable: _metadataUpdateDBtable,
			_metadataSavaDBfield: _metadataSavaDBfield,
			_metadataDeleteDBfield: _metadataDeleteDBfield,
			_metadataPublishDBfield: _metadataPublishDBfield,

		};

		function _httpPost(url, data){
			//统一加密
			return $http.post(url ,data);
		}

		function _testDataSource(data){
			return _httpPost(ctx+"/datasoure/testDataSource",data)
		}

		function _insertDataSourceInfo(data){
			return _httpPost(ctx+"/datasoure/insertDataSourceInfo",data)
		}

		/* 元数据管理 */
		// 查询所有的数据源
		function _metadataQueryDBsource(data){
			return _httpPost(ctx+"/metadata/queryDBsource",data);
		}
		
		// 根据数据源id查询数据源表
		function _metadataQueryDBtable(data){
			return _httpPost(ctx+"/metadata/queryDBtableById",data);
		}
		// 根据表的id查询表中的字段
		function _metadataQueryDBfield(data){
			return _httpPost(ctx+"/metadata/queryDBfieldById",data);
		}

		// 根据表id查询表的详情
		function _metadataQueryDBtableInfo(data){
			return _httpPost(ctx+"/metadata/queryDBtableInfoById",data);
		}
		
		// 修改表名
		function _metadataUpdateDBtable(data){
			return _httpPost(ctx+"/metadata/updateDBtableById",data);
		}

		// 保存表字段（新增、修改）
		function _metadataSavaDBfield(data){
			return _httpPost(ctx+"/metadata/savaDBfield",data);
		}

		// 删除表字段
		function _metadataDeleteDBfield(data){
			return _httpPost(ctx+"/metadata/deleteDBfield",data);
		}

		// 发布表字段
		function _metadataPublishDBfield(data){
			return _httpPost(ctx+"/metadata/publishDBfield",data);
		}
	}


})();
