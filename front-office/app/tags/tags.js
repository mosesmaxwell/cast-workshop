
angular.module( 'cast.tags', [
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
  $stateProvider.state( 'tags', {
    url: '/tags',
    views: {
      "main": {
        controller: 'tagsCtrl',
        templateUrl: 'tags/tags.tpl.html'
      }
    },
    data:{ pageTitle: 'Tags' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'tagsCtrl', function tagsCtrl( $scope, _, tagsService) {
  $scope.tags = [];
  tagsService.getTags()
  .then(function (data) {  
        angular.forEach(data, function(row){
          row.getApplication = function() {
            return this.application.href+', '+this.application.name+', '+this.application.adgDatabase;
          };
          row.getTechnologies = function() {
            return this.technologies.join(', ');
          };
          row.getTags = function() {
            return _.pluck(this.commonTags, 'label').join(', ');
          };
          row.getOwnTags = function() {
            return _.isEmpty(this.ownTags)?"--":this.ownTags.join(', ');
          };
        });  
        $scope.tags = data;

  }, function ( data ) {
    //error function Attention required
  });

  $scope.tagsOptions = { 
        enableSorting: true,
        columnDefs: [
              { name:'Application', field: 'getApplication()' },
              { name:'Technologies', field: 'getTechnologies()' },
              { name:'Common Tags', field: 'getTags()' },
              { name:'Own Tags', field: 'getOwnTags()' }
            ],
        data: 'tags'
    };

})

.service('tagsService', function ($http, $q) {
    var tags = {};  
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


