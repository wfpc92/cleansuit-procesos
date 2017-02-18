var AuthService = function($q, 
						$http, 
						API_ENDPOINT,
						USER_ROLES, 
						UsuarioFactory,
						RecursosFactory,
						$log) {

	var estaAutenticado = false;
 
	function cargarCredenciales() {
		$log.debug("AuthService.cargarCredenciales()")
		
		if (UsuarioFactory.getUsuario()) {
			useCredentials();
		}
	}
 
	function guardarCredenciales(usuario) {
		$log.debug("AuthService.guardarCredenciales()")
		UsuarioFactory.setUsuario(usuario);
		useCredentials(usuario);
	}
 
	function useCredentials() {
		$log.debug("AuthService.useCredentials()")
		estaAutenticado = true;
 
    	// Set the token as header for your requests!
    	//$http.defaults.headers.common['X-Auth-Token'] = token;
    	// Set the token as header for your requests!
		$http.defaults.headers.common.Authorization = UsuarioFactory.getUsuario().token;
	}
 
	function eliminarCredenciales() {
		$log.debug("AuthService.eliminarCredenciales()")
		UsuarioFactory.deleteUsuario();
		estaAutenticado = false;
		//$http.defaults.headers.common['X-Auth-Token'] = undefined;
		$http.defaults.headers.common.Authorization = undefined;
    	//window.localStorage.removeItem(LOCAL_CLIENT_KEY);
	}
 
 	//result.data = {success:boolean, usuario: {nombre:string, correo:string, role:string, token:string}}
 	function authCallback(resolve, reject, result) {
		if (result.data.success) {
			guardarCredenciales(result.data.usuario);
			return resolve(result.data.mensaje);
		} else {
			return reject(result.data.mensaje);
		}
 	};

 	var ingresar = function(usuario) {
		return $q(function(resolve, reject) {
			RecursosFactory
			.post('/ingresar', usuario)
			.then(function(res) {
 				$log.debug("AuthService.ingresar()", res)
				return authCallback(resolve, reject, res);
			});
		});
	};
 
	var logout = function() {
		$log.debug("AuthService.logout()")
		eliminarCredenciales();
	};

	var estaAutorizado = function(rolesAutorizados) {
		$log.debug("AuthService.estaAutorizado()")
		if(!UsuarioFactory.getUsuario()){
			return false;
		}

		if (!angular.isArray(rolesAutorizados)) {
			rolesAutorizados = [rolesAutorizados];
		}
		return (estaAutenticado && rolesAutorizados.indexOf(UsuarioFactory.getUsuario().rol) !== -1);
	};
 
	cargarCredenciales();
 
	return {
		ingresar: ingresar,
		logout: logout,
    	estaAutorizado: estaAutorizado,
		estaAutenticado: function(){
    		return estaAutenticado;
    	},
	};
};

app.service('AuthService', AuthService);
