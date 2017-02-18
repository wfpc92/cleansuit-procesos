var PrendaFactory = function(RecursosFactory,
							$localStorage,
							$log){
	
	var _prenda = null;

	return {
		productos : $localStorage.productos,

		//carga una lista de productos desde el servidor
		buscarPrenda: function(codigo) {
			return RecursosFactory
			.get('/prendas/codigo/' + codigo, {})
			.then(function(respuesta) {
				$log.debug("PrendaFactory.cargar()", respuesta);
				if(respuesta){
					_prenda = respuesta.data.prenda;
					return _prenda;
				}
			});
		}
	};
};

app.factory('PrendaFactory', PrendaFactory);
