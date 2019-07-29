(function () {
    'use strict';

    /*
    * 数据源
    * MetaStandardController
    */
    angular.module("MetronicApp").controller("MetaStandardController", MetaStandardController);
    MetaStandardController.$inject = ["$rootScope", '$scope', 'settings','ds'];
    function MetaStandardController($rootScope, $scope, settings, ds, $state) {
        var hasInit = false;
        $scope.data=[];
        $scope.query = query;

      function query(){
        $scope.$emit("spinnerShow");
        ds._metadataQueryDBsource()
          .then(function(res) {
            $scope.data = res.data.data;
            $scope.$emit('spinnerHide');
          }, function(res) {
            $scope.data=[];
            $scope.$emit('spinnerHide');
          });
        }

        function initPage(){
          if(hasInit){return;}
          hasInit = true;
          $scope.query();
        }

        $scope.$on('$viewContentLoaded', function () {
            initPage();
        });
    }

    /*
    * 数据表
    * MetaStandardTableController
    */
    angular.module("MetronicApp").controller("MetaStandardTableController", MetaStandardTableController);
    MetaStandardTableController.$inject = ["$rootScope", '$scope', 'settings','ds', '$stateParams'];
    function MetaStandardTableController($rootScope, $scope, settings, ds, $stateParams) {
        var hasInit = false;
        $scope.data=[];
        $scope.table = {};
        $scope.query = query;
        $scope.update = update;
        $scope.updateClick = updateClick;

        function query(){
            $scope.$emit("spinnerShow");
            ds._metadataQueryDBtable({dbsource_id: $scope.dbsourceId})
              .then(
                function(res) {
                $scope.data = res.data.data;
                $scope.$emit('spinnerHide');
              },function(res) {
                $scope.data=[];
                $scope.$emit('spinnerHide');
                console.log(res);
          });
        }

        function update(item, index){
            angular.copy(item, $scope.table);
            $scope.table.index = index;
        }

        function updateClick(){
            if(!$scope.table.ID || !$scope.table.TABLE_NAME){
                swal("请填写表名称", " ", "warning");
                return;
            }
            $('#modal_table').modqueryTableal('hide');
            var data = {
                id: $scope.table.ID,
                name: $scope.table.TABLE_NAME,
                table_note: $scope.table.note
            };
            $scope.$emit("spinnerShow");
            ds._metadataUpdateDBtable(data).then(function(res) {
                console.log(res);
                $scope.$emit('spinnerHide');
                if(res.data.code == constant.CODE_SUCCESS){
                    angular.copy($scope.table, $scope.data[$scope.table.index]);//深拷贝：单条数据修改时覆盖刷新
                    swal("操作成功", " ", "success", {buttons:false, timer:1500});//sweetalert插件----提示
                } else{
                    swal("操作失败", " ", "error", {buttons:false, timer:1500});
                }
			}, function(res) {
                $scope.$emit('spinnerHide');
                swal("操作失败", " ", "error", {buttons:false, timer:1500});
                console.log(res);
			});
        }

        function initPage(){
          if(hasInit){return;}
          hasInit = true;
          $scope.query();
        }

        $scope.$on('$viewContentLoaded', function () {
            $scope.dbsourceId = $stateParams.sid;
            initPage();
        });
    }

    /*
    * 数据表详情：传进表的ID==查询表详情、表字段新增和修改时同一个方法
    * MetaStandardInfoController
    */
    angular.module("MetronicApp").controller("MetaStandardInfoController", MetaStandardInfoController);
    MetaStandardInfoController.$inject = ["$rootScope", '$scope', 'settings', 'ds', '$stateParams'];
    function MetaStandardInfoController($rootScope, $scope, settings, ds, $stateParams) {
        var hasInit = false;
        $scope.table={};
        $scope.cols =[];
        $scope.col = {};
        $scope.query = query;
        $scope.publish = publish;
        $scope.remove = remove;
        $scope.save = save;
        $scope.saveClick = saveClick;

        function query(){
            $scope.$emit("spinnerShow");
            ds._metadataQueryDBtableInfo({id: $scope.tableId}).then(function(res) {
				$scope.table = res.data.data;
                $scope.$emit('spinnerHide');
			}, function(res) {
				$scope.table={};
                $scope.$emit('spinnerHide');
                console.log(res);
            });

            ds._metadataQueryDBfield({dbtable_id: $scope.tableId}).then(function(res) {
				$scope.cols = res.data.data;
                $scope.$emit('spinnerHide');
			}, function(res) {
				$scope.cols=[];
                $scope.$emit('spinnerHide');
                console.log(res);
			});
        }
            /*发布*/
        function publish(id, index){//第二个副标题   英文文档
            swal("发布字段 ？", "", "warning", {
                buttons: ["取消", "确定"],
                dangerMode: true
            })
            .then((value) => {//判断存在与否
                if(value){
                    ds._metadataPublishDBfield({id: id}).then(function(res) {
                        if(res.data.code == constant.CODE_SUCCESS){
                            $scope.cols[index].STATUS = 1;
                            swal("操作成功", " ", "success", {buttons:false, timer:1500});
                        } else{
                            swal("操作失败", " ", "error", {buttons:false, timer:1500});
                        }
                    }, function(res) {
                        swal("操作失败", " ", "error", {buttons:false, timer:1500});
                    });
                }
            });
        }

        function remove(id, index){
            var ids = [];
            ids.push(id);
            swal("删除字段 ？", " ", "warning", {
                buttons: ["取消", "确定"],
                dangerMode: true
            })
            .then((value) => {
                if(value){
                    ds._metadataDeleteDBfield({ids: id}).then(function(res) {
                        console.log(res)
                        if(res.data.code == constant.CODE_SUCCESS){
                            $scope.cols.splice(index, 1);
                            swal("操作成功", " ", "success", {buttons:false, timer:1500});
                        } else{
                            swal("操作失败", " ", "error", {buttons:false, timer:1500});
                        }
                    }, function(res) {
                        swal("操作失败", " ", "error", {buttons:false, timer:1500});
                    });
                }
            });
        }
        /*表字段新增*/
        function save(item, index){
            angular.copy(item, $scope.col);
            $scope.col.index = index;
        }
        /*保存*/
        function saveClick(){
            if(!$scope.table.TABLE_NAME){
                swal("请填写内容", " ", "warning");
                return;
            }
            $('#modal_col').modal('hide');
            var data = {
                dbtable_id: $scope.tableId,
                id: $scope.col.ID,
                field_name: $scope.col.FIELD_NAME,
                field_type: $scope.col.FIELD_TYPE,
                field_length: $scope.col.FIELD_LENGTH,
                field_note: $scope.col.FIELD_NOTE,
                remarks: $scope.col.remarks
            };

            $scope.$emit("spinnerShow");
            ds._metadataSavaDBfield(data).then(function(res) {
                console.log(res);
                $scope.$emit('spinnerHide');
                if(res.data.code == constant.CODE_SUCCESS){
                    if($scope.col.ID){
                        angular.copy($scope.col, $scope.cols[$scope.col.index]);//修改
                    }else{
                        $scope.query();//新增数据获取一下新增的ID
                    }

                    swal("操作成功", " ", "success", {buttons:false, timer:1500});
                } else{
                    swal("操作失败", " ", "error", {buttons:false, timer:1500});
                }
			}, function(res) {
                $scope.$emit('spinnerHide');
                swal("操作失败", " ", "error", {buttons:false, timer:1500});
                console.log(res);
			});
        }

        function initPage(){
			if(hasInit){return;}
			hasInit = true;
			$scope.query();
		}

        $scope.$on('$viewContentLoaded', function () {
            $scope.tableId = $stateParams.tid;
            $scope.sourceName = $stateParams.sname;
            initPage();
        });
    }




    /*
    * 元数据标准
    * MetaStandardController1
    */
    angular.module("MetronicApp").controller("MetaStandardController1", MetaStandardController1);
    MetaStandardController1.$inject = ["$rootScope", '$scope', 'settings','ds'];
    function MetaStandardController1($rootScope, $scope, settings, ds, $state) {
        var hasInit = false;
        $scope.sources= [];
        $scope.source = {};
        $scope.tables = [];
        $scope.table = {};
        $scope.cols = [];
        $scope.col = {};

        $scope.query = query;
        $scope.queryTable = queryTable;
        $scope.queryTableCol = queryTableCol;
        $scope.updateTable = updateTable;
        $scope.updateTableClick = updateTableClick;
        $scope.publishCol = publishCol;
        $scope.removeCol = removeCol;
        $scope.saveCol = saveCol;
        $scope.saveColClick = saveColClick;

        function query(){
            $scope.$emit("spinnerShow");
            ds._metadataQueryDBsource().then(function(res) {
                $scope.sources = res.data.data;
                $scope.$emit('spinnerHide');
            }, function(res) {
                $scope.sources=[];
                $scope.$emit('spinnerHide');
            });
        }

        function queryTable(item){
            $scope.source = item;
            $scope.cols = {};
            $scope.$emit("spinnerShow");
            ds._metadataQueryDBtable({dbsource_id: item.ID}).then(function(res) {
                console.log(res,'000');
                $scope.tables = res.data.data;
                $scope.$emit('spinnerHide');
            }, function(res) {
            $scope.tables=[];
                $scope.$emit('spinnerHide');
                console.log(res);
          });
        }

        function queryTableCol(item){
            $scope.table = item;
            ds._metadataQueryDBfield({dbtable_id: item.ID}).then(function(res) {
            $scope.cols = res.data.data;
            $scope.$emit('spinnerHide');
        }, function(res) {
            $scope.cols=[];
                $scope.$emit('spinnerHide');
                console.log(res);
			});
        }
        /*修改表*/
        function updateTable(item, index){
            angular.copy(item, $scope.table);
            $scope.table.index = index;
        }
        /*修改表*/
        function updateTableClick(){
            if(!$scope.table.ID || !$scope.table.TABLE_NAME){
                swal("请填写表名称", " ", "warning");
                return;
            }
            $('#modal_table').modal('hide');
            var data = {
                id: $scope.table.ID,
                name: $scope.table.TABLE_NAME,
                table_note: $scope.table.note
            };
            $scope.$emit("spinnerShow");
            ds._metadataUpdateDBtable(data).then(function(res) {
                console.log(res);
                $scope.$emit('spinnerHide');
                if(res.data.code == constant.CODE_SUCCESS){
                    angular.copy($scope.table, $scope.tables[$scope.table.index]);
                    swal("操作成功", " ", "success", {buttons:false, timer:1500});
                } else{
                    swal("操作失败", " ", "error", {buttons:false, timer:1500});
                }
			}, function(res) {
                $scope.$emit('spinnerHide');
                swal("操作失败", " ", "error", {buttons:false, timer:1500});
                console.log(res);
			});
        }


        function publishCol(id, index){
            swal("发布字段 ？", " ", "warning", {
                buttons: ["取消", "确定"],
                dangerMode: true
            })
            .then((value) => {
                if(value){
                    ds._metadataPublishDBfield({id: id}).then(function(res) {
                        if(res.data.code == constant.CODE_SUCCESS){
                            $scope.cols[index].STATUS = 1;
                            swal("操作成功", " ", "success", {buttons:false, timer:1500});
                        } else{
                            swal("操作失败", " ", "error", {buttons:false, timer:1500});
                        }
                    }, function(res) {
                        swal("操作失败", " ", "error", {buttons:false, timer:1500});
                    });
                }
            });
        }

        function removeCol(id, index){
            var ids = [];
            ids.push(id);
            swal("删除字段 ？", " ", "warning", {
                buttons: ["取消", "确定"],
                dangerMode: true
            })
            .then((value) => {
                console.log(value,'value')
                if(value){
                    ds._metadataDeleteDBfield({ids: id}).then(function(res) {
                        console.log(res)
                        if(res.data.code == constant.CODE_SUCCESS){
                            $scope.cols.splice(index, 1);
                            swal("操作成功", " ", "success", {buttons:false, timer:1500});
                        } else{
                            swal("操作失败", " ", "error", {buttons:false, timer:1500});
                        }
                    }, function(res) {
                        swal("操作失败", " ", "error", {buttons:false, timer:1500});
                    });
                }
            });
        }

        function saveCol(item, index){
            angular.copy(item, $scope.col);
            $scope.col.index = index;
        }

        function saveColClick(){
            if(!$scope.table.TABLE_NAME){
                swal("请填写内容", " ", "warning");
                return;
            }
            $('#modal_col').modal('hide');
            var data = {
                dbtable_id: $scope.tableId,
                id: $scope.col.ID,
                field_name: $scope.col.FIELD_NAME,
                field_type: $scope.col.FIELD_TYPE,
                field_length: $scope.col.FIELD_LENGTH,
                field_note: $scope.col.FIELD_NOTE,
                remarks: $scope.col.remarks
            };

            $scope.$emit("spinnerShow");
            ds._metadataSavaDBfield(data).then(function(res) {
                console.log(res);
                $scope.$emit('spinnerHide');
                if(res.data.code == constant.CODE_SUCCESS){
                    if($scope.col.ID){
                        angular.copy($scope.col, $scope.cols[$scope.col.index]);
                    }else{
                        $scope.queryTableCol();
                    }

                    swal("操作成功", " ", "success", {buttons:false, timer:1500});
                } else{
                    swal("操作失败", " ", "error", {buttons:false, timer:1500});
                }
			}, function(res) {
                $scope.$emit('spinnerHide');
                swal("操作失败", " ", "error", {buttons:false, timer:1500});
                console.log(res);
			});
        }

        function initPage(){
            if(hasInit){return;}
            hasInit = true;
            $scope.query();
        }

        $scope.$on('$viewContentLoaded', function () {
            initPage();
        });
    }

})();
