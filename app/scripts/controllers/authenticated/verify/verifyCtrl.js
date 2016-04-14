'use strict';
app.controller('VerifyCtrl',
    function ($scope, $cookies, $state, $mdDialog, cookieName) {

        $scope.fnLogout = function () {
            CarglyPartner.logout(function () {
                $cookies.remove(cookieName);
                $state.go('login');
            }, function () {
            });
        };

        $scope.isReconfirmUser = false;
        $scope.fnReconfirmUser = function () {
            CarglyPartner.reconfirmUser(function () {
                $scope.isReconfirmUser = true;
                $scope.$apply();
            });
        };

        $scope.fnInitVerify = function () {
            if (CarglyPartner.user) {
                $scope.userObj = CarglyPartner.user;
            }
        };
    });
