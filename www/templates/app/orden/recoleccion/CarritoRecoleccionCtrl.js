var CarritoRecoleccionCtrl = function($scope, 
						$ionicHistory, 
						$state, 
						$stateParams, 
						$ionicPopup,
						OrdenesFactory,
						CancelarOrdenFactory,
						$log) {
	
	$log.debug("CarritoRecoleccionCtrl", $scope.$id);

	$scope.$on("$ionicView.beforeEnter", function () {
		$scope.carrito.limpiar();
		$scope.formulario.init();
		$scope.formulario.prendas.eliminar = true;
		$scope.formulario.prendas.eliminar = true;
		$scope.formulario.productos.panel = true;
		$scope.formulario.cancelar.hide = true;
	});

	$scope.cancelar = function() {
		CancelarOrdenFactory.$scope = $scope;
		CancelarOrdenFactory.textos.volverInfoOrden = "Cerrar";
		CancelarOrdenFactory.cb = {
			volverInfoOrden: function(e) {
				
			},

			enviar: function(e) {
				
			},

			cancelar: function(e) {
				$scope.carrito.vaciar();
				$ionicHistory.clearHistory();
				$ionicHistory.nextViewOptions({
					disableBack:'true'
				});
				$state.go("app.recoleccion");
			},
		};
		CancelarOrdenFactory.mostrarMotivos();
	};
	
	$scope.siguiente = function() {
		$state.go("app.recoleccion-confirmacion");
	};
};

app.controller('CarritoRecoleccionCtrl', CarritoRecoleccionCtrl);
