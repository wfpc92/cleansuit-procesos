var OrdenEnRecoleccionCtrl = function($scope, 
							$stateParams,
							$log,
							$state,
							$ionicPopup,
							$ionicHistory,
							$ionicListDelegate, 
							$timeout,
							OrdenesFactory,
							CancelarOrdenFactory) {

	$log.debug("OrdenEnRecoleccionCtrl", $scope.$id);
	
	$scope.$on("$ionicView.beforeEnter", function() {
		$scope.formulario.init();
		$scope.formulario.nombre.disabled = true;
		$scope.formulario.recoleccion.direccion.disabled = true;
		$scope.formulario.recoleccion.fecha.disabled = true;
		$scope.formulario.recoleccion.hora.disabled = true;
		$scope.formulario.entrega.direccion.disabled = true;
		$scope.formulario.entrega.fecha.disabled = true;
		$scope.formulario.entrega.hora.disabled = true;
		$scope.formulario.telefono.disabled = true;
		$scope.formulario.formaPago.hide = true;
		$scope.formulario.cupon.disabled = true;
		$scope.formulario.abono.hide = true;
		$scope.formulario.totales.hide = true;
		$scope.formulario.cancelar.texto = "Suspender pedido";
		$scope.formulario.siguiente.texto = "TOMAR PEDIDO";
		$scope.formulario.valido = true;
	});

	$scope.siguiente = function() {
		if ($scope.formulario.valido) {
			$state.go("app.recoleccion-carrito")
		}
		else {
			console.log("Formulario incompleto.")
		}
	};

	//cancelar orden:
	$scope.cancelar = function() {
		CancelarOrdenFactory.$scope = $scope;
		CancelarOrdenFactory.textos.volverInfoOrden = "Volver a información de orden";
		CancelarOrdenFactory.cb = {
			pendiente: 	function(e) {
				OrdenesFactory.setPedidoPendiente($scope.carrito.infoOrden);
				$scope.carrito.vaciar();
				$ionicHistory.clearHistory();
				$ionicHistory.nextViewOptions({
					disableBack:'true'
				});
				$state.go("app.recoleccion");
			},

			volverInfoOrden: function(e) {

			},

			enviar: function(e) {
				console.log($scope.motivo)
				$scope.carrito.vaciar();
			},

			cancelar: function(e) {
				$ionicHistory.clearHistory();
				$ionicHistory.nextViewOptions({
					disableBack:'true'
				});
				$state.go("app.recoleccion");
			},
		};

		CancelarOrdenFactory.mostrarOrdenPendiente();
	};
};


app.controller("OrdenEnRecoleccionCtrl", OrdenEnRecoleccionCtrl);
