'use strict';
/**
 * @ngdoc function
 * @name  MainCtrl
 * @description
 * # MainCtrl
 * Controller
 */
angular
  .module('contactCenterWeb')
  .controller('MainCtrl', MainController);

MainController.$inject = ['$window'];

/**
 * @function MainController
 */
function MainController($window) {
  if (localStorage.getItem('userId')) {
    $window.location.href = '#!/admin';
  } else {
    $window.location.href = '#!/login';
  }
}
