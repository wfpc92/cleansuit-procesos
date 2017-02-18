var UsuarioFactory = function(RecursosFactory,
							$localStorage,
							$log){
	
	return {
		actualizarPerfil: function(usuario) {
			return RecursosFactory
			.post("/cliente", usuario)
			.then(function(response) {
				$log.debug("UsuarioFactory.actualizarPerfil(): ", response);
				if(response.data.success) {
					$localStorage.usuario.nombre = response.data.usuario.nombre;
					$localStorage.usuario.direccion = response.data.usuario.direccion;
					$localStorage.usuario.telefono = response.data.usuario.telefono;
					$localStorage.usuario.correo = response.data.usuario.correo;
					$localStorage.usuario.url_foto = response.data.usuario.url_foto;
				}
				return response.data.mensaje;
			}, function(err) {
				$log.debug("UsuarioFactory.actualizarPerfil(): ", err);
			});
		},

		setUsuario: function(usuario) {
			$log.debug("UsuarioFactory.setUsuario():", usuario)
			$localStorage.usuario = usuario;
		},

		getUsuario: function() {
			//$log.debug("UsuarioFactory.getUsuario():", JSON.stringify($localStorage.usuario));//, _usuario)
			return ($localStorage.usuario ? $localStorage.usuario : null);
		}, 

		deleteUsuario: function() {
			$log.debug("UsuarioFactory.deleteUsuario():");//, _usuario)			
			delete $localStorage.usuario;
		}
	};
	
};

app.factory('UsuarioFactory', UsuarioFactory);
