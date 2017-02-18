var ProductosFactory = function(RecursosFactory,
							$localStorage,
							$log){
	
	var init = function() {
		$localStorage.productos = $localStorage.productos || [];
	};

	var setProductos = function(productos) {
		init();

		for (var i in $localStorage.productos) {
			delete $localStorage.productos[i];
		}	

		for (var i in productos) {
			$localStorage.productos[i] = productos[i];
		}
	};

	init();
	
	return {
		productos : $localStorage.productos,

		//carga una lista de productos desde el servidor
		cargar: function() {
			return RecursosFactory
			.get('/productos', {})
			.then(function(respuesta) {
				$log.debug("ProductosFactory.cargar()", respuesta);
				if(respuesta){
					setProductos(respuesta.data.productos);
				} 
			});
		}
	};
};

app.factory('ProductosFactory', ProductosFactory);
