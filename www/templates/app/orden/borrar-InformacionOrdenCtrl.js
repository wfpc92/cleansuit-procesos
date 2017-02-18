
var InformacionOrdenCtrl = function($scope, 
									OrdenesFactory, 
									$state, 
									$ionicPopover, 
									$ionicHistory, 
									$ionicModal, 
									$ionicPopup,   
									$rootScope,
									$ionicSideMenuDelegate,
									MapasFactory, 
									ModalCargaFactory,
									PromocionesFactory,
									$log,
									ConfiguracionesFactory) {
	
	$log.debug("InformacionOrdenCtrl");
	$ionicSideMenuDelegate.canDragContent(false);
	
	var self = this; 

	this.$scope = $scope;
	this.$ionicModal = $ionicModal;
	this.$ionicPopup = $ionicPopup;	
	this.$ionicPopover = $ionicPopover;
	this.$state = $state;
	this.$ionicHistory = $ionicHistory;
	this.$rootScope = $rootScope;
	this.MapasFactory = MapasFactory;
	this.ModalCargaFactory = ModalCargaFactory;
	this.OrdenesFactory = OrdenesFactory;
	this.$log = $log;

	$scope.orden = OrdenesFactory.getOrden();

	//aqui se configura la direccion por defecto para las ordenes, se debe programar la ultima direccion suministrada
	if (!$scope.orden.recoleccion.fecha) {
		var ahora = new Date();
		//ahora = new Date(2016, 7, 11, 20, 00, 0, 0); //para probar varas fechas
		var unaHoraDespues = new Date(ahora.getTime() + (60 * 60 * 1000));
		//si se adiciona una hora despues y se pasa al siguiente dia: 
		if(ahora.getDate() == unaHoraDespues.getDate()
			&& ahora.getMonth() == unaHoraDespues.getMonth() 
			&& ahora.getFullYear() == unaHoraDespues.getFullYear()
			&& unaHoraDespues.getHours() < 22) {
			//verificar si es una hora valida: antes de las 10 de las noche
			$scope.orden.recoleccion.fecha = ahora;
		} else {
			//como se pasa de las 10 de la noche la fecha de recoleccion debe ser un dia despues.
			$scope.orden.recoleccion.fecha = new Date(ahora.getTime() + (24 * 3600 * 1000));
		}
		//$log.debug("recolecion.fecha", $scope.orden.recoleccion.fecha.toString())
	}
	
	$scope.orden.entrega.fecha = $scope.orden.entrega.fecha || $scope.orden.recoleccion.fecha;

	//FLAGS:
	//si solo hay productos en el carrito de compra solo se debe mostrar la direccion de entrega
	
	//$log.debug("solo hay productos: "+ $scope.soloProductos);

	//se ejecuta al dar click en el icono de ubicacion de las direcciones, muestra ventana modal
	//con un mapa para ubicar un punto, basado en su ubicacion actual. 
	$scope.openModal = function(tipo) {
		self.abrirModal(tipo);
	};

	$scope.formaPago = function(formaPago){
		$scope.orden.formaPago = formaPago;
		$scope.closePopover();
	};

	$scope.closeModal = function() {
		$scope.modal.hide();
	};

	$scope.openPopover = function(tipo, $event) {
		self.construirPopover(tipo, $event);  	
    };
    
    $scope.closePopover = function() {
    	$scope.popover.hide();
    };

    $scope.abrirModalTC = function() {
    	$scope.modalTC
    	.show()
    	.then(function() {

    	});
    };

    $scope.validarCupon = function() {
    	//mostrar venana emergente, si es verdadero, su coponha sido redimido.
    	//falso: este cupon es incorrecto  o ha expirado.
    	ModalCargaFactory.mostrar("Validando cupón de descuento...", null);
    	PromocionesFactory
    	.validar($scope.orden.cupon)
    	.then(function(respuesta) {
    		$log.debug("InformacionOrdenCtrl.validarCupon()")
    		$log.debug(JSON.stringify(respuesta))
    		if(respuesta) {
    			tmp = respuesta.mensaje;
    			$scope.carrito.aplicarPromocion(respuesta.promocion);
    		} else {
    			tmp = "No se pudo validar el cupón. Intenta de nuevo.";
    		}
    	})
    	.finally(function() {
    		ModalCargaFactory.ocultar();
    		$ionicPopup
			.alert({
		    	title: 'Cupón de descuento',
		    	template: tmp
	    	});	
    	});
    };
	
	//Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function() {
		if(typeof $scope.modal != 'undefined') {
			$scope.modal.remove();
		}
	});

	$scope.$on('$ionicView.afterEnter', function(event) {
		$scope.soloProductos = $scope.carrito.soloHayProductos();
		self.viewAfterEnter();
	});

	//cancelar orden:
	$scope.confirmarCancelarOrden = function() {
		$ionicPopup
		.confirm({
	    	title: 'Cancelar Orden',
	    	template: '¿Está seguro que desea cancelar esta orden?',
	    	buttons: [
		    	{
		    		text: 'Si',
		    		onTap: function(e) {
		    			self.cancelarOrden();
		    		}
		    	},
		      	{
			    	text: '<b>No</b>',
			    	type: 'button-positive'
		      	}
		    ]
    	});
	};

	$scope.realizarOrden = function() {
		//$log.debug("InformacionOrdenCtrl: realizarOrden(): ");
		OrdenesFactory
		.enviarOrden()
		.then(function() {
			//$log.debug("exito")
			$ionicHistory.clearHistory();
			$ionicHistory.clearCache()
			$ionicHistory.nextViewOptions({
				disableBack: 'true'
			}); 
			$state.go("app.realizar-orden");
		}, function(err) {
			//$log.debug(err)
		})
	};

	$scope.modalMapa = null;
	$scope.mapa = null;
	$scope.scopeModal = $rootScope.$new();
	$scope.scopeModal.idModal = "id-modal-mapa";
	
	$scope.scopeModal.finalizaUbicacion = function(tipo) {
		var posicion = $scope.mapa.getPosicion();
		//$log.debug("finaliza ubicacion: ", posicion.lat(), posicion.lng() );
		
		switch(tipo) {
			case "DIRECCIONRECOLECCION":
				$scope.orden.recoleccion.posicion = posicion;
				break;

			case "DIRECCIONENTREGA":
				$scope.orden.entrega.posicion = posicion;
				break;
		}

		$scope.modalMapa.hide();
	};

	$ionicModal
	.fromTemplateUrl("templates/app/orden/modal-mapa.html", {
		scope: $scope.scopeModal,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalMapa = modal;
		MapasFactory.getMapa().then(function(mapa) {
			$scope.mapa = mapa;
			//$log.debug("mapa obtenido: ", $scope.mapa)
			$scope.modalMapa
					.modalEl //ion-modal
					.children[1] //ion-content
					.children[0] //scroll
					.children[0] //#contenedor-mapa
					.appendChild($scope.mapa.mapaDOM);
		});
	});


	$scope.scopeModalTC = $rootScope.$new();
	$scope.scopeModalTC.terminosCondiciones = ConfiguracionesFactory.getConfiguraciones().terminosCondiciones;
	$scope.scopeModalTC.finalizarTC = function(opc) {
		$scope.modalTC.hide();
		$scope.orden.terminosCondiciones = opc;
	};


	$ionicModal
	.fromTemplateUrl("templates/app/orden/modal-terminos-condiciones.html", {
		scope: $scope.scopeModalTC,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.modalTC = modal;
		$scope.scopeModalTC.modalTC = modal;
	});
};


