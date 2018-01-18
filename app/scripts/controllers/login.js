'use strict';

/**
 * @ngdoc function
 * @name contactCenterWeb.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the monsterMonitorApp
 */
angular
  .module('contactCenterWeb')
  .controller('LoginController', LoginController);

LoginController.$inject = ['Resource', 'Utils', '$window'];

/**
 * @function LoginController
 */
function LoginController(Resource, Utils, $window) {

  const vm = this;
  //variables
  vm.isLogged = localStorage.getItem('isLogged') == null ? false : localStorage.getItem('isLogged');
  vm.userId = localStorage.getItem('userId');
  //vm.status = localStorage.getItem('status');
  vm.loginData = {
    username: '',
    password: '',
  };

  //functions
  vm.login = login;
  vm.changeStatus = changeStatus;
  /** */
  function changeStatus(userId, status) {
    Resource.changeStatus(status, userId);
  }
  function login() {
    let username = $("#username"), password = $("#password"), error = false;
    if (Utils.validateFieldEmpty(vm.loginData.password)) {
      password.addClass('alert-input alert-effect');
      error = true;
      vm.error = 'Por favor llene los campos.';
    }
    else {
      password.removeClass('alert-input');
    }
    if (Utils.validateFieldEmpty(vm.loginData.username)) {
      username.addClass('alert-input alert-effect');
      error = true;
      vm.error = 'Por favor llene los campos.';
    }
    else if (Utils.validateEmail(vm.loginData.username)) {
      error = true;
      username.addClass('alert-input alert-effect');
      vm.error = 'Formato de correo incorrecto.';
    }
    else {
      username.removeClass('alert-input');
    }

    if (error) {
      setTimeout(function () {
        username.removeClass('alert-effect');
        password.removeClass('alert-effect');
      }, 500);
      return false;
    }
    else {
      Resource.login(vm.loginData.username, vm.loginData.password).then((data) => {
        if (data.data) { console.log(data)
          if (data.data.name) {
            let userId = data.data.email;
            let bearer = 'Bearer ' + data.data.token;
            localStorage.setItem('isLogged', true);
            localStorage.setItem('name', data.data.name);
            localStorage.setItem('email', data.data.email);
            localStorage.setItem('userId', data.data.email);
            localStorage.setItem('status', 1);

            //save data from privileges
            let localPrivileges = {};
            for (let n in data.data.privileges) {
              if (data.data.privileges[n].app == 'intercom') {
                localPrivileges = data.data.privileges[n];
                localStorage.setItem('mode', data.data.privileges[n].actions.botAssignable);
              }
            }
            for (let prop in localPrivileges.actions) {
              localStorage.setItem('action.' + prop, localPrivileges.actions[prop]);
            }
            if (localStorage.getItem('mode') == 'undefined') {
              localStorage.setItem('mode', false);
            }
            localStorage.setItem('type', localPrivileges.type);
            localStorage.setItem('app', localPrivileges.app);
            localStorage.setItem('conversations', data.data.conversations);
            localStorage.setItem('bearer', bearer);
            vm.isLogged = true;

            //default values
            vm.loginData.password = '';
            vm.error = '';
            let role = localPrivileges.type;
            $window.location.href = '#!/admin';

          } else {
            vm.error = 'Ocurrió un error en la petición. 2';
            localStorage.clear();
          }
        } else {
          vm.error = 'Ocurrió un error en la petición. 1';
          localStorage.clear();
        }
      }).catch(function (data) {
        if (data.status == 401) {
          vm.error = 'Usuario y/o contraseña erroneos.';
        } else {
          vm.error = 'Ocurrió un error en la petición. Consulta al administrador del sitio';
        }
        return false;
      });
    }
  }
}
