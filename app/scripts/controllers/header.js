'use strict';

/**
 * @ngdoc function
 * @name contactCenterWeb.controller:HeaderController
 * @description
 * # MainCtrl
 * Controller of the monsterMonitorApp
 */
angular
  .module('contactCenterWeb')
  .controller('HeaderController', HeaderController);

HeaderController.$inject = ['Resource', 'Utils', '$scope', '$window', '$compile'];

/**
 * @function HeaderController
 */
function HeaderController(Resource, Utils, $scope, $window, $compile) {
  const hc = this;
  //variables
  hc.isLogged = localStorage.getItem('isLogged') == null ? false : localStorage.getItem('isLogged');
  hc.userId = localStorage.getItem('userId') == null ? 0 : localStorage.getItem('userId');
  hc.name = localStorage.getItem('name') == null ? '' : localStorage.getItem('name');
  hc.email = localStorage.getItem('email') == null ? '' : localStorage.getItem('email');
  hc.currentUser = localStorage.getItem('status') == null ? 0 : localStorage.getItem('status');
  hc.type = localStorage.getItem('type') == null ? 0 : localStorage.getItem('type');
  hc.mode = localStorage.getItem('mode') == null ? false : localStorage.getItem('mode');

  hc.change = {
    currentPassword: '',
    oldPassword: '',
  };
  //Scopes
  $scope.$watch(
    () => {
      return localStorage.mode;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.mode = newVal;
    }
  );
  $scope.$watch(
    () => {
      return localStorage.isLogged;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.isLogged = newVal;
    }
  );
  $scope.$watch(
    () => {
      return localStorage.status;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.currentUser = newVal;
    }
  );
  $scope.$watch(
    () => {
      return localStorage.name;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.name = newVal;
    }
  );

  $scope.$watch(
    () => {
      return localStorage.type;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.type = newVal;
    }
  );
  $scope.$watch(
    () => {
      return localStorage.userId;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.userId = newVal;
    }
  );
  $scope.$watch(
    () => {
      return localStorage.email;
    },
    (newVal, oldVal) => {
      if (newVal == undefined)
        return;
      hc.email = newVal;
    }
  );
  //functions
  hc.logout = logout;
  hc.getInitials = getInitials;

  function logout() {
    hc.isLogged = false;
    localStorage.clear();
    $window.location.href = '#!/';
  }
  /** */
  function getInitials(name) {
    return Utils.getInitials(name);
  }
}
