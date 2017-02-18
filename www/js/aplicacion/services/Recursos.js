var RecursosFactory = function($log, 
							$http,
							$q,
							API_ENDPOINT,
							APP_EVENTS,
							$rootScope,
							RequestManual,
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

			if (esFormData) {
				//archivos se deben almacenar en tipo FormData() y los parametros POST tambien
				//headers['Content-Type'] = 'multipart/form-data';
				headers['Content-Type'] = undefined;
				RequestManual.init();
				RequestManual.setPostParams(postParams);
				
				// por cada elemento del array de imagenes se codifican los archivos a formato BLOB con RequestManual
				var imgs = data.imagenes; // [{ campo: nombreCampo, url: urlImagen (o arreglo de urls) }]
				for (var key in imgs) {
					console.log("agregarArchivo", key)
					RequestManual.agregarArchivo("fotoprenda-" + key, imgs[key]);
				}

				//se convierten imagenes a formato Blob y se retorna el objeto tipo FormData()
				return RequestManual
				.codificarArchivos()
				.then(function(formData) {
					console.log("codificarArchivos.formData");
					
					for (var pair of formData.entries()) {
					   console.log(pair[0], pair[1]); 
					}

					return self.solicitud(recursos, {
						method: "PUT",
						data: formData,
						headers: headers
					});	
				}); 

			} else {
				return self.solicitud(recursos, {
					method: "PUT",
					data: postParams
				});
			};
		}
	};
};

app.factory("RecursosFactory", RecursosFactory);
