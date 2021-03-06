'use strict';
app.controller('BillingHistoryCtrl',
    function ($scope, $stateParams, $state, billingHistoryService) {

        $scope.billingHistoryFilterOptions = {
            useExternalFilter: false
        };

        $scope.billingHistoryTotalServerItems = 0;

        $scope.setPagingData = function (data) {
            $scope.billingHistoryData = data;
            $scope.billingHistoryTotalServerItems = data.length;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsync = function () {
            billingHistoryService.fetchBillingHistory().then(function (data) {
                if (data.length !== 0) {
                    $scope.isDataNotNull = true;
                    $scope.isMsgShow = false;
                    $scope.setPagingData(data);
                } else {
                    $scope.isDataNotNull = false;
                    $scope.isMsgShow = true;
                }
            });
        };

        $scope.billingHistoryGridOptions = {
            data: 'billingHistoryData',
            rowHeight: 50,
            multiSelect: false,
            enableRowSelection: true,
            enableRowHeaderSelection: false,
            enableVerticalScrollbar: 0,
            columnDefs: [
                {
                    field: 'date',
                    displayName: 'Date',
                    minWidth: 100,
                    cellFilter: 'date:\'dd-MM-yyyy\'',
                    enableHiding: false
                },
                {field: 'reference', displayName: 'Invoice #', minWidth: 200, enableHiding: false},
                {field: 'description', displayName: 'Description', minWidth: 250, enableHiding: false},
                {field: 'amount', cellFilter:'CentToDollar | currency', displayName: 'Amount', minWidth: 100, enableHiding: false}
            ],
            onRegisterApi: function (gridApi) {
                gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                    row.isSelected = true;
                });
            }
        };

        $scope.fnInitBillingHistory = function () {
            if ($stateParams.settingsName == 'billingHistory') {
                $scope.getPagedDataAsync();
            }
        };

    });