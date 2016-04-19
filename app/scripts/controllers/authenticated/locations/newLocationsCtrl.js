'use strict';
app.controller('newLocationsCtrl',
    function ($scope, $rootScope, toastr, globalTimeZone, locationService) {

        $scope.location = {timezone: 'US/Central'};
        $scope.isProcessing = false;

        $scope.fnSaveLocation = function (location) {
            $scope.isProcessing = true;
            locationService.saveLocation('',location)
                .then(function (response) {
                    $scope.isProcessing = false;
                    toastr.success('Location save successfully.');
                    $scope.location = {timezone: 'US/Central'};
                    $scope.locationForm.$setUntouched();
                    $rootScope.$broadcast('RefreshLocations');

                }, function (error) {
                    $scope.isProcessing = false;
                    toastr.error('Can\'t be saved, repeated email or invalid information.',
                        'STATUS CODE: ' + error.status);
                });

            $scope.closeNewLocationSwap();
        };

        $scope.fnInitLocation = function () {
            $scope.timeZoneDDOptions = globalTimeZone;
        };

    });
