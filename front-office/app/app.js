(function (app){
  app.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $mdThemingProvider ) {
    $urlRouterProvider.otherwise( '/dashboard' );
    $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('orange')
    .warnPalette('red')
    .backgroundPalette('grey');
  })

  .run( function run ( $rootScope ) {
    $rootScope.identity = {
      isGuest: true,
      id: 0
    };
  })

  .controller( 'castController', function castController ( $rootScope, $scope, $location, $state ) {
    $scope.title = 'Application Analytics Manager';
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | ' + $scope.title;
      }
    });
    
    $rootScope.$on("auth.change", function (event, identity) {
        $rootScope.identity = identity;
        $state.go('dashboard');
    });
        
  });

}(angular.module('cast', [
  'ngAnimate',
  'ngTouch',
  'ngResource',
  'ngMaterial',
  'templates-app',
  'templates-common',
  'ui.router',
  'ui.bootstrap',
  'cast.dashboard'
])));




