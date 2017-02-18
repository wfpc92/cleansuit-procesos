// Permite armar manualmente una request tipo multipart/form-data
// Permite enviar varios archivos en una misma solicitud
// Se basa en el objeto FormData
app.factory('RequestManual', function($q) {
	var _request = new XMLHttpRequest();
	var _formData = new FormData();
	var _headers = []; // [{ campo: numbreCampo, valor: elValor }]
	var _archivos = []; // [{campo: nombreCampo, urls: [urlArchivo]}]
	var _urlParams = "";
	var _callbackExito, _callbackFracaso, _callbackProgreso;

	// Utiliza https://github.com/eligrey/canvas-toBlob.js para convertir un canvas en un blob
	function _getBlobFromFile(url, callback) {
		var image = new Image();

		image.onload = function () {
			var canvas = document.createElement('canvas');
			canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
			canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

			canvas.getContext('2d').drawImage(this, 0, 0);

			// Get raw image data
			//callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

			// ... or get as Data URI
			canvas.toBlob(
				function(blob) {
					callback(blob);
				},
				'image/jpeg'
			);
		};

		image.src = url;
	}

	// Genera un nombre aleatorio para una imagen jpg (incluye extensión)
	// El nombre incluye un timestamp con 3 caracteres aleatorios
	function _nombreImagen() {
		var result = '';
		var length = 3;
		var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
		for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
		return Date.now() + result + ".jpg";
	}


	// Función recursiva que codifica todas las urls (arreglo) como BLOBs, y los anexa a formData en "campo"
	// Invoca el callback al terminar
	function _codificarRecursivo(campo, urls, i, callback) {
		if (i == urls.length) {
			callback();
		}
		else {
			var url = (urls[i].src).trim();
			if (url == "") {
				_codificarRecursivo(campo, urls, i + 1, callback);
			}
			else {
				_getBlobFromFile(urls[i].src, function (blob) {
					_formData.append(campo, blob, urls[i].nombre);
					_codificarRecursivo(campo, urls, i + 1, callback);
				});
			}
		}
	}

	// A partir de uno de los elementos de "_archivos", crea los respectivos BLOBs y los anexa a formData
	// Soporta tanto un solo archivo como varios (selección múltiple en un mismo campo)
	// Invoca "callback" al terminar
	function _codificarCampo(archActual, callback) {
		var campo = archActual.campo;
		var urls = archActual.urls;
		
		if (Array.isArray(urls)) {
			// Si son varios archivos, codificamos recursivamente y agregamos hasta terminar
			var campoMultiple = campo + "[]";
			_codificarRecursivo(campoMultiple, urls, 0, function() {
				callback();
			});
		}
		else {
			// Si es 1 solo archivo, codificamos y agregamos
			if (urls == "") {
				callback();
			}
			else {
				_getBlobFromFile(urls, function (blob) {
					_formData.append(campo, blob, _nombreImagen());
					callback();
				});
			}
		}
	}

	// Codifica todos los archivos configurados en sus correspondientes campos como BLOBs,
	// y los anexa a la FormData. Función recursiva.
	function _codificarArchivos(callback, i) {
		if (i == _archivos.length) {
			callback();
		}
		else {
			var archActual = _archivos[i];
			_codificarCampo(archActual, function() {
				_codificarArchivos(callback, i + 1);
			});
		}
	}

	// Agrega todos los headers configurados a la request (ya debe estar abierta)
	function _anexarHeaders() {
		var n = _headers.length, i = 0;
		for (i = 0 ; i < n ; i++) {
			_request.setRequestHeader(_headers[i].campo, _headers[i].valor);
		}
	}

	return {
		// Callbacks configurables
		callbackInicio: null, // Cuando inicia la request, luego de codificar los archivos
		callbackProgreso: null, // Disparado varias veces durante la transferencia; usar e.loaded / e.total
		callbackExito: null, // En request exitosa
		callbackFracaso: null, // En request fallida

		// Inicializa toda la info de la request
		init: function() {
			_request = new XMLHttpRequest();
			_formData = new FormData();
			_headers = [];
			_archivos = [];
			_urlParams = "";
			_callbackExito = null;
			_callbackFracaso = null;
			_callbackProgreso = null;
		},

		// Configura un header para agregar en la request
		agregarHeader: function(campo, valor) {
			_headers.push({ "campo": campo, "valor": valor });
		},

		// Configura una o varias urls de archivos, para ser enviados en la request
		// urls puede ser un arreglo o una string si es única
		// Su contenido se agregará como un BLOB en el momento de enviar el FormData
		agregarArchivo: function(campo, urls) {
			_archivos.push({ "campo": campo, "urls": urls });
		},

		// Establecer los parámetros POST, cuando sean de tipo escalar no binario.
		// Se reciben como un objeto JSON
		setPostParams: function(params) {
			var key = "";
			for (key in params) {
				var jsonParams = JSON.stringify(params[key]);
				_formData.append(key, jsonParams);
			}
		},

		// Establecer los parámetros GET. Se reciben como un objeto JSON.
		setGetParams: function(params) {
			var urlParams = "";

			for (key in params) {
				urlParams += (urlParams == "") ? "?" : "&";
				urlParams += key + "=" + params[key];
			}
			_urlParams = urlParams;
		},

		// Configura los callbacks configurados para la request
		setCallbacks: function() {
			var cExito = this.callbackExito;
			var cFracaso = this.callbackFracaso;
			var cProgreso = this.callbackProgreso;

			if (cExito) {
				_request.addEventListener("load", function(e) {
					var jsonResponse;

					try {
						jsonResponse = JSON.parse(_request.responseText);
					} catch (e) {
						cFracaso("El servidor no respondión con un objeto JSON válido.", _request.status);
					}

					if (jsonResponse.success) {
						cExito(jsonResponse);
					} else {
						cFracaso("La operación no fué existosa.", _request.status);
					}
				}, false);
			}
			if (cFracaso) {
				_request.addEventListener("error", function(e) { cFracaso(_request.responseText, _request.status); }, false);
				_request.addEventListener("abort", function(e) { cFracaso(_request.responseText, _request.status); }, false);
			}
			if (cProgreso) {
				_request.upload.addEventListener("progress", function(e) { cProgreso(Math.floor(e.loaded * 100 / e.total)); }, false);
			}
		},

		// Envía la solicitud con el contenido que se haya configurado
		// Al terminar, invoca el callback con la respuesta obtenida, o null si no se pudo enviar
		enviar: function(metodo, url) {
			var self = this;
			this.setCallbacks();

			_codificarArchivos(function() {
				if (self.callbackInicio) { self.callbackInicio(); }
				_request.open(metodo, url + _urlParams, true);
				_anexarHeaders();
				_request.send(_formData);
			}, 0);
		},

		//codificar y retornar formulario codificado.
		codificarArchivos: function() {
			return $q(function(resolve, reject) {
				_codificarArchivos(function() {
					//retornar el objeto fitpo FormData al terminar de codificar los archivos.
					return resolve(_formData);
				}, 0);
			});
			
		}
	};
});