/**
 * este se ejecuta al dar click sobre los pines de ubicacion,
 * se ubica la posicion almacenada previamente en el mapa,
 * se muestra la ventana modal con el mapa configurado en su sitio.
 */
InformacionOrdenCtrl.prototype.abrirModal = function(tipo) {
	var self = this,
		$scope = self.$scope,
		MapasFactory = self.MapasFactory,
		ModalCargaFactory = self.ModalCargaFactory,
		posicion = null;

	//self.$log.debug("abriendo ventana modal para "+tipo+"...")
	
	switch(tipo) {
		case "DIRECCIONRECOLECCION":
			//ubicar la posicion en el mapa almacenada
			if($scope.orden.recoleccion.posicion) {
				posicion = $scope.orden.recoleccion.posicion;
				//self.$log.debug("DIRECCIONRECOLECCION: ", posicion.lat(), posicion.lng());
			} else {
				//self.$log.debug("DIRECCIONRECOLECCION: null");
			}

			//mostrar la ventana modal con el mapa configurado en la posicion almacenada.
			$scope.scopeModal.titulo = "Ubique en el mapa el punto de recolección.";
			$scope.scopeModal.tipo = tipo;
			break;

		case "DIRECCIONENTREGA":
			//ubicar la posicion en el mapa almacenada
			if($scope.orden.entrega.posicion) {
				posicion = $scope.orden.entrega.posicion;
				//self.$log.debug("DIRECCIONENTREGA: ", posicion.lat(), posicion.lng())
			} else {
				//self.$log.debug("DIRECCIONENTREGA: null");
			}

			//mostrar la ventana modal con el mapa configurado en la posicion almacenada.
			$scope.scopeModal.titulo = "Ubique en el mapa el punto de entrega.";
			$scope.scopeModal.tipo = tipo;
			break;
	}

	if(!$scope.mapa) {
		//self.$log.debug("no existe el mapa...");
		//mostrar ventana de error 
		return;
	}

	if(posicion) {
		$scope.mapa.setPosicion(posicion);
	}

	if(!$scope.mapa.verificarUbicacionGPS()) {
		ModalCargaFactory.mostrar("Buscando posicion actual...", null);
		$scope.modalMapa.show().then(function() {
			$scope.mapa.obtenerUbicacionGPS(function() {
				//self.$log.debug("ubicacion obtenida GPS: ", $scope.mapa.getPosicion().lat(), $scope.mapa.getPosicion().lng());
				ModalCargaFactory.ocultar();
			}); 
		});	
	} else {
		$scope.modalMapa.show();
	}
};


