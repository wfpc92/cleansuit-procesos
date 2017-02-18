var ConfiguracionesFactory = function(RecursosFactory,
									$localStorage,
									$log) {
	
	var getConfiguraciones = function() {
		return $localStorage.configuraciones = $localStorage.configuraciones || {};
	};

	var getVersiones = function() {
		return $localStorage.versiones = $localStorage.versiones || {};
	};

	var setVersiones = function(v) {
		$localStorage.versiones = v;
	};

	var cargar = function() {
		return RecursosFactory
		.get("/configuraciones")
		.then(function(response) {
			$log.debug("ConfiguracionesFactory.cargar()", response);
			if (response.data.success) {
				$localStorage.configuraciones = response.data.configuraciones;
				return response.data.configuraciones;
			}
			return null;			
		});
	};

	var cargarVersiones = function() {
		return RecursosFactory
		.get("/configuraciones/versiones")
		.then(function(response) {
			$log.debug("ConfiguracionesFactory.cargarVersiones()", response);
			if (response.data.success) {
				var anterior = getVersiones(),
					nueva = response.data.versiones;

				return {
					anterior: anterior,
					nueva: nueva,
					cb: function() {
						setVersiones(nueva);
					}
				};
			}
			return null;
		});	
	};

	return {
		getConfiguraciones: getConfiguraciones,
		cargar: cargar,
		cargarVersiones: cargarVersiones
	};
};

app.factory("ConfiguracionesFactory", ConfiguracionesFactory);
