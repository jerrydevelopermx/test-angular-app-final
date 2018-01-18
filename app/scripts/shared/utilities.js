'use strict';

angular
    .module('contactCenterWeb')
    .factory('Utils', Utils);

Utils.$inject = ['Resource', '$window'];
    
function Utils(Resource, $window) {
    return {
        orderBy: orderBy,
        validateEmail: validateEmail,
        validateFieldEmpty: validateFieldEmpty,
        getInitials: getInitials,
        validateFormPassword: validateFormPassword,
        logout: logout,
        getActions: getActions,
        buildUser: buildUser,
    };
    /** */
    function buildUser(){ 
        let actions = getActions();
        let user = 
            {
                name: localStorage.getItem('name'),
                privileges: [
                    {
                        type: parseInt(localStorage.getItem('type')),
                        app: localStorage.getItem('app'),
                        actions: actions,
                    }
                ]
            };
        return user;
    }
    /** */
    function getActions(){
        let actions = {}
        //actions from localStorage
        for(let m in localStorage){
            if(m.split(".")[0] == "action"){
                actions[m.split(".")[1]] = localStorage.getItem(m) == 'false' ? false : true;
            }
        }
        return actions;
    }
    /**  */
    function logout() {
        Resource.changeStatus(0, localStorage.getItem('userId'));
        localStorage.clear();
        localStorage.setItem('isLogged', false);
        $window.location.href = '#!/';
    }
    function getInitials(name){
        let res = '';
        if( typeof name === 'undefined' || name == null ){
            res = 'CC';
        }else{
            let namePart = name.split(" ");
            if (namePart[1]) {
            res = namePart[0].substr(0, 1) + namePart[1].substr(0, 1);
            }
            else {
            res = namePart[0].substr(0, 1) + namePart[0].substr(0, 1);
            }
        }
        return res;
    }
    function orderBy(property, reverse) {
        reverse = (property === property) ? !reverse : false;
        return reverse;
    }
    function validateEmail(email) {
        const emailR = /^\w+([\.\-\+]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,4})+$/;
        if (emailR.test(email)) {
            return false;
        }
        else{
            return true;
        }
    }
    function validateFieldEmpty(field) {
        const fieldR = /([^\s])/;
        if(field == null){
            return true;
        }
        else if (fieldR.test(field)) {
            return false;
        }
        else{
            return true;
        }
    }

    function validateFormPassword(email, change, dialog) {
        let error = false;
        if (validateFieldEmpty(change.currentPassword)) {
            $("#currentPassword").addClass('alert-input alert-effect');
            error = true;
        } else {
            $("#currentPassword").removeClass('alert-input');
        }
        if (validateFieldEmpty(change.newPassword)) {
            $("#newPassword").addClass('alert-input alert-effect');
            error = true;
        } else {
            $("#newPassword").removeClass('alert-input');
        }
        if (error) {
            $('#no-data').html('<span>Por favor llene los campos</span>');
            setTimeout(function () {
                $("#currentPassword").removeClass('alert-effect');
                $("#newPassword").removeClass('alert-effect');
            }, 500);
            return false;
        }
        Resource.changePassword(email, change.currentPassword, change.newPassword).then((data) => {
            if (data.status == 200 || data.status == '200') {
                bootbox.dialog({
                    title: 'Confirmación',
                    message: "Se actualizó correctamente.",
                    closeButton : false,
                    buttons: {
                        ok: {
                            label: "Ok",
                            className: 'btn-info',
                            callback: function(){
                                //logout();
                                bootbox.hideAll();
                            }
                        }
                    }
                });
            } else if (data.status == 401 || data.status == '401') {
                bootbox.alert('Ocurrió un error al cambiar password');
            }
        }).catch(function (data) {
            if (data.status == 401) {
                $('#no-data').html('<span>Contraseña errónea.</span>');
            } else {
                $('#no-data').html('<span>Ocurrió un error en la petición. Consulta al administrador del sitio.</span>');
            }
        });
    }
}