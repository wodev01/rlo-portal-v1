'use strict';
app.controller('VerifyCtrl',
    function ($scope, $cookies, $state, $mdDialog, cookieName, localStorage, userObjKey) {

        $scope.fnLogout = function () {
            CarglyPartner.logout(function () {
                $cookies.remove(cookieName);
                localStorage.removeItem(userObjKey);
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
            if (localStorage.getItem(userObjKey)) {
                $scope.userObj = JSON.parse(unescape(localStorage.getItem(userObjKey)));
            }
        };
    });
