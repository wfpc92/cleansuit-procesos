var PromocionesFactory = function(RecursosFactory, 
								$localStorage,
								$log){
	
	var init = function() {
		$localStorage.promociones = $localStorage.promociones || [];
	};

	var setPromociones = function(promociones) {
		init();

		for (var i in $localStorage.promociones) {
			delete $localStorage.promociones[i];
		}
	
		for (var i in promociones) {
			$localStorage.promociones[i] = promociones[i];
		}
	};

	init();	

	return {
		promociones: $localStorage.promociones,

		//carga lista de promociones desde el servidor
		cargar: function() {
			return RecursosFactory
			.get('/promociones', {})
			.then(function(respuesta) {
				$log.debug("PromocionesFactory.cargar()", respuesta);
				if(respuesta){
					setPromociones(respuesta.data.promociones);
				}
			});
		},

		validar: function(cupon) {
			return RecursosFactory
			.get('/promociones/validar/'+cupon)
			.then(function(respuesta) {
				$log.debug(respuesta)
				if(respuesta.data.success) {
					$log.debug("PromocionesFactory.validarCupon: true")
	    			return respuesta.data;
	    		} else {
					$log.debug("PromocionesFactory.validarCupon: false")
	    			return false;
	    		}
			}, function() {
				$log.debug("PromocionesFactory.validarCupon: error")
				return false;
			});
		}
	};
};

app.factory('PromocionesFactory', PromocionesFactory);