InformacionOrdenCtrl.prototype.viewAfterEnter = function() {
	var self = this;
	self.$scope.formIncompleto = false;

	if(self.$scope.soloProductos) {
		//console.log("view Solo productos:")
		self.$scope.$watchGroup([
			'orden.entrega.direccion',
			'orden.entrega.fecha',
			'orden.entrega.hora',
			'orden.telefono',
			'orden.formaPago',
			'orden.terminosCondiciones'], function(newV, oldV, scope){
				if(newV[0] && newV[1] && newV[2] 
					&& newV[3] && newV[4] && newV[5]){
					self.$scope.formIncompleto = true;
				}
				else {
					self.$scope.formIncompleto = false;	
				}
				//self.$log.debug("watchProductos", JSON.stringify(newV), JSON.stringify(self.$scope.formIncompleto))
			});
	} else {
		//console.log("view servicios:")
		self.$scope.$watchGroup([ 
			'orden.recoleccion.direccion',
			'orden.recoleccion.fecha',
			'orden.recoleccion.hora',
			'orden.entrega.direccion',
			'orden.entrega.fecha',
			'orden.entrega.hora',
			'orden.telefono',
			'orden.formaPago',
			'orden.terminosCondiciones'], function(newV, oldV, scope){
				if(newV[0] && newV[1] && newV[2] 
					&& newV[3] && newV[4] && newV[5] 
					&& newV[6] && newV[7] && newV[8] ){
					self.$scope.formIncompleto = true;
				}
				else {
					self.$scope.formIncompleto = false;	
				}
				//self.$log.debug("watchServicios", JSON.stringify(newV), JSON.stringify(self.$scope.formIncompleto))
			});
	}
};

