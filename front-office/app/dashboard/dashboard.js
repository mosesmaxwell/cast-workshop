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
angular.module( 'cast.dashboard', [
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
  $stateProvider.state( 'dashboard', {
    url: '/dashboard',
    views: {
      "main": {
        controller: 'dashboardCtrl as model',
        templateUrl: 'dashboard/dashboard.tpl.html'
      }
    },
    data:{ pageTitle: 'Dashboard' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'dashboardCtrl', function dashboardController( $scope, _, $state, applicationService) {
  $scope.apps = []; $scope.appDetails = {};
  applicationService.getApplicationList()
  .then(function (data) {    
        angular.forEach(data, function(row){
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
        $scope.apps = data;

  }, function ( data ) {
    //error function Attention required
  });

  $scope.gridOptions = { 
        enableSorting: true,
        enableFiltering: true,
        columnDefs: [
              { name:'Href', field: 'href'},
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
              { name:'Version', field: 'adgVersion', width:60 },
              { name: 'View', displayName: 'View', cellTemplate: '<md-button md-no-ink class="md-primary menu-link" ng-click="grid.appScope.ShowDetails(row.entity.href)" >Detail</md-button> ', width:80 }
            ],
        data: 'apps'
    };

    $scope.ShowDetails = function(rowID) {
        var _r = rowID.split("/");
        $state.go('details', {
          applicationId: _r[2]
        });
    };
})

.service('applicationService', function ($http, $q) {
    var applicationList = {},
    categories = {},
    tags = {};
    this.getApplicationList = function () {
        var def = $q.defer();
        $http.get("/REST/applications")
            .success(function (data) {
                applicationList = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get applications");
            });
        return def.promise;
    };
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
    this.getApplicationList = function () {
        var def = $q.defer();
        $http.get("/REST/applications")
            .success(function (data) {
                applicationList = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get applications");
            });
        return def.promise;
    };
    this.getCategories = function () {
        var def = $q.defer();
        $http.get("/REST/categories")
            .success(function (data) {
                categories = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get categories");
            });
        return def.promise;
    };   
    this.getTags = function () {
        var def = $q.defer();
        $http.get("/REST/tags")
            .success(function (data) {
                tags = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get tags");
            });
        return def.promise;
    };            
});


