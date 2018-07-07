var app = angular.module('portfolio', ['ngMaterial', 'ngAnimate', 'ui.router', 'ngSanitize', 'firebase']);
app
    .factory('$toast', function() {
        return function(text) {
            $("#toast").toggleClass("animate").children("#toastText").text(text);
            setTimeout(
                function() {
                    $("#toast").toggleClass("animate");
                }, 6000);
        }
    })
    .run(['$rootScope', '$state', '$stateParams', '$location', '$anchorScroll', '$animate', '$toast',
        function($rootScope, $state, $stateParams, $location, $anchorScroll, $animate, $toast) {
            $rootScope.$state = $state;

            //$toast('This website is in development');
            var config = {
                apiKey: "AIzaSyDgRVMrL_IWFsr6fYn-xpMKFaQ27Mc12tw",
                authDomain: "abdelelmedny.firebaseapp.com",
                databaseURL: "https://abdelelmedny.firebaseio.com",
                storageBucket: "project-3122023172084139285.appspot.com",
            };
            firebase.initializeApp(config);
            $rootScope.database = firebase.database().ref();
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams, options) {
                    /*Fixing stuck title bug*/
                    slideAway();
                    if (toState.name == 'preview') {
                        $anchorScroll('top');
                        $animate.enabled(false);
                        menuToArrow();
                        $rootScope.resetNavColors();
                    } else {
                        $animate.enabled(true);
                    }
                    if (fromState.name == 'preview') {
                        menuToArrow();
                    }
                });
            /*404*/
            $rootScope.$on('$stateChangeError', function(event) {
                $state.go('404');
            })
            $rootScope.$on('$stateNotFound', function(event) {
                $state.go('404');
            });

            /*Hamburger to arrow*/
            var arrow = false;
            var menuToArrow = function() {
                if (!arrow) {
                    document.querySelector('#rotateAble').className = "animate";
                    document.querySelector('.line:nth-of-type(2)').className += " animate";
                    document.querySelector('.line:nth-of-type(1)').className += " animate";
                    document.querySelector('.line:nth-of-type(3)').className += " animate";
                }
                if (arrow) {
                    document.querySelector('#rotateAble').className = "";
                    // document.querySelector('.line:nth-of-type(1)').style.backgroundColor = 'green';
                    document.querySelector('.line:nth-of-type(2)').className = "line";
                    document.querySelector('.line:nth-of-type(1)').className = "line";
                    document.querySelector('.line:nth-of-type(3)').className = "line";
                }
                arrow = !arrow;
                return arrow;
            }
            document.getElementById('rotateAble').addEventListener('click', function() {
                if (arrow) {
                    $state.go('projects');
                } else {
                    document.querySelector('#sideNav').className += " show";
                    document.querySelector('#overlay').className += " show";
                }
            });

            document.querySelector("#overlay").addEventListener('click', function() {
                slideAway();
            });

            function slideAway() {
                document.querySelector('#sideNav').className = "mobile";
                document.querySelector('#overlay').className = "mobile fadeOut";
                setTimeout(function() {
                    document.querySelector('#overlay').className = "mobile";
                }, 300);
            }

            $('.card').on('touchstart', function() {
                alert('ur touching me ;)');
            });
        }
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$mdThemingProvider', '$sceProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $mdThemingProvider, $sceProvider, $locationProvider) {

            // Deployment, add base tag 
            // $locationProvider.html5Mode(true);

            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('amber');

            /*Not recommeneded, but will be enabled for now so preview iframes work*/
            $sceProvider.enabled(false);

            $urlRouterProvider.otherwise('/');

            //Nested default state
            // $urlRouterProvider.when("/dashboard", "/dashboard/");
            $stateProvider
                .state('projects', {
                    url: '/',
                    templateUrl: 'pages/projects.html',
                    data: {
                        pageTitle: 'Projects'
                    },
                    onEnter: function() {
                        $("nav").removeClass('slideUp');
                        setTimeout(function() {
                            //document.querySelector('footer').style.display = 'none';
                        });
                    },
                    controller: 'mainCtrl'
                })
                .state('preview', {
                    url: '/preview/{projectName}',
                    templateUrl: 'pages/preview.html',
                    data: {
                        pageTitle: 'Preview'
                    },
                    controller: 'previewCtrl',
                    onEnter: function() {
                        $("md-progress-linear").addClass('preview')
                        $("nav").addClass('slideUp');
                        $("#menu .line").css({
                            'background': "#FFC107",
                            'transition': '0.3s'
                        });
                    },
                    onExit: function() {
                        window.scrollTo(0, 0);
                        setTimeout(function() {
                            $(window).unbind('scroll');
                        });
                    }
                }).state('about', {
                    url: '/about',
                    templateUrl: 'pages/about.html',
                    data: {
                        pageTitle: 'About'
                    },
                    onEnter: function() {
                        $("nav").removeClass('slideUp');
                        setTimeout(function() {
                            document.querySelector('footer').style.display = 'block';
                        });
                    },
                    controller: 'aboutCtrl'
                }).state('404', {
                    url: '/404/*path',
                    templateUrl: 'pages/404.html',
                    data: {
                        pageTitle: '404 | Not found'
                    },
                    onEnter: function() {
                        $("body").addClass('hideBar');
                        setTimeout(function() {
                            $("nav").addClass('slideUp');
                        }, 1000);
                        $("#rotateAble").hide();
                    },
                    onExit: function() {
                        $("body").removeClass('hideBar');
                        $("#rotateAble").show();
                    }
                })
        }
    ])
    .controller('mainCtrl', ['$scope', '$state', '$rootScope', '$firebaseObject', '$http', '$toast',
        function($scope, $state, $rootScope, $firebaseObject, $http, $toast) {
            $scope.state = $state;
            $scope.html = "html";
            var database = firebase.database().ref();

            $scope.projects = $firebaseObject(database.child("projects"));
            $scope.projects.$loaded()
                .then(function() {
                    if ($state.current.name == 'projects') {
                        document.querySelector('footer').style.display = 'block';
                    }
                    document.querySelector('md-progress-linear').style.display = 'none';
                })
                .catch(function(error) {
                    console.error("Error:", error);
                });
            //{{state.current.data.pageTitle}}

            $scope.animate = function() {

            }

            $scope.experience = {
                'Languages /': ['Javascript', 'PHP', 'HTML', 'CSS'],
                'Databases /': ['Firebase', 'mySQL'],
                'Frameworks /': ['AngularJS', 'chartjs', 'jQuery'],
                'Tools /': ['Bower', 'NPM', 'git', 'gulp', 'sass', 'Markdown', 'wakatime'],
                'Studying.now()': ['ionic', 'nodejs', "Typescript"]
            }
            $scope.fullScreen = function() {
            }
                // Default colors for the navigation bar
            var white = "#FFFFFF";
            var primary = "#2196F3";
            var accent = "#FFC107";

            $rootScope.changeNavColors = function(background, color) {
                /*To do, store transitinons like so $(elem).css('transition') in a varaible and restore that in the resetNavColors function*/
                $("nav").css({
                    "background": background,
                    'transition': 'background 0.3s, transform 0.7s cubic-bezier(0.0, 0.0, 0.2, 1)'
                });
                $("footer").css({
                        "background": background,
                        'transition': '0.3s'
                    })
                    // $("nav").find('a').css('color', color);
                $("#menu .line").css({
                    'background': white,
                    'transition': '0.3s'
                });
                $("div#logo").children().eq(1).css({
                    'color': color,
                    'transition': '0.3s'
                });
                $("div#logo").children().eq(4).css({
                    "background": background,
                    'transition': ' 0.3s'
                });
                $("#sideNav header").css({
                    'background': background,
                    'transition': '0.3s'
                })
                $("meta[name=theme-color]").attr("content", background);
            }

            $rootScope.resetNavColors = function() {
                $("nav").css({
                    "background": primary,
                    "color": white,
                    'transition': 'background 0.3s, transform 0.7s cubic-bezier(0.0, 0.0, 0.2, 1)'
                });
                $("footer").css({
                    "background": primary,
                    'transition': '0.3s'
                });
                // $("nav").find('a:link').css('color', white);
                $("#menu .line").css({
                    'background': accent,
                    'transition': '0.3s'
                });
                $("div#logo").children().eq(1).css({
                    'color': accent,
                    'transition': '0.3s'
                });
                $("div#logo").children().eq(4).css({
                    "background": primary,
                    'transition': 'background 0.3s, left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
                });
                $("#sideNav header").css({
                    'background': primary
                })
                $("meta[name=theme-color]").attr("content", primary);
            }

            /*var colors = ["#2196F3", "#FFC107"];
         setInterval(function(){
             var r = Math.floor(Math.random() * 2) + 0;
              $("meta[name=theme-color]").attr("content", colors[r]);
         },1);*/
        }
    ])
    .controller('previewCtrl', ['$scope', '$stateParams', '$state',
        function($scope, $stateParams, $state) {

            $scope.projectName = $stateParams.projectName
            $scope.project = {};

            if (!$stateParams.projectName) {
                $state.go('404');
            }
            angular.element(document).ready(function() {
                function scrolling() {
                    $(window).scroll(function() {
                        //Calculation the bottom sheet distance from the top of the page
                        var topDistance = $("#bottomSheet").offset().top - $(window).scrollTop()
                        if (topDistance <= 1) {
                            // Moving the title element
                            var copy = $("#title").clone();
                            $("#title").detach();
                            $("body").append(copy);
                            $("#title").addClass("top");
                            $("#contentContainer").css({
                                "margin-top": "60px"
                            });
                        }
                        if (topDistance > 1) {
                            var copy = $("#title").clone();
                            $("#title").detach();
                            $("#bottomSheet").prepend(copy);
                            $("#title").removeClass("top");
                            $("#contentContainer").css({
                                "margin-top": "0"
                            });
                        }
                    });
                };
                window.requestAnimationFrame(scrolling);

            });
        }
    ]).controller('aboutCtrl', ['$scope', '$firebaseArray', '$rootScope', function($scope, $firebaseArray, $rootScope) {
        var statsRef = $rootScope.database.child('stats/');
        var stats = $firebaseArray(statsRef);
        stats.$loaded().then(function() {
            var chartData = {
                datasets: [{
                    data: [],
                    backgroundColor: [
                        "#f7da4d",
                        "#ff7043",
                        "#29a8df",
                        "#4c70ac",
                        "#cc689a",
                        "#7a1fa2",
                        "#ffcc80",
                        "#36A2EB"
                    ],
                    borderColor: "white"
                }],
                labels: []
            };

            for (var i = 0; i < stats.length; i++) {
                if(stats[i].percent > 2){
                    chartData.datasets[0].data.push(stats[i].percent);
                    chartData.labels.push(stats[i].name);    
                }
            }

            renderStats(chartData);
        })

        function renderStats(chartData) {
            var ctx = document.getElementById("statChart").getContext("2d");
            // Wrap code in a scroll function
            new Chart(ctx, {
                type: 'pie',
                data: chartData,
                options: {
                    responsive: true,
                    tooltips: {
                        bodyFontSize: 15
                    },
                    title: {
                        display: true,
                        text: 'This years editor statistics',
                        fontSize: 15
                    }
                },
                animation: {
                    // animateScale:true,
                    // animateRotate: true
                }
            });
        }

    }]);