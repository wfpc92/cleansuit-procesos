var RecursosFactory = function($log, 
							$http,
							$q,
							API_ENDPOINT,
							APP_EVENTS,
							$rootScope,
							ModalCargaFactory) {
	var self = this;
	this.$log = $log;
	this.$http = $http;
	this._apiUrl = API_ENDPOINT.url;	
	
	$log.debug("Contructor de RecursosApi");

	this.solicitud = function(recurso, requestConfig) {
		var self = this;
		requestConfig.url = self._apiUrl + recurso;
		$log.debug("solicitud para consumir servicio de api cleansuit");
		$log.debug("RecursosFactory.requestConfig: ", JSON.stringify(requestConfig))
		
		ModalCargaFactory.mostrar("Cargando...", null);
    	
    	return $http(requestConfig)
    	.finally(function() {
    		ModalCargaFactory.ocultar();
    	});
	};

	return {
		get: function(recursos, params) {
			return self.solicitud(recursos, {
				method: "GET",
				params: params
			});
		},
		post: function(recursos, postData) {
			return self.solicitud(recursos, {
				method: "POST",
				data: postData
			});	
		},
		put: function(recursos, postParams, data) {
			//var promise = $q.defer();
			var headers = {};
			var esFormData = (typeof data != 'undefined');

			return self.solicitud(recursos, {
				method: "PUT",
				data: postParams
			});
		}
	};
};

app.factory("RecursosFactory", RecursosFactory);
