'use strict';
app.controller('AccountSettingsCtrl',
	function ($scope, accountServices, $mdDialog, toastr, globalTimeZone, $stateParams, locationService) {
        $scope.isProcessing = false;
        $scope.updateAccountForm = function () {
            if (CarglyPartner.accountInfo) {
                $scope.user = {
                    businessName: CarglyPartner.accountInfo.businessName,
                    website: CarglyPartner.accountInfo.website,
                    address: CarglyPartner.accountInfo.address,
                    city: CarglyPartner.accountInfo.city,
                    state: CarglyPartner.accountInfo.state,
                    zip: CarglyPartner.accountInfo.zip,
                    timezone: CarglyPartner.accountInfo.timezone,
                    contactName: CarglyPartner.accountInfo.contactName,
                    paymentProcessingSecretKey: CarglyPartner.accountInfo.paymentProcessingSecretKey,
                    paymentProcessingPublicKey: CarglyPartner.accountInfo.paymentProcessingPublicKey,
                    paymentProcessingAccountId: CarglyPartner.accountInfo.paymentProcessingAccountId
                };
                $scope.paymentInfo = {
                    subscriptionType : 'None ($0.00/month)',
                    cardType : CarglyPartner.accountInfo.cardType,
                    cardLast4 : CarglyPartner.accountInfo.cardLast4
                };
                $scope.email = CarglyPartner.accountInfo.email;
            }
        };

        $scope.fnInitAccount = function () {
            $scope.timeZoneDDOptions = globalTimeZone;
            if ($stateParams.settingsName == 'account') {
                $scope.fetchAccount();
            }
        };

        $scope.fetchAccount = function () {
            $scope.isProcessing = true;
            accountServices.fetchAccount(CarglyPartner.user.id)
                .then(function (data) {
                    $scope.isProcessing = false;
                    CarglyPartner.accountInfo = data;
                    $scope.updateAccountForm();
                    $scope.fetchPartnerLocations();
                });
        };

        $scope.fetchPartnerLocations = function () {
            var subscriptionsArr = [];
            locationService.fetchPartnerLocations(CarglyPartner.user.partnerId).then(function(res){
                angular.forEach(res,function(key){
                    subscriptionsArr.push({'locationName':key.name,'subscriptions':key.subscriptions});
                });
                $scope.paymentInfo.subscriptionsList = subscriptionsArr;
            });
        };

        //$broadcast event
        $scope.$on('refreshFetchAccount', function () {
            $scope.fetchAccount();
        });

        $scope.cancel = function () {
            $scope.fetchAccount();
        };

        $scope.updateUser = function () {
            var id = CarglyPartner.user.id;
            if (id.length === 0) { id = null; }
            $scope.isProcessing = true;
            accountServices.updateAccount (id, $scope.user).then(function(res){
                if(res===null){
                    $scope.fetchAccount();
                    toastr.success('Account information saved successfully.');
                }else{
                    toastr.error('Account information can\'t saved.');
                }
                $scope.isProcessing = false;
            });
        };

        $scope.openUserPaymentInfo = function (ev) {
            $mdDialog.show({
                controller: 'paymentInfoCtrl',
                templateUrl: 'views/authenticated/settings/modals/updatePaymentInfo.html',
                targetEvent: ev
            });
        };
    });