InformacionOrdenCtrl.prototype.horasDelDia = [
	"12:00 A.M. a 12:59 A.M.",
	"1:00 A.M. a 1:59 A.M.",
	"2:00 A.M. a 2:59 A.M.",
	"3:00 A.M. a 3:59 A.M.",
	"4:00 A.M. a 4:59 A.M.",
	"5:00 A.M. a 5:59 A.M.",
	"6:00 A.M. a 6:59 A.M.",
	"7:00 A.M. a 7:59 A.M.",
	"8:00 A.M. a 8:59 A.M.",
	"9:00 A.M. a 9:59 A.M.",
	"10:00 A.M. a 10:59 A.M.",
	"11:00 A.M. a 11:59 A.M.",
	"12:00 P.M. a 12:59 P.M.",
	"1:00 P.M. a 1:59 P.M.",
	"2:00 P.M. a 2:59 P.M.",
	"3:00 P.M. a 3:59 P.M.",
	"4:00 P.M. a 4:59 P.M.",
	"5:00 P.M. a 5:59 P.M.",
	"6:00 P.M. a 6:59 P.M.",
	"7:00 P.M. a 7:59 P.M.",
	"8:00 P.M. a 8:59 P.M.",
	"9:00 P.M. a 9:59 P.M.",
	"10:00 P.M. a 10:59 P.M.",
	"11:00 P.M. a 11:59 P.M.",
];

InformacionOrdenCtrl.prototype.horasRecoleccion = function() {
	var self = this,
		$scope = this.$scope, 
		fecha = $scope.orden.recoleccion.fecha;
		hoy = new Date(),
		result = [],
		inicio = 10, //index de horasDelDia de la hora de inicio
		fin = 22; //index de horasDelDia de la hora final

	//si la fecha es hoy se debe comprobar las horas 
	if(fecha.getDate() == hoy.getDate()
		&& fecha.getMonth() == hoy.getMonth() 
		&& fecha.getFullYear() == hoy.getFullYear()) {
		inicio = fecha.getHours() + 1;
		if (inicio < 10) {
			inicio = 10;
		}
		
		result = this.horasDelDia.slice(inicio, fin);
	} else {
		result = this.horasDelDia.slice(inicio, fin);
	}
	return result;
};


InformacionOrdenCtrl.prototype.horasEntrega = function() {
	var self = this,
		$scope = this.$scope, 
		ahora = new Date(),
		result = [],
		inicio = 10, //index de horasDelDia de la hora de inicio
		fin = 22, //index de horasDelDia de la hora final
		fr = $scope.orden.recoleccion.fecha,
		fe = $scope.orden.entrega.fecha,
		index = this.horasDelDia.indexOf($scope.orden.recoleccion.hora);

	//si la fecha es hoy se debe comprobar las horas 
	if(fr.getDate() == fe.getDate()
		&& fr.getMonth() == fe.getMonth() 
		&& fr.getFullYear() == fe.getFullYear()) {
		//self.$log.debug("fecha de recoleccion igual a fecha de entrega");

		if(index !== -1) {
			//self.$log.debug("index encontrado: ", index, $scope.orden.recoleccion.hora)
			var inicio = index + 1;
			if(inicio >= 21) {
				inicio = 10;
				$scope.orden.entrega.fecha = new Date($scope.orden.entrega.fecha.getTime() + (24 * 3600 * 1000));
			}
		}
	} 
	result = this.horasDelDia.slice(inicio, fin);
	return result;
};

