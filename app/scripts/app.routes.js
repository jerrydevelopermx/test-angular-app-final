angular
  .module('contactCenterWeb')
  .config(routes);

/**
 * @function routes
 */
function routes ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'MainCtrl as vm',
    })
    .when('/login', {
      templateUrl: 'views/login.html',
      controller: 'LoginController as vm',
    })

    .when('/admin', {
      templateUrl: 'views/admin.html',
      controller: 'AdminController as ac',
    })

    .otherwise({
      redirectTo: '/',
    });
}
