angular
  .module('contactCenterWeb')
  .factory('Resource', Resource);

/** functions dependency injector */
Resource.$inject = ['$http', 'env'];

/**
 * @function Resource
 * @description Resource for Monster Monitor API
 */
function Resource($http, env, RequestService, activeUser, AnalyticsService) {
  return {
    login: login,
    getAllUsers: getAllUsers,
    addUser: addUser,
    deleteUser: deleteUser,
    editUser: editUser,
  };

  function login(username, password) {
    let http = {
      method: 'POST',
      url: `${env.apiUrl}/api/authentication/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        username: username,
        password: password,
      },
    };
    return ($http(http));
  }

  function getAllUsers(username, password) {
    let http = {
      method: 'GET',
      url: `${env.apiUrl}/api/users`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("bearer"),
      },
      data: {
      },
    };
    return ($http(http));
  }

  function addUser(user) {
    const socialNetworks = {
      'facebook': '',
      'twitter': '',
    };
    const credentials = {
      'password': user.password
    };
    user.credentials = credentials;
    user.socialNetworks = socialNetworks;

    let http = {
      method: 'POST',
      url: `${env.apiUrl}/api/users`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("bearer"),
      },
      data: user,
    };
    return ($http(http));
  }
  /** */
  function deleteUser(username) {
    let http = {
      method: 'DELETE',
      url: `${env.apiUrl}/api/users/${username}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("bearer"),
      }
    };
    return ($http(http));
  }

  /** */
  function editUser(user) {
    let http = {
      method: 'PUT',
      url: `${env.apiUrl}/api/users/${user.email}`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': localStorage.getItem("bearer"),
      },
      data: user,
    };
    return ($http(http));
  };

}
