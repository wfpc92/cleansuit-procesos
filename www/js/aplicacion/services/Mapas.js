var MapasFactory = function($q, $cordovaGeolocation, CargarScriptsFactory, $ionicPopup, $log) {
	var deferred = null,
		mapa = null,
		marker = null,
		infoWindow = null,
		elemMapa = null,
		elemMarker = null, 
		latLng = null,
		poligonos = []; //areas permitidas para realizar la ubicacion.

	var listenerIniciaArrastre = null,
		listenerCentroActualizado = null;

	var buscarYUbicarGPS = function() {
		latLng = null;
		detectarPosicionGPS(function() {
			mapa.panTo(latLng);
			marker.setPosition(latLng)
		});
	};

	var detectarPosicionGPS = function(callback) {
		$log.debug("detectando posicion actual...");
		
		if(!latLng) {
			$cordovaGeolocation
				.getCurrentPosition({timeout: 5000, enableHighAccuracy: true})
				.then(function(position) {
					$log.debug("posicion detectada con gps: ", position.coords.latitude, position.coords.longitude)
					latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
				}, function(error){
					//mostrar ventana de error.
					$log.debug("posicion no se puede obtener: ", error);
					$log.debug(JSON.stringify(error));
					
					document.addEventListener("deviceready",function() {
						$log.debug("deviceready lanzado... llamando cordova.dialogGPS()")
						/**
						* @param message {string}       message to be displayed.
						* @param description {string}   description of the propertie that you want change.
						* @param callback {function}    callback function to send the index when a button is pressed
						* @param title {string}         title of dialog
						* @param buttons {array}        array with the buttons names with a max three names.
						**/
						cordova.dialogGPS("Habilitar servicios de ubicación.",//message
							"Usa el GPS con conexión WiFi o 3G.",//description
							function(buttonIndex){//callback
								switch(buttonIndex) {
								case 0: break;//cancel
								case 1: break;//neutro option
								case 2: break;//user go to configuration
								}
							},
							"Servicios de ubicación desactivados",//title
							["","","Habilitar"]);//buttons

					});

					latLng = new google.maps.LatLng(2,-76);
				})
				.finally(function() {
					if(callback) {
						callback();
					}
				});
		} else {
			$log.debug("ya se detecto una posicion en... ", latLng.lat(), latLng.lng())
			if(callback) {
				callback();
			}
		}	
	};

	var initMap = function() {

		if(!google) {
			deferred.reject("no existe referencia a google.maps");
			return;
		}

		var mapOptions = {
				zoom: 18,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true, //quitar controles por defecto: "tipo", "zoom", "hombrecillo"
    			//scaleControl: true // mostrar escala
    			//mapTypeControl: false, //deshabilitar "tipo mapa"
    			zoomControl: true

			},
			contentString = "", //mensaje que se muestra al apuntar a una ubicacion no permitida
			areasPoligonos = [
				[
					new google.maps.LatLng(4.88915, -74.04235),
					new google.maps.LatLng(4.64486, -74.23461),
					new google.maps.LatLng(4.46895, -74.05403)
				],
				[
		  			new google.maps.LatLng(2.4579925872334303, -76.59548145463106),
		  			new google.maps.LatLng(2.4569367687815498, -76.59446757962343),
		  			new google.maps.LatLng(2.4568778144271235, -76.59610909154054)
				],
				[
					new google.maps.LatLng(2.4591360832564315, -76.5965884923935),
		  			new google.maps.LatLng(2.458760919756627, -76.59667432308197),
		  			new google.maps.LatLng(2.458439350958533, -76.59652948379517),
		  			new google.maps.LatLng(2.458439350958533, -76.59623444080353),
		  			new google.maps.LatLng(2.458589416407283, -76.59584820270538),
		  			new google.maps.LatLng(2.4588841877753445, -76.59576773643494),
		  			new google.maps.LatLng(2.4590771289991644, -76.59602522850037),
		  			new google.maps.LatLng(2.459221834898719, -76.59621834754944),
				],
				[
					new google.maps.LatLng(2.4588788282965033, -76.59394383430481),
					new google.maps.LatLng(2.459173599600623, -76.59431397914886),
					new google.maps.LatLng(2.458969939433815, -76.59485578536987),
					new google.maps.LatLng(2.458487586283193, -76.59450709819794),
					new google.maps.LatLng(2.4585036647243474, -76.59403502941132) 
				],
				[
					new google.maps.LatLng(2.4562794785238347, -76.59623980522156),
					new google.maps.LatLng(2.455336208076778, -76.59637928009033),
					new google.maps.LatLng(2.455234377704592, -76.59578382968903),
					new google.maps.LatLng(2.4559686281091677, -76.59515619277954),
					new google.maps.LatLng(2.456247321587736, -76.59528493881226),
					new google.maps.LatLng(2.4563491518827103, -76.59564435482025),
					new google.maps.LatLng(2.4566224857939796, -76.59604668617249),
					new google.maps.LatLng(2.45657425040193, -76.59651339054108) 
				],
				[
					new google.maps.LatLng(2.4563973872828764, -76.59442126750946),
					new google.maps.LatLng(2.456113334345683, -76.59425497055054),
					new google.maps.LatLng(2.4564402631926754, -76.59404039382935),
					new google.maps.LatLng(2.4559900660711214, -76.59386873245239),
					new google.maps.LatLng(2.455561306766679, -76.59388482570648),
					new google.maps.LatLng(2.455352286555883, -76.59442663192749),
					new google.maps.LatLng(2.455695294064099, -76.59488260746002)
				]
			];

		elemMapa = document.createElement("div");
		elemMapa.id = "id-mapa";
		elemMapa.setAttribute("data-tap-disabled","true");
		//crear mapa en <div id="{{idMapa}}">
		mapa = new google.maps.Map(elemMapa, mapOptions);

		// Crear Boton para buscar posicion GPS
		var centerControlDiv = document.createElement('div');
		var controlUI = document.createElement('div');
		controlUI.style.backgroundColor = '#fff';
		controlUI.style.border = '2px solid #fff';
		controlUI.style.borderRadius = '3px';
		controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		controlUI.style.cursor = 'pointer';
		controlUI.style.marginBottom = '20px';
		controlUI.style.marginRight = '10px';
		controlUI.style.textAlign = 'center';
		controlUI.title = 'Click to recenter the map';
		centerControlDiv.appendChild(controlUI);
		var controlText = document.createElement('div');
		controlText.className = 'icon ion-navigate';
		controlText.style.color = 'rgb(25,25,25)';
		controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
		controlText.style.fontSize = '16px';
		controlText.style.lineHeight = '38px';
		controlText.style.paddingLeft = '5px';
		controlText.style.paddingRight = '5px';
		controlUI.appendChild(controlText);

		// Setup the click event listeners: simply set the map to Chicago.
		controlUI.addEventListener('click', function() {
			$log.debug("aqui se realiza ubicacion GPS....")
			buscarYUbicarGPS();
		});
		
		centerControlDiv.index = 1;
		//mapa.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
		
		//crear pin que se ubica en el centro de la pantalla
		elemMarker = document.createElement("div");
		elemMarker.id= "marker-" + elemMapa.id ;
		elemMarker.className = 'centerMarker';
		elemMapa.appendChild(elemMarker)	

		marker = new google.maps.Marker({
        	//position: latLng,
        	icon: {
				//url: 'img/marker-rojo.png',
				// This marker is 20 pixels wide by 32 pixels high.
				//size: new google.maps.Size(30, 44),
				path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
				fillColor: 'green',
				fillOpacity: 0.0,
				strokeColor: 'white',
				strokeWeight: 0.0,
				scale: 10
			},
        	map: mapa,
        	draggable: false,
        	title: 'Ubica el pin.'
        });

		contentString = '<div class="popup">'+
			'<h5>No tenemos cobertura para este sitio</h5>'+
			'<p><b>Cleansuit</b>, no tiene cobertura de domicilio para esta ubicacion'
			'</p>'+
			'</div>';

        infoWindow = new google.maps.InfoWindow({
	    	content: contentString,
	    	disableAutoPan: true
	  	});			
		
		//crear las areas permitidas para ubicar una posicion.
		for (var i = 0; i < areasPoligonos.length; i++) {
			poligonos[i] = new google.maps.Polygon({
				paths: areasPoligonos[i],
				strokeColor: 'transparent',
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: 'transparent',
				fillOpacity: 0.35,
				map: mapa
			});
		}

		asignarEventos();	
	};

	var asignarEventos = function() {
		$log.debug("asiganando eventos para mapa... ")

		mapa.setOptions({
			draggable: true
		});
		/**
		 * Este evento es ejecutado cuando termina de cambiar el centro del mapa. 
		 * Si el centro del mapa se encuentra dentro de un área establecida
		 * el marker se pinta de azul, de lo contrario el marker muestra un mensaje.
		 */
		listenerCentroActualizado = google.maps.event.addListener(mapa, 'center_changed', function() {
			var posCentro = mapa.getCenter(),
				puntoEnPoligono = false, 
				posicionArea = -1;

			$log.debug("Evento lanzado, center_changed, posicion: ", posCentro.lat(), posCentro.lng());
			
			if(!posCentro) {
				return;
			}

			infoWindow.close();
			
			for(var i = 0; i < poligonos.length; i++){
				puntoEnPoligono = google.maps.geometry.poly.containsLocation(posCentro, poligonos[i]) ? true : false;
				
				if(puntoEnPoligono) {
					posicionArea = i;
					i = poligonos.length + 1;
				}
			}
			
			//el punto se encuentra dentro del area del poligono	
			if(puntoEnPoligono){
				$log.debug("si esta dentor del area " + posicionArea);
				elemMarker.style.background = 'url("img/pin.svg") no-repeat';
			}
			else{
				$log.debug("no esta dentro del area");
				elemMarker.style.background = 'url("img/marker-rojo.png") no-repeat';
				marker.setPosition(mapa.getCenter());
				infoWindow.open(mapa, marker);
			}
		});

		/**
		 * Este evento se ejecuta cuando un usuario inicia arrastre, el mensaje que se muestra
		 * se oculta.
		 */
		listenerIniciaArrastre = google.maps.event.addListener(mapa, 'dragstart', function(e) {
			infoWindow.close();
		});
	};

	var resultado = function() {
		deferred.resolve({
			map: mapa,
			marker: marker,
			mapaDOM: elemMapa,

			verificarUbicacionGPS: function() {
				return latLng;
			},

			getPosicion: function(){
				return new google.maps.LatLng(mapa.getCenter().lat(), mapa.getCenter().lng());
			},
			setPosicion: function(posicion) {
				$log.debug("SetPosicion: ", posicion.lat, posicion.lng);
				marker.setPosition(posicion);
				mapa.setCenter(posicion);
				return this;
			},
			obtenerUbicacionGPS: function(callback) {
				var self = this;
				detectarPosicionGPS(function() {
					self.setPosicion(latLng);

					if(callback) {
						callback();
					}
				});
				return this;
			}
		});
	}
	return {
		getMapa: function() {
			deferred = $q.defer();
			if(!mapa) {
				$log.debug("mapa google no ha sido creado, construyendo dom...")
				CargarScriptsFactory.cargarGoogleMaps(function() {
					$log.debug("creando mapa de google...")
					initMap();
					resultado();			
				}, function() {
					$log.debug("no se ha podido cargar el script de google maps")
				});
			}
			else {
				$log.debug("mapa google ya ha sido previamente construido.")
				resultado();
			}
			return deferred.promise;
		}
	}
};

app.factory("MapasFactory", MapasFactory);
