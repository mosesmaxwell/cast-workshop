(function (app){
  app.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $mdThemingProvider ) {
    $urlRouterProvider.otherwise( '/dashboard' );
    $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple')
    .accentPalette('orange')
    .warnPalette('pink')
    .backgroundPalette('grey');
  })

  .run( function run ( $rootScope ) {
    $rootScope.identity = {
      isGuest: true,
      id: 0
    };
  })

  .controller( 'castController', function castController ( $rootScope, $scope, $location, $state, $timeout, $mdSidenav, $log ) {
    $scope.title = 'Application Analytics Manager';
    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
      if ( angular.isDefined( toState.data.pageTitle ) ) {
        $scope.pageTitle = toState.data.pageTitle + ' | ' + $scope.title;
      }
    });
  });

}(angular.module('cast', [
  'ngAnimate',
  'ngTouch',
  'ngResource',
  'ngMaterial',
  'underscore',
  'templates-app',
  'templates-common',
  'ui.router',
  'ui.bootstrap',
  'cast.dashboard',
  'cast.categories',
  'cast.tags',
  'cast.details',
  'cast.details.results'
])));


var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);