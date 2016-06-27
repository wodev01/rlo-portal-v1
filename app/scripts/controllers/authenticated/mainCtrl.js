'use strict';

app.controller('MainCtrl', function ($scope, $mdDialog, $location, $cookies, cookieName, $state, $mdSidenav,locationService) {

    $scope.partnerLocations = [];
    $scope.lastConfig = {};

    $scope.fnToggleSideNav = function (componentId) {
        $mdSidenav(componentId).toggle().then(function () {
            if ($mdSidenav(componentId).isOpen()) {
                var leftNavElem = $('.left-side-nav').parent().find('md-backdrop').first();
                $(leftNavElem).css('z-index', '61');
            }
        });
    };

    $scope.fnIsActive = function (viewLocation) {
        return viewLocation === $location.path() ? 'md-warn' : '';
    };

    $scope.fnIsSyncEnabled = function(status){
        if(status == 'yes')
            return 'green-indicator';
        else if(status == 'no')
            return 'red-indicator';
        else
            return 'md-accent';
    };

    $scope.fnGetLocationStatusForVideoIndicator = function(locId){
        $scope.lastConfig = {};
        var locObj = {}, idx = $scope.partnerLocations.map(function(obj){return obj.id}).indexOf(locId);
        if(idx > -1){
            locObj = $scope.partnerLocations[idx];
        }
        if(locObj.id) {
            locObj.lastConfig = typeof locObj.lastConfig === 'string' ? JSON.parse(locObj.lastConfig) : locObj.lastConfig;
            if (locObj.lastConfig !== null) {
                var settings = locObj.lastConfig.settings;
                //sync is enabled, and we've received at least one repair order in the last 3 days
                if (settings['carglyconnect.syncenabled'] === 'yes') {
                    $scope.lastConfig.color = '#00D500'; //green
                    $scope.lastConfig.msg = 'Location "'+locObj.name+'" synchronization is enabled.';
                }
                else if (settings['carglyconnect.syncenabled'] === 'no') {
                    //sync is disabled. Prompt them to enable syncing
                    $scope.lastConfig.color = '#FFFF00';//yellow
                    $scope.lastConfig.msg = 'Location "'+locObj.name+'" synchronization is disabled.';
                }
                if (settings['carglyconnect.lastsync'] !== '') {
                    var lastSyncDate = new Date(settings['carglyconnect.lastsync']);
                    var currentDate = new Date(Date.now());
                    var timeDiff = Math.abs(currentDate.getTime() - lastSyncDate.getTime());
                    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    //This is the timestamp of the last time a sync operation sent us any data. If its been more than a few days since we've had anything sync'd something is wrong.
                    if (diffDays > 3) {
                        $scope.lastConfig.color = '#DD0000';//red
                        $scope.lastConfig.msg = 'Location "'+locObj.name+'" not sync\'d something is wrong.';
                    }
                }
            }
            else if (locObj.lastConfig === null) {
                $scope.lastConfig.color = '#9E9E9E';//gray
                $scope.lastConfig.msg = 'Location "'+locObj.name+'" not sync\'d something is wrong.';
            }
        }
    };

    /*---------- Fetch locations ----------*/
    $scope.fnGetLocationDetails = function () {
        //$scope.locationDDOptions = [];
        locationService.fetchLocation().then(function (response) {
            $scope.partnerLocations = response;
            $scope.fnGetLocationStatusForVideoIndicator(response[0].id);
        }, function (error) {
            toastr.error('Retrieving locations failed.', 'STATUS CODE: ' + error.status);
        });
    };


    $scope.fnLogout = function () {
        CarglyPartner.logout(function () {
            $cookies.remove(cookieName);
            $state.go('login');
        }, function () {
        });
    };

    $scope.fnStateSettings = function () {
        $state.go('main.settings', {'settingsName': 'account'});
    };

    $scope.fnInitMain = function () {
        if (CarglyPartner.user) {
            $scope.userObj = CarglyPartner.user;
            $scope.userSubscriptions = JSON.parse(CarglyPartner.user.subscriptions);
        }
        $scope.fnGetLocationDetails();
    };

    $scope.fnCheckSubscription = function (userSubscriptions, subscription) {
        var hasSubscriptions = true;
        if(userSubscriptions !== null && userSubscriptions !== "") {
            angular.forEach(userSubscriptions, function (obj) {
                /*if (obj.subscriptions.indexOf('rlo_standard') === -1) {obj.subscriptions.push('rlo_standard');}*/
                if (hasSubscriptions) {
                    if (obj.subscriptions.indexOf(subscription) === -1) {
                        hasSubscriptions = false;
                    }
                }
            });
        }else{
            hasSubscriptions = false;
        }
        return hasSubscriptions;
    };
});
