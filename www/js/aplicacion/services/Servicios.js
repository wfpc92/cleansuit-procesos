var ServiciosFactory = function(RecursosFactory,
							$localStorage,
							$log){
	
	var init = function() {
		$localStorage.servicios = $localStorage.servicios || [];
	};

	var setServicios = function(servicios) {
		init();

		for (var i in $localStorage.servicios) {
			delete $localStorage.servicios[i];
		}

		for (var i in servicios) {
			$localStorage.servicios[i] = servicios[i];
		}
	};

	var buscarEnSubservicios = function(f) {
		for (var i in $localStorage.servicios) {
			for (var j in $localStorage.servicios[i].subservicios) {
				f ($localStorage.servicios[i].subservicios[j]);
			}
		}
	};
	
	init();

	return {
		servicios: $localStorage.servicios,

		cargar: function() {
			return RecursosFactory
			.get('/servicios', {})
			.then(function(respuesta) {
				$log.debug("ServiciosFactory.cargar()", respuesta)
				if(respuesta){
					setServicios(respuesta.data.servicios);
				}
			});
		},

		getNombreSubservicio: function(_id) {
			var res = 0;
			buscarEnSubservicios(function(subservicio) {
				if (subservicio._id == _id) {
					res = subservicio.nombre;
					return;
				}
			});
			return res;
		},

		getPrecioSubservicio: function(_id) {
			var res = 0;
			buscarEnSubservicios(function(subservicio) {
				if (subservicio._id == _id) {
					res = subservicio.precio;
					return;
				}
			});
			return res;
		}
	};
};

app.factory('ServiciosFactory', ServiciosFactory); 
