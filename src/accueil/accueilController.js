(function () {

    angular
        .module('accueil')
        .controller('accueilController', [
            '$rootScope', '$scope', '$location', 'accueilService', '$stateParams', '_', '$timeout', '$q', '$state',
            accueilController
        ]);

    function accueilController($rootScope, $scope, $location, accueilService, $stateParams, _, $timeout, $q, $state) {
        console.log('accueilController');
        var _body = angular.element(document.getElementsByTagName("body"));
        _body.addClass('page_cover');

        $rootScope.getActualitesPromise = $q.defer();
        $scope.contact={};
        accueilService.loadAll()
            .success(function (data) {
                $rootScope.getActualitesPromise.resolve();
                $rootScope.actualites = data;
            })
            .error(function (error) {
                $rootScope.getActualitesPromise.resolve();
                console.error(error);
            });

        $scope.idActualite = $stateParams.id;

        $scope.getActualite = function (idActualite) {
            $scope.actualite = {};
            $scope.actualite = _.findWhere($rootScope.actualites, {'id': parseInt(idActualite)});
            //console.log('currentActualite ', currentActualite);
            return $scope.actualite ? $scope.actualite : null;
        };

        $rootScope.types_actualites = {
            'article': {
                id: 1,
                name: 'article',
                class: '',
                icon: 'assets/img/article_icn.png',
                description: ''
            },
            'video': {
                id: 2,
                name: 'vidéo',
                class: 'video_article',
                icon: 'assets/img/video_icn.png',
                description: ''
            }
        };

        $scope.presentionHeight = function () {
            var presentionBlock = angular.element(document.getElementsByClassName("presentation_area"));
            if (presentionBlock.length) {
                var windowHeight = $(window).outerHeight();
                var presentationBlockoffset = presentionBlock.offset().top;
                var presentationHeight = windowHeight - presentationBlockoffset;
                presentionBlock.css('height', presentationHeight);
            }
        };
        $scope.presentionHeight();

        /* Load mapPlan */
        $scope.loadMapPlan = function () {
            var mapBlock = angular.element(document.querySelector('#map_plan'));
            if (mapBlock.length) {
                var myLatlng = new google.maps.LatLng(48.844559, 2.434568);
                var styleArray =
                    [
                        {
                            "featureType": "administrative.land_parcel",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.park",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "poi.sports_complex",
                            "elementType": "all",
                            "stylers": [
                                {
                                    "visibility": "off"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#8e2862"
                                },
                                {
                                    "saturation": "76"
                                },
                                {
                                    "visibility": "on"
                                },
                                {
                                    "weight": "0.62"
                                }
                            ]
                        },
                        {
                            "featureType": "road.highway",
                            "elementType": "geometry.stroke",
                            "stylers": [
                                {
                                    "visibility": "off"
                                },
                                {
                                    "saturation": "0"
                                }
                            ]
                        },
                        {
                            "featureType": "road.arterial",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#f39200"
                                },
                                {
                                    "weight": "0.43"
                                }
                            ]
                        },
                        {
                            "featureType": "road.local",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#f5f5f5"
                                },
                                {
                                    "visibility": "on"
                                }
                            ]
                        },
                        {
                            "featureType": "water",
                            "elementType": "geometry.fill",
                            "stylers": [
                                {
                                    "color": "#d3d3d3"
                                }
                            ]
                        }
                    ]
                var mapOptions = {
                    zoom: 14,
                    center: myLatlng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true,
                    styles: styleArray,
                    scrollwheel: false,
                    draggable: false
                };
                var map = new google.maps.Map(document.getElementById("map_plan"), mapOptions);


                //add a custom marker to the map
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(48.836291, 2.434390),
                    map: map,
                    visible: true,
                    icon: 'assets/img/default_marker.png',
                });
            }
        };
        if (typeof google === 'object' && typeof google.maps === 'object') {
            $scope.loadMapPlan();
        }
        /* End Load mapPlan */


        $scope.showArticle = function (id) {
            $state.go('actualites', { id: id }, {reload: true});
        };

        $rootScope.getActualitesPromise.promise.then(function () {
            if ($scope.idActualite && $scope.idActualite != '') {

                //var target_news_area = angular.element(document.querySelector("#target_news_area"));
                var news_list = angular.element(document.getElementsByClassName("news_list"));
                var targetLinkOffset = $('.news_list').offset().top - 62;

                //var targetLinkOffset = $(target_news_area.attr('data-href')).offset().top - 62;

                //target_news_area.addClass('active');
                $timeout(function () {
                    var articleAsidePopin = angular.element(document.getElementsByClassName("article_body"));
                    articleAsidePopin.addClass('active');
                }, 1000);
                /*$('html,body');*/
                $('html,body').stop().animate({scrollTop: targetLinkOffset}, 1200);
                // Add div for control hide modal
                angular.element(document.getElementsByClassName("cover")).css('display', 'block');

                $rootScope.currentActualite = $scope.getActualite($scope.idActualite);
                var date = $rootScope.currentActualite.created_at ? moment($rootScope.currentActualite.created_at, "YYYY-MM-DD hh:mm:ss").format("DD/MM/YY") : null;
                $rootScope.currentActualite.datePub = angular.copy(date);
                if ($rootScope.currentActualite.type == 'video') {
                    $rootScope.currentActualite.link_youtube = 'https://www.youtube.com/watch?v=' + $rootScope.currentActualite.youtube_id;
                }
            }
        });

        $scope.sendEmail = function (contact) {

            if ($scope.contactForm.$invalid) {
                console.log($scope.contactForm.$error);
                return;
            }
            $scope.contact = contact;
            formData = new FormData();
            formData.append('name',  $scope.contact.name);
            formData.append('email',  $scope.contact.email);
            formData.append('message',  $scope.contact.message);
            accueilService.sendEmail(formData, function (res) {
                console.log(" res", res);
                $scope.success = res.message;
            }, function (res) {
                console.log(" res.error", res);
                if(!angular.isObject(res.errors)){
                    $scope.errors = res.errors;
                }else{
                    $scope.formErrors = res.errors;
                }
            })
        }

    }

})
();
