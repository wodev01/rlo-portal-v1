'use strict';
app.controller('repairOrderCtrl',
    function ($scope, toastr, locationService) {

        $scope.getPagedDataAsync = function () {
            // repair Order call
            if (locationService.getLocationObj().id) {
                var locationID = locationService.getLocationObj().id;
                locationService.repairOrder(locationID)
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
                        toastr.error('Failed retrieving repair order data.', 'STATUS CODE: ' + error.status);
                    });
            }
        };

        $scope.repairOrderGridOptions = {
            data: 'repairOrdersData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {field: 'customer.first_name', displayName: 'Name', minWidth: 150, enableHiding: false},
                {field: 'writer.full_name', displayName: 'Writer Name', minWidth: 200, enableHiding: false},
                {field: 'order_status', displayName: 'Status', minWidth: 100, enableHiding: false},
                {field: 'technician_name', displayName: 'Technician', minWidth: 200, enableHiding: false},
                {
                    field: 'opened',
                    displayName: 'Arrived',
                    cellFilter: 'date:"dd-MM-yyyy, h:mm:ss a"',
                    minWidth: 180, enableHiding: false
                },
                {
                    field: 'closed',
                    displayName: 'Closed',
                    cellFilter: 'date:"dd-MM-yyyy, h:mm:ss a"',
                    minWidth: 180, enableHiding: false
                }
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnInitRepairOrders = function () {
            $scope.getPagedDataAsync();
        };

    });