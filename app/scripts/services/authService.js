'use strict';
app.factory('AuthService', ['$q', '$state', '$location', '$http', '$timeout', '$cookies', 'paymentService', 'cookieName', 'ErrorMsg',
    function ($q, $state, $location, $http, $timeout, $cookies, paymentService, cookieName, ErrorMsg) {
        var AuthService = {};

        function fnCheckSubscription(res, subscription) {
            var hasSubscriptions = true;
            if (res.subscriptions !== null && res.subscriptions !== "") {
                var userSubscriptions = JSON.parse(res.subscriptions);
                angular.forEach(userSubscriptions, function (obj) {
                    if (hasSubscriptions) {
                        if (obj.subscriptions.indexOf(subscription) === -1) {
                            hasSubscriptions = false;
                        }
                    }
                });
            } else {
                hasSubscriptions = false;
            }
            return hasSubscriptions;
        }

        AuthService.fnGetUser = function (subscription) {
            var token = $cookies.get(cookieName);
            var defer = $q.defer();
            if (!angular.isUndefined(token)) {
                CarglyPartner._getUser(token, function (response) {
                    /*---- Check User is verified or not ----*/
                    if (response.verified === 'true') {
                        /*----- if User is verified then check it's payment info available or not ----*/
                        /*paymentService.fetchUserPaymentInfo()
                            .then(function (res) {
                                if (res.status === 404) {
                                    $timeout(function () {$state.go('payment');});
                                    defer.resolve(res);
                                }
                                else {*/
                                    /*---- Check subscription if define in ui route ----*/
                                    if (!angular.isUndefined(subscription)) {
                                        if (fnCheckSubscription(response, subscription)) {
                                            defer.resolve(response);
                                        } else {
                                            $timeout(function () {$state.go('main.dashboard');});
                                            defer.resolve(response);
                                        }
                                    } else {
                                        /*---- If User already login and it's payment or verify information available then verify and payment page not access ---*/
                                        if ($location.path() === '/verify' ||
                                            $location.path() === '/payment') {
                                            if ($state.current.name === '') {
                                                $location.url('/dashboard');
                                                defer.resolve(response);
                                            } else {
                                                defer.reject();
                                            }
                                        } else {
                                            defer.resolve(response);
                                        }
                                    }
                                /*}
                            });*/
                    } else {
                        $timeout(function () {$state.go('verify');});
                        defer.resolve();
                    }
                }, function (error) {
                    if (error) {
                        ErrorMsg.CheckStatusCode(error.status);
                    }
                });
            } else {
                if (CarglyPartner.queryParams != null && CarglyPartner.queryParams.resetpw != null
                    && CarglyPartner.queryParams.resetpw != '') {
                    if ($state.current.name === '') {
                        $timeout(function () {$state.go('resetPassword');});
                        defer.resolve();
                    } else {
                        defer.reject();
                    }
                } else {
                    if ($state.current.name === '') {
                        $timeout(function () {$state.go('login');});
                        defer.resolve();
                    } else {
                        defer.reject();
                    }
                }
            }

            return defer.promise;
        };

        return AuthService;
    }
]);