InformacionOrdenCtrl.prototype.construirPopover = function(tipo, $event) {
	var self = this,
		$scope = this.$scope, 
		$ionicPopover = this.$ionicPopover,
		tmpURL = null;

	switch(tipo) {
		case "FECHARECOLECCION":
			
			//datePicker, fuente:https://www.npmjs.com/package/cordova-okaybmd-date-picker-plugin
			if(typeof datePicker == 'undefined'){
				document.getElementById("inputFechaRecoleccion").readOnly = false;
				break;
			}

			var minDate = new Date();
			var unaHoraDespues = new Date(minDate.getTime() + (60 * 60 * 1000));
			
			if(unaHoraDespues.getHours() >= 22) {
				//como se pasa de las 10 de la noche la fecha de recoleccion debe ser un dia despues.
				minDate =  new Date(minDate.getTime() + (24 * 3600 * 1000));
			}
			
			datePicker.show({
				date: $scope.orden.recoleccion.fecha,
				mode: 'date',
				minDate: minDate.getTime(),
				clearButton: true,
				windowTitle: '',
				doneButtonLabel: "Establecer",
				cancelButtonLabel: "Cancelar",
				clearButtonLabel: "Eliminar"
			}, function(fecha){
				if(fecha !== 'CANCEL') {
					$scope.orden.recoleccion.fecha = fecha;
					$scope.$digest();
				}
			}, function(error) {
				//self.$log.debug("datepicker, error", JSON.stringify(error))
				//en caso que no funcione la aplicacion con el plkgin se envia una señal
				//para que se active la seleccion de la fecha por defecto.
				document.getElementById("inputFechaRecoleccion").readOnly = false;
			});
			break;

		case "FECHAENTREGA":
			//datePicker, fuente:https://www.npmjs.com/package/cordova-okaybmd-date-picker-plugin
			
			if(typeof datePicker == 'undefined'){
				document.getElementById("inputFechaEntrega").readOnly = false;
				break;
			}

			datePicker.show({
				date: $scope.orden.entrega.fecha,
				mode: 'date',
				minDate: $scope.orden.recoleccion.fecha.getTime(),
				clearButton: true,
				windowTitle: '',
				doneButtonLabel: "Establecer",
				cancelButtonLabel: "Cancelar",
				clearButtonLabel: "Eliminar",
				androidTheme: "THEME_HOLO_LIGHT"
			}, function(fecha){
				//self.$log.debug("construirPopover.FECHAENTREGA: ", $scope.orden.entrega.fecha, fecha);
				if(fecha !== 'CANCEL') {
					$scope.orden.entrega.fecha = fecha;
					$scope.$digest();
				}
			}, function(error) {
				//self.$log.debug("datepicker, error", JSON.stringify(error))
				//en caso que no funcione la aplicacion con el plkgin se envia una señal
				//para que se active la seleccion de la fecha por defecto.
				document.getElementById("inputFechaEntrega").readOnly = false;
			});
			break;

		case "HORARECOLECCION":
			tmpURL = 'templates/app/orden/popover-hora.html';
			$scope.idPopover = "ppHoraRecoleccion";
			//seleccionar las horas validas segun la fecha que seleccione.
			$scope.horas = this.horasRecoleccion();
			
			$scope.setHora = function($index){
				$scope.orden.recoleccion.hora = $scope.horas[$index];
				$scope.closePopover();
			};
			break;
		case "HORAENTREGA":
			tmpURL = 'templates/app/orden/popover-hora.html';
			$scope.idPopover = "ppHoraEntrega";
			//seleccionar las horas validas segun la fecha que seleccione.
			$scope.horas = this.horasEntrega();

			$scope.setHora = function($index){
				$scope.orden.entrega.hora = $scope.horas[$index];
				$scope.closePopover();
			};
			break;

		case "FORMAPAGO":
			tmpURL = 'templates/app/orden/popover-forma-pago.html';
			$scope.idPopover = "ppFormaPago";
			break;

		default:
			return;
	}

	if(tmpURL){
		$ionicPopover.fromTemplateUrl(tmpURL, {
			scope: $scope,
		}).then(function(popover) {
			$scope.popover = popover;
			$scope.popover.show($event);
		});
	}
};


InformacionOrdenCtrl.prototype.cancelarOrden = function() {
	var self = this;
	self.OrdenesFactory.limpiarOrden();
	self.$ionicHistory.clearHistory();
	self.$ionicHistory.nextViewOptions({
		disableBack:'true'
	});
	self.$state.go("app.recoleccion");
};

app.controller('InformacionOrdenCtrl', InformacionOrdenCtrl);
