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
angular.module( 'cast.details.results', [
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
  $stateProvider.state( 'details.results', {
    url: '/results',
    views: {
      "main@": {
        controller: 'resultsCtrl',
        templateUrl: 'details/results/results.tpl.html'
      }
    },
    data:{ pageTitle: 'Application Results' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'resultsCtrl', function resultsCtrl( $scope, _, $stateParams, applicationResultsService) {
  $scope.appResults = [];
  $scope.appDetails = {};
  applicationResultsService.getResults($stateParams.applicationId)
  .then(function (data) {   
        $scope.appDetails = data;     
        var _t;
        _t = data.applicationResults;
        angular.forEach(_t, function(row){
          row.getReferences = function() {
            return this.reference.gradeAggregators!=null ? this.reference.gradeAggregators:'--';
          };
          row.getResults = function() {
            return this.result.evolutionSummary + ', ' + this.result.boundaries;
          };
          row.technologyResults = function() {
            return _.isEmpty(this.technologyResults)? 'Nil' : this.technologyResults.join(', ');
          };
          row.moduleResults = function() {
            return _.isEmpty(this.moduleResults)? 'Nil' : this.moduleResults.join(', ');
          };
        });
        $scope.appResults = _t;
  }, function ( data ) {
    //error function Attention required
  });

  $scope.resultsOptions = { 
        enableSorting: true,
        enableFiltering: true,
        columnDefs: [
              { name:'Type', field: 'type' },
              { name:'Name', field: 'reference.name' },
              { name:'ShortName', field: 'reference.shortName' },
              { name:'Href', field: 'reference.href' },
              { name:'Key', field: 'reference.key' },
              { name:'GradeAggregators', field: 'getReferences()' },
              { name:'Grade', field: 'result.grade' },
              { name:'Results', field: 'getResults()' },
              { name:'Tech.Results', field: 'technologyResults()' },
              { name:'Module.Results', field: 'moduleResults()'}
            ],
        data: 'appResults'
    };
})

.service('applicationResultsService', function ($http, $q) {
    var results = {};
    this.getResults = function (options) {
        var def = $q.defer();
        $http.get("/REST/applications/"+options+"/results")
            .success(function (data) {
                results = data;
                def.resolve(data);
            }).error(function () {
                def.reject("Failed to get application results!");
            });
        return def.promise;
    };           
});


