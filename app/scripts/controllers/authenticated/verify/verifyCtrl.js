'use strict';
app.controller('VerifyCtrl',
    function ($scope, $cookies, $state, $timeout, $mdDialog, cookieName, toastr) {

        $scope.isProcessing = false;
        $scope.fnLogout = function () {
            CarglyPartner.logout(function () {
                $cookies.remove(cookieName);
                $state.go('login');
            }, function () {});
        };

        $scope.fnRefreshDom = function(){
            $timeout(function(){$scope.$apply();});
        };

        $scope.fnReconfirmUser = function () {
            $scope.isProcessing = true;
            CarglyPartner.reconfirmUser(function () {
                $scope.isProcessing = false;
                $scope.fnRefreshDom();
                toastr.success('Confirmation email sent successfully.');
            });
        };

        $scope.fnInitVerify = function () {
            if (CarglyPartner.user) {
                $scope.userObj = CarglyPartner.user;
            }
        };
    });
