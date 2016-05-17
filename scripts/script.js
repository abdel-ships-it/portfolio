var app = angular.module('portfolio', ['ngAnimate', 'ui.router']);
app
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            
           
        }
    ])
    .config(function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        //Nested default state
        // $urlRouterProvider.when("/dashboard", "/dashboard/");


        $stateProvider
            .state('Projects', {
                url: '/',
                templateUrl: 'pages/projects.html',
                data: {
                    pageTitle: 'Projects'
                }
            })
            .state('Preview', {
                url: '/preview',
                templateUrl: 'pages/preview.html',
                data: {
                    pageTitle: 'Preview'
                },
                onEnter: function() {
                    console.log('preview has loaded');
                }
            }).state('About', {
                url: '/about',
                templateUrl: 'pages/about.html',
                data: {
                    pageTitle: 'About'
                }
            })
    })
    .controller('mainCtrl', ['$scope', '$state',
        function($scope, $state) {
            $scope.state = $state;
            console.log('fafafa');
            $scope.finished = function() {
                componentHandler.upgradeAllRegistered();
                console.log('finished');
            }
            //{{state.current.data.pageTitle}}

            function toast(text) {
                if (text === true) {
                    text = "Not logged in"
                };
                $("#toast").toggleClass("animate").children("#toastText").text(text);
                setTimeout(
                    function() {
                        $("#toast").toggleClass("animate");
                    }, 3000);
            }           

    }]);