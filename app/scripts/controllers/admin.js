'use strict'

angular
  .module('contactCenterWeb')
  .controller('AdminController', AdminController);

AdminController.$inject = ['Resource', 'Utils', '$window', '$compile', '$scope'];

function AdminController(Resource, Utils, $window, $compile, $scope) {
  if (!localStorage.getItem('userId')) {
    $window.location.href = '#!/login';
  }

  const ac = this;
  //variables
  ac.currentUser = localStorage.getItem('userId');
  ac.resources = [];
  ac.userStatus = {};
  ac.user = {};

  //functions
  ac.addUser = addUser;
  ac.getInitials = getInitials;
  ac.deleteUser = deleteUser;
  ac.editUser = editUser;


  function deleteUser(username, user) {
    bootbox.confirm({
      message: "¿Do you want delete this user?",
      buttons: {
        'cancel': {
          label: 'Cancel',
          className: 'btn btn-danger'
        },
        'confirm': {
          label: 'Send',
          className: 'btn btn-success'
        }
      },
      callback: function (result) {
        if (result) {
          if (Resource.deleteUser(username)) {
            bootbox.alert('User succesfully deleted');
            //elimina usuario de la lista
            let index = ac.resources.indexOf(user);
            ac.resources.splice(index, 1);
          }
        }
      }
    });
  }

  function getInitials(name) {
    return Utils.getInitials(name);
  }

  Resource.getAllUsers().then(function (data) {
    ac.resources = data.data;
    ac.resources.forEach((element, key) => {
      ac.userStatus[element.userId] = { status: element.status };
    });
  });

  function addUser() {
    let message = '<div class="form-style">' +
      '<form >' +
      '<div class="form-group">' +
      '<label class="text-label">Name</label>' +
      '<input id="name" type="text" class="modal-input text-uppercase" name="name" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Last Name</label>' +
      '<input id="lastName" type="text" class="modal-input text-uppercase" name="lastName" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Email</label>' +
      '<input id="email" type="email" class="modal-input" name="email" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Phone</label>' +
      '<input id="phone" type="text" class="modal-input" name="phone" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Address</label>' +
      '<input id="address" type="text" class="modal-input" name="address" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Password</label>' +
      '<input id="password" type="password" class="modal-input" name="password" />' +
      '</div>' +
      '<div id="no-data" class="alert-span"></div>' +
      '<div class="spacer">&nbsp;</div>' +
      '</form>' +
      '</div>';
    let template = angular.element(message);
    let intermediate = $compile(template);
    let html = intermediate($scope);
    let dialog = bootbox.dialog({
      size: 'large',
      title: "New user",
      closeButton: true,
      message: html,
      buttons: {
        'cancel': {
          label: 'Cancel',
          className: 'btn btn-danger'
        },
        'confirm': {
          label: 'Save',
          className: 'btn btn-success',
          callback: function () {

            let name = $("#name"),
              lastName = $("#lastName"),
              email = $("#email"),
              phone = $("#phone"),
              address = $("#address"),
              password = $("#password"),
              error = false;

            const nameR = /^[\u00F1A-Za-z\s]+$/i,
              emailR = /^\w+([\.\-\+]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,4})+$/;

            if (!nameR.test(name.val()) || name.val().trim() == '') {
              name.addClass('alert-input alert-effect');
              error = true;
            } else {
              name.removeClass('alert-input');
            }

            if (!nameR.test(lastName.val()) || lastName.val().trim() == '') {
              lastName.addClass('alert-input alert-effect');
              error = true;
            } else {
              lastName.removeClass('alert-input');
            }

            if (!emailR.test(email.val()) && email.val() !== '') {
              email.addClass('alert-input alert-effect');
              error = true;
            } else {
              email.removeClass('alert-input');
            }

            if (password.val() == '') {
              password.addClass('alert-input alert-effect');
              error = true;
            } else {
              password.removeClass('alert-input');
            }
            if (error) {
              $('#no-data').html('<span>Por favor llene los campos</span>');
              setTimeout(function () {
                name.removeClass('alert-effect');
                email.removeClass('alert-effect');
                userId.removeClass('alert-effect');
                password.removeClass('alert-effect');
              }, 500);
              return false;
            }

            let user = {
              name: $("#name").val(),
              lastName: $("#lastName").val(),
              email: $("#email").val(),
              phone: $("#phone").val(),
              address: $("#address").val(),
              password: $("#password").val()
            }


            Resource.addUser(user).then((data) => {
              if (data.data.error) {
                switch (data.data.error.name) {
                  case 'ValidationError':
                    bootbox.alert('Ocurrió un error al validar los datos con Intercom');
                    break;
                }
              } else {
                //agrega usuario a la lista
                ac.resources.push(data.data);
                ac.resources.forEach((element, key) => {
                  ac.userStatus[element.userId] = { status: element.status };
                });
                dialog.modal('hide');
                bootbox.alert('Se insertó correctamente.');
              }
            });
            return false;
          },
        },
      },
    });
  }

  function editUser(user, index) {
    ac.user = angular.copy(user);
    let message = '<div class="form-style">' +
      '<form >' +

      '<div class="form-group">' +
      '<label class="text-label">Name</label>' +
      '<input id="name" type="text" class="modal-input text-uppercase" name="name" ng-model="ac.user.name" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Last Name</label>' +
      '<input id="lastName" type="text" class="modal-input text-uppercase" name="name" ng-model="ac.user.lastName" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Phone</label>' +
      '<input id="phone" type="text" class="modal-input text-uppercase" name="name" ng-model="ac.user.phone" />' +
      '</div>' +

      '<div class="form-group">' +
      '<label class="text-label">Address</label>' +
      '<input id="address" type="text" class="modal-input text-uppercase" name="name" ng-model="ac.user.address" />' +
      '</div>' +

      '<div class="form-group">' +
      '<div> <h4>Social Networks</h4>' +
      '<table class="table table-striped mt-4">' +
      '<tr>' +
      '<th>App</th><th>User</th></tr>' +
      '<tr ng-repeat="(key, value) in ac.user.socialNetworks">' +
      '<td>{{key}}</td>' +
      '<td>' +
      '<input id="socials" type="text" class="modal-input" name="socials" ng-model="ac.user.socialNetworks[key]" />' +
      '</td>' +
      '</tr>' +
      '</table>' +
      '</div>' +
      '</div>' +
      '<div id="no-data" class="alert-span"></div>' +
      '<div class="spacer">&nbsp;</div>' +
      '</form>' +
      '</div>';
    let template = angular.element(message);
    let intermediate = $compile(template);
    let html = intermediate($scope);
    let dialog = bootbox.dialog({
      size: 'large',
      title: "Edit user",
      closeButton: true,
      message: html,
      buttons: {
        'cancel': {
          label: 'Calcel',
          className: 'btn btn-danger',
        },
        'confirm': {
          label: 'Save',
          className: 'btn btn-success',
          callback: function () {
            let name = $("#name"), error = false;
            const nameR = /^[\u00F1A-Za-z\s]+$/i, emailR = /^\w+([\.\-\+]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,4})+$/;
            if (!nameR.test(name.val()) || name.val().trim() == '') {
              name.addClass('alert-input alert-effect');
              error = true;
            } else {
              name.removeClass('alert-input');
            }
            if (error) {
              $('#no-data').html('<span>Por favor llene el campo</span>');
              setTimeout(function () {
                name.removeClass('alert-effect');
              }, 500);
              return false;
            }            
            Resource.editUser(ac.user).then((data) => {
              if (data.data.error) {
                switch (data.data.error.name) {
                  case 'ValidationError':
                    bootbox.alert('Usuario duplicado');
                    break;
                }
              } else {
                //actualiza usuario en la lista
                let index = ac.resources.indexOf(user);
                ac.resources.splice(index, 1, data.data);
                dialog.modal('hide');
                bootbox.alert('Se actualizó correctamente.');
              }
            });
            return false;
          },
        }
      },
    });
  }
}