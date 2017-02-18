
var FormularioFactory = function(CarritoFactory,
								MapasFactory, 
								ModalCargaFactory,
								$rootScope,
								$ionicModal,
								$ionicPopover){

	var scopeModal = $rootScope.$new(),
		modalMapa = null,
		mapa;

	scopeModal.finalizaUbicacion = function(tipo) {
		modalMapa.hide();
	};

	$ionicModal
	.fromTemplateUrl("templates/app/orden/informacion-orden/modal-mapa.html", {
		scope: scopeModal,
		animation: 'slide-in-up'
	}).then(function(modal) {
		modalMapa = modal;
		
		MapasFactory
		.getMapa()
		.then(function(googleMap) {
			mapa = googleMap;
			//$log.debug("mapa obtenido: ", $scope.mapa)
			modalMapa
				.modalEl //ion-modal
				.children[1] //ion-content
				.children[0] //scroll
				.children[0] //#contenedor-mapa
				.appendChild(mapa.mapaDOM);
		});
	});


	var verificar = function(items) {
		for (var i in items) {
			if (!items[i].entregado) {
				return false;
			}
		}
		return true;
	};

	var _horasDelDia = [
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

	return {
		init: function() {
			this.titulo= {
				texto: false
			};
			this.orden = {
				titulo: "",
				descripcion: "",
				noHayOrdenes: ""
			};
			this.nombre= {
				disabled: false
			};
			this.recoleccion= {
				direccion: {
					hide: false
				},
				fecha: {
					hide: false
				},
				hora: {
					hide: false
				}
			};
			this.entrega= {
				direccion: {
					disabled: false
				},
				fecha: {
					disabled: false
				},
				hora: {
					disabled: false
				}
			};
			this.telefono = {
				disabled: false
			};
			this.formaPago = {
				hide: false,
				editable: false,
				disabled: false
			};
			this.cupon = {
				disabled: false,
				hide: false
			};	
			this.abono = {
				disabled: false,
				hide: false
			};						
			this.prendas = {
				eliminar: false,
				entregar: false,
				cbEliminar: function(){}
			};
			this.productos = {
				panel: false,
				eliminar: false,
				entregar: false,
				cbEliminar: function(){}
			};
			this.totales = {
				hide: false,
			}
			this.cancelar = {
				hide: false,
				texto: ""
			};
			this.siguiente = {
				texto: ""
			};
			this.valido = false;
		},

		horasDelDia: _horasDelDia,

		verificarEntrega: function(items) {
			this.valido = verificar(items.prendas) && verificar(items.productos);
		},

		verificarPosicion: function(posicion) {
			return (typeof posicion == 'object');
		},

		verMapa: function(tipo) {
			var self = this,
				$scope = self.$scope,
				posicion = null;

			switch(tipo) {
				case "DIRECCIONRECOLECCION":
					//ubicar la posicion en el mapa almacenada
					if(CarritoFactory.infoOrden.orden.recoleccion.posicion) {
						posicion = CarritoFactory.infoOrden.orden.recoleccion.posicion;
					} 

					//mostrar la ventana modal con el mapa configurado en la posicion almacenada.
					scopeModal.titulo = "Punto de recolección.";
					scopeModal.tipo = tipo;
					break;

				case "DIRECCIONENTREGA":
					//ubicar la posicion en el mapa almacenada
					if(CarritoFactory.infoOrden.orden.entrega.posicion) {
						posicion = CarritoFactory.infoOrden.orden.entrega.posicion;
					} 

					//mostrar la ventana modal con el mapa configurado en la posicion almacenada.
					scopeModal.titulo = "Punto de entrega.";
					scopeModal.tipo = tipo;
					break;
			}

			if(posicion) {
				mapa.setPosicion(posicion);
			}

			ModalCargaFactory.mostrar("Ubicando punto en mapa...", null);
			modalMapa
			.show()
			.then(function() {
				ModalCargaFactory.ocultar();
			});
		},

		construirPopover: function(tipo, $event) {
			var self = this,
				scopePopover = $rootScope.$new(),
				tmpURL = null;

			scopePopover.formaPago = function(formaPago){
				CarritoFactory.infoOrden.orden.formaPago = formaPago;
				scopePopover.popover.hide();
			};


			switch(tipo) {
				/*case "FECHARECOLECCION":
					
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
					tmpURL = 'templates/app/orden/informacion-orden/popover-hora.html';
					$scope.idPopover = "ppHoraEntrega";
					//seleccionar las horas validas segun la fecha que seleccione.
					$scope.horas = this.horasEntrega();

					$scope.setHora = function($index){
						$scope.orden.entrega.hora = $scope.horas[$index];
						$scope.closePopover();
					};
					break;
				*/
				case "FORMAPAGO":
					tmpURL = 'templates/app/orden/informacion-orden/popover-forma-pago.html';
					scopePopover.idPopover = "ppFormaPago";
					break;

				default:
					return;
			}

			if(tmpURL){
				$ionicPopover
				.fromTemplateUrl(tmpURL, {
					scope: scopePopover,
				}).then(function(popover) {
					scopePopover.popover = popover;
					scopePopover.popover.show($event);
				});
			}
		},

		setHoraActual: function() {
			var d = new Date();
			var h = d.getHours();
			CarritoFactory.infoOrden.orden.recoleccion.hora = _horasDelDia[h];				
			CarritoFactory.infoOrden.orden.entrega.hora = _horasDelDia[h];				
		}
	};
};

app.factory('FormularioFactory', FormularioFactory);
