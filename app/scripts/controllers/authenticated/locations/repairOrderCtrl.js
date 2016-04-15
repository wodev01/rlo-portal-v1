'use strict';
app.controller('repairOrderCtrl',
    function ($scope, $http, $timeout, $mdSidenav, $log, $cookies, $state, $mdDialog, userService, locationService) {

        var _paginationPageSize = 5;

        $scope.repairOrderFilterOptions = {
            filterText: '',
            useExternalFilter: false
        };

        $scope.repairOrderTotalServerItems = 0;
        $scope.pagingOptions = {
            pageSizes: [5, 10, 25, 50],
            pageSize: 5,
            currentPage: 1
        };

        $scope.getPagedDataAsync = function () {
            // repair Order call
            if (locationService.getLocationObj().id) {
                $scope.locationID = locationService.getLocationObj().id;
                locationService.repairOrder($scope.locationID)
                    .then(function (data) {
                        if (data.length !== 0) {
                            $scope.isDataNotNull = true;
                            $scope.isMsgShow = false;
                            $scope.repairOrdersData = data;
                        } else {
                            $scope.isDataNotNull = false;
                            $scope.isMsgShow = true;
                        }
                    }, function (error) {
                    });
            }
        };

        $scope.$on('refreshrepairOrders', function () {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);
        });

        $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

        $scope.repairOrderGridOptions = {
            data: 'repairOrdersData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'customer.first_name', displayName: 'Name', minWidth: 100, enableHiding: false},
                {field: 'writer.full_name', displayName: 'Writer Name', minWidth: 150, enableHiding: false},
                {field: 'order_status', displayName: 'Status', minWidth: 100, enableHiding: false},
                {field: 'technician_name', displayName: 'Technician', minWidth: 150, enableHiding: false},
                {
                    field: 'opened',
                    displayName: 'Arrived',
                    cellFilter: 'date:"dd-MM-yyyy, h:mm:ss a"',
                    minWidth: 150, enableHiding: false
                },
                {
                    field: 'closed',
                    displayName: 'Closed',
                    cellFilter: 'date:"dd-MM-yyyy, h:mm:ss a"',
                    minWidth: 150, enableHiding: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

    });
