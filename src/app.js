﻿var env = 'local';
var base_url;
if (env == 'local') {
    base_url = "./data/"
} else {
    base_url = window.location.protocol + "://" + window.location.host + ":" + window.location.port + "/";
}

var app = angular.module('app', ['ngResource',
    'oc.lazyLoad',
    'app.config',
    'ui.router',
    'ngSanitize',
    'angular-bind-html-compile',
    'localytics.directives',
    'ngTouch',
    'underscore',
    'ngMessages',
    'angularMoment',
    'commons',
    'accueil',
    'authentification',
    'biensePreparer',
    'exposants',
    'infosPratique'
]).constant('urls', {
    BASE: base_url
});

app.config(
    function ($stateProvider, $httpProvider, $urlRouterProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = undefined;
        $httpProvider.defaults.headers.put['Content-Type'] = undefined;
        $httpProvider.defaults.transformRequest = angular.identity;

        //$urlRouterProvider.otherwise("/");
        $stateProvider
            .state('index', {
                abstract: true,
                url: "/", // root route
                templateUrl: 'index.html'
            })
            .state('accueil', {
                url: "/accueil",
                templateUrl: 'src/accueil/accueil.html',
                controller: 'accueilController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'accueil',
                            files: [
                                'src/accueil/accueilController.js',
                                'src/accueil/accueilService.js'
                            ]
                        });
                    }]
                }
            })
            .state('actualites', {
                url: '/actualites/{id:[0-9]*}',
                templateUrl: 'src/accueil/accueil.html',
                controller: 'accueilController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'actualites',
                            files: [
                                'src/accueil/accueilController.js',
                                'src/accueil/accueilService.js'
                            ]
                        });
                    }]
                }
            })
            .state('connexion', {
                url: "/connexion",
                templateUrl: 'src/authentification/authentification.html',
                controller: 'authentificationController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'authentification',
                            files: [
                                'src/authentification/authentificationController.js',
                                'src/authentification/authentificationService.js'
                            ]
                        });
                    }]
                }
            })
            .state('inscription', {
                url: "/inscription",
                templateUrl: 'src/authentification/authentification.html',
                controller: 'authentificationController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'authentification',
                            files: [
                                'src/authentification/authentificationController.js',
                                'src/authentification/authentificationService.js'
                            ]
                        });
                    }]
                }
            })
            .state('biensepreparer', {
                url: "/biensepreparer",
                templateUrl: 'src/bien_se_preparer/bien_se_preparer.html',
                controller: 'biensePreparerController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'biensePreparer',
                            files: [
                                'src/bien_se_preparer/biensePreparerController.js',
                                'src/bien_se_preparer/biensePreparerService.js'
                            ]
                        });
                    }]
                }
            })
            .state('listeexposants', {
                url: "/listeexposants",
                templateUrl: 'src/exposants/exposants.html',
                controller: 'exposantsController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'exposants',
                            files: [
                                'src/exposants/exposantsController.js',
                                'src/exposants/exposantsService.js'
                            ]
                        });
                    }]
                }
            })
            .state('exposants', {
                url: "/exposants/{id:[0-9]*}",
                templateUrl: 'src/exposants/exposants.html',
                controller: 'exposantsController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'listExposants',
                            files: [
                                'src/exposants/exposantsController.js',
                                'src/exposants/exposantsService.js'
                            ]
                        });
                    }]
                }
            })
            .state('infospratiques', {
                url: "/infospratiques",
                templateUrl: 'src/infos_pratique/infos_pratique.html',
                controller: 'infosPratiqueController',
                resolve: {
                    lazy: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'infosPratique',
                            files: [
                                'src/infos_pratique/infosPratiqueController.js',
                                'src/infos_pratique/infosPratiqueService.js',
                                'src/exposants/exposantsService.js'
                            ]
                        });
                    }]
                }
            });
        $httpProvider.interceptors.push('app.httpinterceptor');
    });

app.run(function ($rootScope, $location, $http) {
    console.log("app run ");
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
    });
});


//Intercepteur HTTP
app.factory('app.httpinterceptor', function ($q, $rootScope, $location) {
    return {
        // optional method
        'request': function (config) {
            return config || $q.when(config);
        },
        // optional method
        'requestError': function (rejection) {
            return $q.reject(rejection);
        },
        // optional method
        'response': function (response) {
            return response || $q.when(response);
        },
        // optional method
        'responseError': function (rejection) {
            if (rejection.status === 403) {
                $location.path('/accueil');
            }
            return $q.reject(rejection);
        }
    };
});

