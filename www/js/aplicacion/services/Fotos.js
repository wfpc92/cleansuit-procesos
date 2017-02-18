var FotosFactory = function($cordovaCamera,
						$cordovaBarcodeScanner,
						$q,
						$log) {
	
	var tomarFoto = function() {
		var opciones = {};

		if(typeof Camera !== 'undefined') {
			opciones = {
				sourceType: Camera.PictureSourceType.CAMERA,
				quality: 75,
				targetWidth: 800,
				targetHeight: 600,
				encodingType: Camera.EncodingType.JPEG,
				destinationType: Camera.DestinationType.DATA_URL,
				saveToPhotoAlbum: !0
			};
		}

		return $cordovaCamera
		.getPicture(opciones)
		.then(function(imageData) {
			return imageData;
		}, function(err) {
			// error
			$log.debug("FotosFactory.obtenerFoto(), err", err)
			return err;
		});
	};

	var escanearCodigo = function() {
		if (typeof cordova !== 'undefined') {
			return  $cordovaBarcodeScanner.scan();
		}
		else {
			return $q.reject("No soporta escaner de barras este dispositivo.");
		}
	}

	return {
		tomarFoto: tomarFoto,
		escanearCodigo: escanearCodigo
	};
};

app.factory("FotosFactory", FotosFactory);