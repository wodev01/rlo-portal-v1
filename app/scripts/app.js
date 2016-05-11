'use strict';

/**
 * @ngdoc overview
 * @name rloPortalApp
 * @description
 * # rloPortalApp
 *
 * Main module of the application.
 */
var app = angular
    .module('rloPortalApp', [
        'ngAnimate',
        'ngCookies',
        'ngSanitize',
        'ui.router',
        'ngMaterial',
        'ui.grid',
        'ui.grid.selection',
        'ui.grid.autoResize',
        'ui.grid.pagination',
        'ui.grid.exporter',
        'angular.filter',
        'mdDateTime'
    ])
    .constant('cookieName', 'cargly_rloPortal_access_token')
    .constant('toastr', toastr)
    .constant('moment', moment)
    .constant('localStorage', localStorage)
    .constant('pagingOptions', ["5", "10", "25", "50", "100"])
    .constant('globalTimeZone', ["US/Hawaii", "US/Alaska", "US/Pacific", "US/Arizona", "US/Mountain", "US/Central", "US/Eastern"]);

app.config(function ($mdThemingProvider, $stateProvider, $urlRouterProvider, toastr) {

    $mdThemingProvider.definePalette('rloPalette', {
        '50': 'C0C9E5',
        '100': 'B8C2E0',
        '200': 'A5B4E2',
        '300': '8dA2E0',
        '400': '6C8AE2',
        '500': '5B7BE3',
        '600': '476DE0',
        '700': '3762E5',
        '800': '2454E5',
        '900': '0F44E2',
        'A100': '82B1FF',
        'A200': '448AFF',
        'A400': '2979FF',
        'A700': '2962FF',
        'contrastDefaultColor': 'light',// whether, by default,text (contrast)
        // on this palette should be dark or light
        'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
        'contrastLightColors': undefined    // could also specify this if default was 'dark'
    });

    $mdThemingProvider.theme('rlo')
        .primaryPalette('rloPalette')
        .accentPalette('grey', {
            'default': '900' // use shade 900 for default, and keep all other shades the same
        })
        .warnPalette('red');

    $mdThemingProvider.theme('grey')
        .primaryPalette('grey')
        .accentPalette('indigo');

    $mdThemingProvider.setDefaultTheme('rlo');
    $mdThemingProvider.alwaysWatchTheme(true);

    /*--------- Toastr Configurations ----------*/
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };


    /*--------- Start State Management ----------*/
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('login', {
            url: "/login",
            templateUrl: "views/login.html",
            controller: 'LoginCtrl',
            data:{pageTitle:'Login'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnAuthTokenUndefined();
                }]
            }
        })
        .state('resetPassword', {
            url: "/reset-password",
            templateUrl: "views/resetPassword.html",
            controller: 'ResetPasswordCtrl',
            data:{pageTitle:'Reset Password'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnResetPWTokenVerified();
                }]
            }
        })
        .state('verify', {
            url: "/verify",
            templateUrl: "views/authenticated/verify/verify.html",
            controller: 'VerifyCtrl',
            data:{pageTitle:'User Verify'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('payment', {
            url: "/payment",
            templateUrl: "views/authenticated/payment/payment.html",
            controller: 'PaymentCtrl',
            data:{pageTitle:'Payment'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main', {
            abstract: true,
            url: "/",
            controller: 'MainCtrl',
            templateUrl: "views/authenticated/main.html"
        })
        .state('main.dashboard', {
            url: "dashboard",
            controller: 'DashboardCtrl',
            templateUrl: "views/authenticated/dashboard/dashboard.html",
            data:{pageTitle:'Dashboard'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main.locations', {
            url: "locations",
            controller: 'LocationsCtrl',
            templateUrl: "views/authenticated/locations/locations.html",
            data:{pageTitle:'Locations'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main.worksheet', {
            url: 'worksheet',
            controller: 'worksheetCtrl',
            templateUrl: 'views/authenticated/worksheet/worksheet.html',
            data:{pageTitle:'Worksheet'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser('rlo_standard');
                }]
            }
        })
        .state('main.locationSetup', {
            url: 'location/setup',
            controller: 'LocationSetupCtrl',
            templateUrl: "views/authenticated/locationSetup/locationSetup.html",
            data:{pageTitle:'Location Setup'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        })
        .state('main.settings', {
            url: 'settings/:settingsName',
            controller: 'SettingsCtrl',
            templateUrl: 'views/authenticated/settings/settings.html',
            data:{pageTitle:'Settings'},
            resolve: {
                AuthService: ['AuthService', function (AuthService) {
                    return AuthService.fnGetUser();
                }]
            }
        });

    /*--------- End of State Management ----------*/

});

app.run(function ($rootScope, $mdDialog, $mdSidenav, $cookies, cookieName) {
    /*----- change ui-grid height -----*/
    $rootScope.fnReturnGridHeight = function (dataLength, intRowHeight, isPaginationEnabled, isFilteringEnabled) {
        var rowHeight = 50; // your row height
        var headerHeight = 30; // your header height
        var footerHeight = 32;  // your footer heightv
        var horizScrollBarHeight = 18; // x-scrollbar height

        var rowHeader = headerHeight + (isFilteringEnabled ? 25 : 0);
        var rowContent = (dataLength * (intRowHeight ? intRowHeight : rowHeight)) + horizScrollBarHeight;
        var rowFooter = isPaginationEnabled ? footerHeight : 0;

        return {
            'height': (rowHeader + rowContent + rowFooter) + "px"
        };
    };

    /*----- on cancel search return last view value -----*/
    $rootScope.fnCancelSearchFilter = function (event, ctrlField) {
        if (event.keyCode === 27) {
            ctrlField.searchForm.searchFilter.$rollbackViewValue();
        }
    };

    /*----- Close all open side-navs -----*/
    $rootScope.fnCloseSideNavs = function () {
        var sideNavSelector = angular.element('md-sidenav');

        angular.forEach(sideNavSelector, function (elem) {
            var componentId = angular.element(elem).attr('md-component-id');
            if ($mdSidenav(componentId).isOpen()) {
                $mdSidenav(componentId).close().then(function () {
                });
            }
        });
    };

    /*----- Cargly Configuration -----*/
    CarglyPartner.configure({
        //applicationId: "Ir85FTuOGRMujq9Xy88RrgmqnyoKm8HN", // test
        //applicationId: "bTkSVhhdCDKmJU1KrE9nmwBllTl8iQ9r", // prod
        applicationId: 'UoLKXYzKpidrWeCjosCKGvcrs5sObIA2',
        appLabel: 'rloPortal',
        onTwoMinWarning: function () {
            var IdleSessionCtrl = ['$scope', '$mdDialog', '$interval', function ($scope, $mdDialog, $interval) {
                $scope.countdown;
                $scope.minRemaining = 60;

                $scope.fnCloseDialog = function () {
                    $mdDialog.cancel();
                };

                var interval = $interval(function () {
                    if ($scope.countdown === 0) {
                        $interval.cancel();
                        $scope.fnCloseDialog();
                    }
                    $scope.countdown -= 1;
                }, 1000);

                $scope.$watch('countdown', function (newval) {
                    $scope.minRemaining = parseInt(newval / 60) + 1;
                });

                $scope.extendSession = function () {
                    $scope.fnCloseDialog();
                    CarglyPartner.extendSession(function () {
                    }, function () {
                    });
                }

            }];

            var token = $cookies.get(cookieName);

            if (token) {
                $mdDialog.show({
                    controller: IdleSessionCtrl,
                    templateUrl: 'views/modals/idleSession.tmpl.html',
                    clickOutsideToClose: false
                });
            }
        },
        onAuthChanged: function () {
        }
    });

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i) || navigator.platform.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i) || navigator.platform.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) || navigator.platform.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    $rootScope.isMobile = isMobile.any();

});
