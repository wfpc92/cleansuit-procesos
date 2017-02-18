var OrdenEntregadaCtrl = function($scope, 
							$stateParams,
							$log,
							$ionicListDelegate,
							OrdenesFactory, 
							$timeout) {

	$log.debug("OrdenEntregadaCtrl", $scope.$id);
	
	$scope.formulario = {
		nombre: {
			disabled: true
		},
		recoleccion: {
			direccion: {
				disabled: true
			},
			fecha: {
				disabled: true
			},
			hora: {
				disabled: true
			}
		},
		entrega: {
			direccion: {
				disabled: true
			},
			fecha: {
				disabled: true
			},
			hora: {
				disabled: true
			}
		},
		telefono: {
			disabled: true
		},
		formaPago: {
			disabled: true
		},
		cupon: {
			hide: true,
		},
		valido: false,
		prendas: {
			eliminar: false
		},
		productos: {
			panel: false,
			eliminar: false,
			entregar: false
		},
		cancelar: {
			hide: true
		},
		siguiente: {
			hide: true
		},
	};
	
	$scope.$on("$ionicView.beforeEnter", function() {
		$scope.carrito.infoOrden.orden.recoleccion.fecha = new Date($scope.carrito.infoOrden.orden.recoleccion.fecha);
		$scope.carrito.infoOrden.orden.entrega.fecha = new Date($scope.carrito.infoOrden.orden.entrega.fecha);
	});

	$scope.$on('$ionicView.afterEnter', function(event) {
		
	});
	
	$scope.$on("$ionicView.beforeLeave", function() {
		
	});

};


app.controller("OrdenEntregadaCtrl", OrdenEntregadaCtrl);
