var PrendaFactory = function(RecursosFactory,
							$localStorage,
							$log){
	
	var _prenda = null;
	
	var _procesos = [
		{_id:"1", nombre: "Proceso 1"},
		{_id:"2", nombre: "Proceso 2"},
		{_id:"3", nombre: "Proceso 3"},
		{_id:"4", nombre: "Proceso 4"},
	];

	$localStorage.proceso = $localStorage.proceso || _procesos[0];

	return {
		proceso : $localStorage.proceso,

		procesos: _procesos,

		guardarProceso: function(o) {
			$localStorage.proceso = o;
		},
		//buscar la informacion de la prenda
		buscarPrenda: function(codigo) {
			return RecursosFactory
			.get('/prendas/codigo/' + codigo, {})
			.then(function(respuesta) {
				$log.debug("PrendaFactory.buscarPrenda()", respuesta);
				if(respuesta){
					_prenda = respuesta.data.prenda;
					return _prenda;
				}
			});
		},

		//enviar novedad de la prenda
		enviarNovedad:function(prenda, novedad) {
			novedad.proceso = $localStorage.proceso;
			console.log(prenda, novedad)
			return RecursosFactory
			.post('/prendas/novedad', {prenda: prenda, novedad: novedad})
			.then(function(respuesta) {
				$log.debug("PrendaFactory.enviarNovedad()", respuesta);
				if(respuesta){
					
				}
			});	
		}
	};
};

app.factory('PrendaFactory', PrendaFactory);
