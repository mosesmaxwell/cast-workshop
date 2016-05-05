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
angular.module( 'cast.categories', [
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
  $stateProvider.state( 'categories', {
    url: '/categories',
    views: {
      "main": {
        controller: 'categoriesCtrl',
        templateUrl: 'categories/categories.tpl.html'
      }
    },
    data:{ pageTitle: 'Categories' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'categoriesCtrl', function dashboardController( $scope, _, categoryService) {
  _.max([1,2,3,4]);
  $scope.categories = [];

  categoryService.getCategories()
  .then(function (data) {    
        angular.forEach(data, function(row){
          row.getTags = function() {
            return _.pluck(this.tags, 'label').join(', ');
          };
        });
        $scope.categories = data;

  }, function ( data ) {
    //error function Attention required
  });

  $scope.catOptions = { 
        enableSorting: true,
        columnDefs: [
              { name:'No', field: 'key', width:50 },
              { name:'Name', field: 'label', width: 200 },
              { name:'Tags', field: 'getTags()' }
            ],
        data: 'categories'
    };

})

.service('categoryService', function ($http, $q) {
    var categories = {};
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
});


