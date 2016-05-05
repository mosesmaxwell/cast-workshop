/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/dashboard`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'cast.details', [
  'ui.router',
  'ui.grid',
  'underscore'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'details', {
    url: '/details/:applicationId',
    views: {
      "main": {
        controller: 'detailsCtrl',
        templateUrl: 'details/details.tpl.html'
      }
    },
    data:{ pageTitle: 'Application Details' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'detailsCtrl', function detailsCtrl( $scope, _, $stateParams, applicationDetailService) {
  $scope.appDetails = [];
  applicationDetailService.getApplication($stateParams.applicationId)
  .then(function (data) { 
        var _t = [];
        _t[0] = data;
        angular.forEach(_t, function(row){
          row.getModules = function() {
            return this.modules.name + ', ' + this.modules.href;
          };
          row.getSnapshots = function() {
            return this.snapshots.name + ', ' + this.snapshots.href;
          };
          row.getResults = function() {
            return this.results.name + ', ' + this.results.href;
          };
          row.getOrigin = function() {
            return this.origin===null?"--":this.origin;
          };
          row.getSystems = function() {
            return this.systems===null?"--":this.systems;
          };
        });
        $scope.appDetails = _t;
  }, function ( data ) {
    //error function Attention required
  });

  $scope.detailOptions = { 
        enableSorting: true,
        columnDefs: [
              { name:'Href', field: 'href' },
              { name:'Name', field: 'name' },
              { name:'Technologies', field: 'technologies.join(",")' },
              { name:'Systems', field: 'getSystems()', width:65 },
              { name:'Modules', field: 'getModules()' },
              { name:'Snapshots', field: 'getSnapshots()' },
              { name:'Results', field: 'getResults()' },
              { name:'Origin', field: 'getOrigin()', width:60 },
              { name:'Database', field: 'adgDatabase'},
              { name:'WebSite', field: 'adgWebSite'},
              { name:'LocalId', field: 'adgLocalId', width:60 },
              { name:'Version', field: 'adgVersion', width:60 }
            ],
        data: 'appDetails'
    };
})

.service('applicationDetailService', function ($http, $q) {
    var applicationList = {};
    this.getApplication = function (options) {
        var def = $q.defer();
        $http.get("/REST/applications/"+options)
            .success(function (data) {
                applicationList = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get application");
            });
        return def.promise;
    };           
});


